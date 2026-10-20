import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSession, instructorLogin } from "@/lib/game/api";
import { useEdition } from "@/lib/game/edition";
import { setInstructorSession } from "@/lib/game/session-store";

export const Route = createFileRoute("/instructor/")({ component: InstructorGate });

function InstructorGate() {
  const navigate = useNavigate();
  const { edition, config } = useEdition();
  const [teamCount, setTeamCount] = useState(1);
  const [code, setCode] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);

  const teamList = config.teamNames;

  useEffect(() => {
    if (teamCount > teamList.length) {
      setTeamCount(teamList.length);
    }
  }, [teamCount, teamList.length]);

  async function create(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setCreateError(null);
    try {
      const session = await createSession({ data: { teamCount, edition } });
      setInstructorSession({
        token: session.token,
        roomCode: session.roomCode,
        pin: session.pin,
      });
      if (typeof window !== "undefined") {
        window.location.href = "/instructor/session";
      } else {
        await navigate({ to: "/instructor/session" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not open a room.";
      setCreateError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  async function resume(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResumeError(null);
    try {
      const session = await instructorLogin({ data: { roomCode: code, pin } });
      setInstructorSession({
        token: session.token,
        roomCode: session.roomCode,
        pin: session.pin,
      });
      if (typeof window !== "undefined") {
        window.location.href = "/instructor/session";
      } else {
        await navigate({ to: "/instructor/session" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not sign in.";
      setResumeError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        right={
          <Button asChild variant="outline" size="sm">
            <Link to="/briefing">Class briefing</Link>
          </Button>
        }
      />
      <main className="mx-auto grid w-full max-w-5xl flex-1 gap-6 px-4 py-8 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {edition === "general" ? "General Supply Chain Edition" : "UNG Nighthawk Edition"}
          </p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-navy">Instructor desk</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground text-pretty">
            Open a room, write the code on the board, and let students pick
            seats. Built for one class period. Empty seats become computer
            players when you start.
            {edition === "general"
              ? " Students can also customize their Greek team names."
              : ""}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Start a new lab</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={create} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="teams">How many chains?</Label>
                <p className="mb-2 text-xs text-muted-foreground">
                  Each chain needs a retailer, wholesaler, distributor, and factory.
                  One chain is enough to illustrate the whip.
                </p>
                <select
                  id="teams"
                  value={teamCount}
                  onChange={(e) => setTeamCount(Number(e.target.value))}
                  className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm font-medium"
                >
                  {teamList.map((name, i) => {
                    const count = i + 1;
                    const previewNames =
                      count <= 6
                        ? teamList.slice(0, count).join(", ")
                        : `${teamList.slice(0, 4).join(", ")} … ${teamList[i]}`;
                    return (
                      <option key={name} value={count}>
                        {count} chain{count === 1 ? "" : "s"} ({count * 4} seats) — {previewNames}
                      </option>
                    );
                  })}
                </select>
              </div>
              {createError ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                  {createError}
                </div>
              ) : null}
              <Button type="submit" disabled={busy} size="lg">
                {busy ? "Opening room..." : "Create room"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Return to a room</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={resume} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="room">Room code</Label>
                <Input
                  id="room"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  maxLength={4}
                  className="mt-1 uppercase tracking-[0.3em]"
                  placeholder="HAWK"
                  required
                />
              </div>
              <div>
                <Label htmlFor="pin">Instructor PIN</Label>
                <Input
                  id="pin"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={4}
                  inputMode="numeric"
                  className="mt-1 tracking-[0.3em]"
                  placeholder="4821"
                  required
                />
              </div>
              {resumeError ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                  {resumeError}
                </div>
              ) : null}
              <Button type="submit" variant="outline" disabled={busy} size="lg">
                {busy ? "Signing in..." : "Open desk"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
