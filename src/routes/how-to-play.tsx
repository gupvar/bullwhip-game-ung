import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, Clock, HelpCircle } from "lucide-react";
import { ChainStrip } from "@/components/chain-strip";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEdition } from "@/lib/game/edition";

export const Route = createFileRoute("/how-to-play")({ component: HowToPlay });

function HowToPlay() {
  const { edition } = useEdition();
  const isGeneral = edition === "general";

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        right={
          <Button asChild size="sm">
            <Link to="/join">Join a lab</Link>
          </Button>
        }
      />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Student briefing & FAQ
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-navy">
          How to play & FAQ
        </h1>
        <p className="mt-3 text-muted-foreground text-pretty">
          {isGeneral
            ? "You are moving cases of goods through a four-seat supply chain — the classic classroom bullwhip simulation. The whole lab is 12 weeks and takes about 15–20 minutes of play. Each week you make one decision: how many cases to order."
            : "You are moving cases of Nighthawk gear through a four-seat chain — the classic classroom supply-chain game, set at UNG. The whole lab is 12 weeks and takes about 15–20 minutes of play. Each week you make one decision: how many cases to order."}
        </p>

        <div className="mt-6">
          <ChainStrip />
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <Rule
            n="1"
            title="Know your seat"
            body={
              isGeneral
                ? "Retailer (storefront) sells to retail shoppers and orders from the wholesaler. Wholesaler ships to the retailer and orders from the distributor. Distributor ships to the wholesaler and orders from the factory. Factory ships to the distributor and starts production."
                : "Retailer (campus store) sells to UNG shoppers and orders from the wholesaler. Wholesaler ships to the retailer and orders from the distributor. Distributor ships to the wholesaler and orders from the factory. Factory ships to the distributor and starts production."
            }
          />
          <Rule
            n="2"
            title="A week in four numbers"
            body="You receive what was shipped two weeks ago. You see this week’s customer order. You ship as much as you can from on-hand stock. Anything you cannot ship becomes a backorder you still owe."
          />
          <Rule
            n="3"
            title="Then you order"
            body="Order 0–30 cases from the seat upstream of you (the factory orders production). Those units arrive in two weeks — not today. There is no chatting about inventory. Hidden information is the point."
          />
          <Rule
            n="4"
            title="Costs"
            body="Each leftover case on the shelf costs $1 that week. Each case you still owe costs $2. The team with the lowest combined cost wins. Do not hoard, and do not stock out if you can help it."
          />
          <Rule
            n="5"
            title="The twist you are not told"
            body="Shopper demand starts steady. It will change once during the lab. You will not see the other seats’ inventory. After week 12 the instructor shows every order on one chart — that is the bullwhip."
          />
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Starting board</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <StartStat label="On hand" value="12" />
            <StartStat label="Arriving next week" value="4" />
            <StartStat label="Recent demand" value="4" />
            <StartStat label="Order range" value="0–30" />
          </CardContent>
        </Card>

        {/* FAQ & Computer Player Setup Section */}
        <section className="mt-12" id="faq">
          <div className="flex items-center gap-2">
            <HelpCircle className="size-5 text-teal" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Frequently Asked Questions
            </p>
          </div>
          <h2 className="mt-1 font-display text-3xl font-semibold text-navy">
            Computer Players, Timers & FAQ
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            How automated computer players make decisions, how the 30-second round timer works, and what happens to unfilled chains.
          </p>

          <div className="mt-6 flex flex-col gap-4">
            <FaqCard
              icon={<Bot className="size-5 text-teal" />}
              question="How is the Computer Player (Bot) set up? Does it know consumer demand?"
              answer={
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">No hidden demand knowledge:</strong>{" "}
                    Computer players do <em>not</em> have access to the external consumer demand schedule or other seats' boards. Just like a human player, a computer seat only sees its own local state: its on-hand inventory (<code className="rounded bg-muted px-1 py-0.5 text-xs">I</code>), its backorders owed (<code className="rounded bg-muted px-1 py-0.5 text-xs">B</code>), its inbound shipment arriving next week (<code className="rounded bg-muted px-1 py-0.5 text-xs">S</code>), and the order placed this week by its immediate downstream customer (<code className="rounded bg-muted px-1 py-0.5 text-xs">D</code>).
                  </p>
                  <p>
                    <strong className="text-foreground">Rational Order-Up-To (Base-Stock) Policy:</strong>{" "}
                    Because backorders cost $2/case/week and holding costs $1/case/week with a 2-week lead time, the computer uses a rational base-stock rule with pipeline accounting:
                  </p>
                  <div className="rounded-lg border border-border bg-muted/60 px-3 py-2 font-mono text-xs text-foreground">
                    Order = clamp(D + 0.5 × (12 − (I − B)) + 0.5 × (D − S), 0, 30)
                  </div>
                  <p>
                    It orders enough to replace this week's observed customer demand (<code className="rounded bg-muted px-1 py-0.5 text-xs">D</code>), plus half of the gap between its net inventory (<code className="rounded bg-muted px-1 py-0.5 text-xs">I − B</code>) and the 12-case target buffer, plus half of the gap between current demand and the shipment already in transit (<code className="rounded bg-muted px-1 py-0.5 text-xs">D − S</code>). Accounting for the inbound pipeline avoids double-ordering goods that are already on the truck.
                  </p>
                </div>
              }
            />

            <FaqCard
              icon={<Clock className="size-5 text-teal" />}
              question="How fast do computer players act, and how does the 30-second visual timer work?"
              answer={
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">30-Second Visual Timer:</strong>{" "}
                    In the General Edition, both the student board and the instructor desk display a live 30-second countdown timer for each week to keep class pacing brisk.
                  </p>
                  <p>
                    <strong className="text-foreground">Computer Actions in ≤30 Seconds:</strong>{" "}
                    Computer seats on a human chain lock in their order within ~3 seconds of the week opening (and immediately if all human teammates submit even faster), so a computer teammate never delays a human chain.
                  </p>
                </div>
              }
            />

            <FaqCard
              icon={<Bot className="size-5 text-teal" />}
              question="Are 100% computer-only chains active during the game?"
              answer={
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Yes — they play all 12 weeks automatically:</strong>{" "}
                    When the instructor starts Week 1, any chain with zero human players becomes an active <strong>All-Computer Chain</strong>. Those four rational computer seats automatically submit orders and advance one week every ~6 seconds (always well under 30 seconds per round) until they complete all 12 weeks.
                  </p>
                  <p>
                    <strong className="text-foreground">Why this is useful for instructors:</strong>{" "}
                    Because even rational computers must update their local demand estimates from downstream orders without knowing true consumer demand, an all-computer chain exhibits a mild, textbook <em>rational forecast-updating bullwhip effect</em>—giving the class a built-in rational benchmark to compare against human teams during the debrief!
                  </p>
                </div>
              }
            />
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/join">Join a class lab</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/practice">Practice all four seats</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Rule({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-border)]">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-navy font-display text-lg font-semibold text-accent">
        {n}
      </span>
      <div>
        <h2 className="font-display text-lg font-semibold text-navy">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground text-pretty">{body}</p>
      </div>
    </div>
  );
}

function FaqCard({
  icon,
  question,
  answer,
}: {
  icon: React.ReactNode;
  question: string;
  answer: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-border)]">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-navy/10">
          {icon}
        </span>
        <div className="flex-1">
          <h3 className="font-display text-lg font-semibold text-navy">{question}</h3>
          <div className="mt-2">{answer}</div>
        </div>
      </div>
    </div>
  );
}

function StartStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="font-display text-2xl font-semibold tabular-nums text-navy">{value}</p>
    </div>
  );
}
