import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyOrders,
  beginWeek,
  botOrder,
  createTeamState,
  customerDemand,
  fillMissingWithBots,
  playWeek,
  STEADY_ORDERS,
  submitOrder,
  teamName,
  teamTotalCost,
  variance,
} from "./engine.ts";
import { BASE_DEMAND, ROLES, SURGE_DEMAND, SURGE_WEEK, TOTAL_WEEKS } from "./types.ts";

describe("customerDemand", () => {
  it("holds at 4 then jumps to 8 in homecoming week", () => {
    assert.equal(customerDemand(1), BASE_DEMAND);
    assert.equal(customerDemand(4), BASE_DEMAND);
    assert.equal(customerDemand(SURGE_WEEK), SURGE_DEMAND);
    assert.equal(customerDemand(12), SURGE_DEMAND);
  });
});

describe("steady state", () => {
  it("keeps 12 on hand when everyone orders 4", () => {
    let state = createTeamState();
    for (let week = 1; week <= 4; week += 1) {
      state = playWeek(state, STEADY_ORDERS);
      assert.equal(state.week, week);
      for (const role of ROLES) {
        assert.equal(state.roles[role].inventory, 12, `${role} inv week ${week}`);
        assert.equal(state.roles[role].backorder, 0);
        assert.equal(state.roles[role].lastDemand, 4);
        assert.equal(state.roles[role].lastShipped, 4);
        assert.equal(state.roles[role].lastReceived, 4);
      }
    }
    assert.equal(teamTotalCost(state), 12 * ROLES.length * 4);
  });
});

describe("homecoming jump", () => {
  it("drains the retailer if they keep ordering 4", () => {
    let state = createTeamState();
    for (let i = 0; i < 4; i += 1) {
      state = playWeek(state, STEADY_ORDERS);
    }
    state = playWeek(state, STEADY_ORDERS);
    assert.equal(state.week, 5);
    assert.equal(state.roles.retailer.lastDemand, 8);
    assert.equal(state.roles.retailer.lastShipped, 8);
    assert.equal(state.roles.retailer.inventory, 8);
    assert.equal(state.roles.wholesaler.lastDemand, 4);
  });

  it("shows the whip when the retailer over-orders", () => {
    let state = createTeamState();
    for (let i = 0; i < 4; i += 1) {
      state = playWeek(state, STEADY_ORDERS);
    }
    state = playWeek(state, { ...STEADY_ORDERS, retailer: 16 });
    state = playWeek(state, { ...STEADY_ORDERS, retailer: 16, wholesaler: 16 });
    assert.equal(state.roles.wholesaler.lastDemand, 16);
    assert.equal(state.history[5]?.roles.retailer.order, 16);
    assert.equal(state.roles.retailer.lastDemand, 8);
  });
});

describe("orders", () => {
  it("rejects a second order from the same seat", () => {
    let state = beginWeek(createTeamState());
    state = submitOrder(state, "retailer", 6);
    assert.throws(() => submitOrder(state, "retailer", 7));
  });

  it("does not resolve until every seat has ordered", () => {
    let state = beginWeek(createTeamState());
    state = submitOrder(state, "retailer", 4);
    state = submitOrder(state, "wholesaler", 4);
    state = submitOrder(state, "distributor", 4);
    assert.throws(() => applyOrders(state));
  });
});

describe("botOrder (rational base-stock with pipeline accounting)", () => {
  it("stays at 4 when the board is steady", () => {
    const state = beginWeek(createTeamState());
    assert.equal(botOrder(state.roles.retailer), 4);
  });

  it("accounts for backorders and inbound pipeline without knowing future demand", () => {
    const state = beginWeek(createTeamState());
    // Suppose inventory is 0, backorder is 6, incoming is 8, lastDemand is 8:
    // netInventory = -6 -> inventoryGap = 12 - (-6) = 18
    // pipelineGap = 8 - 8 = 0
    // order = 8 + 0.5*18 + 0 = 17
    const stressed = {
      ...state.roles.retailer,
      inventory: 0,
      backorder: 6,
      incoming: 8,
      lastDemand: 8,
    };
    assert.equal(botOrder(stressed), 17);
  });

  it("plays a full 12-week all-computer chain to completion", () => {
    let state = createTeamState("general");
    for (let w = 1; w <= TOTAL_WEEKS; w += 1) {
      state = beginWeek(state, 1000 * w);
      assert.equal(state.weekStartedAt, 1000 * w);
      state = fillMissingWithBots(state);
      state = applyOrders(state);
    }
    assert.equal(state.phase, "finished");
    assert.equal(state.history.length, TOTAL_WEEKS);
    // Retailer orders 4 in weeks 1-4, then increases in week 5 when demand jumps to 8
    assert.equal(state.history[0]?.roles.retailer.order, 4);
    assert.ok((state.history[4]?.roles.retailer.order ?? 0) > 8);
  });
});

describe("variance", () => {
  it("is zero for a flat series", () => {
    assert.equal(variance([4, 4, 4, 4]), 0);
  });
});

describe("teamName & edition", () => {
  it("uses UNG campus names in ung edition and Greek letters in general edition", () => {
    assert.equal(teamName(0, "ung"), "Dahlonega");
    assert.equal(teamName(1, "ung"), "Gainesville");
    assert.equal(teamName(0, "general"), "Alpha");
    assert.equal(teamName(7, "general"), "Theta");
    assert.equal(teamName(23, "general"), "Omega");
  });

  it("prefers customName when set", () => {
    assert.equal(teamName(0, "general", "Supply Chain Wizards"), "Supply Chain Wizards");
    assert.equal(teamName(2, "ung", "Nighthawk Squad"), "Nighthawk Squad");
  });
});
