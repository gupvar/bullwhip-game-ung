import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Bot, Check, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { DebriefPanel } from "@/components/debrief-panel";
import { RoundTimer } from "@/components/round-timer";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  fillBotsNow,
  getInstructorView,
  instructorPlaceOrder,
  renameTeam,
  revealDemand,
  startGame,
} from "@/lib/game/api";
import { useEdition } from "@/lib/game/edition";
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
  const { edition, setEdition } = useEdition();
  const [session, setSession] = useState<InstructorAuth | null>(null);
  const [ready, setReady] = useState(false);
  const [editingTeamIdx, setEditingTeamIdx] = useState<number | null>(null);
  const [teamDraft, setTeamDraft] = useState("");

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

  useEffect(() => {
    if (view.data?.edition && view.data.edition !== edition) {
      setEdition(view.data.edition);
    }
  }, [view.data?.edition, edition, setEdition]);

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

  async function handleRenameTeam(teamIndex: number) {
    if (!session || !teamDraft.trim()) return;
    try {
      await renameTeam({
        data: {
          roomCode: session.roomCode,
          teamIndex,
          customName: teamDraft.trim(),
        },
      });
      setEditingTeamIdx(null);
      await view.refetch();
      toast.success("Team name updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not rename team.");
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Opening the desk…
      </div>
    );
  }
  if (!session) return null;
  const data = view.data;
  const activeEdition = data?.edition ?? edition;
  const activeOrderingTeam =
    data?.teams.find((t) => t.phase === "ordering" && t.seats.some((s) => !s.isBot)) ??
    data?.teams.find((t) => t.phase === "ordering");

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
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-foreground bg-accent/10 px-2.5 py-1 rounded inline-block w-fit">
              Room Code (Share with students)
            </p>
            <div className="flex items-center gap-3">
              <span className="font-display text-5xl font-bold tracking-[0.18em] text-navy select-all">
                {session.roomCode}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const url = `${window.location.origin}/join?code=${session.roomCode}&edition=${activeEdition}`;
                  navigator.clipboard.writeText(url);
                  toast.success(`Copied join link: ${url}`);
                }}
              >
                Copy Student Join Link
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Instructor PIN: <span className="font-semibold text-foreground">{session.pin}</span> (keep PIN private)
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
          <div className="mt-4 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              {data.status === "lobby"
                ? "Waiting in the lobby."
                : data.status === "finished"
                  ? "Lab complete — debrief below."
                  : `Live · week ${data.week} of ${data.totalWeeks}`}
            </p>
            {activeEdition === "general" && data.status === "playing" && activeOrderingTeam ? (
              <RoundTimer
                weekStartedAt={activeOrderingTeam.weekStartedAt}
                week={activeOrderingTeam.week}
                phase={activeOrderingTeam.phase}
              />
            ) : null}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">Loading desk…</p>
        )}

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {data?.teams.map((team) => {
            const isAllBotChain =
              team.seats.length > 0 && team.seats.every((s) => s.isBot);
            return (
              <Card key={team.teamIndex}>
                <CardHeader className="flex flex-row items-start justify-between gap-2">
                  <div>
                    {editingTeamIdx === team.teamIndex ? (
                      <div className="flex items-center gap-1.5">
                        <Input
                          value={teamDraft}
                          onChange={(e) => setTeamDraft(e.target.value)}
                          maxLength={28}
                          className="h-8 w-44 text-sm"
                          placeholder="Team name"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-8 px-2"
                          onClick={() => void handleRenameTeam(team.teamIndex)}
                        >
                          <Check className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2"
                          onClick={() => setEditingTeamIdx(null)}
                        >
                          <X className="size-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle>{team.teamName}</CardTitle>
                        {activeEdition === "general" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setTeamDraft(team.teamName);
                              setEditingTeamIdx(team.teamIndex);
                            }}
                            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                            title="Rename team"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                        ) : null}
                        {isAllBotChain && data.status !== "lobby" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-teal/10 px-2 py-0.5 text-[11px] font-medium text-teal">
                            <Bot className="size-3" /> All-Computer Chain
                          </span>
                        ) : null}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Cost ${team.totalCost}
                      {team.phase === "ordering" ? ` · week ${team.week}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeEdition === "general" && team.phase === "ordering" ? (
                      <RoundTimer
                        weekStartedAt={team.weekStartedAt}
                        week={team.week}
                        phase={team.phase}
                        compact
                        isAllBotChain={isAllBotChain}
                      />
                    ) : null}
                    <Badge variant={team.phase === "finished" ? "gold" : "muted"}>
                      {team.phase}
                    </Badge>
                  </div>
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
                                ? seat?.isBot
                                  ? "Computer thinking (≤30s)…"
                                  : "Waiting"
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
            );
          })}
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
