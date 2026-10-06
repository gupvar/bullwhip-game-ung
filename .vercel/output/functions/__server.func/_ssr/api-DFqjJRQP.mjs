import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { i as ROLE_LABEL, n as ROLES, s as TEAM_NAMES } from "./types-B71k4oFf.mjs";
import { a as costsByRole, c as submitOrder, i as botOrder, l as teamName, n as applyOrders, o as createTeamState, r as beginWeek, s as fillMissingWithBots, t as amplification, u as teamTotalCost } from "./engine-V9R4od5Q.mjs";
import { a as string, i as object, r as number, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-DFqjJRQP.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var Handle = string().trim().min(1, "Enter a first name or nickname.").max(16).regex(/^[A-Za-z0-9][A-Za-z0-9 .'-]{0,15}$/, "Use a short nickname, no email.");
var RoomCode = string().trim().toUpperCase().regex(/^[A-Z]{4}$/, "Room code is 4 letters.");
var Pin = string().trim().regex(/^\d{4}$/, "PIN is 4 digits.");
var RoleZ = _enum(ROLES);
function randomHex(bytes = 18) {
	const a = new Uint8Array(bytes);
	crypto.getRandomValues(a);
	return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
}
function makeRoomCode() {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ";
	const a = /* @__PURE__ */ new Uint8Array(4);
	crypto.getRandomValues(a);
	return Array.from(a, (b) => alphabet[b % 24]).join("");
}
function makePin() {
	return (crypto.getRandomValues(/* @__PURE__ */ new Uint32Array(1))[0] % 1e4).toString().padStart(4, "0");
}
async function sql() {
	const { getSql } = await import("./db-Ck68nCoY.mjs");
	return getSql();
}
function parseState(raw) {
	return JSON.parse(raw);
}
function err(message) {
	throw new Error(message);
}
async function loadSessionByCode(code) {
	return (await (await sql())`
    select id, room_code, instructor_pin, instructor_token, status, week, team_count, total_weeks, demand_revealed
    from game_sessions where room_code = ${code}
  `)[0] ?? err("No lab found with that code.");
}
async function loadSessionByInstructor(token) {
	return (await (await sql())`
    select id, room_code, instructor_pin, instructor_token, status, week, team_count, total_weeks, demand_revealed
    from game_sessions where instructor_token = ${token}
  `)[0] ?? err("Instructor session expired. Sign in with the room code and PIN.");
}
async function loadSeats(sessionId) {
	return (await sql())`
    select id, session_id, team_index, role, handle, token, is_bot
    from game_seats where session_id = ${sessionId}
    order by team_index, role
  `;
}
async function loadTeams(sessionId) {
	return (await sql())`
    select session_id, team_index, state_json
    from game_teams where session_id = ${sessionId}
    order by team_index
  `;
}
async function saveTeam(sessionId, teamIndex, state) {
	await (await sql())`
    update game_teams
    set state_json = ${JSON.stringify(state)}, updated_at = now()
    where session_id = ${sessionId} and team_index = ${teamIndex}
  `;
}
async function saveSessionMeta(row) {
	await (await sql())`
    update game_sessions
    set status = ${row.status}, week = ${row.week}, demand_revealed = ${row.demand_revealed}
    where id = ${row.id}
  `;
}
function seatInfos(seats, teams) {
	const byTeam = new Map(teams.map((t) => [t.team_index, parseState(t.state_json)]));
	return seats.map((s) => {
		const state = byTeam.get(s.team_index);
		const hasOrdered = s.is_bot || state?.pendingOrders[s.role] != null;
		return {
			teamIndex: s.team_index,
			role: s.role,
			handle: s.handle,
			isBot: s.is_bot,
			hasOrdered
		};
	});
}
function toTeamResult(teamIndex, state, seats) {
	return {
		teamIndex,
		teamName: teamName(teamIndex),
		phase: state.phase,
		week: state.week,
		totalCost: teamTotalCost(state),
		roleCosts: costsByRole(state),
		history: state.history,
		pendingOrders: state.pendingOrders,
		seats: seatInfos(seats.filter((s) => s.team_index === teamIndex), [{
			session_id: "",
			team_index: teamIndex,
			state_json: JSON.stringify(state)
		}]),
		amplification: amplification(state.history),
		current: state.roles
	};
}
async function instructorView(row) {
	const [seats, teams] = await Promise.all([loadSeats(row.id), loadTeams(row.id)]);
	return {
		roomCode: row.room_code,
		pin: row.instructor_pin,
		status: row.status,
		week: row.week,
		teamCount: row.team_count,
		totalWeeks: row.total_weeks,
		demandRevealed: row.demand_revealed,
		teams: teams.map((t) => toTeamResult(t.team_index, parseState(t.state_json), seats.filter((s) => s.team_index === t.team_index)))
	};
}
function seedBotOrders(state, seats) {
	let next = state;
	if (next.phase !== "ordering") return next;
	for (const role of ROLES) {
		if (next.pendingOrders[role] != null) continue;
		const seat = seats.find((s) => s.role === role);
		if (!seat || seat.is_bot || !seat.token) next = submitOrder(next, role, botOrder(next.roles[role]));
	}
	return next;
}
function maybeAdvance(state, seats) {
	let next = state;
	for (let i = 0; i < 16; i += 1) {
		if (next.phase !== "ordering") break;
		next = seedBotOrders(next, seats);
		if (!ROLES.filter((role) => {
			const seat = seats.find((s) => s.role === role);
			return Boolean(seat && !seat.is_bot && seat.token);
		}).every((role) => next.pendingOrders[role] != null)) break;
		if (!ROLES.every((role) => next.pendingOrders[role] != null)) next = fillMissingWithBots(next);
		next = applyOrders(next);
		if (next.phase !== "finished") next = beginWeek(next);
	}
	return next;
}
var createSession_createServerFn_handler = createServerRpc({
	id: "d48ff02bef0a6ae26e0632fc2c226987a42fd73c74a258fea7d3e823d622d104",
	name: "createSession",
	filename: "src/lib/game/api.ts"
}, (opts) => createSession.__executeServer(opts));
var createSession = createServerFn({ method: "POST" }).validator((input) => object({ teamCount: number().int().min(1).max(TEAM_NAMES.length) }).parse(input)).handler(createSession_createServerFn_handler, async ({ data }) => {
	const db = await sql();
	let code = makeRoomCode();
	for (let i = 0; i < 8; i += 1) {
		if (!(await db`select id from game_sessions where room_code = ${code}`)[0]) break;
		code = makeRoomCode();
	}
	const id = randomHex(12);
	const pin = makePin();
	const token = randomHex(24);
	await db`
      insert into game_sessions (id, room_code, instructor_pin, instructor_token, team_count, total_weeks)
      values (${id}, ${code}, ${pin}, ${token}, ${data.teamCount}, ${12})
    `;
	for (let t = 0; t < data.teamCount; t += 1) {
		const state = JSON.stringify(createTeamState());
		await db`
        insert into game_teams (session_id, team_index, state_json)
        values (${id}, ${t}, ${state})
      `;
		for (const role of ROLES) await db`
          insert into game_seats (session_id, team_index, role)
          values (${id}, ${t}, ${role})
        `;
	}
	return {
		roomCode: code,
		pin,
		token,
		teamCount: data.teamCount
	};
});
var instructorLogin_createServerFn_handler = createServerRpc({
	id: "f045535e2ee22e44cef2ec67cc2b156e4e856f0354f13c3d2156693434ee287d",
	name: "instructorLogin",
	filename: "src/lib/game/api.ts"
}, (opts) => instructorLogin.__executeServer(opts));
var instructorLogin = createServerFn({ method: "POST" }).validator((input) => object({
	roomCode: RoomCode,
	pin: Pin
}).parse(input)).handler(instructorLogin_createServerFn_handler, async ({ data }) => {
	const row = await loadSessionByCode(data.roomCode);
	if (row.instructor_pin !== data.pin) err("That PIN does not match this room.");
	return {
		token: row.instructor_token,
		roomCode: row.room_code,
		pin: row.instructor_pin
	};
});
var listOpenSeats_createServerFn_handler = createServerRpc({
	id: "3b9970c0c4f9d78caf6d6c0c7a8cb33221a989243035fc553a5c524a9d7165c6",
	name: "listOpenSeats",
	filename: "src/lib/game/api.ts"
}, (opts) => listOpenSeats.__executeServer(opts));
var listOpenSeats = createServerFn({ method: "POST" }).validator((input) => object({ roomCode: RoomCode }).parse(input)).handler(listOpenSeats_createServerFn_handler, async ({ data }) => {
	const row = await loadSessionByCode(data.roomCode);
	const [seats, teams] = await Promise.all([loadSeats(row.id), loadTeams(row.id)]);
	return {
		roomCode: row.room_code,
		status: row.status,
		week: row.week,
		teamCount: row.team_count,
		seats: seatInfos(seats, teams)
	};
});
var joinSeat_createServerFn_handler = createServerRpc({
	id: "43a8a3ab2dfbf8b9ef3816aa810595afac73269eef3f19b1ec6b901131cb3390",
	name: "joinSeat",
	filename: "src/lib/game/api.ts"
}, (opts) => joinSeat.__executeServer(opts));
var joinSeat = createServerFn({ method: "POST" }).validator((input) => object({
	roomCode: RoomCode,
	handle: Handle,
	teamIndex: number().int().min(0).max(TEAM_NAMES.length - 1),
	role: RoleZ
}).parse(input)).handler(joinSeat_createServerFn_handler, async ({ data }) => {
	const row = await loadSessionByCode(data.roomCode);
	if (row.status === "finished") err("This lab has already finished.");
	const db = await sql();
	const seat = (await db`
      select id, session_id, team_index, role, handle, token, is_bot
      from game_seats
      where session_id = ${row.id} and team_index = ${data.teamIndex} and role = ${data.role}
    `)[0] ?? err("That seat does not exist.");
	if (seat.is_bot) err("That seat is a computer player.");
	if (seat.token) err("That seat is already taken. Pick another.");
	const token = randomHex(24);
	if (!(await db`
      update game_seats
      set handle = ${data.handle}, token = ${token}
      where id = ${seat.id} and token is null and is_bot = false
      returning id, session_id, team_index, role, handle, token, is_bot
    `)[0]) err("That seat was just taken. Pick another.");
	return {
		token,
		roomCode: row.room_code,
		handle: data.handle,
		teamIndex: data.teamIndex,
		role: data.role,
		roleLabel: ROLE_LABEL[data.role]
	};
});
var getInstructorView_createServerFn_handler = createServerRpc({
	id: "60e0d69039867e0c5dc1c51d0a486e70a52f4e6a1b871901b8a17aa6ea9084f6",
	name: "getInstructorView",
	filename: "src/lib/game/api.ts"
}, (opts) => getInstructorView.__executeServer(opts));
var getInstructorView = createServerFn({ method: "POST" }).validator((input) => object({ token: string().min(8) }).parse(input)).handler(getInstructorView_createServerFn_handler, async ({ data }) => instructorView(await loadSessionByInstructor(data.token)));
var startGame_createServerFn_handler = createServerRpc({
	id: "a3b039e599b68e411fdca1fbe510c16f43f3bd17b4bb8fb0d1eaf1f9852a03e3",
	name: "startGame",
	filename: "src/lib/game/api.ts"
}, (opts) => startGame.__executeServer(opts));
var startGame = createServerFn({ method: "POST" }).validator((input) => object({ token: string().min(8) }).parse(input)).handler(startGame_createServerFn_handler, async ({ data }) => {
	const row = await loadSessionByInstructor(data.token);
	if (row.status !== "lobby") err("The lab has already started.");
	await (await sql())`
      update game_seats
      set is_bot = true, handle = coalesce(handle, 'Computer')
      where session_id = ${row.id} and token is null
    `;
	const [seats, teams] = await Promise.all([loadSeats(row.id), loadTeams(row.id)]);
	for (const team of teams) {
		let state = parseState(team.state_json);
		state = beginWeek(state);
		state = maybeAdvance(state, seats.filter((s) => s.team_index === team.team_index));
		await saveTeam(row.id, team.team_index, state);
		row.week = state.week;
	}
	row.status = "playing";
	await saveSessionMeta(row);
	return instructorView(row);
});
var fillBotsNow_createServerFn_handler = createServerRpc({
	id: "751d6ce02c762091be47e0d0ca7cf5683258d68593d8a0300a94dd2fc0b55816",
	name: "fillBotsNow",
	filename: "src/lib/game/api.ts"
}, (opts) => fillBotsNow.__executeServer(opts));
var fillBotsNow = createServerFn({ method: "POST" }).validator((input) => object({ token: string().min(8) }).parse(input)).handler(fillBotsNow_createServerFn_handler, async ({ data }) => {
	const row = await loadSessionByInstructor(data.token);
	await (await sql())`
      update game_seats
      set is_bot = true, handle = coalesce(handle, 'Computer')
      where session_id = ${row.id} and token is null
    `;
	return instructorView(row);
});
var revealDemand_createServerFn_handler = createServerRpc({
	id: "9f7abc1b36781dcac9aca68ed27fd5cebd0cf96c8268ec280ccf344851fef1a7",
	name: "revealDemand",
	filename: "src/lib/game/api.ts"
}, (opts) => revealDemand.__executeServer(opts));
var revealDemand = createServerFn({ method: "POST" }).validator((input) => object({ token: string().min(8) }).parse(input)).handler(revealDemand_createServerFn_handler, async ({ data }) => {
	const row = await loadSessionByInstructor(data.token);
	row.demand_revealed = true;
	await saveSessionMeta(row);
	return instructorView(row);
});
var instructorPlaceOrder_createServerFn_handler = createServerRpc({
	id: "6b4f62502706c6e47fbe3ce5dcb6f1f88d5702d013726cf3b9794aefda80179d",
	name: "instructorPlaceOrder",
	filename: "src/lib/game/api.ts"
}, (opts) => instructorPlaceOrder.__executeServer(opts));
var instructorPlaceOrder = createServerFn({ method: "POST" }).validator((input) => object({
	token: string().min(8),
	teamIndex: number().int().min(0),
	role: RoleZ,
	quantity: number().int().min(0).max(30)
}).parse(input)).handler(instructorPlaceOrder_createServerFn_handler, async ({ data }) => {
	const row = await loadSessionByInstructor(data.token);
	if (row.status !== "playing") err("The lab is not in play.");
	const team = (await loadTeams(row.id)).find((t) => t.team_index === data.teamIndex) ?? err("Unknown team.");
	const seats = (await loadSeats(row.id)).filter((s) => s.team_index === data.teamIndex);
	let state = parseState(team.state_json);
	if (state.pendingOrders[data.role] != null) err("That seat already ordered this week.");
	state = submitOrder(state, data.role, data.quantity);
	state = maybeAdvance(state, seats);
	await saveTeam(row.id, data.teamIndex, state);
	if (state.phase === "finished") {
		if ((await loadTeams(row.id)).every((t) => parseState(t.state_json).phase === "finished")) {
			row.status = "finished";
			row.demand_revealed = true;
		}
	}
	row.week = state.week;
	await saveSessionMeta(row);
	return instructorView(row);
});
function boardFrom(state, seat, teammates, demandRevealed) {
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
		customerDemand: seat.role === "retailer" || demandRevealed || state.phase === "finished" ? roleState.lastDemand : null,
		teammates: ROLES.filter((r) => r !== seat.role).map((role) => {
			const t = teammates.find((s) => s.role === role);
			return {
				role,
				handle: t?.handle ?? null,
				isBot: t?.is_bot ?? false,
				hasOrdered: state.pendingOrders[role] != null || Boolean(t?.is_bot)
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
			cost: h.roles[seat.role].cost
		}))
	};
}
var getSeatView_createServerFn_handler = createServerRpc({
	id: "f77f4df9fa2ca0ed068c15d35b0200048cc14bc3a98be853a60c4454f44144f9",
	name: "getSeatView",
	filename: "src/lib/game/api.ts"
}, (opts) => getSeatView.__executeServer(opts));
var getSeatView = createServerFn({ method: "POST" }).validator((input) => object({ token: string().min(8) }).parse(input)).handler(getSeatView_createServerFn_handler, async ({ data }) => {
	const db = await sql();
	const seat = (await db`
      select id, session_id, team_index, role, handle, token, is_bot
      from game_seats where token = ${data.token}
    `)[0] ?? err("Seat not found. Join the lab again.");
	const session = (await db`
      select id, room_code, instructor_pin, instructor_token, status, week, team_count, total_weeks, demand_revealed
      from game_sessions where id = ${seat.session_id}
    `)[0] ?? err("Lab not found.");
	const state = parseState(((await db`
      select session_id, team_index, state_json
      from game_teams
      where session_id = ${session.id} and team_index = ${seat.team_index}
    `)[0] ?? err("Team missing.")).state_json);
	const teammates = (await loadSeats(session.id)).filter((s) => s.team_index === seat.team_index);
	const debrief = state.phase === "finished" || session.demand_revealed ? toTeamResult(seat.team_index, state, teammates) : null;
	return {
		roomCode: session.room_code,
		status: session.status,
		demandRevealed: session.demand_revealed,
		board: boardFrom(state, seat, teammates, session.demand_revealed),
		debrief
	};
});
var placeOrder_createServerFn_handler = createServerRpc({
	id: "1c74da3bbeee54cfce2bb1ead3cb3bf9027a033bc61c227f51bd203370a49868",
	name: "placeOrder",
	filename: "src/lib/game/api.ts"
}, (opts) => placeOrder.__executeServer(opts));
var placeOrder = createServerFn({ method: "POST" }).validator((input) => object({
	token: string().min(8),
	quantity: number().int().min(0).max(30)
}).parse(input)).handler(placeOrder_createServerFn_handler, async ({ data }) => {
	const db = await sql();
	const seat = (await db`
      select id, session_id, team_index, role, handle, token, is_bot
      from game_seats where token = ${data.token}
    `)[0] ?? err("Seat not found.");
	const session = (await db`
      select id, room_code, instructor_pin, instructor_token, status, week, team_count, total_weeks, demand_revealed
      from game_sessions where id = ${seat.session_id}
    `)[0] ?? err("Lab not found.");
	if (session.status === "lobby") err("The instructor has not started the lab yet.");
	if (session.status === "finished") err("The lab is finished.");
	let state = parseState(((await db`
      select session_id, team_index, state_json
      from game_teams
      where session_id = ${session.id} and team_index = ${seat.team_index}
    `)[0] ?? err("Team missing.")).state_json);
	if (state.phase !== "ordering") err("Wait for the next week.");
	if (state.pendingOrders[seat.role] != null) err("You already ordered this week.");
	const teammates = (await loadSeats(session.id)).filter((s) => s.team_index === seat.team_index);
	state = submitOrder(state, seat.role, data.quantity);
	state = maybeAdvance(state, teammates);
	await saveTeam(session.id, seat.team_index, state);
	if (state.phase === "finished") {
		if ((await loadTeams(session.id)).every((t) => parseState(t.state_json).phase === "finished")) {
			session.status = "finished";
			session.demand_revealed = true;
		}
	}
	session.week = state.week;
	await saveSessionMeta(session);
	const debrief = state.phase === "finished" || session.demand_revealed ? toTeamResult(seat.team_index, state, teammates) : null;
	return {
		roomCode: session.room_code,
		status: session.status,
		demandRevealed: session.demand_revealed,
		board: boardFrom(state, seat, teammates, session.demand_revealed),
		debrief
	};
});
//#endregion
export { createSession_createServerFn_handler, fillBotsNow_createServerFn_handler, getInstructorView_createServerFn_handler, getSeatView_createServerFn_handler, instructorLogin_createServerFn_handler, instructorPlaceOrder_createServerFn_handler, joinSeat_createServerFn_handler, listOpenSeats_createServerFn_handler, placeOrder_createServerFn_handler, revealDemand_createServerFn_handler, startGame_createServerFn_handler };
