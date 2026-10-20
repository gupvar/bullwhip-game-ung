import { useState } from "react";
import { Bot, Trophy, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  computeOverallRankings,
  computeRoleRankings,
} from "@/lib/game/leaderboard";
import {
  ROLES,
  ROLE_LABEL,
  type Role,
  type SessionLeaderboard,
} from "@/lib/game/types";
import { cn } from "@/lib/utils";

type TabKey = "overall" | Role;

export function LeaderboardPanel({
  leaderboard,
  highlightTeamIndex,
  highlightRole,
}: {
  leaderboard: SessionLeaderboard;
  highlightTeamIndex?: number;
  highlightRole?: Role;
}) {
  const [tab, setTab] = useState<TabKey>("overall");
  const [weekFilter, setWeekFilter] = useState<number | "live">("live");

  if (!leaderboard || leaderboard.teams.length === 0) return null;

  const completedWeeksList = Array.from(
    { length: leaderboard.maxCompletedWeek },
    (_, i) => i + 1,
  );

  const overallRows = computeOverallRankings(leaderboard, weekFilter);
  const roleRows =
    tab !== "overall" ? computeRoleRankings(leaderboard, tab, weekFilter) : [];

  return (
    <Card className="border-border shadow-[var(--shadow-border)]">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-navy text-accent">
            <Trophy className="size-5" />
          </span>
          <div>
            <CardTitle className="text-xl">
              Live Leaderboards (Overall &amp; By Role)
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Lowest cumulative cost wins ($1 holding · $2 backorder). Updated after each week.
            </p>
          </div>
        </div>

        {completedWeeksList.length > 0 ? (
          <div className="flex items-center gap-2">
            <label
              htmlFor="leaderboard-week"
              className="text-xs font-medium text-muted-foreground"
            >
              Standings:
            </label>
            <select
              id="leaderboard-week"
              value={weekFilter === "live" ? "live" : String(weekFilter)}
              onChange={(e) =>
                setWeekFilter(
                  e.target.value === "live" ? "live" : Number(e.target.value),
                )
              }
              className="h-8 rounded-md border border-border bg-card px-2.5 text-xs font-medium"
            >
              <option value="live">Live / Latest Week</option>
              {completedWeeksList.map((wk) => (
                <option key={wk} value={wk}>
                  After Week {wk}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Category Tabs: Overall vs. Individual Roles */}
        <div
          className="flex flex-wrap gap-1.5 rounded-lg bg-muted/70 p-1"
          role="tablist"
          aria-label="Leaderboard view"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "overall"}
            onClick={() => setTab("overall")}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
              tab === "overall"
                ? "bg-navy text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Overall Chains
          </button>
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              role="tab"
              aria-selected={tab === r}
              onClick={() => setTab(r)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                tab === r
                  ? "bg-navy text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r === "factory" ? "Factories" : `${ROLE_LABEL[r]}s`}
            </button>
          ))}
        </div>

        {tab === "overall" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm tabular-nums">
              <thead className="border-b border-border text-xs uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="py-2 pr-3">Rank</th>
                  <th className="py-2 pr-3">Chain</th>
                  <th className="py-2 pr-3">Week</th>
                  <th className="py-2 pr-3">Retailer</th>
                  <th className="py-2 pr-3">Wholesaler</th>
                  <th className="py-2 pr-3">Distributor</th>
                  <th className="py-2 pr-3">Factory</th>
                  <th className="py-2 text-right">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {overallRows.map((row) => {
                  const isMine = highlightTeamIndex === row.teamIndex;
                  return (
                    <tr
                      key={row.teamIndex}
                      className={cn(
                        "border-b border-border/60 last:border-0",
                        isMine && "bg-accent/10 font-medium",
                      )}
                    >
                      <td className="py-2.5 pr-3 font-display font-semibold text-navy">
                        #{row.rank}
                      </td>
                      <td className="py-2.5 pr-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-foreground">
                            {row.teamName}
                          </span>
                          {isMine ? (
                            <span className="rounded bg-navy px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                              Your chain
                            </span>
                          ) : null}
                          {row.isAllBot ? (
                            <span className="inline-flex items-center gap-0.5 rounded bg-teal/10 px-1.5 py-0.5 text-[10px] font-medium text-teal">
                              <Bot className="size-3" /> Bot
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="py-2.5 pr-3 text-xs text-muted-foreground">
                        Wk {row.weekEvaluated}
                      </td>
                      <td className="py-2.5 pr-3">${row.roleCosts.retailer}</td>
                      <td className="py-2.5 pr-3">${row.roleCosts.wholesaler}</td>
                      <td className="py-2.5 pr-3">${row.roleCosts.distributor}</td>
                      <td className="py-2.5 pr-3">${row.roleCosts.factory}</td>
                      <td className="py-2.5 text-right font-display text-base font-bold text-navy">
                        ${row.totalCost}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm tabular-nums">
              <thead className="border-b border-border text-xs uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="py-2 pr-3">Rank</th>
                  <th className="py-2 pr-3">{ROLE_LABEL[tab]} Player</th>
                  <th className="py-2 pr-3">Chain</th>
                  <th className="py-2 pr-3">Week</th>
                  <th className="py-2 pr-3 text-right">Avg / Wk</th>
                  <th className="py-2 text-right">{ROLE_LABEL[tab]} Cost</th>
                </tr>
              </thead>
              <tbody>
                {roleRows.map((row) => {
                  const isMine =
                    highlightTeamIndex === row.teamIndex && highlightRole === row.role;
                  return (
                    <tr
                      key={`${row.teamIndex}-${row.role}`}
                      className={cn(
                        "border-b border-border/60 last:border-0",
                        isMine && "bg-accent/10 font-medium",
                      )}
                    >
                      <td className="py-2.5 pr-3 font-display font-semibold text-navy">
                        #{row.rank}
                      </td>
                      <td className="py-2.5 pr-3">
                        <div className="flex items-center gap-1.5">
                          {row.isBot ? (
                            <Bot className="size-3.5 text-teal" />
                          ) : (
                            <User className="size-3.5 text-muted-foreground" />
                          )}
                          <span className="font-semibold text-foreground">
                            {row.handle}
                          </span>
                          {isMine ? (
                            <span className="rounded bg-navy px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                              You
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="py-2.5 pr-3 text-muted-foreground">
                        {row.teamName}
                      </td>
                      <td className="py-2.5 pr-3 text-xs text-muted-foreground">
                        Wk {row.weekEvaluated}
                      </td>
                      <td className="py-2.5 pr-3 text-right text-xs text-muted-foreground">
                        ${row.avgCostPerWeek.toFixed(1)}
                      </td>
                      <td className="py-2.5 text-right font-display text-base font-bold text-navy">
                        ${row.cost}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
