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
