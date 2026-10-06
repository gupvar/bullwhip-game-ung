import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinSeat, listOpenSeats } from "@/lib/game/api";
import { setStudentSession } from "@/lib/game/session-store";
import { ROLE_LABEL, ROLES, TEAM_NAMES, type Role } from "@/lib/game/types";

export const Route = createFileRoute("/join")({ component: JoinPage });

function JoinPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [handle, setHandle] = useState("");
  const [lobby, setLobby] = useState<Awaited<ReturnType<typeof listOpenSeats>> | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const c = params.get("code");
      if (c && c.length === 4) {
        setCode(c.toUpperCase());
      }
    }
  }, []);

  async function lookup(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await listOpenSeats({ data: { roomCode: code } });
      setLobby(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not find that room.");
    } finally {
      setBusy(false);
    }
  }

  async function sit(teamIndex: number, role: Role) {
    if (!lobby) return;
    setBusy(true);
    try {
      const joined = await joinSeat({
        data: { roomCode: lobby.roomCode, handle, teamIndex, role },
      });
      setStudentSession({
        token: joined.token,
        roomCode: joined.roomCode,
        handle: joined.handle,
        teamIndex: joined.teamIndex,
        role: joined.role,
      });
      await navigate({ to: "/play" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not take that seat.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <h1 className="font-display text-4xl font-semibold text-navy">Join a lab</h1>
        <p className="mt-2 text-muted-foreground">
          Your instructor will put a 4-letter code on the board. Use a nickname,
          not an email.
        </p>

        <form onSubmit={lookup} className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="code">Room code</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={4}
              placeholder="HAWK"
              className="mt-1 uppercase tracking-[0.3em]"
              autoComplete="off"
              required
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="handle">First name or nickname</Label>
            <Input
              id="handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              maxLength={16}
              placeholder="Maya"
              className="mt-1"
              required
            />
          </div>
          <Button type="submit" disabled={busy || code.length !== 4 || handle.trim().length < 1}>
            Find seats
          </Button>
        </form>

        {lobby ? (
          <div className="mt-8 flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Room {lobby.roomCode} · {lobby.teamCount} chain
              {lobby.teamCount === 1 ? "" : "s"} · {lobby.status}
            </p>
            {Array.from({ length: lobby.teamCount }, (_, teamIndex) => (
              <Card key={teamIndex}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {TEAM_NAMES[teamIndex]} chain
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {ROLES.map((role) => {
                    const seat = lobby.seats.find(
                      (s) => s.teamIndex === teamIndex && s.role === role,
                    );
                    const taken = Boolean(seat?.handle || seat?.isBot);
                    return (
                      <button
                        key={role}
                        type="button"
                        disabled={busy || taken}
                        onClick={() => sit(teamIndex, role)}
                        className="rounded-lg border border-border bg-card px-3 py-3 text-left min-h-16 disabled:opacity-50"
                      >
                        <span className="block text-sm font-medium text-navy">
                          {ROLE_LABEL[role]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {seat?.isBot
                            ? "Computer"
                            : seat?.handle
                              ? seat.handle
                              : "Open — sit here"}
                        </span>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        <p className="mt-8 text-sm text-muted-foreground">
          Instructor?{" "}
          <Link to="/instructor" className="text-navy underline">
            Open the instructor desk
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
