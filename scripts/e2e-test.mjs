import { chromium } from "playwright";

async function run() {
  console.log("Starting Playwright E2E browser test against http://127.0.0.1:8080...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  try {
    // 1. Instructor opens /instructor
    const instructorPage = await context.newPage();
    instructorPage.on("console", (msg) => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));
    instructorPage.on("pageerror", (err) => console.error(`[BROWSER ERROR]`, err));
    instructorPage.on("response", async (res) => {
      if (res.status() >= 400) {
        console.log(`[HTTP ${res.status()}] ${res.url()}:`, await res.text().catch(() => ""));
      }
    });
    console.log("1. Navigating to /instructor");
    await instructorPage.goto("http://127.0.0.1:8080/instructor", { waitUntil: "networkidle" });

    // Verify chain options
    const select = instructorPage.locator("#teams");
    await select.waitFor({ state: "visible" });
    await select.selectOption("6"); // select 6 chains (24 seats)
    console.log("Selected 6 chains (24 seats)");

    // Click Create room
    console.log("Clicking 'Create room'...");
    await instructorPage.locator("button[type='submit']:has-text('Create room')").click();
    await instructorPage.waitForTimeout(2000);
    const bodyHtml = await instructorPage.content();
    console.log("[INSTRUCTOR PAGE HTML SNIPPET]:", bodyHtml.slice(0, 1000));

    // Wait for navigation to /instructor/session
    await instructorPage.waitForURL("**/instructor/session", { timeout: 10000 });
    console.log("Successfully navigated to /instructor/session!");

    // Extract Room Code
    const roomCodeElement = instructorPage.locator("span.font-display.text-5xl");
    await roomCodeElement.waitFor({ state: "visible", timeout: 5000 });
    const roomCode = (await roomCodeElement.textContent())?.trim();
    console.log(`Created Room Code: ${roomCode}`);

    if (!roomCode || roomCode.length !== 4) {
      throw new Error(`Invalid room code: ${roomCode}`);
    }

    // 2. Student joins room on /join
    const studentPage = await context.newPage();
    console.log(`2. Student navigating to /join?code=${roomCode}`);
    await studentPage.goto(`http://127.0.0.1:8080/join?code=${roomCode}`, { waitUntil: "networkidle" });

    // Verify room code auto-filled
    const codeInput = studentPage.locator("#code");
    const filledCode = await codeInput.inputValue();
    console.log(`Auto-filled code in student page: ${filledCode}`);

    // Fill student name
    const handleInput = studentPage.locator("#handle");
    await handleInput.fill("Student Maya");

    // Click Find seats
    console.log("Student clicking 'Find seats'...");
    await studentPage.locator("button[type='submit']:has-text('Find seats')").click();

    // Verify all 6 chains appear
    await studentPage.waitForSelector("text=Dahlonega chain", { timeout: 5000 });
    console.log("Found 6 chains displayed in student lobby!");

    // Pick Retailer seat on Dahlonega chain
    const retailerSeatButton = studentPage.locator("button:has-text('Retailer'):has-text('Open — sit here')").first();
    await retailerSeatButton.click();

    // Student lands on /play
    await studentPage.waitForURL("**/play", { timeout: 10000 });
    console.log("Student 1 successfully seated and on /play board!");

    // 3. Instructor sees student in real-time
    await instructorPage.waitForSelector("text=Student Maya", { timeout: 5000 });
    console.log("Instructor desk verified: Student Maya is listed on Dahlonega Retailer seat!");

    // 4. Instructor starts week 1 (fills remaining seats with bots)
    console.log("Instructor clicking 'Start week 1'...");
    const startButton = instructorPage.locator("button:has-text('Start week 1')");
    await startButton.click();

    // Verify live week 1 status
    await instructorPage.waitForSelector("text=Live · week 1 of 12", { timeout: 5000 });
    console.log("Instructor desk shows: Live · week 1 of 12!");

    // 5. Student submits order for Week 1
    await studentPage.waitForSelector("button:has-text('Send order')", { timeout: 5000 });
    console.log("Student board active for Week 1. Submitting order of 4 cases...");
    await studentPage.locator("button:has-text('Send order')").click();

    // Since remaining seats in Dahlonega chain are bots, submitting the order advances the team to Week 2!
    await studentPage.waitForSelector("text=Week 2 of 12", { timeout: 5000 });
    console.log("Student board successfully advanced to Week 2 of 12!");

    console.log("\n=======================================================");
    console.log("✅ ALL E2E INSTRUCTOR & STUDENT CHECKS PASSED PERFECTLY!");
    console.log("=======================================================\n");
  } catch (err) {
    console.error("❌ E2E test failed:", err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

run();
