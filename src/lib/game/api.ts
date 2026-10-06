import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  amplification,
  applyOrders,
  beginWeek,
  botOrder,
  costsByRole,
  createTeamState,
  fillMissingWithBots,
  submitOrder,
  teamName,
  teamTotalCost,
} from "./engine.ts";
import {
  MAX_ORDER,
  MIN_ORDER,
  ROLES,
  ROLE_LABEL,
  TEAM_NAMES,
  TOTAL_WEEKS,
  type InstructorView,
  type Role,
  type SeatInfo,
  type SeatView,
  type SessionStatus,
  type TeamPublicResult,
  type TeamState,
} from "./types.ts";

const Handle = z
  .string()
  .trim()
  .min(1, "Enter a first name or nickname.")
  .max(16)
  .regex(/^[A-Za-z0-9][A-Za-z0-9 .'-]{0,15}$/, "Use a short nickname, no email.");

const RoomCode = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{4}$/, "Room code is 4 letters.");

const Pin = z
  .string()
  .trim()
  .regex(/^\d{4}$/, "PIN is 4 digits.");

const RoleZ = z.enum(ROLES);

function randomHex(bytes = 18): string {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
}

function makeRoomCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const a = new Uint8Array(4);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => alphabet[b % alphabet.length]).join("");
}

function makePin(): string {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 10000;
  return n.toString().padStart(4, "0");
}

async function sql() {
  const { getSql } = await import("../db.ts");
  return getSql();
}

interface SessionRow {
  id: string;
  room_code: string;
  instructor_pin: string;
  instructor_token: string;
  status: SessionStatus;
  week: number;
  team_count: number;
  total_weeks: number;
  demand_revealed: boolean;
}

interface SeatRow {
  id: number;
  session_id: string;
  team_index: number;
  role: Role;
  handle: string | null;
  token: string | null;
  is_bot: boolean;
}

interface TeamRow {
  session_id: string;
  team_index: number;
  state_json: string;
}

function parseState(raw: string): TeamState {
  return JSON.parse(raw) as TeamState;
}

function err(message: string): never {
  throw new Error(message);
}

async function loadSessionByCode(code: string): Promise<SessionRow> {
  const db = await sql();
  const cleanCode = code.trim().toUpperCase();
  const rows = await db<SessionRow>`
    select id, room_code, instructor_pin, instructor_token, status, week, team_count, total_weeks, demand_revealed
    from game_sessions where upper(trim(room_code)) = ${cleanCode}
  `;
  return rows[0] ?? err(`No lab found with code "${cleanCode}". Please check the room code on the instructor board.`);
}

async function loadSessionByInstructor(token: string): Promise<SessionRow> {
  const db = await sql();
  const rows = await db<SessionRow>`
    select id, room_code, instructor_pin, instructor_token, status, week, team_count, total_weeks, demand_revealed
    from game_sessions where instructor_token = ${token}
  `;
  return rows[0] ?? err("Instructor session expired. Sign in with the room code and PIN.");
}

async function loadSeats(sessionId: string): Promise<SeatRow[]> {
  const db = await sql();
  return db<SeatRow>`
    select id, session_id, team_index, role, handle, token, is_bot
    from game_seats where session_id = ${sessionId}
    order by team_index, role
  `;
}

async function loadTeams(sessionId: string): Promise<TeamRow[]> {
  const db = await sql();
  return db<TeamRow>`
    select session_id, team_index, state_json
    from game_teams where session_id = ${sessionId}
    order by team_index
  `;
}

async function saveTeam(sessionId: string, teamIndex: number, state: TeamState) {
  const db = await sql();
  const json = JSON.stringify(state);
  await db`
    update game_teams
    set state_json = ${json}, updated_at = now()
    where session_id = ${sessionId} and team_index = ${teamIndex}
  `;
}

async function saveSessionMeta(row: SessionRow) {
  const db = await sql();
  await db`
    update game_sessions
    set status = ${row.status}, week = ${row.week}, demand_revealed = ${row.demand_revealed}
    where id = ${row.id}
  `;
}

function seatInfos(seats: SeatRow[], teams: TeamRow[]): SeatInfo[] {
  const byTeam = new Map(teams.map((t) => [t.team_index, parseState(t.state_json)]));
  return seats.map((s) => {
    const state = byTeam.get(s.team_index);
    const hasOrdered =
      s.is_bot || (state?.pendingOrders[s.role] != null);
    return {
      teamIndex: s.team_index,
      role: s.role,
      handle: s.handle,
      isBot: s.is_bot,
      hasOrdered,
    };
  });
}

function toTeamResult(teamIndex: number, state: TeamState, seats: SeatRow[]): TeamPublicResult {
  return {
    teamIndex,
    teamName: teamName(teamIndex),
    phase: state.phase,
    week: state.week,
    totalCost: teamTotalCost(state),
    roleCosts: costsByRole(state),
    history: state.history,
    pendingOrders: state.pendingOrders,
    seats: seatInfos(
      seats.filter((s) => s.team_index === teamIndex),
      [{ session_id: "", team_index: teamIndex, state_json: JSON.stringify(state) }],
    ),
    amplification: amplification(state.history),
    current: state.roles,
  };
}

async function instructorView(row: SessionRow): Promise<InstructorView> {
  const [seats, teams] = await Promise.all([loadSeats(row.id), loadTeams(row.id)]);
  return {
    roomCode: row.room_code,
    pin: row.instructor_pin,
    status: row.status,
    week: row.week,
    teamCount: row.team_count,
    totalWeeks: row.total_weeks,
    demandRevealed: row.demand_revealed,
    teams: teams.map((t) =>
      toTeamResult(
        t.team_index,
        parseState(t.state_json),
        seats.filter((s) => s.team_index === t.team_index),
      ),
    ),
  };
}

function seedBotOrders(state: TeamState, seats: SeatRow[]): TeamState {
  let next = state;
  if (next.phase !== "ordering") return next;
  for (const role of ROLES) {
    if (next.pendingOrders[role] != null) continue;
    const seat = seats.find((s) => s.role === role);
    const isBot = !seat || seat.is_bot || !seat.token;
    if (isBot) {
      next = submitOrder(next, role, botOrder(next.roles[role]));
    }
  }
  return next;
}

function maybeAdvance(state: TeamState, seats: SeatRow[]): TeamState {
  let next = state;
  if (next.phase !== "ordering") return next;
  next = seedBotOrders(next, seats);
  const humans = ROLES.filter((role) => {
    const seat = seats.find((s) => s.role === role);
    return Boolean(seat && !seat.is_bot && seat.token);
  });
  if (humans.length > 0) {
    const humansDone = humans.every((role) => next.pendingOrders[role] != null);
    if (!humansDone) return next;
  }
  if (!ROLES.every((role) => next.pendingOrders[role] != null)) {
    next = fillMissingWithBots(next);
  }
  next = applyOrders(next);
  if (next.phase !== "finished") {
    next = beginWeek(next);
    next = seedBotOrders(next, seats);
  }
  return next;
}

export const createSession = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ teamCount: z.number().int().min(1).max(TEAM_NAMES.length) }).parse(input),
  )
  .handler(async ({ data }) => {
    const db = await sql();
    let code = makeRoomCode();
    for (let i = 0; i < 8; i += 1) {
      const existing = await db<{ id: string }>`select id from game_sessions where room_code = ${code}`;
      if (!existing[0]) break;
      code = makeRoomCode();
    }
    const id = randomHex(12);
    const pin = makePin();
    const token = randomHex(24);
    await db`
      insert into game_sessions (id, room_code, instructor_pin, instructor_token, team_count, total_weeks)
      values (${id}, ${code}, ${pin}, ${token}, ${data.teamCount}, ${TOTAL_WEEKS})
    `;
    for (let t = 0; t < data.teamCount; t += 1) {
      const state = JSON.stringify(createTeamState());
      await db`
        insert into game_teams (session_id, team_index, state_json)
        values (${id}, ${t}, ${state})
      `;
      for (const role of ROLES) {
        await db`
          insert into game_seats (session_id, team_index, role)
          values (${id}, ${t}, ${role})
        `;
      }
    }
    return { roomCode: code, pin, token, teamCount: data.teamCount };
  });

export const instructorLogin = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ roomCode: RoomCode, pin: Pin }).parse(input))
  .handler(async ({ data }) => {
    const row = await loadSessionByCode(data.roomCode);
    if (row.instructor_pin !== data.pin) err("That PIN does not match this room.");
    return { token: row.instructor_token, roomCode: row.room_code, pin: row.instructor_pin };
  });

export const listOpenSeats = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ roomCode: RoomCode }).parse(input))
  .handler(async ({ data }) => {
    const row = await loadSessionByCode(data.roomCode);
    const [seats, teams] = await Promise.all([loadSeats(row.id), loadTeams(row.id)]);
    return {
      roomCode: row.room_code,
      status: row.status,
      week: row.week,
      teamCount: row.team_count,
      seats: seatInfos(seats, teams),
    };
  });

export const joinSeat = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        roomCode: RoomCode,
        handle: Handle,
        teamIndex: z.number().int().min(0).max(TEAM_NAMES.length - 1),
        role: RoleZ,
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const row = await loadSessionByCode(data.roomCode);
    if (row.status === "finished") err("This lab has already finished.");
    const db = await sql();
    const seats = await db<SeatRow>`
      select id, session_id, team_index, role, handle, token, is_bot
      from game_seats
      where session_id = ${row.id} and team_index = ${data.teamIndex} and role = ${data.role}
    `;
    const seat = seats[0] ?? err("That seat does not exist.");
    if (seat.is_bot) err("That seat is a computer player.");
    if (seat.token) err("That seat is already taken. Pick another.");
    const token = randomHex(24);
    const updated = await db<SeatRow>`
      update game_seats
      set handle = ${data.handle}, token = ${token}
      where id = ${seat.id} and token is null and is_bot = false
      returning id, session_id, team_index, role, handle, token, is_bot
    `;
    if (!updated[0]) err("That seat was just taken. Pick another.");
    return {
      token,
      roomCode: row.room_code,
      handle: data.handle,
      teamIndex: data.teamIndex,
      role: data.role,
      roleLabel: ROLE_LABEL[data.role],
    };
  });

export const getInstructorView = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ token: z.string().min(8) }).parse(input))
  .handler(async ({ data }) => instructorView(await loadSessionByInstructor(data.token)));

export const startGame = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ token: z.string().min(8) }).parse(input))
  .handler(async ({ data }) => {
    const row = await loadSessionByInstructor(data.token);
    if (row.status !== "lobby") err("The lab has already started.");
    const db = await sql();
    await db`
      update game_seats
      set is_bot = true, handle = coalesce(handle, 'Computer')
      where session_id = ${row.id} and token is null
    `;
    const [seats, teams] = await Promise.all([loadSeats(row.id), loadTeams(row.id)]);
    for (const team of teams) {
      let state = parseState(team.state_json);
      state = beginWeek(state);
      state = seedBotOrders(state, seats.filter((s) => s.team_index === team.team_index));
      await saveTeam(row.id, team.team_index, state);
    }
    row.status = "playing";
    row.week = 1;
    await saveSessionMeta(row);
    return instructorView(row);
  });

export const fillBotsNow = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ token: z.string().min(8) }).parse(input))
  .handler(async ({ data }) => {
    const row = await loadSessionByInstructor(data.token);
    const db = await sql();
    await db`
      update game_seats
      set is_bot = true, handle = coalesce(handle, 'Computer')
      where session_id = ${row.id} and token is null
    `;
    return instructorView(row);
  });

export const revealDemand = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ token: z.string().min(8) }).parse(input))
  .handler(async ({ data }) => {
    const row = await loadSessionByInstructor(data.token);
    row.demand_revealed = true;
    await saveSessionMeta(row);
    return instructorView(row);
  });

export const instructorPlaceOrder = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        token: z.string().min(8),
        teamIndex: z.number().int().min(0),
        role: RoleZ,
        quantity: z.number().int().min(MIN_ORDER).max(MAX_ORDER),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const row = await loadSessionByInstructor(data.token);
    if (row.status !== "playing") err("The lab is not in play.");
    const teams = await loadTeams(row.id);
    const team = teams.find((t) => t.team_index === data.teamIndex) ?? err("Unknown team.");
    const seats = (await loadSeats(row.id)).filter((s) => s.team_index === data.teamIndex);
    let state = parseState(team.state_json);
    if (state.pendingOrders[data.role] != null) err("That seat already ordered this week.");
    state = submitOrder(state, data.role, data.quantity);
    state = maybeAdvance(state, seats);
    await saveTeam(row.id, data.teamIndex, state);
    if (state.phase === "finished") {
      const all = await loadTeams(row.id);
      const done = all.every((t) => parseState(t.state_json).phase === "finished");
      if (done) {
        row.status = "finished";
        row.demand_revealed = true;
      }
    }
    row.week = state.week;
    await saveSessionMeta(row);
    return instructorView(row);
  });

function boardFrom(
  state: TeamState,
  seat: SeatRow,
  teammates: SeatRow[],
  demandRevealed: boolean,
): SeatView["board"] {
  const roleState = state.roles[seat.role];
  return {
    week: state.week,
    phase: state.phase,
    role: seat.role,
    teamIndex: seat.team_index,
    teamName: teamName(seat.team_index),
    handle: seat.handle,
    inventory: roleState.inventory,
    backorder: roleState.backorder,
    incoming: roleState.incoming,
    production: roleState.production,
    lastReceived: roleState.lastReceived,
    lastDemand: roleState.lastDemand,
    lastShipped: roleState.lastShipped,
    lastOrder: roleState.lastOrder,
    weekCost: roleState.weekCost,
    totalCost: roleState.totalCost,
    pendingOrder: state.pendingOrders[seat.role] ?? null,
    customerDemand:
      seat.role === "retailer" || demandRevealed || state.phase === "finished"
        ? roleState.lastDemand
        : null,
    teammates: ROLES.filter((r) => r !== seat.role).map((role) => {
      const t = teammates.find((s) => s.role === role);
      return {
        role,
        handle: t?.handle ?? null,
        isBot: t?.is_bot ?? false,
        hasOrdered: state.pendingOrders[role] != null || Boolean(t?.is_bot),
      };
    }),
    ownHistory: state.history.map((h) => ({
      week: h.week,
      received: h.roles[seat.role].received,
      demand: h.roles[seat.role].demand,
      shipped: h.roles[seat.role].shipped,
      inventory: h.roles[seat.role].inventory,
      backorder: h.roles[seat.role].backorder,
      order: h.roles[seat.role].order,
      cost: h.roles[seat.role].cost,
    })),
  };
}

export const getSeatView = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ token: z.string().min(8) }).parse(input))
  .handler(async ({ data }) => {
    const db = await sql();
    const seats = await db<SeatRow>`
      select id, session_id, team_index, role, handle, token, is_bot
      from game_seats where token = ${data.token}
    `;
    const seat = seats[0] ?? err("Seat not found. Join the lab again.");
    const sessions = await db<SessionRow>`
      select id, room_code, instructor_pin, instructor_token, status, week, team_count, total_weeks, demand_revealed
      from game_sessions where id = ${seat.session_id}
    `;
    const session = sessions[0] ?? err("Lab not found.");
    const teamRows = await db<TeamRow>`
      select session_id, team_index, state_json
      from game_teams
      where session_id = ${session.id} and team_index = ${seat.team_index}
    `;
    const team = teamRows[0] ?? err("Team missing.");
    const state = parseState(team.state_json);
    const teammates = (await loadSeats(session.id)).filter((s) => s.team_index === seat.team_index);
    const debrief =
      state.phase === "finished" || session.demand_revealed
        ? toTeamResult(seat.team_index, state, teammates)
        : null;
    const view: SeatView = {
      roomCode: session.room_code,
      status: session.status,
      demandRevealed: session.demand_revealed,
      board: boardFrom(state, seat, teammates, session.demand_revealed),
      debrief,
    };
    return view;
  });

export const placeOrder = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        token: z.string().min(8),
        quantity: z.number().int().min(MIN_ORDER).max(MAX_ORDER),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const db = await sql();
    const seats = await db<SeatRow>`
      select id, session_id, team_index, role, handle, token, is_bot
      from game_seats where token = ${data.token}
    `;
    const seat = seats[0] ?? err("Seat not found.");
    const sessions = await db<SessionRow>`
      select id, room_code, instructor_pin, instructor_token, status, week, team_count, total_weeks, demand_revealed
      from game_sessions where id = ${seat.session_id}
    `;
    const session = sessions[0] ?? err("Lab not found.");
    if (session.status === "lobby") err("The instructor has not started the lab yet.");
    if (session.status === "finished") err("The lab is finished.");
    const teamRows = await db<TeamRow>`
      select session_id, team_index, state_json
      from game_teams
      where session_id = ${session.id} and team_index = ${seat.team_index}
    `;
    const team = teamRows[0] ?? err("Team missing.");
    let state = parseState(team.state_json);
    if (state.phase !== "ordering") err("Wait for the next week.");
    if (state.pendingOrders[seat.role] != null) err("You already ordered this week.");
    const teammates = (await loadSeats(session.id)).filter((s) => s.team_index === seat.team_index);
    state = submitOrder(state, seat.role, data.quantity);
    state = maybeAdvance(state, teammates);
    await saveTeam(session.id, seat.team_index, state);
    if (state.phase === "finished") {
      const all = await loadTeams(session.id);
      const done = all.every((t) => parseState(t.state_json).phase === "finished");
      if (done) {
        session.status = "finished";
        session.demand_revealed = true;
      }
    }
    session.week = state.week;
    await saveSessionMeta(session);
    const debrief =
      state.phase === "finished" || session.demand_revealed
        ? toTeamResult(seat.team_index, state, teammates)
        : null;
    const view: SeatView = {
      roomCode: session.room_code,
      status: session.status,
      demandRevealed: session.demand_revealed,
      board: boardFrom(state, seat, teammates, session.demand_revealed),
      debrief,
    };
    return view;
  });
