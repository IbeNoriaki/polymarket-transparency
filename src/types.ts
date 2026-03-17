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
