import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DebriefPanel } from "@/components/debrief-panel";
import { RoleBoard } from "@/components/role-board";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  amplification,
  applyOrders,
  beginWeek,
  botOrder,
  costsByRole,
  createTeamState,
  submitOrder,
  teamName,
  teamTotalCost,
} from "@/lib/game/engine";
import {
  ROLES,
  ROLE_LABEL,
  type Role,
  type RoleBoardView,
  type TeamPublicResult,
  type TeamState,
} from "@/lib/game/types";

export const Route = createFileRoute("/practice")({ component: PracticePage });

type Mode = "all" | Role;

function boardView(state: TeamState, role: Role, handle: string): RoleBoardView {
  const r = state.roles[role];
  return {
    week: state.week,
    phase: state.phase,
    role,
    teamIndex: 0,
    teamName: teamName(0),
    handle,
    inventory: r.inventory,
    backorder: r.backorder,
    incoming: r.incoming,
    production: r.production,
    lastReceived: r.lastReceived,
    lastDemand: r.lastDemand,
    lastShipped: r.lastShipped,
    lastOrder: r.lastOrder,
    weekCost: r.weekCost,
    totalCost: r.totalCost,
    pendingOrder: state.pendingOrders[role] ?? null,
    customerDemand: role === "retailer" || state.phase === "finished" ? r.lastDemand : null,
    teammates: ROLES.filter((x) => x !== role).map((x) => ({
      role: x,
      handle: "Computer",
      isBot: true,
      hasOrdered: state.pendingOrders[x] != null,
    })),
    ownHistory: state.history.map((h) => ({
      week: h.week,
      received: h.roles[role].received,
      demand: h.roles[role].demand,
      shipped: h.roles[role].shipped,
      inventory: h.roles[role].inventory,
      backorder: h.roles[role].backorder,
      order: h.roles[role].order,
      cost: h.roles[role].cost,
    })),
  };
}

function toResult(state: TeamState): TeamPublicResult {
  return {
    teamIndex: 0,
    teamName: teamName(0),
    phase: state.phase,
    week: state.week,
    totalCost: teamTotalCost(state),
    roleCosts: costsByRole(state),
    history: state.history,
    pendingOrders: state.pendingOrders,
    seats: ROLES.map((role) => ({
      teamIndex: 0,
      role,
      handle: "You",
      isBot: false,
      hasOrdered: state.pendingOrders[role] != null,
    })),
    amplification: amplification(state.history),
    current: state.roles,
  };
}

function PracticePage() {
  const [mode, setMode] = useState<Mode>("all");
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<TeamState>(() => createTeamState());
  const [focus, setFocus] = useState<Role>("retailer");
  const [qty, setQty] = useState(4);

  const board = useMemo(
    () => boardView(state, focus, mode === "all" ? ROLE_LABEL[focus] : "You"),
    [state, focus, mode],
  );

  function start() {
    const next = beginWeek(createTeamState());
    setState(next);
    setStarted(true);
    const first = mode === "all" ? "retailer" : mode;
    setFocus(first);
    setQty(next.roles[first].lastDemand);
  }

  function submit() {
    let next = submitOrder(state, focus, qty);

    if (mode === "all") {
      const idx = ROLES.indexOf(focus);
      if (idx < ROLES.length - 1) {
        const upcoming = ROLES[idx + 1];
        setState(next);
        setFocus(upcoming);
        setQty(next.roles[upcoming].lastDemand);
        return;
      }
    } else {
      for (const role of ROLES) {
        if (next.pendingOrders[role] == null) {
          next = submitOrder(next, role, botOrder(next.roles[role]));
        }
      }
    }

    next = applyOrders(next);
    if (next.phase !== "finished") {
      next = beginWeek(next);
      const nextFocus = mode === "all" ? "retailer" : mode;
      setFocus(nextFocus);
      setQty(next.roles[nextFocus].lastDemand);
    }
    setState(next);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        {!started ? (
          <div className="flex flex-col gap-5">
            <h1 className="font-display text-4xl font-semibold text-navy">Practice lab</h1>
            <p className="text-muted-foreground text-pretty">
              Same 12-week Nighthawk gear chain, no classmates required. Play every
              seat to feel the delay — that is how an instructor can also demo
              the lab before class — or hold one seat and let a simple computer
              rule run the others.
            </p>
            <div className="flex flex-col gap-2">
              <Label>How do you want to play?</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                <ModeButton
                  selected={mode === "all"}
                  onClick={() => setMode("all")}
                  label="All four seats"
                  hint="Best for learning the full four-seat chain"
                />
                {ROLES.map((role) => (
                  <ModeButton
                    key={role}
                    selected={mode === role}
                    onClick={() => setMode(role)}
                    label={`${ROLE_LABEL[role]} only`}
                    hint="Computers fill the other two seats"
                  />
                ))}
              </div>
            </div>
            <Button size="lg" onClick={start} className="w-full sm:w-auto">
              Start week 1
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {mode === "all" && state.phase === "ordering" ? (
              <p className="text-sm text-muted-foreground">
                You are placing the {ROLE_LABEL[focus].toLowerCase()} order for week {state.week}.
              </p>
            ) : null}
            {state.phase !== "lobby" ? (
              <RoleBoard
                board={board}
                quantity={qty}
                onQuantity={setQty}
                onSubmit={submit}
              />
            ) : null}
            {state.phase === "finished" ? (
              <>
                <DebriefPanel result={toResult(state)} title="Practice debrief" />
                <Button variant="outline" onClick={start}>
                  Play again
                </Button>
              </>
            ) : null}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function ModeButton({
  selected,
  onClick,
  label,
  hint,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        selected
          ? "rounded-lg border border-navy bg-navy px-4 py-3 text-left text-primary-foreground"
          : "rounded-lg border border-border bg-card px-4 py-3 text-left shadow-[var(--shadow-border)]"
      }
    >
      <span className="block text-sm font-medium">{label}</span>
      <span className={selected ? "text-xs text-primary-foreground/70" : "text-xs text-muted-foreground"}>
        {hint}
      </span>
    </button>
  );
}
