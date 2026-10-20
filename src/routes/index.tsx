import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight, Check, Globe, GraduationCap, Keyboard, School, Users } from "lucide-react";
import { ChainStrip } from "@/components/chain-strip";
import { BrandMark, GeneralChainMark, NighthawkMark } from "@/components/nighthawk-mark";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEdition } from "@/lib/game/edition";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { edition, config, setEdition } = useEdition();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        solid
        right={
          <div className="flex gap-1">
            <Button asChild variant="gold" size="sm">
              <Link to="/join">Join a lab</Link>
            </Button>
          </div>
        }
      />
      <main className="flex-1">
        {/* Edition Selector Banner */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-6xl px-4 py-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Choose Your Edition
                </p>
                <h2 className="font-display text-lg font-semibold text-navy">
                  Select the version you want to play or host
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Both editions share the same 12-week supply chain engine
              </p>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setEdition("general")}
                className={`group flex items-start gap-4 rounded-xl border p-4 text-left transition-all ${
                  edition === "general"
                    ? "border-navy bg-navy/5 ring-2 ring-navy"
                    : "border-border bg-background hover:border-navy/40"
                }`}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-emerald-400">
                  <GeneralChainMark className="size-6" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-base font-semibold text-foreground flex items-center gap-1.5">
                      <Globe className="size-4 text-muted-foreground" />
                      General Supply Chain Edition
                    </span>
                    {edition === "general" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-navy px-2.5 py-0.5 text-[11px] font-medium text-primary-foreground">
                        <Check className="size-3" /> Active
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Modern minimalist theme · Up to 24 Greek-named chains (Alpha–Omega) · Editable team names · Built for any classroom or public workshop.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setEdition("ung")}
                className={`group flex items-start gap-4 rounded-xl border p-4 text-left transition-all ${
                  edition === "ung"
                    ? "border-navy bg-navy/5 ring-2 ring-navy"
                    : "border-border bg-background hover:border-navy/40"
                }`}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#1f3d7c] text-[#ffc62f]">
                  <NighthawkMark className="size-6" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-base font-semibold text-foreground flex items-center gap-1.5">
                      <School className="size-4 text-muted-foreground" />
                      UNG Nighthawk Edition
                    </span>
                    {edition === "ung" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-navy px-2.5 py-0.5 text-[11px] font-medium text-primary-foreground">
                        <Check className="size-3" /> Active
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    University of North Georgia edition · 6 UNG campus chains (Dahlonega–Watkinsville) · Nighthawk gear theme.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </section>

        <section className="bg-navy text-primary-foreground">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
                {config.eyebrow}
              </p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                One class period. One demand shock. Watch the chain whip.
              </h1>
              <p className="mt-4 max-w-xl text-base text-primary-foreground/80 text-pretty">
                {edition === "general"
                  ? "An interactive four-echelon supply chain simulation. Retail store, wholesaler, distributor, factory. Twelve weeks. One order decision each week. Consumer demand shifts once — nobody upstream is told."
                  : "A UNG classroom version of the classic four-seat supply chain game. Campus store, wholesaler, distributor, factory. Twelve weeks. One order each week. Shoppers change once — nobody else is told."}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="gold" size="lg">
                  <Link to="/join">
                    Join with a room code
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/20 bg-navy-deep text-primary-foreground hover:bg-navy"
                >
                  <Link to="/instructor">Host as instructor</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-xl bg-navy-deep p-5 shadow-[var(--shadow-border)]">
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-lg bg-navy">
                  <BrandMark className="size-8" />
                </span>
                <div>
                  <p className="font-display text-xl font-semibold">{config.productTitle}</p>
                  <p className="text-sm text-primary-foreground/70">
                    {config.productSubtitle}
                  </p>
                </div>
              </div>
              <div className="mt-5 text-primary-foreground">
                <ChainStrip />
              </div>
              <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-navy px-2 py-3">
                  <dt className="text-[11px] uppercase tracking-[0.12em] text-primary-foreground/60">
                    Weeks
                  </dt>
                  <dd className="font-display text-2xl font-semibold tabular-nums">12</dd>
                </div>
                <div className="rounded-lg bg-navy px-2 py-3">
                  <dt className="text-[11px] uppercase tracking-[0.12em] text-primary-foreground/60">
                    Seats
                  </dt>
                  <dd className="font-display text-2xl font-semibold tabular-nums">4</dd>
                </div>
                <div className="rounded-lg bg-navy px-2 py-3">
                  <dt className="text-[11px] uppercase tracking-[0.12em] text-primary-foreground/60">
                    Decision
                  </dt>
                  <dd className="font-display text-2xl font-semibold">Order</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:grid-cols-3">
          <PathCard
            icon={<Users className="size-5" />}
            title="Play in class"
            body="Enter a 4-letter code, pick a seat, and order 0–30 cases each week."
            to="/join"
            cta="Join a lab"
          />
          <PathCard
            icon={<Keyboard className="size-5" />}
            title="Practice solo"
            body="Walk all four seats yourself. Same rules, no room code."
            to="/practice"
            cta="Open the practice lab"
          />
          <PathCard
            icon={<GraduationCap className="size-5" />}
            title="Instructor desk"
            body="Open a room, watch live orders, then show the whip on the projector."
            to="/instructor"
            cta="Host a session"
          />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function PathCard({
  icon,
  title,
  body,
  to,
  cta,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  to: "/join" | "/practice" | "/instructor";
  cta: string;
}) {
  return (
    <Card className="rounded-xl">
      <CardContent className="flex h-full flex-col gap-3 p-5">
        <span className="flex size-10 items-center justify-center rounded-md bg-navy text-accent">
          {icon}
        </span>
        <h2 className="font-display text-xl font-semibold text-navy">{title}</h2>
        <p className="flex-1 text-sm text-muted-foreground text-pretty">{body}</p>
        <Button asChild variant="outline">
          <Link to={to}>
            {cta}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
