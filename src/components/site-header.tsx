import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { NighthawkMark } from "@/components/nighthawk-mark";
import { cn } from "@/lib/utils";

export function SiteHeader({
  solid = false,
  right,
}: {
  solid?: boolean;
  right?: ReactNode;
}) {
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
        <Link to="/" className="flex items-center gap-2 min-h-11">
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-md",
              solid ? "bg-navy-deep" : "bg-navy",
            )}
          >
            <NighthawkMark className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-sm font-semibold tracking-tight">
              Nighthawk Chain
            </span>
            <span
              className={cn(
                "block text-[11px] uppercase tracking-[0.14em]",
                solid ? "text-primary-foreground/70" : "text-muted-foreground",
              )}
            >
              UNG Supply Chain Lab
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/how-to-play"
            className={cn(
              "hidden rounded-md px-3 py-2 min-h-11 sm:inline-flex items-center",
              solid ? "hover:bg-navy-deep" : "hover:bg-muted",
            )}
          >
            How to play
          </Link>
          {right}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>University of North Georgia · Operations classroom lab</p>
        <p>12 weeks · four seats · one class session</p>
      </div>
    </footer>
  );
}
