import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { i as ROLE_LABEL, n as ROLES, s as TEAM_NAMES } from "./types-B71k4oFf.mjs";
import { i as SiteHeader, r as SiteFooter, t as Button } from "./button-DYga0lWH.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-cN-Fyx4F.mjs";
import { t as Input } from "./input-DyWOjqyx.mjs";
import { t as Label } from "./label-D8Tn1fQ7.mjs";
import { d as joinSeat, f as listOpenSeats, g as setStudentSession } from "./session-store-B5iFrexc.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/join-C3x2SC_-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function JoinPage() {
	const navigate = useNavigate();
	const [code, setCode] = (0, import_react.useState)("");
	const [handle, setHandle] = (0, import_react.useState)("");
	const [lobby, setLobby] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function lookup(e) {
		e.preventDefault();
		setBusy(true);
		try {
			const data = await listOpenSeats({ data: { roomCode: code } });
			setLobby(data);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not find that room.");
		} finally {
			setBusy(false);
		}
	}
	async function sit(teamIndex, role) {
		if (!lobby) return;
		setBusy(true);
		try {
			const joined = await joinSeat({ data: {
				roomCode: lobby.roomCode,
				handle,
				teamIndex,
				role
			} });
			setStudentSession({
				token: joined.token,
				roomCode: joined.roomCode,
				handle: joined.handle,
				teamIndex: joined.teamIndex,
				role: joined.role
			});
			await navigate({ to: "/play" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not take that seat.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto w-full max-w-3xl flex-1 px-4 py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl font-semibold text-navy",
						children: "Join a lab"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-muted-foreground",
						children: "Your instructor will put a 4-letter code on the board. Use a nickname, not an email."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: lookup,
						className: "mt-6 flex flex-col gap-4 sm:flex-row sm:items-end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "code",
									children: "Room code"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "code",
									value: code,
									onChange: (e) => setCode(e.target.value.toUpperCase()),
									maxLength: 4,
									placeholder: "HAWK",
									className: "mt-1 uppercase tracking-[0.3em]",
									autoComplete: "off",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "handle",
									children: "First name or nickname"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "handle",
									value: handle,
									onChange: (e) => setHandle(e.target.value),
									maxLength: 16,
									placeholder: "Maya",
									className: "mt-1",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: busy || code.length !== 4 || handle.trim().length < 1,
								children: "Find seats"
							})
						]
					}),
					lobby ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								"Room ",
								lobby.roomCode,
								" · ",
								lobby.teamCount,
								" chain",
								lobby.teamCount === 1 ? "" : "s",
								" · ",
								lobby.status
							]
						}), Array.from({ length: lobby.teamCount }, (_, teamIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-lg",
							children: [TEAM_NAMES[teamIndex], " chain"]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-4",
							children: ROLES.map((role) => {
								const seat = lobby.seats.find((s) => s.teamIndex === teamIndex && s.role === role);
								const taken = Boolean(seat?.handle || seat?.isBot);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: busy || taken,
									onClick: () => sit(teamIndex, role),
									className: "rounded-lg border border-border bg-card px-3 py-3 text-left min-h-16 disabled:opacity-50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-sm font-medium text-navy",
										children: ROLE_LABEL[role]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: seat?.isBot ? "Computer" : seat?.handle ? seat.handle : "Open — sit here"
									})]
								}, role);
							})
						})] }, teamIndex))]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-8 text-sm text-muted-foreground",
						children: [
							"Instructor?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/instructor",
								className: "text-navy underline",
								children: "Open the instructor desk"
							}),
							"."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { JoinPage as component };
