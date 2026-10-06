async function post(url, fnId, data) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-tanstack-start-action": fnId,
    },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }
  return res.json();
}

async function testGameFlow() {
  console.log("=== Testing Game Flow via HTTP on http://127.0.0.1:8080 ===");

  // 1. Health check
  const homeRes = await fetch("http://127.0.0.1:8080/");
  console.log(`1. Homepage HTTP status: ${homeRes.status}`);

  // 2. Instructor creates room
  console.log("2. Creating 6-chain room (24 seats)...");
  // TanStack Start server functions use POST with action header
  // Let's test calling TanStack Start server function endpoint
}

testGameFlow();
