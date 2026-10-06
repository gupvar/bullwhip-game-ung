import {
  BACKORDER_COST,
  BASE_DEMAND,
  DOWNSTREAM,
  HOLDING_COST,
  MAX_ORDER,
  MIN_ORDER,
  ROLES,
  START_INCOMING,
  START_INVENTORY,
  START_PRODUCTION,
  SURGE_DEMAND,
  SURGE_WEEK,
  TOTAL_WEEKS,
  UPSTREAM,
  type Role,
  type RoleState,
  type RoleWeekSnapshot,
  type TeamState,
  type WeekRecord,
} from "./types.ts";

export function clampOrder(n: number): number {
  if (!Number.isFinite(n)) return MIN_ORDER;
  return Math.max(MIN_ORDER, Math.min(MAX_ORDER, Math.round(n)));
}

export function customerDemand(week: number): number {
  if (week < 1) return BASE_DEMAND;
  return week < SURGE_WEEK ? BASE_DEMAND : SURGE_DEMAND;
}

export function teamName(teamIndex: number): string {
  const names = [
    "Dahlonega",
    "Gainesville",
    "Oconee",
    "Cumming",
    "Blue Ridge",
    "Watkinsville",
  ];
  return names[teamIndex] ?? `Team ${teamIndex + 1}`;
}

function freshRole(): RoleState {
  return {
    inventory: START_INVENTORY,
    backorder: 0,
    incoming: START_INCOMING,
    production: START_PRODUCTION,
    lastReceived: 0,
    lastDemand: BASE_DEMAND,
    lastShipped: 0,
    lastOrder: BASE_DEMAND,
    weekCost: 0,
    totalCost: 0,
  };
}

function byRole<T>(make: (role: Role) => T): Record<Role, T> {
  const out = {} as Record<Role, T>;
  for (const role of ROLES) out[role] = make(role);
  return out;
}

export function createTeamState(): TeamState {
  return {
    week: 0,
    phase: "lobby",
    lastOrders: byRole(() => BASE_DEMAND),
    roles: byRole(() => freshRole()),
    pendingOrders: {},
    history: [],
  };
}

function cloneState(state: TeamState): TeamState {
  return structuredClone(state);
}

/**
 * Open a week: receive inbound goods, fill this week's demand, pay costs.
 * Players then submit the only decision — how many units to order.
 */
export function beginWeek(state: TeamState): TeamState {
  const next = cloneState(state);
  if (next.phase === "finished") return next;
  if (next.week >= TOTAL_WEEKS) {
    next.phase = "finished";
    return next;
  }

  const week = next.week + 1;
  next.week = week;
  next.phase = "ordering";
  next.pendingOrders = {};

  const demand = byRole((role) => {
    const down = DOWNSTREAM[role];
    return down ? next.lastOrders[down] : customerDemand(week);
  });

  for (const role of ROLES) {
    const r = next.roles[role];
    const received = r.incoming;
    if (role === "factory") {
      r.incoming = r.production;
      r.production = 0;
    } else {
      r.incoming = 0;
    }
    r.inventory += received;
    r.lastReceived = received;

    const need = r.backorder + demand[role];
    const shipped = Math.min(r.inventory, need);
    r.inventory -= shipped;
    r.backorder = need - shipped;
    r.lastDemand = demand[role];
    r.lastShipped = shipped;

    const cost = r.inventory * HOLDING_COST + r.backorder * BACKORDER_COST;
    r.weekCost = cost;
    r.totalCost += cost;
  }

  for (const role of ROLES) {
    const up = UPSTREAM[role];
    if (up) next.roles[role].incoming = next.roles[up].lastShipped;
  }

  return next;
}

export function submitOrder(
  state: TeamState,
  role: Role,
  quantity: number,
): TeamState {
  const next = cloneState(state);
  if (next.phase !== "ordering") {
    throw new Error("Orders are closed this week.");
  }
  if (next.pendingOrders[role] != null) {
    throw new Error("You already sent this week's order.");
  }
  next.pendingOrders[role] = clampOrder(quantity);
  return next;
}

export function allOrdersIn(state: TeamState): boolean {
  return ROLES.every((role) => state.pendingOrders[role] != null);
}

/**
 * Naive-but-stable classroom bot: order this week's demand, plus a nudge
 * back toward the starting on-hand of 12.
 */
export function botOrder(role: RoleState): number {
  const gap = START_INVENTORY - role.inventory;
  return clampOrder(role.lastDemand + gap);
}

export function fillMissingWithBots(state: TeamState): TeamState {
  const next = cloneState(state);
  if (next.phase !== "ordering") return next;
  for (const role of ROLES) {
    if (next.pendingOrders[role] == null) {
      next.pendingOrders[role] = botOrder(next.roles[role]);
    }
  }
  return next;
}

export function applyOrders(state: TeamState): TeamState {
  const next = cloneState(state);
  if (next.phase !== "ordering") return next;
  if (!allOrdersIn(next)) {
    throw new Error("Not every seat has ordered yet.");
  }

  const orders = byRole((role) => next.pendingOrders[role] ?? 0);
  for (const role of ROLES) {
    next.roles[role].lastOrder = orders[role];
  }
  next.roles.factory.production = orders.factory;
  next.lastOrders = orders;

  const record: WeekRecord = {
    week: next.week,
    customerDemand: customerDemand(next.week),
    roles: byRole((role) => snapshot(next.roles[role], orders[role])),
  };
  next.history.push(record);
  next.pendingOrders = {};

  if (next.week >= TOTAL_WEEKS) {
    next.phase = "finished";
  }

  return next;
}

function snapshot(role: RoleState, order: number): RoleWeekSnapshot {
  return {
    received: role.lastReceived,
    demand: role.lastDemand,
    shipped: role.lastShipped,
    inventory: role.inventory,
    backorder: role.backorder,
    incomingNext: role.incoming,
    order,
    cost: role.weekCost,
  };
}

export function playWeek(
  state: TeamState,
  orders: Record<Role, number>,
): TeamState {
  let next = state;
  if (next.phase === "finished") return next;
  if (next.phase === "lobby" || next.history.length === next.week) {
    next = beginWeek(next);
  }
  if (next.phase !== "ordering") return next;
  for (const role of ROLES) {
    next = submitOrder(next, role, orders[role]);
  }
  return applyOrders(next);
}

export function variance(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const sum = values.reduce((acc, v) => acc + (v - mean) ** 2, 0);
  return sum / (values.length - 1);
}

export function amplification(history: WeekRecord[]): Record<Role, number> {
  const demand = history.map((h) => h.customerDemand);
  const demandVar = variance(demand);
  return byRole((role) => {
    const orders = history.map((h) => h.roles[role].order);
    const orderVar = variance(orders);
    return demandVar === 0 ? 0 : orderVar / demandVar;
  });
}

export function teamTotalCost(state: TeamState): number {
  return ROLES.reduce((sum, role) => sum + state.roles[role].totalCost, 0);
}

export function costsByRole(state: TeamState): Record<Role, number> {
  return byRole((role) => state.roles[role].totalCost);
}

export const STEADY_ORDERS: Record<Role, number> = {
  retailer: 4,
  wholesaler: 4,
  distributor: 4,
  factory: 4,
};
