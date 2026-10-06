import { createFileRoute, Link } from "@tanstack/react-router";
import { ChainStrip } from "@/components/chain-strip";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/how-to-play")({ component: HowToPlay });

function HowToPlay() {
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
          Student briefing
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-navy">How to play</h1>
        <p className="mt-3 text-muted-foreground text-pretty">
          You are moving cases of Nighthawk gear through a four-seat chain —
          the classic classroom supply-chain game, set at UNG. The whole lab is
          12 weeks and takes about 15–20 minutes of play. Each week you make
          one decision: how many cases to order.
        </p>

        <div className="mt-6">
          <ChainStrip />
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <Rule
            n="1"
            title="Know your seat"
            body="Retailer (campus store) sells to UNG shoppers and orders from the wholesaler. Wholesaler ships to the retailer and orders from the distributor. Distributor ships to the wholesaler and orders from the factory. Factory ships to the distributor and starts production."
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

function StartStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="font-display text-2xl font-semibold tabular-nums text-navy">{value}</p>
    </div>
  );
}
