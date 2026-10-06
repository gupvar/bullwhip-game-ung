import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DebriefPanel } from "@/components/debrief-panel";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  fillBotsNow,
  getInstructorView,
  instructorPlaceOrder,
  revealDemand,
  startGame,
} from "@/lib/game/api";
import {
  clearInstructorSession,
  getInstructorSession,
  type InstructorSession as InstructorAuth,
} from "@/lib/game/session-store";
import { ROLE_LABEL, ROLES } from "@/lib/game/types";

export const Route = createFileRoute("/instructor/session")({
  component: InstructorSession,
});

function InstructorSession() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [session, setSession] = useState<InstructorAuth | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(getInstructorSession());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && !session) void navigate({ to: "/instructor" });
  }, [ready, session, navigate]);

  const view = useQuery({
    queryKey: ["instructor", session?.token],
    enabled: Boolean(session?.token),
    queryFn: () => getInstructorView({ data: { token: session!.token } }),
    refetchInterval: 1500,
  });

  const start = useMutation({
    mutationFn: () => startGame({ data: { token: session!.token } }),
    onSuccess: (data) => {
      queryClient.setQueryData(["instructor", session?.token], data);
      toast.success("Week 1 is open.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not start."),
  });

  const bots = useMutation({
    mutationFn: () => fillBotsNow({ data: { token: session!.token } }),
    onSuccess: (data) => {
      queryClient.setQueryData(["instructor", session?.token], data);
    },
  });

  const reveal = useMutation({
    mutationFn: () => revealDemand({ data: { token: session!.token } }),
    onSuccess: (data) => {
      queryClient.setQueryData(["instructor", session?.token], data);
      toast.success("Shopper demand is now visible on student boards.");
    },
  });

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Opening the desk…
      </div>
    );
  }
  if (!session) return null;
  const data = view.data;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        solid
        right={
          <div className="flex items-center gap-2">
            <Button asChild variant="gold" size="sm">
              <Link to="/briefing">Briefing</Link>
            </Button>
          </div>
        }
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Write this on the board
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-[0.12em] text-navy">
              {session.roomCode}
            </h1>
            <p className="text-sm text-muted-foreground">
              Instructor PIN {session.pin} · keep this one off the projector if you can
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {data?.status === "lobby" ? (
              <>
                <Button variant="outline" onClick={() => bots.mutate()} disabled={bots.isPending}>
                  Empty seats → computers
                </Button>
                <Button onClick={() => start.mutate()} disabled={start.isPending}>
                  Start week 1
                </Button>
              </>
            ) : null}
            {data && data.status !== "lobby" && !data.demandRevealed ? (
              <Button variant="outline" onClick={() => reveal.mutate()}>
                Reveal shopper demand
              </Button>
            ) : null}
            <Button
              variant="ghost"
              onClick={() => {
                clearInstructorSession();
                setSession(null);
              }}
            >
              Leave desk
            </Button>
          </div>
        </div>

        {view.isError ? (
          <div className="mt-6 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            <p className="font-semibold">Unable to load instructor room</p>
            <p className="mt-1">
              {view.error instanceof Error ? view.error.message : "Instructor session expired or not found."}
            </p>
            <Button
              className="mt-3"
              variant="outline"
              size="sm"
              onClick={() => {
                clearInstructorSession();
                void navigate({ to: "/instructor" });
              }}
            >
              Back to Instructor Desk
            </Button>
          </div>
        ) : data ? (
          <p className="mt-4 text-sm text-muted-foreground">
            {data.status === "lobby"
              ? "Waiting in the lobby."
              : data.status === "finished"
                ? "Lab complete — debrief below."
                : `Live · week ${data.week} of ${data.totalWeeks}`}
          </p>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">Loading desk…</p>
        )}

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {data?.teams.map((team) => (
            <Card key={team.teamIndex}>
              <CardHeader className="flex flex-row items-start justify-between gap-2">
                <div>
                  <CardTitle>{team.teamName}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Cost ${team.totalCost}
                    {team.phase === "ordering" ? ` · week ${team.week}` : ""}
                  </p>
                </div>
                <Badge variant={team.phase === "finished" ? "gold" : "muted"}>
                  {team.phase}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {ROLES.map((role) => {
                  const seat = team.seats.find((s) => s.role === role);
                  const current = team.current[role];
                  return (
                    <div
                      key={role}
                      className="rounded-lg border border-border bg-muted/50 px-3 py-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">
                          {ROLE_LABEL[role]}{" "}
                          <span className="font-normal text-muted-foreground">
                            {seat?.isBot ? "Computer" : seat?.handle ?? "Empty"}
                          </span>
                        </p>
                        <p className="text-xs tabular-nums text-muted-foreground">
                          {team.pendingOrders[role] != null
                            ? `Ordered ${team.pendingOrders[role]}`
                            : team.phase === "ordering"
                              ? "Waiting"
                              : ""}
                        </p>
                      </div>
                      <dl className="mt-2 grid grid-cols-4 gap-2 text-center text-xs">
                        <Mini label="On hand" value={current.inventory} />
                        <Mini label="Owed" value={current.backorder} />
                        <Mini label="Demand" value={current.lastDemand} />
                        <Mini label="Last order" value={current.lastOrder} />
                      </dl>
                      {data.status === "playing" &&
                      team.phase === "ordering" &&
                      team.pendingOrders[role] == null &&
                      !seat?.isBot ? (
                        <HelpOrder
                          onSend={(qty) =>
                            instructorPlaceOrder({
                              data: {
                                token: session.token,
                                teamIndex: team.teamIndex,
                                role,
                                quantity: qty,
                              },
                            }).then((next) => {
                              queryClient.setQueryData(
                                ["instructor", session.token],
                                next,
                              );
                            }).catch((err) => {
                              toast.error(
                                err instanceof Error ? err.message : "Could not order.",
                              );
                            })
                          }
                        />
                      ) : null}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>

        {data?.teams.some((t) => t.history.length > 0) ? (
          <div className="mt-10 flex flex-col gap-12">
            {data.teams.map((team) =>
              team.history.length ? (
                <DebriefPanel
                  key={team.teamIndex}
                  result={team}
                  title={`${team.teamName} — round-by-round`}
                />
              ) : null,
            )}
          </div>
        ) : null}

        <p className="mt-10 text-sm text-muted-foreground">
          Students join at the home page with code {session.roomCode}. Need the
          slide outline?{" "}
          <a href="/class-slides.md" className="text-navy underline" download>
            Download class-slides.md
          </a>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-display text-lg font-semibold tabular-nums text-navy">{value}</dd>
    </div>
  );
}

function HelpOrder({ onSend }: { onSend: (qty: number) => void }) {
  const [qty, setQty] = useState(4);
  return (
    <form
      className="mt-2 flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSend(qty);
      }}
    >
      <Input
        type="number"
        min={0}
        max={30}
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
        className="h-9 w-20"
        aria-label="Help order"
      />
      <Button type="submit" size="sm" variant="outline">
        Order for them
      </Button>
    </form>
  );
}
