import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { i as SiteHeader, r as SiteFooter, t as Button } from "./button-DYga0lWH.mjs";
import { c as getStudentSession, n as clearStudentSession, p as placeOrder, s as getSeatView } from "./session-store-B5iFrexc.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as DebriefPanel } from "./badge-ueL5t7TD.mjs";
import { t as RoleBoard } from "./role-board-zNkjXUdO.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/play-CAycQWO5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PlayPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [session, setSession] = (0, import_react.useState)(() => getStudentSession());
	const [qty, setQty] = (0, import_react.useState)(4);
	(0, import_react.useEffect)(() => {
		if (!session) navigate({ to: "/join" });
	}, [session, navigate]);
	const view = useQuery({
		queryKey: ["seat", session?.token],
		enabled: Boolean(session?.token),
		queryFn: () => getSeatView({ data: { token: session.token } }),
		refetchInterval: 1600
	});
	(0, import_react.useEffect)(() => {
		if (view.data?.board && view.data.board.pendingOrder == null) setQty(view.data.board.lastDemand);
	}, [
		view.data?.board.week,
		view.data?.board.pendingOrder,
		view.data?.board.lastDemand
	]);
	const order = useMutation({
		mutationFn: () => placeOrder({ data: {
			token: session.token,
			quantity: qty
		} }),
		onSuccess: (data) => {
			queryClient.setQueryData(["seat", session?.token], data);
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Order failed.")
	});
	if (!session) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs uppercase tracking-[0.14em] text-muted-foreground",
				children: ["Room ", session.roomCode]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto w-full max-w-3xl flex-1 px-4 py-8",
				children: [
					view.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This seat is no longer available." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								clearStudentSession();
								setSession(null);
							},
							children: "Join again"
						})]
					}) : null,
					view.data?.status === "lobby" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-6 rounded-lg bg-muted px-4 py-3 text-sm",
						children: "You are in. Hang tight — the instructor will start week 1 from the desk."
					}) : null,
					view.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBoard, {
						board: view.data.board,
						quantity: qty,
						onQuantity: setQty,
						onSubmit: () => order.mutate(),
						submitting: order.isPending,
						showMarket: view.data.demandRevealed
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Loading your board…"
					}),
					view.data?.debrief ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DebriefPanel, {
							result: view.data.debrief,
							title: `${view.data.debrief.teamName} results`
						})
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/how-to-play",
								children: "Review the rules"
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { PlayPage as component };
