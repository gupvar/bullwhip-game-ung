import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { i as ROLE_LABEL, n as ROLES } from "./types-B71k4oFf.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as cn } from "./button-DYga0lWH.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-cN-Fyx4F.mjs";
import { a as CartesianGrid, c as Legend, i as Line, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-ueL5t7TD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ORDER_KEYS = {
	Shoppers: "#5c5a55",
	Retailer: "#007367",
	Wholesaler: "#1f3d7c",
	Distributor: "#c49212",
	Factory: "#151922"
};
function BullwhipCharts({ result }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	const orderData = result.history.map((h) => ({
		week: h.week,
		Shoppers: h.customerDemand,
		Retailer: h.roles.retailer.order,
		Wholesaler: h.roles.wholesaler.order,
		Distributor: h.roles.distributor.order,
		Factory: h.roles.factory.order
	}));
	const stockData = result.history.map((h) => ({
		week: h.week,
		Retailer: h.roles.retailer.inventory - h.roles.retailer.backorder,
		Wholesaler: h.roles.wholesaler.inventory - h.roles.wholesaler.backorder,
		Distributor: h.roles.distributor.inventory - h.roles.distributor.backorder,
		Factory: h.roles.factory.inventory - h.roles.factory.backorder
	}));
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 rounded-lg bg-muted" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
				title: "Orders vs. shopper demand",
				hint: "The whip is the widening swing as you move upstream.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: 260,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: orderData,
						margin: {
							top: 8,
							right: 8,
							left: -18,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "#e6e0d4",
								strokeDasharray: "3 3"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "week",
								tick: { fontSize: 12 }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: { fontSize: 12 },
								allowDecimals: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "Shoppers",
								stroke: ORDER_KEYS.Shoppers,
								strokeDasharray: "5 4",
								dot: false,
								strokeWidth: 2
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "Retailer",
								stroke: ORDER_KEYS.Retailer,
								strokeWidth: 2,
								dot: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "Wholesaler",
								stroke: ORDER_KEYS.Wholesaler,
								strokeWidth: 2,
								dot: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "Distributor",
								stroke: ORDER_KEYS.Distributor,
								strokeWidth: 2,
								dot: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "Factory",
								stroke: ORDER_KEYS.Factory,
								strokeWidth: 2,
								dot: false
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
				title: "On-hand minus backorders",
				hint: "Below zero means the seat still owes units.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: 260,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: stockData,
						margin: {
							top: 8,
							right: 8,
							left: -18,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "#e6e0d4",
								strokeDasharray: "3 3"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "week",
								tick: { fontSize: 12 }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: { fontSize: 12 },
								allowDecimals: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "Retailer",
								stroke: ORDER_KEYS.Retailer,
								strokeWidth: 2,
								dot: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "Wholesaler",
								stroke: ORDER_KEYS.Wholesaler,
								strokeWidth: 2,
								dot: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "Distributor",
								stroke: ORDER_KEYS.Distributor,
								strokeWidth: 2,
								dot: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "Factory",
								stroke: ORDER_KEYS.Factory,
								strokeWidth: 2,
								dot: false
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-2",
				children: ROLES.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-muted/80 px-3 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs uppercase tracking-[0.12em] text-muted-foreground",
							children: [ROLE_LABEL[role], " whip"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-2xl font-semibold tabular-nums text-navy",
							children: [result.amplification[role].toFixed(1), "×"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "order variance / demand variance"
						})
					]
				}, role))
			})
		]
	});
}
function ChartCard({ title, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-lg font-semibold text-navy",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-xs text-muted-foreground",
				children: hint
			}),
			children
		]
	});
}
function DebriefPanel({ result, title = "Chain results" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl font-semibold text-navy",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					result.teamName,
					" · total cost",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-medium tabular-nums text-foreground",
						children: ["$", result.totalCost]
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BullwhipCharts, { result }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-lg",
				children: "Cost by seat"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: ROLES.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.12em] text-muted-foreground",
					children: ROLE_LABEL[role]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-2xl font-semibold tabular-nums text-navy",
					children: ["$", result.roleCosts[role]]
				})] }, role))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-navy px-5 py-4 text-primary-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg font-semibold",
					children: "What to notice"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-primary-foreground/85 text-pretty",
					children: "Shopper demand only moved once — from 4 to 8 in week 5. If factory orders swing much harder than that, you are looking at the bullwhip effect: delay, hidden information, and local inventory targets amplifying a small change."
				})]
			})
		]
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground",
		gold: "border-transparent bg-accent text-accent-foreground",
		outline: "border-border text-foreground",
		muted: "border-transparent bg-muted text-muted-foreground",
		teal: "border-transparent bg-teal/15 text-teal",
		warn: "border-transparent bg-destructive/12 text-destructive"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { DebriefPanel as n, Badge as t };
