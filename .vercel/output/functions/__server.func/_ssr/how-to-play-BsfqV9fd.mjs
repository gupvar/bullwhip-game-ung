import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { i as SiteHeader, r as SiteFooter, t as Button } from "./button-DYga0lWH.mjs";
import { t as ChainStrip } from "./chain-strip-0iC9xMFT.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-cN-Fyx4F.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/how-to-play-BsfqV9fd.js
var import_jsx_runtime = require_jsx_runtime();
function HowToPlay() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/join",
					children: "Join a lab"
				})
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto w-full max-w-3xl flex-1 px-4 py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground",
						children: "Student briefing"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-4xl font-semibold text-navy",
						children: "How to play"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted-foreground text-pretty",
						children: "You are moving cases of Nighthawk gear through a four-seat chain — the classic classroom supply-chain game, set at UNG. The whole lab is 12 weeks and takes about 15–20 minutes of play. Each week you make one decision: how many cases to order."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChainStrip, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
								n: "1",
								title: "Know your seat",
								body: "Retailer (campus store) sells to UNG shoppers and orders from the wholesaler. Wholesaler ships to the retailer and orders from the distributor. Distributor ships to the wholesaler and orders from the factory. Factory ships to the distributor and starts production."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
								n: "2",
								title: "A week in four numbers",
								body: "You receive what was shipped two weeks ago. You see this week’s customer order. You ship as much as you can from on-hand stock. Anything you cannot ship becomes a backorder you still owe."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
								n: "3",
								title: "Then you order",
								body: "Order 0–30 cases from the seat upstream of you (the factory orders production). Those units arrive in two weeks — not today. There is no chatting about inventory. Hidden information is the point."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
								n: "4",
								title: "Costs",
								body: "Each leftover case on the shelf costs $1 that week. Each case you still owe costs $2. The team with the lowest combined cost wins. Do not hoard, and do not stock out if you can help it."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {
								n: "5",
								title: "The twist you are not told",
								body: "Shopper demand starts steady. It will change once during the lab. You will not see the other seats’ inventory. After week 12 the instructor shows every order on one chart — that is the bullwhip."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "mt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Starting board" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "grid grid-cols-2 gap-3 text-sm sm:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartStat, {
									label: "On hand",
									value: "12"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartStat, {
									label: "Arriving next week",
									value: "4"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartStat, {
									label: "Recent demand",
									value: "4"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartStat, {
									label: "Order range",
									value: "0–30"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col gap-3 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/join",
								children: "Join a class lab"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/practice",
								children: "Practice all four seats"
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function Rule({ n, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-4 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex size-9 shrink-0 items-center justify-center rounded-md bg-navy font-display text-lg font-semibold text-accent",
			children: n
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-lg font-semibold text-navy",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground text-pretty",
			children: body
		})] })]
	});
}
function StartStat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs uppercase tracking-[0.12em] text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-display text-2xl font-semibold tabular-nums text-navy",
		children: value
	})] });
}
//#endregion
export { HowToPlay as component };
