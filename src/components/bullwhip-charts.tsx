import { useEffect, useState, type ReactNode } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ROLE_LABEL, ROLES, type TeamPublicResult } from "@/lib/game/types";

const NAVY = "#1f3d7c";
const GOLD = "#c49212";
const TEAL = "#007367";
const INK = "#5c5a55";
const FACTORY = "#151922";

const ORDER_KEYS = {
  Shoppers: INK,
  Retailer: TEAL,
  Wholesaler: NAVY,
  Distributor: GOLD,
  Factory: FACTORY,
} as const;

export function BullwhipCharts({ result }: { result: TeamPublicResult }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const orderData = result.history.map((h) => ({
    week: h.week,
    Shoppers: h.customerDemand,
    Retailer: h.roles.retailer.order,
    Wholesaler: h.roles.wholesaler.order,
    Distributor: h.roles.distributor.order,
    Factory: h.roles.factory.order,
  }));

  const stockData = result.history.map((h) => ({
    week: h.week,
    Retailer: h.roles.retailer.inventory - h.roles.retailer.backorder,
    Wholesaler: h.roles.wholesaler.inventory - h.roles.wholesaler.backorder,
    Distributor: h.roles.distributor.inventory - h.roles.distributor.backorder,
    Factory: h.roles.factory.inventory - h.roles.factory.backorder,
  }));

  if (!ready) {
    return <div className="h-64 rounded-lg bg-muted" />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Orders vs. shopper demand" hint="The whip is the widening swing as you move upstream.">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={orderData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#e6e0d4" strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Shoppers" stroke={ORDER_KEYS.Shoppers} strokeDasharray="5 4" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="Retailer" stroke={ORDER_KEYS.Retailer} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Wholesaler" stroke={ORDER_KEYS.Wholesaler} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Distributor" stroke={ORDER_KEYS.Distributor} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Factory" stroke={ORDER_KEYS.Factory} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="On-hand minus backorders" hint="Below zero means the seat still owes units.">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={stockData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#e6e0d4" strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Retailer" stroke={ORDER_KEYS.Retailer} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Wholesaler" stroke={ORDER_KEYS.Wholesaler} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Distributor" stroke={ORDER_KEYS.Distributor} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Factory" stroke={ORDER_KEYS.Factory} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-2">
        {ROLES.map((role) => (
          <div key={role} className="rounded-lg bg-muted/80 px-3 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              {ROLE_LABEL[role]} whip
            </p>
            <p className="font-display text-2xl font-semibold tabular-nums text-navy">
              {result.amplification[role].toFixed(1)}×
            </p>
            <p className="text-xs text-muted-foreground">order variance / demand variance</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-border)]">
      <h3 className="font-display text-lg font-semibold text-navy">{title}</h3>
      <p className="mb-3 text-xs text-muted-foreground">{hint}</p>
      {children}
    </div>
  );
}
