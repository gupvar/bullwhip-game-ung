# Nighthawk Chain

University of North Georgia classroom lab. A one-class-session supply-chain game (classic four-seat structure: retailer, wholesaler, distributor, factory) using cases of Nighthawk gear. Shoppers change their order once. The chain usually overreacts. That is the bullwhip.

Students do **not** play from this GitHub repo. They play on a **public website URL**.

## Easiest free host (no Grok paid plan)

Use **Vercel Hobby** (free) plus a free **Neon** database so every phone in the room shares the same lab.

### 1. Create a free database (2 minutes)

1. Open [console.neon.tech](https://console.neon.tech) and sign in with GitHub.
2. Create a project (any name, e.g. `nighthawk-chain`).
3. On the dashboard, copy the connection string. It starts with `postgres://` or `postgresql://`.  
   Choose the **pooled** string if Neon shows both.

### 2. Deploy the site (3 minutes)

1. Open [vercel.com/new](https://vercel.com/new) and sign in with the **same GitHub account**.
2. Import **`gupvar/bullwhip-game-ung`**.
3. Before you click Deploy, add one environment variable:

   | Name | Value |
   | --- | --- |
   | `DATABASE_URL` | the Neon connection string you copied |

4. Click **Deploy**. Wait until it is green.
5. Open the `.vercel.app` URL. If Vercel asks *you* to log in, go to the project **Settings → Deployment Protection** and turn **Vercel Authentication** off so students are not blocked.

That `.vercel.app` link is what you put in D2L.

### 3. Run class

**You:** site → **Host as instructor** → Create room → write the 4-letter code on the board, keep the PIN.

**Students:** same site → **Join a lab** → code + nickname → pick a seat.

Empty seats become computer players when you press **Start week 1**.

**Practice / demo with no students:** **Practice lab** — no room code.

## Class timing (50 minutes)

| Block | Minutes |
| --- | --- |
| Brief + seating | 8–10 |
| 12 weeks of play | 15–20 |
| Debrief the chart | 10–15 |

Slide outline: [CLASS_SLIDES.md](CLASS_SLIDES.md) (also downloadable from the site as `class-slides.md`).

## Rules in one screen

- 12 weeks, one order per week
- Lead time: two weeks
- Start: 12 on hand, 4 arriving
- Costs: $1 holding, $2 backorder
- Hidden information: only the retailer sees shoppers
- Demand: 4 cases/week, then 8 from week 5 (Homecoming) — do not tell students this before the debrief
