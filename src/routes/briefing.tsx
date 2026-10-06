import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/briefing")({ component: BriefingPage });

const SLIDES: Array<{ title: string; points: string[]; note: string }> = [
  {
    title: "Nighthawk Chain",
    points: [
      "UNG operations lab · one class session",
      "Four seats: retailer · wholesaler · distributor · factory",
      "One decision per week: how many cases of Nighthawk gear to order",
    ],
    note: "This is the classic classroom supply-chain game with UNG names. Put the room code on the board after this slide. Phones and laptops both work.",
  },
  {
    title: "Learning objectives",
    points: [
      "Feel lead time in a live chain, not a spreadsheet",
      "See how a small demand change grows upstream",
      "Connect local inventory choices to system cost",
    ],
    note: "Keep this short — about 8 minutes for slides 1–6. Students learn more from the debrief charts than from theory up front.",
  },
  {
    title: "The chain",
    points: [
      "Shoppers → Retailer → Wholesaler → Distributor → Factory",
      "Orders travel upstream. Goods travel downstream.",
      "You only see your own board. That is intentional.",
    ],
    note: "Four students per chain is the classic setup. Extra students share a seat or watch the projector. One chain is enough to illustrate.",
  },
  {
    title: "A week of play",
    points: [
      "Receive the shipment that left two weeks ago",
      "Fill this week’s customer order from on-hand stock",
      "Unfilled units become backorders you still owe",
      "Order 0–30 cases. They arrive in two weeks.",
    ],
    note: "Walk one example on the board with 12 on hand, 4 arriving, demand 4.",
  },
  {
    title: "Costs and the goal",
    points: [
      "$1 per case left on the shelf each week",
      "$2 per case you still owe each week",
      "Lowest combined cost across the four seats wins",
    ],
    note: "Do not tell them the demand pattern. If they ask, say: it starts like a quiet week on campus.",
  },
  {
    title: "Play 12 weeks",
    points: [
      "Instructor starts week 1 from the desk",
      "Empty seats become computer players",
      "If someone stalls, order for them from the desk",
    ],
    note: "Plan 15–20 minutes of play, about a minute a week once they settle. Stay quiet after week 3. Week 5 is the shock.",
  },
  {
    title: "Debrief",
    points: [
      "Plot shopper demand against every seat’s orders",
      "Ask: who felt the shortage first? who ordered 20+?",
      "Name the bullwhip: variance grows as you move upstream",
    ],
    note: "Reveal demand after week 12. Demand only jumped once, from 4 to 8 in week 5 (Homecoming).",
  },
  {
    title: "Why it happens",
    points: [
      "Lead time — you order for a future you cannot see",
      "Hidden information — only the retailer sees shoppers",
      "Local targets — covering your own shelf over-corrects the chain",
    ],
    note: "Real parallels: toilet paper in 2020, semiconductor allocations, promotional spikes in CPG. Optional: what would dampen the whip? Share POS data, shorter lead time, a boring base-stock rule.",
  },
];


function BriefingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        right={
          <Button asChild variant="outline" size="sm">
            <a href="/class-slides.md" download>
              Download .md
            </a>
          </Button>
        }
      />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Instructor
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-navy">
          Class briefing outline
        </h1>
        <p className="mt-3 text-muted-foreground text-pretty">
          Eight slides. Paste each heading into PowerPoint, drop the bullets, and
          keep the speaker notes in the notes pane. Full markdown also lives in
          class-slides.md.
        </p>
        <ol className="mt-8 flex flex-col gap-5">
          {SLIDES.map((slide, i) => (
            <li
              key={slide.title}
              className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-border)]"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Slide {i + 1}
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-navy">
                {slide.title}
              </h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                {slide.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <p className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground text-pretty">
                Speaker note: {slide.note}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Button asChild>
            <Link to="/instructor">Back to the desk</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
