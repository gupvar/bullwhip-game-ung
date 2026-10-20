import { ArrowRight } from "lucide-react";
import { useEdition } from "@/lib/game/edition";
import { ROLE_LABEL, ROLES, type Role } from "@/lib/game/types";
import { cn } from "@/lib/utils";

export function ChainStrip({
  active,
  compact = false,
}: {
  active?: Role;
  compact?: boolean;
}) {
  const { config } = useEdition();
  return (
    <ol className="flex flex-wrap items-center gap-2">
      <li className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        Shoppers
      </li>
      {ROLES.map((role) => (
        <li key={role} className="flex items-center gap-2">
          <ArrowRight className="size-3.5 text-current opacity-50" />
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              active === role
                ? "bg-navy text-primary-foreground"
                : "bg-card text-foreground shadow-[var(--shadow-border)]",
            )}
          >
            {compact ? config.roleShort[role] : ROLE_LABEL[role]}
          </span>
        </li>
      ))}
    </ol>
  );
}
