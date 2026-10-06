import { Warehouse } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStepper } from "@/components/order-stepper";
import {
  ROLE_CUSTOMER,
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
}: {
  board: RoleBoardView;
  quantity: number;
  onQuantity: (n: number) => void;
  onSubmit: () => void;
  submitting?: boolean;
  showMarket?: boolean;
}) {
  const waiting = board.teammates.filter((t) => !t.hasOrdered);
  const ordered = board.pendingOrder != null;
  const canOrder = board.phase === "ordering" && !ordered;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {board.teamName} campus · {ROLE_LABEL[board.role]}
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-navy">
            Week {board.week} of 12
          </h1>
          {board.handle ? (
            <p className="text-sm text-muted-foreground">Playing as {board.handle}</p>
          ) : null}
        </div>
        <Badge variant="gold">Nighthawk gear · cases</Badge>
      </div>

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

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <Warehouse className="mt-0.5 size-5 text-navy" />
            <div className="text-sm text-pretty">
              <p>
                {ROLE_CUSTOMER[board.role]} wanted{" "}
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
                    .join(" and ")}
                  .
                </p>
              ) : (
                <p className="mt-1 text-muted-foreground">Resolving the week…</p>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {showMarket && board.role !== "retailer" ? (
        <p className="text-sm text-muted-foreground">
          Instructor has revealed shopper demand. Compare it with the orders you placed.
        </p>
      ) : null}

      {board.ownHistory.length > 0 ? (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Week</th>
                  <th className="px-2 py-3 font-medium">In</th>
                  <th className="px-2 py-3 font-medium">Demand</th>
                  <th className="px-2 py-3 font-medium">Out</th>
                  <th className="px-2 py-3 font-medium">Stock</th>
                  <th className="px-2 py-3 font-medium">Owed</th>
                  <th className="px-4 py-3 font-medium">You ordered</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {board.ownHistory.map((row) => (
                  <tr key={row.week} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-2">{row.week}</td>
                    <td className="px-2 py-2">{row.received}</td>
                    <td className="px-2 py-2">{row.demand}</td>
                    <td className="px-2 py-2">{row.shipped}</td>
                    <td className="px-2 py-2">{row.inventory}</td>
                    <td className="px-2 py-2">{row.backorder}</td>
                    <td className="px-4 py-2 font-medium">{row.order}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
