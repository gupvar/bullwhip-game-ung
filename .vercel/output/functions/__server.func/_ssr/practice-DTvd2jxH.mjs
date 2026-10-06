import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { i as ROLE_LABEL, n as ROLES } from "./types-B71k4oFf.mjs";
import { a as costsByRole, c as submitOrder, i as botOrder, l as teamName, n as applyOrders, o as createTeamState, r as beginWeek, t as amplification, u as teamTotalCost } from "./engine-V9R4od5Q.mjs";
import { i as SiteHeader, r as SiteFooter, t as Button } from "./button-DYga0lWH.mjs";
import { t as Label } from "./label-D8Tn1fQ7.mjs";
import { n as DebriefPanel } from "./badge-ueL5t7TD.mjs";
import { t as RoleBoard } from "./role-board-zNkjXUdO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/practice-DTvd2jxH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function boardView(state, role, handle) {
	const r = state.roles[role];
	return {
		week: state.week,
		phase: state.phase,
		role,
		teamIndex: 0,
		teamName: teamName(0),
		handle,
		inventory: r.inventory,
		backorder: r.backorder,
		incoming: r.incoming,
		production: r.production,
		lastReceived: r.lastReceived,
		lastDemand: r.lastDemand,
		lastShipped: r.lastShipped,
		lastOrder: r.lastOrder,
		weekCost: r.weekCost,
		totalCost: r.totalCost,
		pendingOrder: state.pendingOrders[role] ?? null,
		customerDemand: role === "retailer" || state.phase === "finished" ? r.lastDemand : null,
		teammates: ROLES.filter((x) => x !== role).map((x) => ({
			role: x,
			handle: "Computer",
			isBot: true,
			hasOrdered: state.pendingOrders[x] != null
		})),
		ownHistory: state.history.map((h) => ({
			week: h.week,
			received: h.roles[role].received,
			demand: h.roles[role].demand,
			shipped: h.roles[role].shipped,
			inventory: h.roles[role].inventory,
			backorder: h.roles[role].backorder,
			order: h.roles[role].order,
			cost: h.roles[role].cost
		}))
	};
}
function toResult(state) {
	return {
		teamIndex: 0,
		teamName: teamName(0),
		phase: state.phase,
		week: state.week,
		totalCost: teamTotalCost(state),
		roleCosts: costsByRole(state),
		history: state.history,
		pendingOrders: state.pendingOrders,
		seats: ROLES.map((role) => ({
			teamIndex: 0,
			role,
			handle: "You",
			isBot: false,
			hasOrdered: state.pendingOrders[role] != null
		})),
		amplification: amplification(state.history),
		current: state.roles
	};
}
function PracticePage() {
	const [mode, setMode] = (0, import_react.useState)("all");
	const [started, setStarted] = (0, import_react.useState)(false);
	const [state, setState] = (0, import_react.useState)(() => createTeamState());
	const [focus, setFocus] = (0, import_react.useState)("retailer");
	const [qty, setQty] = (0, import_react.useState)(4);
	const board = (0, import_react.useMemo)(() => boardView(state, focus, mode === "all" ? ROLE_LABEL[focus] : "You"), [
		state,
		focus,
		mode
	]);
	function start() {
		const next = beginWeek(createTeamState());
		setState(next);
		setStarted(true);
		const first = mode === "all" ? "retailer" : mode;
		setFocus(first);
		setQty(next.roles[first].lastDemand);
	}
	function submit() {
		let next = submitOrder(state, focus, qty);
		if (mode === "all") {
			const idx = ROLES.indexOf(focus);
			if (idx < ROLES.length - 1) {
				const upcoming = ROLES[idx + 1];
				setState(next);
				setFocus(upcoming);
				setQty(next.roles[upcoming].lastDemand);
				return;
			}
		} else for (const role of ROLES) if (next.pendingOrders[role] == null) next = submitOrder(next, role, botOrder(next.roles[role]));
		next = applyOrders(next);
		if (next.phase !== "finished") {
			next = beginWeek(next);
			const nextFocus = mode === "all" ? "retailer" : mode;
			setFocus(nextFocus);
			setQty(next.roles[nextFocus].lastDemand);
		}
		setState(next);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-3xl flex-1 px-4 py-8",
				children: !started ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-4xl font-semibold text-navy",
							children: "Practice lab"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground text-pretty",
							children: "Same 12-week Nighthawk gear chain, no classmates required. Play every seat to feel the delay — that is how an instructor can also demo the lab before class — or hold one seat and let a simple computer rule run the others."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "How do you want to play?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeButton, {
									selected: mode === "all",
									onClick: () => setMode("all"),
									label: "All four seats",
									hint: "Best for learning the full four-seat chain"
								}), ROLES.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeButton, {
									selected: mode === role,
									onClick: () => setMode(role),
									label: `${ROLE_LABEL[role]} only`,
									hint: "Computers fill the other two seats"
								}, role))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							onClick: start,
							className: "w-full sm:w-auto",
							children: "Start week 1"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-6",
					children: [
						mode === "all" && state.phase === "ordering" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								"You are placing the ",
								ROLE_LABEL[focus].toLowerCase(),
								" order for week ",
								state.week,
								"."
							]
						}) : null,
						state.phase !== "lobby" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBoard, {
							board,
							quantity: qty,
							onQuantity: setQty,
							onSubmit: submit
						}) : null,
						state.phase === "finished" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DebriefPanel, {
							result: toResult(state),
							title: "Practice debrief"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: start,
							children: "Play again"
						})] }) : null
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function ModeButton({ selected, onClick, label, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: selected ? "rounded-lg border border-navy bg-navy px-4 py-3 text-left text-primary-foreground" : "rounded-lg border border-border bg-card px-4 py-3 text-left shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-sm font-medium",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: selected ? "text-xs text-primary-foreground/70" : "text-xs text-muted-foreground",
			children: hint
		})]
	});
}
//#endregion
export { PracticePage as component };
