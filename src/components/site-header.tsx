import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { BrandMark } from "@/components/nighthawk-mark";
import { useEdition } from "@/lib/game/edition";
import { cn } from "@/lib/utils";

export function SiteHeader({
  solid = false,
  right,
}: {
  solid?: boolean;
  right?: ReactNode;
}) {
  const { edition, config, setEdition } = useEdition();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b",
        solid
          ? "border-navy-deep/40 bg-navy text-primary-foreground"
          : "border-border/80 bg-paper/90 text-foreground backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 min-h-11">
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-md",
                solid ? "bg-navy-deep" : "bg-navy",
              )}
            >
              <BrandMark className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-sm font-semibold tracking-tight">
                {config.appName}
              </span>
              <span
                className={cn(
                  "block text-[11px] uppercase tracking-[0.14em]",
                  solid ? "text-primary-foreground/70" : "text-muted-foreground",
                )}
              >
                {config.subtitle}
              </span>
            </span>
          </Link>

          <div
            className={cn(
              "hidden sm:inline-flex items-center rounded-full p-0.5 text-xs border",
              solid
                ? "border-primary-foreground/20 bg-navy-deep/80 text-primary-foreground"
                : "border-border bg-muted/70 text-foreground",
            )}
            role="group"
            aria-label="Edition selector"
          >
            <button
              type="button"
              onClick={() => setEdition("ung")}
              className={cn(
                "rounded-full px-2.5 py-1 font-medium transition-colors",
                edition === "ung"
                  ? solid
                    ? "bg-accent text-accent-foreground"
                    : "bg-navy text-primary-foreground"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              UNG Edition
            </button>
            <button
              type="button"
              onClick={() => setEdition("general")}
              className={cn(
                "rounded-full px-2.5 py-1 font-medium transition-colors",
                edition === "general"
                  ? solid
                    ? "bg-accent text-accent-foreground"
                    : "bg-navy text-primary-foreground"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              General Edition
            </button>
          </div>
        </div>

        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/how-to-play"
            className={cn(
              "hidden rounded-md px-3 py-2 min-h-11 sm:inline-flex items-center",
              solid ? "hover:bg-navy-deep" : "hover:bg-muted",
            )}
          >
            How to play & FAQ
          </Link>
          {right}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { config, edition, setEdition } = useEdition();
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>{config.footerLeft}</p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setEdition(edition === "ung" ? "general" : "ung")}
            className="text-xs underline hover:text-foreground"
          >
            Switch to {edition === "ung" ? "General Edition" : "UNG Edition"}
          </button>
          <span>·</span>
          <p>{config.footerRight}</p>
        </div>
      </div>
    </footer>
  );
}
