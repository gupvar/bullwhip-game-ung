import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { s as TEAM_NAMES } from "./types-B71k4oFf.mjs";
import { i as SiteHeader, r as SiteFooter, t as Button } from "./button-DYga0lWH.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-cN-Fyx4F.mjs";
import { t as Input } from "./input-DyWOjqyx.mjs";
import { t as Label } from "./label-D8Tn1fQ7.mjs";
import { h as setInstructorSession, l as instructorLogin, r as createSession } from "./session-store-B5iFrexc.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/instructor-Cz1VFkgl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InstructorGate() {
	const navigate = useNavigate();
	const [teamCount, setTeamCount] = (0, import_react.useState)(1);
	const [code, setCode] = (0, import_react.useState)("");
	const [pin, setPin] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function create(e) {
		e.preventDefault();
		setBusy(true);
		try {
			const session = await createSession({ data: { teamCount } });
			setInstructorSession({
				token: session.token,
				roomCode: session.roomCode,
				pin: session.pin
			});
			await navigate({ to: "/instructor/session" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not open a room.");
		} finally {
			setBusy(false);
		}
	}
	async function resume(e) {
		e.preventDefault();
		setBusy(true);
		try {
			const session = await instructorLogin({ data: {
				roomCode: code,
				pin
			} });
			setInstructorSession({
				token: session.token,
				roomCode: session.roomCode,
				pin: session.pin
			});
			await navigate({ to: "/instructor/session" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not sign in.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/briefing",
					children: "Class briefing"
				})
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto grid w-full max-w-5xl flex-1 gap-6 px-4 py-8 lg:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-4xl font-semibold text-navy",
							children: "Instructor desk"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-2xl text-muted-foreground text-pretty",
							children: "Open a room, write the code on the board, and let four students pick seats. Built for one class period. Empty seats become computer players when you start."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Start a new lab" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: create,
						className: "flex flex-col gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "teams",
								children: "How many chains?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-xs text-muted-foreground",
								children: "Each chain needs a retailer, wholesaler, distributor, and factory. One chain is enough to illustrate the whip."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								id: "teams",
								value: teamCount,
								onChange: (e) => setTeamCount(Number(e.target.value)),
								className: "h-11 w-full rounded-md border border-border bg-card px-3 text-sm",
								children: TEAM_NAMES.map((name, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: i + 1,
									children: [
										i + 1,
										" — ",
										TEAM_NAMES.slice(0, i + 1).join(", ")
									]
								}, name))
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: busy,
							size: "lg",
							children: "Create room"
						})]
					}) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Return to a room" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: resume,
						className: "flex flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "room",
								children: "Room code"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "room",
								value: code,
								onChange: (e) => setCode(e.target.value.toUpperCase()),
								maxLength: 4,
								className: "mt-1 uppercase tracking-[0.3em]",
								placeholder: "HAWK",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "pin",
								children: "Instructor PIN"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "pin",
								value: pin,
								onChange: (e) => setPin(e.target.value),
								maxLength: 4,
								inputMode: "numeric",
								className: "mt-1 tracking-[0.3em]",
								placeholder: "4821",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: "outline",
								disabled: busy,
								size: "lg",
								children: "Open desk"
							})
						]
					}) })] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { InstructorGate as component };
