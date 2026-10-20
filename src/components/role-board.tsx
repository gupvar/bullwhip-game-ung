import { useState } from "react";
import { Bot, Check, Pencil, User, Warehouse, X } from "lucide-react";
import { OrderStepper } from "@/components/order-stepper";
import { RoundTimer } from "@/components/round-timer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEdition } from "@/lib/game/edition";
import {
  ROLE_LABEL,
  ROLE_UPSTREAM,
  type RoleBoardView,
} from "@/lib/game/types";
import { cn } from "@/lib/utils";

function Stat({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: number;
  tone?: "ink" | "teal" | "warn";
}) {
  return (
    <div className="rounded-lg bg-muted/70 px-3 py-3">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 font-display text-3xl font-semibold tabular-nums leading-none",
          tone === "teal" && "text-teal",
          tone === "warn" && "text-destructive",
          tone === "ink" && "text-navy",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function RoleBoard({
  board,
  quantity,
  onQuantity,
  onSubmit,
  submitting,
  showMarket,
  onRenameTeam,
}: {
  board: RoleBoardView;
  quantity: number;
  onQuantity: (n: number) => void;
  onSubmit: () => void;
  submitting?: boolean;
  showMarket?: boolean;
  onRenameTeam?: (newName: string) => Promise<void> | void;
}) {
  const { edition, config } = useEdition();
  const [editingTeam, setEditingTeam] = useState(false);
  const [teamDraft, setTeamDraft] = useState(board.teamName);
  const [savingName, setSavingName] = useState(false);

  const waiting = board.teammates.filter((t) => !t.hasOrdered);
  const ordered = board.pendingOrder != null;
  const canOrder = board.phase === "ordering" && !ordered;

  async function saveTeamName() {
    if (!onRenameTeam || !teamDraft.trim()) return;
    setSavingName(true);
    try {
      await onRenameTeam(teamDraft.trim());
      setEditingTeam(false);
    } finally {
      setSavingName(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            {editingTeam ? (
              <div className="flex items-center gap-1.5">
                <Input
                  value={teamDraft}
                  onChange={(e) => setTeamDraft(e.target.value)}
                  maxLength={28}
                  className="h-7 w-44 text-xs"
                  placeholder="Team name"
                  aria-label="Edit team name"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 px-2"
                  disabled={savingName || !teamDraft.trim()}
                  onClick={() => void saveTeamName()}
                >
                  <Check className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2"
                  onClick={() => setEditingTeam(false)}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            ) : (
              <>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {board.teamName} {config.chainLabel} · {ROLE_LABEL[board.role]}
                </p>
                {onRenameTeam && config.allowCustomTeamNames ? (
                  <button
                    type="button"
                    onClick={() => {
                      setTeamDraft(board.teamName);
                      setEditingTeam(true);
                    }}
                    className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="Edit team name"
                  >
                    <Pencil className="size-3" />
                    <span>Edit team name</span>
                  </button>
                ) : null}
              </>
            )}
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-navy">
            Week {board.week} of 12
          </h1>
          {board.handle ? (
            <p className="text-sm text-muted-foreground">Playing as {board.handle}</p>
          ) : null}
        </div>
        <Badge variant="gold">{config.productBadge}</Badge>
      </div>

      {edition === "general" && board.phase === "ordering" ? (
        <RoundTimer
          weekStartedAt={board.weekStartedAt}
          week={board.week}
          phase={board.phase}
        />
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Received this week" value={board.lastReceived} />
        <Stat
          label={board.role === "retailer" ? "Shoppers asked for" : "Your customer asked for"}
          value={board.lastDemand}
        />
        <Stat label="You shipped" value={board.lastShipped} />
        <Stat label="Arriving next week" value={board.incoming} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="On hand" value={board.inventory} tone="teal" />
        <Stat
          label="Still owed (backorders)"
          value={board.backorder}
          tone={board.backorder > 0 ? "warn" : "ink"}
        />
      </div>

      {edition === "general" && board.phase === "ordering" && board.teammates.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-card p-3 text-xs">
          {board.teammates.map((t) => (
            <div
              key={t.role}
              className="flex items-center justify-between gap-1.5 rounded-lg bg-muted/50 px-2.5 py-2"
            >
              <div className="flex items-center gap-1.5 truncate">
                {t.isBot ? (
                  <Bot className="size-3.5 shrink-0 text-teal" />
                ) : (
                  <User className="size-3.5 shrink-0 text-muted-foreground" />
                )}
                <div className="truncate">
                  <span className="block font-medium text-foreground">
                    {ROLE_LABEL[t.role]}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {t.isBot ? "Computer (≤30s)" : t.handle ?? "Open"}
                  </span>
                </div>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                  t.hasOrdered
                    ? "bg-teal/15 text-teal"
                    : "bg-amber-500/15 text-amber-700",
                )}
              >
                {t.hasOrdered ? "Ready" : "Ordering…"}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <Warehouse className="mt-0.5 size-5 text-navy" />
            <div className="text-sm text-pretty">
              <p>
                {config.roleCustomer[board.role]} wanted{" "}
                <span className="font-semibold tabular-nums">{board.lastDemand}</span>{" "}
                this week. You shipped{" "}
                <span className="font-semibold tabular-nums">{board.lastShipped}</span>.
              </p>
              <p className="mt-1 text-muted-foreground">
                Holding costs ${board.inventory} this week. Backorder costs $
                {board.backorder * 2}. Running total{" "}
                <span className="font-medium text-foreground tabular-nums">
                  ${board.totalCost}
                </span>
                .
              </p>
            </div>
          </div>

          {board.phase === "lobby" ? (
            <p className="rounded-md bg-muted px-3 py-3 text-sm">
              You are seated. Wait for the instructor to start week 1.
            </p>
          ) : null}

          {board.phase === "finished" ? (
            <p className="rounded-md bg-muted px-3 py-3 text-sm">
              Twelve weeks are in. Scroll down for your chain's bullwhip chart.
            </p>
          ) : null}

          {canOrder ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium">
                Order from {ROLE_UPSTREAM[board.role]}{" "}
                <span className="font-normal text-muted-foreground">
                  (arrives in two weeks)
                </span>
              </p>
              <OrderStepper value={quantity} onChange={onQuantity} />
              <Button size="xl" onClick={onSubmit} disabled={submitting} className="w-full sm:w-auto">
                Send order of {quantity}
              </Button>
              <p className="text-xs text-muted-foreground">
                Order 0–30 cases. There is no undo after you send it.
              </p>
            </div>
          ) : null}

          {ordered && board.phase === "ordering" ? (
            <div className="rounded-lg border border-border bg-muted/60 px-4 py-3 text-sm">
              <p>
                Order of{" "}
                <span className="font-semibold tabular-nums">{board.pendingOrder}</span>{" "}
                is in.
              </p>
              {waiting.length ? (
                <p className="mt-1 text-muted-foreground">
                  Waiting on{" "}
                  {waiting
                    .map((t) => ROLE_LABEL[t.role] + (t.handle ? ` (${t.handle})` : ""))
                    .join(", ")}
                  .
                </p>
              ) : (
                <p className="mt-1 text-muted-foreground">Advancing to next week…</p>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {showMarket && board.customerDemand != null && board.role !== "retailer" ? (
        <p className="rounded-lg border border-border bg-card px-4 py-3 text-sm">
          Shoppers at the retail store actually asked for{" "}
          <span className="font-semibold tabular-nums">{board.customerDemand}</span>{" "}
          cases this week.
        </p>
      ) : null}

      {board.ownHistory.length > 0 ? (
        <Card>
          <CardContent>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Your past weeks
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm tabular-nums">
                <thead className="border-b border-border text-xs text-muted-foreground">
                  <tr>
                    <th className="py-2 pr-3">Wk</th>
                    <th className="py-2 pr-3">In</th>
                    <th className="py-2 pr-3">Asked</th>
                    <th className="py-2 pr-3">Sent</th>
                    <th className="py-2 pr-3">On hand</th>
                    <th className="py-2 pr-3">Owed</th>
                    <th className="py-2 pr-3">Ordered</th>
                    <th className="py-2">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {board.ownHistory.map((row) => (
                    <tr key={row.week} className="border-b border-border/60 last:border-0">
                      <td className="py-1.5 pr-3 font-medium">{row.week}</td>
                      <td className="py-1.5 pr-3">{row.received}</td>
                      <td className="py-1.5 pr-3">{row.demand}</td>
                      <td className="py-1.5 pr-3">{row.shipped}</td>
                      <td className="py-1.5 pr-3">{row.inventory}</td>
                      <td className="py-1.5 pr-3">{row.backorder}</td>
                      <td className="py-1.5 pr-3 font-semibold text-navy">{row.order}</td>
                      <td className="py-1.5">${row.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
