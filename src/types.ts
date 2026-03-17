export type Category = 'Sports' | 'Election' | 'Crypto' | 'Politics' | 'Other'

export interface MarketWashStats {
  marketId: string
  title: string
  category: Category
  totalVolume: number
  washVolume: number
  washPercent: number
  suspiciousWallets: number
}

export interface CategoryStats {
  category: Category
  washPercent: number
  totalVolume: number
  marketCount: number
}

export interface OverallStats {
  totalMarkets: number
  totalVolume: number
  totalWashVolume: number
  avgWashPercent: number
  categoryBreakdown: CategoryStats[]
  topWashMarkets: MarketWashStats[]
  updatedAt: string
  source: string
}

// Polymarket API types

export type LeaderboardCategory =
  | 'OVERALL' | 'POLITICS' | 'SPORTS' | 'CRYPTO'
  | 'CULTURE' | 'WEATHER' | 'ECONOMICS' | 'TECH' | 'FINANCE'

export type TimePeriod = 'DAY' | 'WEEK' | 'MONTH' | 'ALL'

export interface LeaderboardEntry {
  rank: string
  proxyWallet: string
  userName: string
  vol: number
  pnl: number
  profileImage: string
  xUsername: string
  verifiedBadge: boolean
}

export interface Trade {
  proxyWallet: string
  side: 'BUY' | 'SELL'
  asset: string
  conditionId: string
  size: number
  price: number
  timestamp: number
  title: string
  slug: string
  icon: string
  eventSlug: string
  outcome: string
  outcomeIndex: number
  name: string
  pseudonym: string
  transactionHash: string
}

export interface MarketPosition {
  proxyWallet: string
  name: string
  profileImage: string
  verified: boolean
  asset: string
  conditionId: string
  avgPrice: number
  size: number
  currPrice: number
  currentValue: number
  cashPnl: number
  totalBought: number
  realizedPnl: number
  totalPnl: number
  outcome: string
  outcomeIndex: number
}

export interface MarketPositionResponse {
  token: string
  positions: MarketPosition[]
}

export interface PolymarketMarket {
  id: string
  question: string
  conditionId: string
  slug: string
  endDate: string
  outcomes: string
  outcomePrices: string
  volume: string
  volumeNum: number
  active: boolean
  closed: boolean
  image: string
  icon: string
}
