export const TOTAL_WEEKS = 12;
export const HOLDING_COST = 1;
export const BACKORDER_COST = 2;
export const START_INVENTORY = 12;
export const START_INCOMING = 4;
export const START_PRODUCTION = 4;
export const BASE_DEMAND = 4;
export const SURGE_DEMAND = 8;
export const SURGE_WEEK = 5;
export const MAX_ORDER = 30;
export const MIN_ORDER = 0;

/** Classic four-echelon classroom chain (retailer → factory). */
export const ROLES = ["retailer", "wholesaler", "distributor", "factory"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABEL: Record<Role, string> = {
  retailer: "Retailer",
  wholesaler: "Wholesaler",
  distributor: "Distributor",
  factory: "Factory",
};

export const ROLE_SHORT: Record<Role, string> = {
  retailer: "Campus store",
  wholesaler: "Wholesaler",
  distributor: "Distributor",
  factory: "Factory",
};

/** Immediate customer of each seat. Retailer sells to shoppers. */
export const DOWNSTREAM: Record<Role, Role | null> = {
  retailer: null,
  wholesaler: "retailer",
  distributor: "wholesaler",
  factory: "distributor",
};

/** Who you order from. Factory orders production. */
export const UPSTREAM: Record<Role, Role | null> = {
  retailer: "wholesaler",
  wholesaler: "distributor",
  distributor: "factory",
  factory: null,
};

export const ROLE_CUSTOMER: Record<Role, string> = {
  retailer: "UNG campus shoppers",
  wholesaler: "the retailer",
  distributor: "the wholesaler",
  factory: "the distributor",
};

export const ROLE_UPSTREAM: Record<Role, string> = {
  retailer: "the wholesaler",
  wholesaler: "the distributor",
  distributor: "the factory",
  factory: "your production line",
};

export const TEAM_NAMES = [
  "Dahlonega",
  "Gainesville",
  "Oconee",
  "Cumming",
  "Blue Ridge",
  "Watkinsville",
] as const;

export type TeamPhase = "lobby" | "ordering" | "finished";
export type SessionStatus = "lobby" | "playing" | "finished";

export interface RoleState {
  inventory: number;
  backorder: number;
  incoming: number;
  production: number;
  lastReceived: number;
  lastDemand: number;
  lastShipped: number;
  lastOrder: number;
  weekCost: number;
  totalCost: number;
}

export interface RoleWeekSnapshot {
  received: number;
  demand: number;
  shipped: number;
  inventory: number;
  backorder: number;
  incomingNext: number;
  order: number;
  cost: number;
}

export interface WeekRecord {
  week: number;
  customerDemand: number;
  roles: Record<Role, RoleWeekSnapshot>;
}

export interface TeamState {
  week: number;
  phase: TeamPhase;
  lastOrders: Record<Role, number>;
  roles: Record<Role, RoleState>;
  pendingOrders: Partial<Record<Role, number>>;
  history: WeekRecord[];
}

export interface SeatInfo {
  teamIndex: number;
  role: Role;
  handle: string | null;
  isBot: boolean;
  hasOrdered: boolean;
}

export interface SessionLobby {
  id: string;
  roomCode: string;
  status: SessionStatus;
  week: number;
  teamCount: number;
  totalWeeks: number;
  demandRevealed: boolean;
  seats: SeatInfo[];
}

export interface RoleBoardView {
  week: number;
  phase: TeamPhase;
  role: Role;
  teamIndex: number;
  teamName: string;
  handle: string | null;
  inventory: number;
  backorder: number;
  incoming: number;
  production: number;
  lastReceived: number;
  lastDemand: number;
  lastShipped: number;
  lastOrder: number;
  weekCost: number;
  totalCost: number;
  pendingOrder: number | null;
  customerDemand: number | null;
  teammates: Array<{
    role: Role;
    handle: string | null;
    isBot: boolean;
    hasOrdered: boolean;
  }>;
  ownHistory: Array<{
    week: number;
    received: number;
    demand: number;
    shipped: number;
    inventory: number;
    backorder: number;
    order: number;
    cost: number;
  }>;
}

export interface TeamPublicResult {
  teamIndex: number;
  teamName: string;
  phase: TeamPhase;
  week: number;
  totalCost: number;
  roleCosts: Record<Role, number>;
  history: WeekRecord[];
  pendingOrders: Partial<Record<Role, number>>;
  seats: SeatInfo[];
  amplification: Record<Role, number>;
  current: Record<Role, RoleState>;
}

export interface InstructorView {
  roomCode: string;
  pin: string;
  status: SessionStatus;
  week: number;
  teamCount: number;
  totalWeeks: number;
  demandRevealed: boolean;
  teams: TeamPublicResult[];
}

export interface SeatView {
  roomCode: string;
  status: SessionStatus;
  demandRevealed: boolean;
  board: RoleBoardView;
  debrief: TeamPublicResult | null;
}
