import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createSession,
  instructorLogin,
  listOpenSeats,
  joinSeat,
  getInstructorView,
  startGame,
  fillBotsNow,
  placeOrder,
  getSeatView,
  revealDemand,
  instructorPlaceOrder,
} from "./api.ts";

describe("E2E Game Flow: Session creation to 12 weeks play", () => {
  it("creates a 6-chain (24-seat) room, joins students, fills bots, and plays through rounds", async () => {
    // 1. Instructor creates a 6-chain room (24 seats)
    const session = await createSession({ data: { teamCount: 6 } });
    assert.ok(session.roomCode, "Room code was generated");
    assert.equal(session.roomCode.length, 4, "Room code is 4 letters");
    assert.ok(session.token, "Instructor token was generated");
    assert.ok(session.pin, "PIN was generated");
    assert.equal(session.teamCount, 6, "6 teams created");

    // 2. Instructor can re-login with room code and PIN
    const login = await instructorLogin({
      data: { roomCode: session.roomCode, pin: session.pin },
    });
    assert.equal(login.token, session.token);

    // 3. Students view open seats for this room code
    const lobby = await listOpenSeats({ data: { roomCode: session.roomCode } });
    assert.equal(lobby.roomCode, session.roomCode);
    assert.equal(lobby.teamCount, 6);
    assert.equal(lobby.seats.length, 24, "24 seats available in lobby");
    assert.equal(lobby.status, "lobby");

    // 4. Students join different seats across different chains
    // Student 1: Retailer on Dahlonega (team 0)
    const student1 = await joinSeat({
      data: {
        roomCode: session.roomCode,
        handle: "Student Maya",
        teamIndex: 0,
        role: "retailer",
      },
    });
    assert.ok(student1.token);
    assert.equal(student1.handle, "Student Maya");

    // Student 2: Wholesaler on Dahlonega (team 0)
    const student2 = await joinSeat({
      data: {
        roomCode: session.roomCode,
        handle: "Student Alex",
        teamIndex: 0,
        role: "wholesaler",
      },
    });
    assert.ok(student2.token);

    // Student 3: Factory on Cumming (team 3)
    const student3 = await joinSeat({
      data: {
        roomCode: session.roomCode,
        handle: "Student Chris",
        teamIndex: 3,
        role: "factory",
      },
    });
    assert.ok(student3.token);

    // 5. Instructor view reflects the joined seats
    let desk = await getInstructorView({ data: { token: session.token } });
    assert.equal(desk.teams.length, 6);
    const team0 = desk.teams.find((t) => t.teamIndex === 0)!;
    const retailerSeat = team0.seats.find((s) => s.role === "retailer")!;
    assert.equal(retailerSeat.handle, "Student Maya");
    assert.equal(retailerSeat.isBot, false);

    // 6. Instructor starts game (auto-fills remaining 21 empty seats with computer bots)
    desk = await startGame({ data: { token: session.token } });
    assert.equal(desk.status, "playing");
    assert.equal(desk.week, 1);

    // Verify bots are filled
    const team0Wholesaler = desk.teams[0].seats.find((s) => s.role === "wholesaler")!;
    assert.equal(team0Wholesaler.handle, "Student Alex");
    const team0Distributor = desk.teams[0].seats.find((s) => s.role === "distributor")!;
    assert.equal(team0Distributor.isBot, true);

    // 7. Student 1 views board for Week 1
    const board1 = await getSeatView({ data: { token: student1.token } });
    assert.equal(board1.status, "playing");
    assert.equal(board1.board.week, 1);
    assert.equal(board1.board.inventory, 12);
    assert.equal(board1.board.backorder, 0);

    // 8. Human players submit orders for Week 1
    // Student 1 (Retailer) orders 4
    await placeOrder({ data: { token: student1.token, quantity: 4 } });

    // Student 2 (Wholesaler) orders 4
    // Since Distributor and Factory on Team 0 are bots, ordering by both humans will advance Team 0 to week 2!
    await placeOrder({ data: { token: student2.token, quantity: 4 } });

    // Student 3 (Factory on Team 3) orders 4
    // Team 3 has 3 bots + Student 3, so placing Student 3's order advances Team 3 to week 2!
    await placeOrder({ data: { token: student3.token, quantity: 4 } });

    // Check board again for student 1: should now be week 2!
    const board1Week2 = await getSeatView({ data: { token: student1.token } });
    assert.equal(board1Week2.board.week, 2);

    // 9. Instructor can reveal demand or place orders on behalf of students
    desk = await revealDemand({ data: { token: session.token } });
    assert.equal(desk.demandRevealed, true);

    // 10. Advance Team 0 through subsequent weeks
    for (let w = 2; w <= 12; w++) {
      await placeOrder({ data: { token: student1.token, quantity: 4 } });
      await placeOrder({ data: { token: student2.token, quantity: 4 } });
    }

    const finalBoard = await getSeatView({ data: { token: student1.token } });
    assert.equal(finalBoard.board.phase, "finished");
    assert.ok(finalBoard.debrief, "Debrief generated at end of game");
    assert.equal(finalBoard.debrief?.history.length, 12, "12 weeks of history recorded");
  });
});
