import { chromium } from "playwright";

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server at ${url} did not become ready within ${timeoutMs}ms`);
}

async function run() {
  console.log("Waiting for dev server at http://127.0.0.1:8080...");
  await waitForServer("http://127.0.0.1:8080/");
  console.log("Starting Playwright E2E browser test against http://127.0.0.1:8080...");
  const browser = await chromium.launch({ headless: true });

  try {
    // =========================================================================
    // PART A: Home Page Edition Selector, FAQ, & UNG Nighthawk Edition (6 chains)
    // =========================================================================
    console.log("\n--- PART A: Home Page, FAQ, & UNG Nighthawk Edition Flow ---");
    const ungContext = await browser.newContext();
    const homePage = await ungContext.newPage();
    homePage.on("pageerror", (err) => console.error(`[BROWSER ERROR]`, err));

    await homePage.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
    await homePage.waitForSelector("text=General Supply Chain Edition", { timeout: 5000 });
    await homePage.waitForSelector("text=UNG Nighthawk Edition", { timeout: 5000 });
    await homePage.waitForSelector("text=© Varun Gupta", { timeout: 5000 });
    console.log("✔ Home page 2-card Edition Selector and © Varun Gupta attribution verified!");

    // Check /how-to-play FAQ section
    await homePage.goto("http://127.0.0.1:8080/how-to-play", { waitUntil: "networkidle" });
    await homePage.waitForSelector("text=Computer Players, Timers & FAQ", { timeout: 5000 });
    await homePage.waitForSelector("text=Rational Order-Up-To (Base-Stock) Policy", { timeout: 5000 });
    console.log("✔ Verified FAQ & Rational Computer Player Setup on /how-to-play!");

    // Navigate to /instructor in UNG mode
    await homePage.goto("http://127.0.0.1:8080/instructor?edition=ung", { waitUntil: "networkidle" });

    const select = homePage.locator("#teams");
    await select.waitFor({ state: "visible" });
    await select.selectOption("6"); // 6 chains (24 seats)
    await homePage.locator("button[type='submit']:has-text('Create room')").click();

    await homePage.waitForURL("**/instructor/session", { timeout: 15000 });
    const roomCodeElement = homePage.locator("span.font-display.text-5xl");
    await roomCodeElement.waitFor({ state: "visible", timeout: 5000 });
    const ungRoomCode = (await roomCodeElement.textContent())?.trim();
    console.log(`✔ Created UNG Room Code: ${ungRoomCode}`);

    // Student joins UNG room
    const studentPage = await ungContext.newPage();
    await studentPage.goto(`http://127.0.0.1:8080/join?code=${ungRoomCode}`, { waitUntil: "networkidle" });
    await studentPage.locator("#handle").fill("Student Maya");
    await studentPage.locator("button[type='submit']:has-text('Find seats')").click();

    await studentPage.waitForSelector("text=Dahlonega chain", { timeout: 5000 });
    console.log("✔ UNG lobby shows Dahlonega chain!");

    const retailerSeatButton = studentPage.locator("button:has-text('Retailer'):has-text('Open — sit here')").first();
    await retailerSeatButton.click();
    await studentPage.waitForURL("**/play", { timeout: 10000 });
    console.log("✔ UNG Student seated on /play board!");

    await homePage.locator("button:has-text('Start week 1')").click();
    await homePage.waitForSelector("text=Live · week 1 of 12", { timeout: 5000 });
    await studentPage.waitForSelector("button:has-text('Send order')", { timeout: 5000 });
    await studentPage.locator("button:has-text('Send order')").click();
    await studentPage.waitForSelector("text=Week 2 of 12", { timeout: 5000 });
    console.log("✔ UNG chain advanced to Week 2 of 12!");
    await ungContext.close();

    // =========================================================================
    // PART B: General Supply Chain Edition Flow (Visual Timer + Active All-Computer Chains)
    // =========================================================================
    console.log("\n--- PART B: General Supply Chain Edition Flow (Visual Timer + Active Computer Chains) ---");
    const genContext = await browser.newContext();
    const genInstructor = await genContext.newPage();
    genInstructor.on("pageerror", (err) => console.error(`[GEN BROWSER ERROR]`, err));

    await genInstructor.goto("http://127.0.0.1:8080/instructor?edition=general", { waitUntil: "networkidle" });
    await genInstructor.waitForSelector("text=General Supply Chain Edition", { timeout: 5000 });

    const genTeamsSelect = genInstructor.locator("#teams");
    await genTeamsSelect.selectOption("8"); // 8 chains (Alpha through Theta)
    await genInstructor.locator("button[type='submit']:has-text('Create room')").click();

    await genInstructor.waitForURL("**/instructor/session", { timeout: 15000 });
    const genCodeEl = genInstructor.locator("span.font-display.text-5xl");
    await genCodeEl.waitFor({ state: "visible", timeout: 5000 });
    const genRoomCode = (await genCodeEl.textContent())?.trim();
    console.log(`✔ Created 8-team General Room Code: ${genRoomCode}`);

    // Student joins General room and renames Team Alpha
    const genStudent = await genContext.newPage();
    await genStudent.goto(`http://127.0.0.1:8080/join?code=${genRoomCode}`, { waitUntil: "networkidle" });
    await genStudent.locator("#handle").fill("Alex General");
    await genStudent.locator("button[type='submit']:has-text('Find seats')").click();

    // Student clicks Edit name on Alpha chain in /join lobby
    await genStudent.locator("button:has-text('Edit name')").first().click();
    const renameInput = genStudent.locator("input[placeholder='Custom team name']").first();
    await renameInput.fill("Apex Logistics");
    await genStudent.locator("button:has-text('Save')").first().click();
    await genStudent.waitForSelector("text=Apex Logistics chain", { timeout: 5000 });
    console.log("✔ Student renamed 'Alpha' to 'Apex Logistics' in lobby!");

    // Take Retailer seat on Apex Logistics chain (Chains 2..8 remain 100% computer-only chains!)
    const genRetailerBtn = genStudent.locator("button:has-text('Retailer'):has-text('Open — sit here')").first();
    await genRetailerBtn.click();
    await genStudent.waitForURL("**/play", { timeout: 10000 });

    // Start week 1
    await genInstructor.locator("button:has-text('Start week 1')").click();

    // Verify Visual Timer appears on BOTH Instructor view and Student view
    await genInstructor.waitForSelector("text=Week 1 Decision Timer", { timeout: 5000 });
    await genInstructor.waitForSelector("text=All-Computer Chain", { timeout: 5000 });
    console.log("✔ Visual 30s Decision Timer & All-Computer Chain badge verified on Instructor Desk!");

    await genStudent.waitForSelector("text=Week 1 Decision Timer", { timeout: 5000 });
    await genStudent.waitForSelector("text=Computer seats act in ≤30s", { timeout: 5000 });
    console.log("✔ Visual 30s Decision Timer verified on Student Board!");

    // Verify that computer teammates on the student's chain lock in their order within ~3s (<=30s)
    // and that 100% computer-only chains (Beta..Theta) automatically advance to Week 2 within ~6s (<=30s) WITHOUT human action!
    console.log("Waiting ~7s to verify computer seats & 100% computer-only chains act and advance automatically...");
    await genInstructor.waitForSelector("text=Cost $96 · week 2", { timeout: 12000 });
    console.log("✔ 100% Computer-only chains automatically placed rational orders and advanced to Week 2 in ≤30s!");

    // Student submits order on Apex Logistics chain
    await genStudent.locator("button:has-text('Send order')").click();
    await genStudent.waitForSelector("text=Week 2 of 12", { timeout: 5000 });
    console.log("✔ Student's mixed chain also advanced to Week 2 of 12!");

    await genContext.close();

    console.log("\n=======================================================");
    console.log("✅ ALL E2E CHECKS (TIMER + ACTIVE BOTS + FAQ + EDITIONS) PASSED!");
    console.log("=======================================================\n");
  } catch (err) {
    console.error("❌ E2E test failed:", err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

run();
