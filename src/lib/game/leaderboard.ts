import {
  ROLES,
  ROLE_LABEL,
  type InstructorView,
  type LeaderboardTeamSnapshot,
  type Role,
  type SessionLeaderboard,
  type TeamPublicResult,
} from "./types.ts";

export function buildSessionLeaderboard(teams: TeamPublicResult[]): SessionLeaderboard {
  let maxCompletedWeek = 0;
  let maxCurrentWeek = 0;

  const snapshots: LeaderboardTeamSnapshot[] = teams.map((team) => {
    const completedWeeks = team.history.length;
    if (completedWeeks > maxCompletedWeek) maxCompletedWeek = completedWeeks;
    if (team.week > maxCurrentWeek) maxCurrentWeek = team.week;

    const runningRole: Record<Role, number> = {
      retailer: 0,
      wholesaler: 0,
      distributor: 0,
      factory: 0,
    };
    const cumulativeByWeek: LeaderboardTeamSnapshot["cumulativeByWeek"] = [];

    for (const h of team.history) {
      for (const r of ROLES) {
        runningRole[r] += h.roles[r].cost;
      }
      const total = ROLES.reduce((s, r) => s + runningRole[r], 0);
      cumulativeByWeek.push({
        week: h.week,
        totalCost: total,
        roleCosts: { ...runningRole },
      });
    }

    const isAllBot = team.seats.length > 0 && team.seats.every((s) => s.isBot);

    return {
      teamIndex: team.teamIndex,
      teamName: team.teamName,
      phase: team.phase,
      currentWeek: team.week,
      completedWeeks,
      totalCost: team.totalCost,
      roleCosts: { ...team.roleCosts },
      isAllBot,
      seats: ROLES.map((role) => {
        const s = team.seats.find((seat) => seat.role === role);
        return {
          role,
          handle: s?.isBot ? "Computer" : s?.handle ?? "Computer",
          isBot: Boolean(s?.isBot || !s?.handle),
        };
      }),
      cumulativeByWeek,
    };
  });

  return {
    maxCompletedWeek,
    maxCurrentWeek,
    teams: snapshots,
  };
}

export interface RankedTeamRow {
  rank: number;
  teamIndex: number;
  teamName: string;
  isAllBot: boolean;
  weekEvaluated: number;
  totalCost: number;
  avgCostPerWeek: number;
  roleCosts: Record<Role, number>;
}

export interface RankedRoleRow {
  rank: number;
  teamIndex: number;
  teamName: string;
  role: Role;
  handle: string;
  isBot: boolean;
  weekEvaluated: number;
  cost: number;
  avgCostPerWeek: number;
}

export function computeOverallRankings(
  leaderboard: SessionLeaderboard,
  weekFilter: number | "live" = "live",
): RankedTeamRow[] {
  const rows = leaderboard.teams.map((t) => {
    if (weekFilter !== "live") {
      const snap =
        t.cumulativeByWeek.find((w) => w.week === weekFilter) ??
        t.cumulativeByWeek[t.cumulativeByWeek.length - 1];
      const wk = snap ? snap.week : t.currentWeek;
      const tot = snap ? snap.totalCost : t.totalCost;
      const rc = snap ? snap.roleCosts : t.roleCosts;
      return {
        rank: 0,
        teamIndex: t.teamIndex,
        teamName: t.teamName,
        isAllBot: t.isAllBot,
        weekEvaluated: wk,
        totalCost: tot,
        avgCostPerWeek: wk > 0 ? tot / wk : tot,
        roleCosts: rc,
      };
    }

    const wk = Math.max(1, t.currentWeek);
    return {
      rank: 0,
      teamIndex: t.teamIndex,
      teamName: t.teamName,
      isAllBot: t.isAllBot,
      weekEvaluated: t.currentWeek,
      totalCost: t.totalCost,
      avgCostPerWeek: t.totalCost / wk,
      roleCosts: t.roleCosts,
    };
  });

  rows.sort((a, b) => {
    if (a.totalCost !== b.totalCost) return a.totalCost - b.totalCost;
    if (a.avgCostPerWeek !== b.avgCostPerWeek) return a.avgCostPerWeek - b.avgCostPerWeek;
    return a.teamIndex - b.teamIndex;
  });

  return rows.map((r, i) => ({ ...r, rank: i + 1 }));
}

export function computeRoleRankings(
  leaderboard: SessionLeaderboard,
  role: Role,
  weekFilter: number | "live" = "live",
): RankedRoleRow[] {
  const rows = leaderboard.teams.map((t) => {
    const seat = t.seats.find((s) => s.role === role);
    if (weekFilter !== "live") {
      const snap =
        t.cumulativeByWeek.find((w) => w.week === weekFilter) ??
        t.cumulativeByWeek[t.cumulativeByWeek.length - 1];
      const wk = snap ? snap.week : t.currentWeek;
      const cost = snap ? snap.roleCosts[role] : t.roleCosts[role];
      return {
        rank: 0,
        teamIndex: t.teamIndex,
        teamName: t.teamName,
        role,
        handle: seat?.handle ?? "Computer",
        isBot: seat?.isBot ?? true,
        weekEvaluated: wk,
        cost,
        avgCostPerWeek: wk > 0 ? cost / wk : cost,
      };
    }

    const wk = Math.max(1, t.currentWeek);
    const cost = t.roleCosts[role];
    return {
      rank: 0,
      teamIndex: t.teamIndex,
      teamName: t.teamName,
      role,
      handle: seat?.handle ?? "Computer",
      isBot: seat?.isBot ?? true,
      weekEvaluated: t.currentWeek,
      cost,
      avgCostPerWeek: cost / wk,
    };
  });

  rows.sort((a, b) => {
    if (a.cost !== b.cost) return a.cost - b.cost;
    if (a.avgCostPerWeek !== b.avgCostPerWeek) return a.avgCostPerWeek - b.avgCostPerWeek;
    return a.teamIndex - b.teamIndex;
  });

  return rows.map((r, i) => ({ ...r, rank: i + 1 }));
}

function csvEscape(val: string | number | boolean | null | undefined): string {
  const s = val == null ? "" : String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function triggerBlobDownload(blob: Blob, filename: string) {
  if (typeof window === "undefined") return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Generates and downloads a detailed week-by-week, role-by-role CSV for all chains.
 */
export function downloadWeeklyCsv(view: InstructorView): void {
  const headers = [
    "RoomCode",
    "Edition",
    "TeamIndex",
    "TeamName",
    "AllComputerChain",
    "Week",
    "CustomerDemand",
    "Role",
    "PlayerHandle",
    "IsComputer",
    "Received",
    "Demand",
    "Shipped",
    "EndingInventory",
    "EndingBackorder",
    "IncomingNextWeek",
    "OrderPlaced",
    "WeeklyCost",
    "CumulativeRoleCost",
    "CumulativeTeamCost",
  ];

  const lines: string[] = [headers.join(",")];

  for (const team of view.teams) {
    const isAllBot = team.seats.length > 0 && team.seats.every((s) => s.isBot);
    const runningRoleCost: Record<Role, number> = {
      retailer: 0,
      wholesaler: 0,
      distributor: 0,
      factory: 0,
    };
    let runningTeamCost = 0;

    if (team.history.length === 0) {
      // Include current Week 1 state if no week has completed yet
      for (const role of ROLES) {
        const seat = team.seats.find((s) => s.role === role);
        const cur = team.current[role];
        lines.push(
          [
            view.roomCode,
            view.edition ?? "ung",
            team.teamIndex + 1,
            team.teamName,
            isAllBot,
            team.week,
            "",
            ROLE_LABEL[role],
            seat?.isBot ? "Computer" : seat?.handle ?? "Empty",
            Boolean(seat?.isBot),
            cur.lastReceived,
            cur.lastDemand,
            cur.lastShipped,
            cur.inventory,
            cur.backorder,
            cur.incoming,
            team.pendingOrders[role] ?? "",
            cur.weekCost,
            cur.totalCost,
            team.totalCost,
          ]
            .map(csvEscape)
            .join(","),
        );
      }
      continue;
    }

    for (const h of team.history) {
      for (const r of ROLES) {
        runningRoleCost[r] += h.roles[r].cost;
        runningTeamCost += h.roles[r].cost;
      }
      for (const role of ROLES) {
        const seat = team.seats.find((s) => s.role === role);
        const snap = h.roles[role];
        lines.push(
          [
            view.roomCode,
            view.edition ?? "ung",
            team.teamIndex + 1,
            team.teamName,
            isAllBot,
            h.week,
            h.customerDemand,
            ROLE_LABEL[role],
            seat?.isBot ? "Computer" : seat?.handle ?? "Computer",
            Boolean(seat?.isBot),
            snap.received,
            snap.demand,
            snap.shipped,
            snap.inventory,
            snap.backorder,
            snap.incomingNext,
            snap.order,
            snap.cost,
            runningRoleCost[role],
            runningTeamCost,
          ]
            .map(csvEscape)
            .join(","),
        );
      }
    }
  }

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  triggerBlobDownload(blob, `bullwhip-weekly-${view.roomCode}.csv`);
}

/**
 * Generates and downloads a chain summary + role leaderboard CSV.
 */
export function downloadSummaryCsv(view: InstructorView): void {
  const lb = view.leaderboard ?? buildSessionLeaderboard(view.teams);
  const overall = computeOverallRankings(lb, "live");
  const rankByTeam = new Map(overall.map((r) => [r.teamIndex, r.rank]));

  const headers = [
    "RoomCode",
    "Edition",
    "OverallRank",
    "TeamIndex",
    "TeamName",
    "AllComputerChain",
    "CurrentWeek",
    "WeeksCompleted",
    "Phase",
    "TotalChainCost",
    "RetailerPlayer",
    "RetailerCost",
    "RetailerBullwhipAmp",
    "WholesalerPlayer",
    "WholesalerCost",
    "WholesalerBullwhipAmp",
    "DistributorPlayer",
    "DistributorCost",
    "DistributorBullwhipAmp",
    "FactoryPlayer",
    "FactoryCost",
    "FactoryBullwhipAmp",
  ];

  const lines: string[] = [headers.join(",")];
  const sortedTeams = [...view.teams].sort(
    (a, b) => (rankByTeam.get(a.teamIndex) ?? 999) - (rankByTeam.get(b.teamIndex) ?? 999),
  );

  for (const team of sortedTeams) {
    const isAllBot = team.seats.length > 0 && team.seats.every((s) => s.isBot);
    const handleFor = (role: Role) => {
      const s = team.seats.find((seat) => seat.role === role);
      return s?.isBot ? "Computer" : s?.handle ?? "Computer";
    };
    lines.push(
      [
        view.roomCode,
        view.edition ?? "ung",
        rankByTeam.get(team.teamIndex) ?? "",
        team.teamIndex + 1,
        team.teamName,
        isAllBot,
        team.week,
        team.history.length,
        team.phase,
        team.totalCost,
        handleFor("retailer"),
        team.roleCosts.retailer,
        team.amplification.retailer.toFixed(2),
        handleFor("wholesaler"),
        team.roleCosts.wholesaler,
        team.amplification.wholesaler.toFixed(2),
        handleFor("distributor"),
        team.roleCosts.distributor,
        team.amplification.distributor.toFixed(2),
        handleFor("factory"),
        team.roleCosts.factory,
        team.amplification.factory.toFixed(2),
      ]
        .map(csvEscape)
        .join(","),
    );
  }

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  triggerBlobDownload(blob, `bullwhip-summary-${view.roomCode}.csv`);
}

const SERIES_COLORS = {
  Shoppers: "#5c5a55",
  Retailer: "#007367",
  Wholesaler: "#1f3d7c",
  Distributor: "#c49212",
  Factory: "#e11d48",
} as const;

function drawLinePanel(
  ctx: CanvasRenderingContext2D,
  box: { x: number; y: number; w: number; h: number },
  title: string,
  subtitle: string,
  weeks: number[],
  series: Array<{
    name: string;
    color: string;
    dashed?: boolean;
    values: number[];
  }>,
  includeZeroLine = false,
) {
  const { x, y, w, h } = box;
  ctx.save();

  // Card background & border
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 12);
  ctx.fill();
  ctx.stroke();

  // Title & subtitle
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 16px system-ui, -apple-system, sans-serif";
  ctx.fillText(title, x + 20, y + 28);

  ctx.fillStyle = "#64748b";
  ctx.font = "12px system-ui, -apple-system, sans-serif";
  ctx.fillText(subtitle, x + 20, y + 48);

  // Legend
  let lx = x + 20;
  const ly = y + 68;
  for (const s of series) {
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 2.5;
    if (s.dashed) ctx.setLineDash([5, 4]);
    else ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(lx, ly - 4);
    ctx.lineTo(lx + 18, ly - 4);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#334155";
    ctx.font = "12px system-ui, -apple-system, sans-serif";
    ctx.fillText(s.name, lx + 23, ly);
    lx += ctx.measureText(s.name).width + 42;
  }

  // Plot area
  const plotX = x + 48;
  const plotY = y + 86;
  const plotW = w - 68;
  const plotH = h - 122;

  const allVals = series.flatMap((s) => s.values);
  let minVal = allVals.length ? Math.min(...allVals, includeZeroLine ? 0 : Infinity) : 0;
  if (!Number.isFinite(minVal)) minVal = 0;
  if (!includeZeroLine) minVal = Math.min(0, minVal);
  let maxVal = allVals.length ? Math.max(...allVals, 10) : 16;
  if (maxVal === minVal) maxVal = minVal + 10;
  const pad = Math.ceil((maxVal - minVal) * 0.12);
  const yMin = minVal < 0 ? minVal - pad : 0;
  const yMax = maxVal + pad;

  const toX = (idx: number) =>
    weeks.length <= 1
      ? plotX + plotW / 2
      : plotX + (idx / (weeks.length - 1)) * plotW;
  const toY = (val: number) =>
    plotY + plotH - ((val - yMin) / (yMax - yMin || 1)) * plotH;

  // Gridlines & Y labels
  const steps = 5;
  ctx.font = "11px system-ui, -apple-system, sans-serif";
  for (let i = 0; i <= steps; i += 1) {
    const val = Math.round(yMin + ((yMax - yMin) * i) / steps);
    const py = toY(val);
    ctx.strokeStyle = val === 0 && includeZeroLine ? "#94a3b8" : "#e2e8f0";
    ctx.lineWidth = val === 0 && includeZeroLine ? 1.5 : 1;
    ctx.beginPath();
    ctx.moveTo(plotX, py);
    ctx.lineTo(plotX + plotW, py);
    ctx.stroke();

    ctx.fillStyle = "#64748b";
    ctx.textAlign = "right";
    ctx.fillText(String(val), plotX - 8, py + 4);
  }

  // X labels
  ctx.textAlign = "center";
  weeks.forEach((wk, idx) => {
    const px = toX(idx);
    ctx.fillStyle = "#64748b";
    ctx.fillText(`W${wk}`, px, plotY + plotH + 18);
  });

  // Series lines & dots
  for (const s of series) {
    if (s.values.length === 0) continue;
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 2.5;
    if (s.dashed) ctx.setLineDash([6, 4]);
    else ctx.setLineDash([]);
    ctx.beginPath();
    s.values.forEach((v, idx) => {
      const px = toX(idx);
      const py = toY(v);
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Dots
    ctx.fillStyle = s.color;
    s.values.forEach((v, idx) => {
      const px = toX(idx);
      const py = toY(v);
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  ctx.restore();
}

/**
 * Renders and downloads high-resolution PNG graph(s) for a single chain.
 */
export function downloadTeamChartPng(
  result: TeamPublicResult,
  mode: "orders" | "inventory" | "both" = "both",
  roomCode?: string,
): void {
  if (typeof document === "undefined" || result.history.length === 0) return;

  const scale = 2;
  const width = mode === "both" ? 1160 : 620;
  const height = 430;

  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(scale, scale);

  // Outer background
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, width, height);

  // Header
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 20px system-ui, -apple-system, sans-serif";
  ctx.fillText(
    `${result.teamName} Chain — Bullwhip Analysis${roomCode ? ` (Room ${roomCode})` : ""}`,
    24,
    34,
  );

  ctx.fillStyle = "#475569";
  ctx.font = "13px system-ui, -apple-system, sans-serif";
  const whipSummary = ROLES.map(
    (r) => `${ROLE_LABEL[r]}: $${result.roleCosts[r]} (${result.amplification[r].toFixed(1)}× whip)`,
  ).join("   ·   ");
  ctx.fillText(`Total Cost: $${result.totalCost}   |   ${whipSummary}`, 24, 56);

  const weeks = result.history.map((h) => h.week);
  const orderSeries = [
    {
      name: "Shoppers",
      color: SERIES_COLORS.Shoppers,
      dashed: true,
      values: result.history.map((h) => h.customerDemand),
    },
    {
      name: "Retailer",
      color: SERIES_COLORS.Retailer,
      values: result.history.map((h) => h.roles.retailer.order),
    },
    {
      name: "Wholesaler",
      color: SERIES_COLORS.Wholesaler,
      values: result.history.map((h) => h.roles.wholesaler.order),
    },
    {
      name: "Distributor",
      color: SERIES_COLORS.Distributor,
      values: result.history.map((h) => h.roles.distributor.order),
    },
    {
      name: "Factory",
      color: SERIES_COLORS.Factory,
      values: result.history.map((h) => h.roles.factory.order),
    },
  ];

  const stockSeries = [
    {
      name: "Retailer",
      color: SERIES_COLORS.Retailer,
      values: result.history.map((h) => h.roles.retailer.inventory - h.roles.retailer.backorder),
    },
    {
      name: "Wholesaler",
      color: SERIES_COLORS.Wholesaler,
      values: result.history.map((h) => h.roles.wholesaler.inventory - h.roles.wholesaler.backorder),
    },
    {
      name: "Distributor",
      color: SERIES_COLORS.Distributor,
      values: result.history.map(
        (h) => h.roles.distributor.inventory - h.roles.distributor.backorder,
      ),
    },
    {
      name: "Factory",
      color: SERIES_COLORS.Factory,
      values: result.history.map((h) => h.roles.factory.inventory - h.roles.factory.backorder),
    },
  ];

  if (mode === "orders") {
    drawLinePanel(
      ctx,
      { x: 24, y: 74, w: width - 48, h: 332 },
      "Orders vs. Shopper Demand",
      "Widening order swings upstream illustrate the bullwhip effect.",
      weeks,
      orderSeries,
      false,
    );
  } else if (mode === "inventory") {
    drawLinePanel(
      ctx,
      { x: 24, y: 74, w: width - 48, h: 332 },
      "Net Inventory (On-Hand minus Backorders)",
      "Values below zero indicate backorders owed downstream.",
      weeks,
      stockSeries,
      true,
    );
  } else {
    const panelW = (width - 64) / 2;
    drawLinePanel(
      ctx,
      { x: 24, y: 74, w: panelW, h: 332 },
      "Orders vs. Shopper Demand",
      "Widening order swings upstream illustrate the bullwhip effect.",
      weeks,
      orderSeries,
      false,
    );
    drawLinePanel(
      ctx,
      { x: 40 + panelW, y: 74, w: panelW, h: 332 },
      "Net Inventory (On-Hand minus Backorders)",
      "Values below zero indicate backorders owed downstream.",
      weeks,
      stockSeries,
      true,
    );
  }

  canvas.toBlob((blob) => {
    if (!blob) return;
    const safeName = result.teamName.replace(/[^A-Za-z0-9_-]+/g, "_");
    triggerBlobDownload(blob, `bullwhip-${mode}-${safeName}.png`);
  }, "image/png");
}

/**
 * Renders and downloads a composite PNG image containing graphs for ALL chains in the session.
 */
export function downloadAllTeamsChartsPng(teams: TeamPublicResult[], roomCode: string): void {
  const activeTeams = teams.filter((t) => t.history.length > 0);
  if (typeof document === "undefined" || activeTeams.length === 0) return;

  const scale = 2;
  const width = 1160;
  const rowHeight = 370;
  const headerHeight = 64;
  const height = headerHeight + activeTeams.length * rowHeight + 20;

  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(scale, scale);

  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 22px system-ui, -apple-system, sans-serif";
  ctx.fillText(`Bullwhip Supply Chain Lab — Room ${roomCode} (All Chains Report)`, 24, 38);

  activeTeams.forEach((team, idx) => {
    const topY = headerHeight + idx * rowHeight;
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 16px system-ui, -apple-system, sans-serif";
    ctx.fillText(
      `${idx + 1}. ${team.teamName} Chain — Total Cost: $${team.totalCost} (${team.history.length} weeks)`,
      24,
      topY + 22,
    );

    const weeks = team.history.map((h) => h.week);
    const panelW = (width - 64) / 2;

    drawLinePanel(
      ctx,
      { x: 24, y: topY + 34, w: panelW, h: 316 },
      "Orders vs. Shopper Demand",
      `Factory whip: ${team.amplification.factory.toFixed(1)}× · Distributor: ${team.amplification.distributor.toFixed(1)}×`,
      weeks,
      [
        {
          name: "Shoppers",
          color: SERIES_COLORS.Shoppers,
          dashed: true,
          values: team.history.map((h) => h.customerDemand),
        },
        {
          name: "Retailer",
          color: SERIES_COLORS.Retailer,
          values: team.history.map((h) => h.roles.retailer.order),
        },
        {
          name: "Wholesaler",
          color: SERIES_COLORS.Wholesaler,
          values: team.history.map((h) => h.roles.wholesaler.order),
        },
        {
          name: "Distributor",
          color: SERIES_COLORS.Distributor,
          values: team.history.map((h) => h.roles.distributor.order),
        },
        {
          name: "Factory",
          color: SERIES_COLORS.Factory,
          values: team.history.map((h) => h.roles.factory.order),
        },
      ],
      false,
    );

    drawLinePanel(
      ctx,
      { x: 40 + panelW, y: topY + 34, w: panelW, h: 316 },
      "Net Inventory (On-Hand minus Backorders)",
      `R: $${team.roleCosts.retailer} · W: $${team.roleCosts.wholesaler} · D: $${team.roleCosts.distributor} · F: $${team.roleCosts.factory}`,
      weeks,
      [
        {
          name: "Retailer",
          color: SERIES_COLORS.Retailer,
          values: team.history.map(
            (h) => h.roles.retailer.inventory - h.roles.retailer.backorder,
          ),
        },
        {
          name: "Wholesaler",
          color: SERIES_COLORS.Wholesaler,
          values: team.history.map(
            (h) => h.roles.wholesaler.inventory - h.roles.wholesaler.backorder,
          ),
        },
        {
          name: "Distributor",
          color: SERIES_COLORS.Distributor,
          values: team.history.map(
            (h) => h.roles.distributor.inventory - h.roles.distributor.backorder,
          ),
        },
        {
          name: "Factory",
          color: SERIES_COLORS.Factory,
          values: team.history.map(
            (h) => h.roles.factory.inventory - h.roles.factory.backorder,
          ),
        },
      ],
      true,
    );
  });

  canvas.toBlob((blob) => {
    if (!blob) return;
    triggerBlobDownload(blob, `bullwhip-all-graphs-${roomCode}.png`);
  }, "image/png");
}
