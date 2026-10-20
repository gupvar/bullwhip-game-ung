import { useEdition } from "@/lib/game/edition";
import { cn } from "@/lib/utils";

export function NighthawkMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("text-accent", className)}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M6 34c8-2 14-10 18-18 2 8 7 14 14 18-10 1-18 6-22 16-2-6-6-12-10-16Zm52 0c-8-2-14-10-18-18-2 8-7 14-14 18 10 1 18 6 22 16 2-6 6-12 10-16Z"
      />
      <path
        fill="currentColor"
        d="M32 18c3 6 8 10 16 12-6 14-12 20-16 26-4-6-10-12-16-26 8-2 13-6 16-12Z"
      />
      <circle cx="32" cy="22" r="2.2" fill="var(--color-navy-deep)" />
    </svg>
  );
}

export function GeneralChainMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={cn("text-accent", className)}
      aria-hidden="true"
    >
      <path
        d="M12 40L25 24L39 36L52 18"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="40" r="5" fill="currentColor" />
      <circle cx="25" cy="24" r="5" fill="currentColor" />
      <circle cx="39" cy="36" r="5" fill="currentColor" />
      <circle cx="52" cy="18" r="5" fill="currentColor" />
    </svg>
  );
}

export function BrandMark({ className }: { className?: string }) {
  const { edition } = useEdition();
  return edition === "general" ? (
    <GeneralChainMark className={className} />
  ) : (
    <NighthawkMark className={className} />
  );
}
