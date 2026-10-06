import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { i as ROLE_LABEL, o as ROLE_UPSTREAM, r as ROLE_CUSTOMER } from "./types-B71k4oFf.mjs";
import { a as cn, t as Button } from "./button-DYga0lWH.mjs";
import { a as Minus, i as Plus, t as Warehouse } from "../_libs/lucide-react.mjs";
import { n as CardContent, t as Card } from "./card-cN-Fyx4F.mjs";
import { t as Badge } from "./badge-ueL5t7TD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/role-board-zNkjXUdO.js
var import_jsx_runtime = require_jsx_runtime();
function OrderStepper({ value, onChange, disabled }) {
	const set = (n) => onChange(Math.max(0, Math.min(30, Math.round(n))));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				size: "icon",
				className: "size-14 rounded-lg text-lg",
				disabled: disabled || value <= 0,
				onClick: () => set(value - 1),
				"aria-label": "Decrease order",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "number",
				inputMode: "numeric",
				min: 0,
				max: 30,
				value,
				disabled,
				onChange: (e) => set(Number(e.target.value)),
				className: "h-14 w-24 rounded-lg border border-border bg-card text-center font-display text-3xl font-semibold tabular-nums text-navy shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				"aria-label": "Order quantity"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				size: "icon",
				className: "size-14 rounded-lg text-lg",
				disabled: disabled || value >= 30,
				onClick: () => set(value + 1),
				"aria-label": "Increase order",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" })
			})
		]
	});
}
function Stat({ label, value, tone = "ink" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-muted/70 px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("mt-1 font-display text-3xl font-semibold tabular-nums leading-none", tone === "teal" && "text-teal", tone === "warn" && "text-destructive", tone === "ink" && "text-navy"),
			children: value
		})]
	});
}
function RoleBoard({ board, quantity, onQuantity, onSubmit, submitting, showMarket }) {
	const waiting = board.teammates.filter((t) => !t.hasOrdered);
	const ordered = board.pendingOrder != null;
	const canOrder = board.phase === "ordering" && !ordered;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground",
						children: [
							board.teamName,
							" campus · ",
							ROLE_LABEL[board.role]
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-display text-3xl font-semibold tracking-tight text-navy",
						children: [
							"Week ",
							board.week,
							" of 12"
						]
					}),
					board.handle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: ["Playing as ", board.handle]
					}) : null
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "gold",
					children: "Nighthawk gear · cases"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Received this week",
						value: board.lastReceived
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: board.role === "retailer" ? "Shoppers asked for" : "Your customer asked for",
						value: board.lastDemand
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "You shipped",
						value: board.lastShipped
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Arriving next week",
						value: board.incoming
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "On hand",
					value: board.inventory,
					tone: "teal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Still owed (backorders)",
					value: board.backorder,
					tone: board.backorder > 0 ? "warn" : "ink"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Warehouse, { className: "mt-0.5 size-5 text-navy" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-pretty",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								ROLE_CUSTOMER[board.role],
								" wanted",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold tabular-nums",
									children: board.lastDemand
								}),
								" ",
								"this week. You shipped",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold tabular-nums",
									children: board.lastShipped
								}),
								"."
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-muted-foreground",
								children: [
									"Holding costs $",
									board.inventory,
									" this week. Backorder costs $",
									board.backorder * 2,
									". Running total",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium text-foreground tabular-nums",
										children: ["$", board.totalCost]
									}),
									"."
								]
							})]
						})]
					}),
					board.phase === "lobby" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-md bg-muted px-3 py-3 text-sm",
						children: "You are seated. Wait for the instructor to start week 1."
					}) : null,
					board.phase === "finished" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-md bg-muted px-3 py-3 text-sm",
						children: "Twelve weeks are in. Scroll down for your chain's bullwhip chart."
					}) : null,
					canOrder ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-medium",
								children: [
									"Order from ",
									ROLE_UPSTREAM[board.role],
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-normal text-muted-foreground",
										children: "(arrives in two weeks)"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderStepper, {
								value: quantity,
								onChange: onQuantity
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "xl",
								onClick: onSubmit,
								disabled: submitting,
								className: "w-full sm:w-auto",
								children: ["Send order of ", quantity]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Order 0–30 cases. There is no undo after you send it."
							})
						]
					}) : null,
					ordered && board.phase === "ordering" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-muted/60 px-4 py-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Order of",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold tabular-nums",
								children: board.pendingOrder
							}),
							" ",
							"is in."
						] }), waiting.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-muted-foreground",
							children: [
								"Waiting on",
								" ",
								waiting.map((t) => ROLE_LABEL[t.role] + (t.handle ? ` (${t.handle})` : "")).join(" and "),
								"."
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-muted-foreground",
							children: "Resolving the week…"
						})]
					}) : null
				]
			}) }),
			showMarket && board.role !== "retailer" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Instructor has revealed shopper demand. Compare it with the orders you placed."
			}) : null,
			board.ownHistory.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "overflow-x-auto p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[28rem] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-border text-xs uppercase tracking-[0.12em] text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Week"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-3 font-medium",
								children: "In"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-3 font-medium",
								children: "Demand"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-3 font-medium",
								children: "Out"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-3 font-medium",
								children: "Stock"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-3 font-medium",
								children: "Owed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "You ordered"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "tabular-nums",
						children: board.ownHistory.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border/70 last:border-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2",
									children: row.week
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: row.received
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: row.demand
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: row.shipped
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: row.inventory
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: row.backorder
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2 font-medium",
									children: row.order
								})
							]
						}, row.week))
					})]
				})
			}) }) : null
		]
	});
}
//#endregion
export { RoleBoard as t };
