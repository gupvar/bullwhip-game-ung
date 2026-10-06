import { BullwhipCharts } from "@/components/bullwhip-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLE_LABEL, ROLES, type TeamPublicResult } from "@/lib/game/types";

export function DebriefPanel({
  result,
  title = "Chain results",
}: {
  result: TeamPublicResult;
  title?: string;
}) {
  return (
    <section className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-2xl font-semibold text-navy">{title}</h2>
        <p className="text-sm text-muted-foreground">
          {result.teamName} · total cost{" "}
          <span className="font-medium tabular-nums text-foreground">${result.totalCost}</span>
        </p>
      </div>
      <BullwhipCharts result={result} />
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cost by seat</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ROLES.map((role) => (
            <div key={role}>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {ROLE_LABEL[role]}
              </p>
              <p className="font-display text-2xl font-semibold tabular-nums text-navy">
                ${result.roleCosts[role]}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="rounded-xl border border-border bg-navy px-5 py-4 text-primary-foreground">
        <p className="font-display text-lg font-semibold">What to notice</p>
        <p className="mt-1 text-sm text-primary-foreground/85 text-pretty">
          Shopper demand only moved once — from 4 to 8 in week 5. If factory orders
          swing much harder than that, you are looking at the bullwhip effect: delay,
          hidden information, and local inventory targets amplifying a small change.
        </p>
      </div>
    </section>
  );
}
