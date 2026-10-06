import { c as UPSTREAM, n as ROLES, t as DOWNSTREAM } from "./types-B71k4oFf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/engine-V9R4od5Q.js
function clampOrder(n) {
	if (!Number.isFinite(n)) return 0;
	return Math.max(0, Math.min(30, Math.round(n)));
}
function customerDemand(week) {
	if (week < 1) return 4;
	return week < 5 ? 4 : 8;
}
function teamName(teamIndex) {
	return [
		"Dahlonega",
		"Gainesville",
		"Oconee",
		"Cumming",
		"Blue Ridge",
		"Watkinsville"
	][teamIndex] ?? `Team ${teamIndex + 1}`;
}
function freshRole() {
	return {
		inventory: 12,
		backorder: 0,
		incoming: 4,
		production: 4,
		lastReceived: 0,
		lastDemand: 4,
		lastShipped: 0,
		lastOrder: 4,
		weekCost: 0,
		totalCost: 0
	};
}
function byRole(make) {
	const out = {};
	for (const role of ROLES) out[role] = make(role);
	return out;
}
function createTeamState() {
	return {
		week: 0,
		phase: "lobby",
		lastOrders: byRole(() => 4),
		roles: byRole(() => freshRole()),
		pendingOrders: {},
		history: []
	};
}
function cloneState(state) {
	return structuredClone(state);
}
/**
* Open a week: receive inbound goods, fill this week's demand, pay costs.
* Players then submit the only decision — how many units to order.
*/
function beginWeek(state) {
	const next = cloneState(state);
	if (next.phase === "finished") return next;
	if (next.week >= 12) {
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
		} else r.incoming = 0;
		r.inventory += received;
		r.lastReceived = received;
		const need = r.backorder + demand[role];
		const shipped = Math.min(r.inventory, need);
		r.inventory -= shipped;
		r.backorder = need - shipped;
		r.lastDemand = demand[role];
		r.lastShipped = shipped;
		const cost = r.inventory * 1 + r.backorder * 2;
		r.weekCost = cost;
		r.totalCost += cost;
	}
	for (const role of ROLES) {
		const up = UPSTREAM[role];
		if (up) next.roles[role].incoming = next.roles[up].lastShipped;
	}
	return next;
}
function submitOrder(state, role, quantity) {
	const next = cloneState(state);
	if (next.phase !== "ordering") throw new Error("Orders are closed this week.");
	if (next.pendingOrders[role] != null) throw new Error("You already sent this week's order.");
	next.pendingOrders[role] = clampOrder(quantity);
	return next;
}
function allOrdersIn(state) {
	return ROLES.every((role) => state.pendingOrders[role] != null);
}
/**
* Naive-but-stable classroom bot: order this week's demand, plus a nudge
* back toward the starting on-hand of 12.
*/
function botOrder(role) {
	const gap = 12 - role.inventory;
	return clampOrder(role.lastDemand + gap);
}
function fillMissingWithBots(state) {
	const next = cloneState(state);
	if (next.phase !== "ordering") return next;
	for (const role of ROLES) if (next.pendingOrders[role] == null) next.pendingOrders[role] = botOrder(next.roles[role]);
	return next;
}
function applyOrders(state) {
	const next = cloneState(state);
	if (next.phase !== "ordering") return next;
	if (!allOrdersIn(next)) throw new Error("Not every seat has ordered yet.");
	const orders = byRole((role) => next.pendingOrders[role] ?? 0);
	for (const role of ROLES) next.roles[role].lastOrder = orders[role];
	next.roles.factory.production = orders.factory;
	next.lastOrders = orders;
	const record = {
		week: next.week,
		customerDemand: customerDemand(next.week),
		roles: byRole((role) => snapshot(next.roles[role], orders[role]))
	};
	next.history.push(record);
	next.pendingOrders = {};
	if (next.week >= 12) next.phase = "finished";
	return next;
}
function snapshot(role, order) {
	return {
		received: role.lastReceived,
		demand: role.lastDemand,
		shipped: role.lastShipped,
		inventory: role.inventory,
		backorder: role.backorder,
		incomingNext: role.incoming,
		order,
		cost: role.weekCost
	};
}
function variance(values) {
	if (values.length < 2) return 0;
	const mean = values.reduce((a, b) => a + b, 0) / values.length;
	return values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / (values.length - 1);
}
function amplification(history) {
	const demandVar = variance(history.map((h) => h.customerDemand));
	return byRole((role) => {
		const orderVar = variance(history.map((h) => h.roles[role].order));
		return demandVar === 0 ? 0 : orderVar / demandVar;
	});
}
function teamTotalCost(state) {
	return ROLES.reduce((sum, role) => sum + state.roles[role].totalCost, 0);
}
function costsByRole(state) {
	return byRole((role) => state.roles[role].totalCost);
}
//#endregion
export { costsByRole as a, submitOrder as c, botOrder as i, teamName as l, applyOrders as n, createTeamState as o, beginWeek as r, fillMissingWithBots as s, amplification as t, teamTotalCost as u };
