import { chromium } from "playwright";

async function run() {
  console.log("Starting Playwright E2E browser test against http://127.0.0.1:8080...");
  const browser = await chromium.launch({ headless: true });

  try {
    // =========================================================================
    // PART A: Home Page Edition Selector & UNG Nighthawk Edition (6 chains)
    // =========================================================================
    console.log("\n--- PART A: UNG Nighthawk Edition Flow ---");
    const ungContext = await browser.newContext();
    const homePage = await ungContext.newPage();
    homePage.on("pageerror", (err) => console.error(`[BROWSER ERROR]`, err));

    await homePage.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
    await homePage.waitForSelector("text=General Supply Chain Edition", { timeout: 5000 });
    await homePage.waitForSelector("text=UNG Nighthawk Edition", { timeout: 5000 });
    await homePage.waitForSelector("text=© Varun Gupta", { timeout: 5000 });
    console.log("✔ Home page 2-card Edition Selector and © Varun Gupta attribution verified!");

    // Select General Supply Chain Edition first on home page, verify it switches
    await homePage.locator("button:has-text('General Supply Chain Edition')").click();
    await homePage.waitForSelector("text=Supply chain network", { timeout: 5000 });
    console.log("✔ Switched to General Supply Chain Edition on home page!");

    // Switch back to UNG Nighthawk Edition on home page
    await homePage.locator("button:has-text('UNG Nighthawk Edition')").click();
    await homePage.waitForSelector("text=Cases moving from factory to Dahlonega shop", { timeout: 5000 });
    console.log("✔ Switched to UNG Nighthawk Edition on home page!");

    // Navigate to /instructor in UNG mode using the same page
    await homePage.locator("a:has-text('Host as instructor')").click();
    await homePage.waitForURL("**/instructor", { timeout: 10000 });

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
    // PART B: General Supply Chain Edition Flow (10 chains + Greek names + Team Rename)
    // =========================================================================
    console.log("\n--- PART B: General Supply Chain Edition Flow (>6 teams + Greek names + Team Rename) ---");
    const genContext = await browser.newContext();
    const genInstructor = await genContext.newPage();
    genInstructor.on("pageerror", (err) => console.error(`[GEN BROWSER ERROR]`, err));

    await genInstructor.goto("http://127.0.0.1:8080/instructor?edition=general", { waitUntil: "networkidle" });
    await genInstructor.waitForSelector("text=General Supply Chain Edition", { timeout: 5000 });

    const genTeamsSelect = genInstructor.locator("#teams");
    await genTeamsSelect.selectOption("10"); // 10 chains (40 seats, Alpha through Kappa)
    await genInstructor.locator("button[type='submit']:has-text('Create room')").click();

    await genInstructor.waitForURL("**/instructor/session", { timeout: 15000 });
    const genCodeEl = genInstructor.locator("span.font-display.text-5xl");
    await genCodeEl.waitFor({ state: "visible", timeout: 5000 });
    const genRoomCode = (await genCodeEl.textContent())?.trim();
    console.log(`✔ Created 10-team General Room Code: ${genRoomCode}`);

    // Verify Greek team names (Alpha through Kappa) appear on instructor desk
    await genInstructor.waitForSelector("text=Alpha", { timeout: 5000 });
    await genInstructor.waitForSelector("text=Kappa", { timeout: 5000 });
    console.log("✔ Verified 10 Greek chains (Alpha through Kappa) on instructor desk!");

    // Student joins General room and renames Team Alpha
    const genStudent = await genContext.newPage();
    await genStudent.goto(`http://127.0.0.1:8080/join?code=${genRoomCode}`, { waitUntil: "networkidle" });
    await genStudent.locator("#handle").fill("Alex General");
    await genStudent.locator("button[type='submit']:has-text('Find seats')").click();

    await genStudent.waitForSelector("text=Alpha chain", { timeout: 5000 });
    await genStudent.waitForSelector("text=Kappa chain", { timeout: 5000 });
    console.log("✔ Student sees all 10 Greek chains in lobby!");

    // Student clicks Edit name on Alpha chain in /join lobby
    await genStudent.locator("button:has-text('Edit name')").first().click();
    const renameInput = genStudent.locator("input[placeholder='Custom team name']").first();
    await renameInput.fill("Apex Logistics");
    await genStudent.locator("button:has-text('Save')").first().click();

    await genStudent.waitForSelector("text=Apex Logistics chain", { timeout: 5000 });
    console.log("✔ Student renamed 'Alpha' to 'Apex Logistics' in lobby!");

    // Take Retailer seat on Apex Logistics chain
    const genRetailerBtn = genStudent.locator("button:has-text('Retailer'):has-text('Open — sit here')").first();
    await genRetailerBtn.click();
    await genStudent.waitForURL("**/play", { timeout: 10000 });
    await genStudent.waitForSelector("text=Apex Logistics chain", { timeout: 5000 });
    console.log("✔ Student seated on 'Apex Logistics chain' on /play!");

    // Verify instructor also sees the renamed team
    await genInstructor.waitForSelector("text=Apex Logistics", { timeout: 5000 });
    console.log("✔ Instructor desk live-updated with 'Apex Logistics'!");

    // Start week 1 and submit order
    await genInstructor.locator("button:has-text('Start week 1')").click();
    await genStudent.waitForSelector("button:has-text('Send order')", { timeout: 5000 });
    await genStudent.locator("button:has-text('Send order')").click();
    await genStudent.waitForSelector("text=Week 2 of 12", { timeout: 5000 });
    console.log("✔ General Edition chain advanced to Week 2 of 12!");

    await genContext.close();

    console.log("\n=======================================================");
    console.log("✅ ALL E2E CHECKS (UNG + GENERAL + RENAME + >6 TEAMS) PASSED!");
    console.log("=======================================================\n");
  } catch (err) {
    console.error("❌ E2E test failed:", err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

run();
