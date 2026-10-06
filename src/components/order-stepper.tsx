import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAX_ORDER, MIN_ORDER } from "@/lib/game/types";

export function OrderStepper({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
}) {
  const set = (n: number) =>
    onChange(Math.max(MIN_ORDER, Math.min(MAX_ORDER, Math.round(n))));

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-14 rounded-lg text-lg"
        disabled={disabled || value <= MIN_ORDER}
        onClick={() => set(value - 1)}
        aria-label="Decrease order"
      >
        <Minus className="size-5" />
      </Button>
      <input
        type="number"
        inputMode="numeric"
        min={MIN_ORDER}
        max={MAX_ORDER}
        value={value}
        disabled={disabled}
        onChange={(e) => set(Number(e.target.value))}
        className="h-14 w-24 rounded-lg border border-border bg-card text-center font-display text-3xl font-semibold tabular-nums text-navy shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Order quantity"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-14 rounded-lg text-lg"
        disabled={disabled || value >= MAX_ORDER}
        onClick={() => set(value + 1)}
        aria-label="Increase order"
      >
        <Plus className="size-5" />
      </Button>
    </div>
  );
}
