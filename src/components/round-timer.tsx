import { useEffect, useState } from "react";
import { Bot, Clock } from "lucide-react";
import { ROUND_TIMER_SECONDS, type TeamPhase } from "@/lib/game/types";
import { cn } from "@/lib/utils";

export function RoundTimer({
  weekStartedAt,
  week,
  phase,
  durationSeconds = ROUND_TIMER_SECONDS,
  compact = false,
  isAllBotChain = false,
}: {
  weekStartedAt?: number;
  week: number;
  phase: TeamPhase;
  durationSeconds?: number;
  compact?: boolean;
  isAllBotChain?: boolean;
}) {
  const [now, setNow] = useState(() => Date.now());
  const [fallbackStart, setFallbackStart] = useState(() => Date.now());

  useEffect(() => {
    setFallbackStart(Date.now());
  }, [week, phase]);

  useEffect(() => {
    if (phase !== "ordering") return;
    const id = window.setInterval(() => {
      setNow(Date.now());
    }, 250);
    return () => window.clearInterval(id);
  }, [phase]);

  if (phase !== "ordering") return null;

  const anchor = weekStartedAt ?? fallbackStart;
  const elapsedSec = Math.max(0, Math.floor((now - anchor) / 1000));
  const remainingSec = durationSeconds - elapsedSec;
  const isOvertime = remainingSec < 0;
  const isUrgent = remainingSec <= 10 && remainingSec >= 0;
  const pct = Math.max(0, Math.min(100, (remainingSec / durationSeconds) * 100));

  const formatSec = (s: number) => {
    const abs = Math.abs(s);
    const mins = Math.floor(abs / 60);
    const secs = abs % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (compact) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tabular-nums",
          isAllBotChain
            ? "border-teal/30 bg-teal/10 text-teal"
            : isOvertime
              ? "border-destructive/40 bg-destructive/10 text-destructive"
              : isUrgent
                ? "border-amber-500/40 bg-amber-500/10 text-amber-700"
                : "border-border bg-muted/60 text-foreground",
        )}
        title="Weekly decision timer (computers act within ≤30s)"
      >
        {isAllBotChain ? <Bot className="size-3.5" /> : <Clock className="size-3.5" />}
        <span>
          {isAllBotChain
            ? `Auto-bot · ${Math.max(0, remainingSec)}s`
            : isOvertime
              ? `Overtime +${Math.abs(remainingSec)}s`
              : `${remainingSec}s left`}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 transition-colors",
        isOvertime
          ? "border-destructive/40 bg-destructive/5"
          : isUrgent
            ? "border-amber-500/40 bg-amber-500/5"
            : "border-border bg-card shadow-[var(--shadow-border)]",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Clock
            className={cn(
              "size-4",
              isOvertime
                ? "text-destructive"
                : isUrgent
                  ? "text-amber-600"
                  : "text-teal",
            )}
          />
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Week {week} Decision Timer
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Computer seats act in ≤30s
          </span>
          <span
            className={cn(
              "font-display text-lg font-bold tabular-nums",
              isOvertime
                ? "text-destructive"
                : isUrgent
                  ? "text-amber-600"
                  : "text-navy",
            )}
          >
            {isOvertime ? `+${formatSec(remainingSec)} overtime` : formatSec(remainingSec)}
          </span>
        </div>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full transition-all duration-300",
            isOvertime
              ? "w-full bg-destructive"
              : isUrgent
                ? "bg-amber-500"
                : "bg-teal",
          )}
          style={{ width: `${isOvertime ? 100 : pct}%` }}
        />
      </div>
    </div>
  );
}
