import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { i as SiteHeader, n as NighthawkMark, r as SiteFooter, t as Button } from "./button-DYga0lWH.mjs";
import { c as ArrowRight, n as Users, o as Keyboard, s as GraduationCap } from "../_libs/lucide-react.mjs";
import { t as ChainStrip } from "./chain-strip-0iC9xMFT.mjs";
import { n as CardContent, t as Card } from "./card-cN-Fyx4F.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-9EVGYzuW.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {
				solid: true,
				right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "gold",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/join",
							children: "Join a lab"
						})
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "bg-navy text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-[0.2em] text-accent",
								children: "University of North Georgia"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl",
								children: "One class period. One demand shock. Watch the chain whip."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-xl text-base text-primary-foreground/80 text-pretty",
								children: "A UNG classroom version of the classic four-seat supply chain game. Campus store, wholesaler, distributor, factory. Twelve weeks. One order each week. Shoppers change once — nobody else is told."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-col gap-3 sm:flex-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "gold",
									size: "lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/join",
										children: ["Join with a room code", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "outline",
									size: "lg",
									className: "border-primary-foreground/20 bg-navy-deep text-primary-foreground hover:bg-navy",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/instructor",
										children: "Host as instructor"
									})
								})]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-navy-deep p-5 shadow-[var(--shadow-border)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex size-12 items-center justify-center rounded-lg bg-navy",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NighthawkMark, { className: "size-8" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-xl font-semibold",
										children: "Nighthawk gear"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-primary-foreground/70",
										children: "Cases moving from factory to Dahlonega shop"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-5 text-primary-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChainStrip, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "mt-6 grid grid-cols-3 gap-3 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg bg-navy px-2 py-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-[11px] uppercase tracking-[0.12em] text-primary-foreground/60",
												children: "Weeks"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "font-display text-2xl font-semibold tabular-nums",
												children: "12"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg bg-navy px-2 py-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-[11px] uppercase tracking-[0.12em] text-primary-foreground/60",
												children: "Seats"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "font-display text-2xl font-semibold tabular-nums",
												children: "4"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg bg-navy px-2 py-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-[11px] uppercase tracking-[0.12em] text-primary-foreground/60",
												children: "Decision"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "font-display text-2xl font-semibold",
												children: "Order"
											})]
										})
									]
								})
							]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PathCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5" }),
							title: "Play in class",
							body: "Enter a 4-letter code, pick a seat, and order 0–30 cases each week.",
							to: "/join",
							cta: "Join a lab"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PathCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Keyboard, { className: "size-5" }),
							title: "Practice solo",
							body: "Walk all four seats yourself. Same rules, no room code.",
							to: "/practice",
							cta: "Open the practice lab"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PathCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-5" }),
							title: "Instructor desk",
							body: "Open a room, watch live orders, then show the whip on the projector.",
							to: "/instructor",
							cta: "Host a session"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function PathCard({ icon, title, body, to, cta }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "rounded-xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "flex h-full flex-col gap-3 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-10 items-center justify-center rounded-md bg-navy text-accent",
					children: icon
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-semibold text-navy",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "flex-1 text-sm text-muted-foreground text-pretty",
					children: body
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to,
						children: [cta, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
					})
				})
			]
		})
	});
}
//#endregion
export { Home as component };
