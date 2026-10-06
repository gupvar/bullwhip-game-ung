import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime, n as Slot } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-DYga0lWH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function NighthawkMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 64 64",
		className: cn("text-accent", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				d: "M6 34c8-2 14-10 18-18 2 8 7 14 14 18-10 1-18 6-22 16-2-6-6-12-10-16Zm52 0c-8-2-14-10-18-18-2 8-7 14-14 18 10 1 18 6 22 16 2-6 6-12 10-16Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				d: "M32 18c3 6 8 10 16 12-6 14-12 20-16 26-4-6-10-12-16-26 8-2 13-6 16-12Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "22",
				r: "2.2",
				fill: "var(--color-navy-deep)"
			})
		]
	});
}
function SiteHeader({ solid = false, right }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: cn("sticky top-0 z-30 border-b", solid ? "border-navy-deep/40 bg-navy text-primary-foreground" : "border-border/80 bg-paper/90 text-foreground backdrop-blur-sm"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-center gap-2 min-h-11",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("flex size-8 items-center justify-center rounded-md", solid ? "bg-navy-deep" : "bg-navy"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NighthawkMark, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "leading-tight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-display text-sm font-semibold tracking-tight",
						children: "Nighthawk Chain"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("block text-[11px] uppercase tracking-[0.14em]", solid ? "text-primary-foreground/70" : "text-muted-foreground"),
						children: "UNG Supply Chain Lab"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex items-center gap-1 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/how-to-play",
					className: cn("hidden rounded-md px-3 py-2 min-h-11 sm:inline-flex items-center", solid ? "hover:bg-navy-deep" : "hover:bg-muted"),
					children: "How to play"
				}), right]
			})]
		})
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-border bg-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "University of North Georgia · Operations classroom lab" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "12 weeks · four seats · one class session" })]
		})
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color,box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow-sm hover:bg-navy-deep",
			gold: "bg-accent text-accent-foreground hover:opacity-90",
			outline: "border border-border bg-card text-foreground shadow-[var(--shadow-border)] hover:bg-muted",
			ghost: "text-foreground hover:bg-muted",
			navy: "bg-navy text-primary-foreground hover:bg-navy-deep"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 rounded-sm px-3 text-sm",
			lg: "h-12 rounded-md px-5 text-base",
			xl: "h-14 rounded-lg px-6 text-base",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
export { cn as a, SiteHeader as i, NighthawkMark as n, SiteFooter as r, Button as t };
