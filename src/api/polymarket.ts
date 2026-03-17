import type {
  LeaderboardEntry,
  LeaderboardCategory,
  TimePeriod,
  Trade,
  MarketPositionResponse,
  PolymarketMarket,
} from '../types'

const DATA_API = 'https://data-api.polymarket.com'
const GAMMA_API = 'https://gamma-api.polymarket.com'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function fetchLeaderboard(
  category: LeaderboardCategory = 'OVERALL',
  timePeriod: TimePeriod = 'ALL',
  orderBy: 'PNL' | 'VOL' = 'PNL',
  limit = 50,
  offset = 0,
): Promise<LeaderboardEntry[]> {
  const params = new URLSearchParams({
    category,
    timePeriod,
    orderBy,
    limit: String(limit),
    offset: String(offset),
  })
  return fetchJson<LeaderboardEntry[]>(
    `${DATA_API}/v1/leaderboard?${params}`,
  )
}

export async function fetchWalletTrades(
  address: string,
  limit = 100,
  offset = 0,
): Promise<Trade[]> {
  const params = new URLSearchParams({
    user: address,
    limit: String(limit),
    offset: String(offset),
  })
  return fetchJson<Trade[]>(`${DATA_API}/trades?${params}`)
}

export async function fetchMarketPositions(
  conditionId: string,
  sortBy: 'TOTAL_PNL' | 'CASH_PNL' | 'REALIZED_PNL' | 'TOKENS' = 'TOTAL_PNL',
  sortDirection: 'ASC' | 'DESC' = 'DESC',
  limit = 50,
  offset = 0,
): Promise<MarketPositionResponse[]> {
  const params = new URLSearchParams({
    market: conditionId,
    sortBy,
    sortDirection,
    limit: String(limit),
    offset: String(offset),
  })
  return fetchJson<MarketPositionResponse[]>(
    `${DATA_API}/v1/market-positions?${params}`,
  )
}

export async function fetchMarkets(
  limit = 20,
  active = true,
): Promise<PolymarketMarket[]> {
  const params = new URLSearchParams({
    limit: String(limit),
    active: String(active),
    closed: 'false',
    order: 'volumeNum',
    ascending: 'false',
  })
  return fetchJson<PolymarketMarket[]>(`${GAMMA_API}/markets?${params}`)
}

export async function fetchMarketTitle(
  conditionId: string,
): Promise<string | null> {
  try {
    const trades = await fetchJson<Trade[]>(
      `${DATA_API}/trades?market=${conditionId}&limit=1`,
    )
    return trades[0]?.title ?? null
  } catch {
    return null
  }
}
