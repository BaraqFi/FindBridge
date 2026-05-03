# FindBridge

A cross-chain bridge aggregator that helps users discover and analyze blockchain bridges. Live TVL and volume data is pulled from [DeFiLlama](https://defillama.com) and merged with a curated static config of 49 active bridges (plus 7 tracked inactive ones).

![FindBridge Screenshot](public/findbridgess.png)

## Features

- **Bridge Directory** — Browse 49+ cross-chain bridges with live TVL, 7-day change, transfer speed, fees, and supported tokens
- **Search & Filter** — Search by bridge name or token; filter by source and destination chain
- **Market Summary** — Aggregated TVL and 24h volume across all tracked bridges, pulled from DeFiLlama
- **Chains Page** — View all blockchain networks with bridge counts, bridgeable tokens, and TVL
- **Live Data** — DeFiLlama integration with 24h in-memory cache and automatic static fallback
- **SEO** — Structured data, Open Graph, sitemap, robots.txt, and web app manifest

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3
- **UI Components:** Radix UI primitives + shadcn/ui
- **Icons:** Lucide React
- **Data Source:** [DeFiLlama API](https://defillama.com/docs/api) (free tier)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Install & Run

```bash
# Clone the repo
git clone https://github.com/BaraqFi/FindBridge.git
cd FindBridge

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start dev server (runs on port 3290)
pnpm dev
```

Open [http://localhost:3290](http://localhost:3290) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
findbridge/
├── app/
│   ├── api/
│   │   ├── bridges/         # GET /api/bridges, GET /api/bridges/[id]
│   │   ├── chains/          # GET /api/chains
│   │   └── market-summary/  # GET /api/market-summary
│   ├── chains/              # Chains explorer page
│   ├── resources/           # Resources page (placeholder)
│   ├── globals.css          # Global styles & CSS variables
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Home — bridge directory + market summary
│   ├── manifest.ts          # Web app manifest
│   ├── sitemap.ts           # Dynamic sitemap
│   └── robots.txt           # Crawl directives
├── components/
│   ├── ui/                  # shadcn/ui primitives (badge, button, card, input, select)
│   ├── bridge-card.tsx      # Individual bridge card
│   ├── footer.tsx           # Site footer
│   ├── loading-skeleton.tsx # Skeleton loaders
│   └── theme-provider.tsx   # Theme wrapper (light-only)
├── hooks/
│   ├── useBridges.ts        # Fetch & manage bridge data
│   ├── useChains.ts         # Fetch & manage chain data
│   └── useMarketSummary.ts  # Fetch & manage market summary
├── lib/
│   ├── api.ts               # Client-side API wrapper
│   ├── bridgeConfig.ts      # Static bridge config (56 bridges)
│   ├── defillama.ts         # DeFiLlama API wrapper with in-memory cache
│   ├── transforms.ts        # Data formatting & merge utilities
│   └── utils.ts             # Tailwind merge helper
├── types/
│   └── bridge.ts            # TypeScript interfaces
└── public/                  # Static assets (favicon, OG image, icons)
```

## API Endpoints

| Endpoint              | Method | Description                           |
| --------------------- | ------ | ------------------------------------- |
| `/api/bridges`        | GET    | All bridges with live TVL + volume    |
| `/api/bridges/[id]`   | GET    | Single bridge by ID                   |
| `/api/chains`         | GET    | All chains with bridge counts and TVL |
| `/api/market-summary` | GET    | Aggregated TVL, volume, bridge counts |

All endpoints return a standardized `{ data, success, lastUpdated }` response. If DeFiLlama is unreachable, responses fall back to static config values and include `dataSource: "static"`.

## Environment Variables

| Variable              | Required | Description                                              |
| --------------------- | -------- | -------------------------------------------------------- |
| `DEFILLAMA_BASE_URL`  | No       | DeFiLlama API base URL (default: `https://api.llama.fi`) |
| `NEXT_PUBLIC_APP_URL` | No       | Deployed app URL for OG metadata                         |

## License

MIT

## Author

Created by [BaraqFi](https://x.com/baraqfi)
