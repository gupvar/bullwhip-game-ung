import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { i as ROLE_LABEL, n as ROLES } from "./types-B71k4oFf.mjs";
import { i as SiteHeader, r as SiteFooter, t as Button } from "./button-DYga0lWH.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-cN-Fyx4F.mjs";
import { t as Input } from "./input-DyWOjqyx.mjs";
import { _ as startGame, a as getInstructorSession, i as fillBotsNow, m as revealDemand, o as getInstructorView, t as clearInstructorSession, u as instructorPlaceOrder } from "./session-store-B5iFrexc.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as DebriefPanel, t as Badge } from "./badge-ueL5t7TD.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session-DRQzp-HF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InstructorSession() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [session, setSession] = (0, import_react.useState)(() => getInstructorSession());
	(0, import_react.useEffect)(() => {
		if (!session) navigate({ to: "/instructor" });
	}, [session, navigate]);
	const view = useQuery({
		queryKey: ["instructor", session?.token],
		enabled: Boolean(session?.token),
		queryFn: () => getInstructorView({ data: { token: session.token } }),
		refetchInterval: 1500
	});
	const start = useMutation({
		mutationFn: () => startGame({ data: { token: session.token } }),
		onSuccess: (data) => {
			queryClient.setQueryData(["instructor", session?.token], data);
			toast.success("Week 1 is open.");
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Could not start.")
	});
	const bots = useMutation({
		mutationFn: () => fillBotsNow({ data: { token: session.token } }),
		onSuccess: (data) => {
			queryClient.setQueryData(["instructor", session?.token], data);
		}
	});
	const reveal = useMutation({
		mutationFn: () => revealDemand({ data: { token: session.token } }),
		onSuccess: (data) => {
			queryClient.setQueryData(["instructor", session?.token], data);
			toast.success("Shopper demand is now visible on student boards.");
		}
	});
	if (!session) return null;
	const data = view.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {
				solid: true,
				right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "gold",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/briefing",
							children: "Briefing"
						})
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto w-full max-w-6xl flex-1 px-4 py-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground",
								children: "Write this on the board"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-4xl font-semibold tracking-[0.12em] text-navy",
								children: session.roomCode
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									"Instructor PIN ",
									session.pin,
									" · keep this one off the projector if you can"
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								data?.status === "lobby" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => bots.mutate(),
									disabled: bots.isPending,
									children: "Empty seats → computers"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => start.mutate(),
									disabled: start.isPending,
									children: "Start week 1"
								})] }) : null,
								data && data.status !== "lobby" && !data.demandRevealed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => reveal.mutate(),
									children: "Reveal shopper demand"
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => {
										clearInstructorSession();
										setSession(null);
									},
									children: "Leave desk"
								})
							]
						})]
					}),
					data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted-foreground",
						children: data.status === "lobby" ? "Waiting in the lobby." : data.status === "finished" ? "Lab complete — debrief below." : `Live · week ${data.week} of ${data.totalWeeks}`
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted-foreground",
						children: "Loading desk…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid gap-4 lg:grid-cols-2",
						children: data?.teams.map((team) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: team.teamName }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									"Cost $",
									team.totalCost,
									team.phase === "ordering" ? ` · week ${team.week}` : ""
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: team.phase === "finished" ? "gold" : "muted",
								children: team.phase
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "flex flex-col gap-3",
							children: ROLES.map((role) => {
								const seat = team.seats.find((s) => s.role === role);
								const current = team.current[role];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border bg-muted/50 px-3 py-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm font-medium",
												children: [
													ROLE_LABEL[role],
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-normal text-muted-foreground",
														children: seat?.isBot ? "Computer" : seat?.handle ?? "Empty"
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs tabular-nums text-muted-foreground",
												children: team.pendingOrders[role] != null ? `Ordered ${team.pendingOrders[role]}` : team.phase === "ordering" ? "Waiting" : ""
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
											className: "mt-2 grid grid-cols-4 gap-2 text-center text-xs",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
													label: "On hand",
													value: current.inventory
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
													label: "Owed",
													value: current.backorder
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
													label: "Demand",
													value: current.lastDemand
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
													label: "Last order",
													value: current.lastOrder
												})
											]
										}),
										data.status === "playing" && team.phase === "ordering" && team.pendingOrders[role] == null && !seat?.isBot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HelpOrder, { onSend: (qty) => instructorPlaceOrder({ data: {
											token: session.token,
											teamIndex: team.teamIndex,
											role,
											quantity: qty
										} }).then((next) => {
											queryClient.setQueryData(["instructor", session.token], next);
										}).catch((err) => {
											toast.error(err instanceof Error ? err.message : "Could not order.");
										}) }) : null
									]
								}, role);
							})
						})] }, team.teamIndex))
					}),
					data?.teams.some((t) => t.history.length > 0) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 flex flex-col gap-12",
						children: data.teams.map((team) => team.history.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DebriefPanel, {
							result: team,
							title: `${team.teamName} — round-by-round`
						}, team.teamIndex) : null)
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-10 text-sm text-muted-foreground",
						children: [
							"Students join at the home page with code ",
							session.roomCode,
							". Need the slide outline?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/class-slides.md",
								className: "text-navy underline",
								download: true,
								children: "Download class-slides.md"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function Mini({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "font-display text-lg font-semibold tabular-nums text-navy",
		children: value
	})] });
}
function HelpOrder({ onSend }) {
	const [qty, setQty] = (0, import_react.useState)(4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mt-2 flex items-center gap-2",
		onSubmit: (e) => {
			e.preventDefault();
			onSend(qty);
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type: "number",
			min: 0,
			max: 30,
			value: qty,
			onChange: (e) => setQty(Number(e.target.value)),
			className: "h-9 w-20",
			"aria-label": "Help order"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "submit",
			size: "sm",
			variant: "outline",
			children: "Order for them"
		})]
	});
}
//#endregion
export { InstructorSession as component };
