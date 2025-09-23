# FindBridge - Cross-Chain Bridge Aggregator

A comprehensive web application for discovering, comparing, and analyzing cross-chain bridges across multiple blockchain networks. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Bridge Discovery**: Browse and search through 15+ cross-chain bridges
- **Real-time Analytics**: View TVL, volume, fees, and transfer speeds
- **Chain Comparison**: Compare bridge support across different blockchain networks
- **Market Summary**: Get overview of the cross-chain bridge ecosystem
- **Responsive Design**: Modern UI with dark/light theme support
- **Advanced Filtering**: Filter bridges by source chain, destination chain, and supported tokens

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks
- **API**: Next.js API Routes

## 📊 Supported Bridges

The platform currently tracks 15+ major cross-chain bridges including:

- **Stargate Finance** - $1.2B TVL
- **Hop Protocol** - $890M TVL  
- **Synapse Protocol** - $650M TVL
- **Wormhole** - $420M TVL
- **Celer cBridge** - $380M TVL
- **Across Protocol** - $320M TVL
- And many more...

## 🔗 Supported Chains

- Ethereum
- Arbitrum
- Polygon
- BSC (Binance Smart Chain)
- Avalanche
- Optimism
- Solana
- And others...

## ⚠️ Important Note

**This application currently uses mock data for demonstration purposes.** Real live data integration has not been implemented yet. All bridge information, TVL values, volumes, and market data are simulated for the purpose of showcasing the application's functionality and user interface.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd findbridge-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
findbridge-app/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── bridges/       # Bridge data endpoints
│   │   ├── chains/        # Chain data endpoints
│   │   └── market-summary/ # Market analytics
│   ├── chains/            # Chains page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── footer.tsx        # Footer component
│   ├── loading-skeleton.tsx # Loading states
│   └── theme-*.tsx       # Theme components
├── hooks/                # Custom React hooks
│   ├── useBridges.ts     # Bridge data management
│   ├── useChains.ts      # Chain data management
│   └── useMarketSummary.ts # Market data management
├── lib/                  # Utility libraries
│   ├── api.ts           # API client
│   └── utils.ts         # Helper functions
├── types/               # TypeScript type definitions
│   └── bridge.ts        # Bridge-related types
└── public/              # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 API Endpoints

- `GET /api/bridges` - Get all bridges
- `GET /api/bridges/[id]` - Get specific bridge
- `GET /api/chains` - Get all supported chains
- `GET /api/market-summary` - Get market overview

## 🎨 UI Components

The project uses a comprehensive set of UI components built on Radix UI:

- Cards, Buttons, Inputs
- Select dropdowns, Badges
- Loading skeletons, Theme toggle
- Responsive navigation
- Data tables and grids

## 🔮 Future Enhancements

- **Real-time Data Integration**: Connect to actual bridge APIs
- **Price Tracking**: Real-time token price updates
- **Transaction History**: Track bridge transaction history
- **User Accounts**: Save favorite bridges and preferences
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Historical data and trends
- **Bridge Comparison Tool**: Side-by-side bridge comparison
- **Alert System**: Notifications for bridge status changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@findbridge.com or create an issue in the repository.

---

**Note**: This is a demonstration project showcasing cross-chain bridge aggregation capabilities. All data is currently mock data for UI/UX demonstration purposes.
