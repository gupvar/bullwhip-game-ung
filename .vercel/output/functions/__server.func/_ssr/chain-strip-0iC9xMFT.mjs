import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { a as ROLE_SHORT, i as ROLE_LABEL, n as ROLES } from "./types-B71k4oFf.mjs";
import { a as cn } from "./button-DYga0lWH.mjs";
import { c as ArrowRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chain-strip-0iC9xMFT.js
var import_jsx_runtime = require_jsx_runtime();
function ChainStrip({ active, compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
		className: "flex flex-wrap items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
			className: "rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground",
			children: "Shoppers"
		}), ROLES.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5 text-current opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("rounded-full px-3 py-1 text-xs font-medium", active === role ? "bg-navy text-primary-foreground" : "bg-card text-foreground shadow-[var(--shadow-border)]"),
				children: compact ? ROLE_SHORT[role] : ROLE_LABEL[role]
			})]
		}, role))]
	});
}
//#endregion
export { ChainStrip as t };
