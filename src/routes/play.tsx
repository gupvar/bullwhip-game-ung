import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DebriefPanel } from "@/components/debrief-panel";
import { RoleBoard } from "@/components/role-board";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { getSeatView, placeOrder } from "@/lib/game/api";
import { clearStudentSession, getStudentSession, type StudentSession } from "@/lib/game/session-store";

export const Route = createFileRoute("/play")({ component: PlayPage });

function PlayPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [session, setSession] = useState<StudentSession | null>(null);
  const [ready, setReady] = useState(false);
  const [qty, setQty] = useState(4);

  useEffect(() => {
    setSession(getStudentSession());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && !session) {
      void navigate({ to: "/join" });
    }
  }, [ready, session, navigate]);

  const view = useQuery({
    queryKey: ["seat", session?.token],
    enabled: Boolean(session?.token),
    queryFn: () => getSeatView({ data: { token: session!.token } }),
    refetchInterval: 1600,
  });

  useEffect(() => {
    if (view.data?.board && view.data.board.pendingOrder == null) {
      setQty(view.data.board.lastDemand);
    }
  }, [view.data?.board.week, view.data?.board.pendingOrder, view.data?.board.lastDemand]);

  const order = useMutation({
    mutationFn: () => placeOrder({ data: { token: session!.token, quantity: qty } }),
    onSuccess: (data) => {
      queryClient.setQueryData(["seat", session?.token], data);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Order failed."),
  });

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading your board…
      </div>
    );
  }
  if (!session) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        right={
          <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Room {session.roomCode}
          </span>
        }
      />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        {view.isError ? (
          <div className="flex flex-col gap-3">
            <p>This seat is no longer available.</p>
            <Button
              onClick={() => {
                clearStudentSession();
                setSession(null);
              }}
            >
              Join again
            </Button>
          </div>
        ) : null}

        {view.data?.status === "lobby" ? (
          <div className="mb-6 rounded-lg bg-muted px-4 py-3 text-sm">
            You are in. Hang tight — the instructor will start week 1 from the desk.
          </div>
        ) : null}

        {view.data ? (
          <RoleBoard
            board={view.data.board}
            quantity={qty}
            onQuantity={setQty}
            onSubmit={() => order.mutate()}
            submitting={order.isPending}
            showMarket={view.data.demandRevealed}
          />
        ) : (
          <p className="text-sm text-muted-foreground">Loading your board…</p>
        )}

        {view.data?.debrief ? (
          <div className="mt-10">
            <DebriefPanel result={view.data.debrief} title={`${view.data.debrief.teamName} results`} />
          </div>
        ) : null}

        <div className="mt-8">
          <Button asChild variant="ghost" size="sm">
            <Link to="/how-to-play">Review the rules</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
