import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Nav } from '../components/Nav'
import { WalletSearch } from '../components/WalletSearch'
import { TradeHistory } from '../components/TradeHistory'
import { fetchWalletTrades } from '../api/polymarket'
import type { Trade } from '../types'

function formatUsd(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (abs >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${n.toFixed(2)}`
}

interface MarketSummary {
  title: string
  conditionId: string
  buyCost: number
  sellRevenue: number
  pnl: number
  tradeCount: number
}

function computeMarketSummaries(trades: Trade[]): MarketSummary[] {
  const byMarket = new Map<string, { title: string; conditionId: string; buyCost: number; sellRevenue: number; count: number }>()

  for (const t of trades) {
    const key = t.conditionId
    const existing = byMarket.get(key) ?? {
      title: t.title,
      conditionId: t.conditionId,
      buyCost: 0,
      sellRevenue: 0,
      count: 0,
    }

    if (t.side === 'BUY') {
      existing.buyCost += t.size * t.price
    } else {
      existing.sellRevenue += t.size * t.price
    }
    existing.count += 1
    byMarket.set(key, existing)
  }

  return Array.from(byMarket.values())
    .map(m => ({
      title: m.title,
      conditionId: m.conditionId,
      buyCost: m.buyCost,
      sellRevenue: m.sellRevenue,
      pnl: m.sellRevenue - m.buyCost,
      tradeCount: m.count,
    }))
    .sort((a, b) => b.pnl - a.pnl)
}

export default function Wallet() {
  const { address } = useParams<{ address: string }>()
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!address) return

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchWalletTrades(address, 500)
        setTrades(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [address])

  const marketSummaries = useMemo(() => computeMarketSummaries(trades), [trades])

  const totalBuyCost = marketSummaries.reduce((sum, m) => sum + m.buyCost, 0)
  const totalSellRevenue = marketSummaries.reduce((sum, m) => sum + m.sellRevenue, 0)
  const totalPnl = totalSellRevenue - totalBuyCost
  const winningMarkets = marketSummaries.filter(m => m.pnl > 0).length
  const losingMarkets = marketSummaries.filter(m => m.pnl < 0).length

  if (!address) {
    return (
      <div className="min-h-screen">
        <Nav />
        <main className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h1 className="font-mono text-3xl text-text-primary mb-4">
              SCAN A WALLET
            </h1>
            <p className="text-text-muted mb-8">
              Enter any Polymarket wallet address to see their complete trading history and P&L.
            </p>
          </div>
          <WalletSearch />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Nav />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-mono text-xl text-text-primary mb-1">
            WALLET ANALYSIS
          </h1>
          <div className="font-mono text-sm text-text-muted break-all">
            {address}
          </div>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/30 p-4 mb-6 font-mono text-sm text-danger">
            ERROR: {error}
          </div>
        )}

        {/* Summary stats */}
        {!loading && trades.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-surface border border-border p-4">
              <div className={`font-mono text-2xl ${totalPnl >= 0 ? 'text-success' : 'text-danger'}`}>
                {totalPnl >= 0 ? '+' : ''}{formatUsd(totalPnl)}
              </div>
              <div className="font-mono text-xs text-text-muted">EST. P&L</div>
            </div>
            <div className="bg-surface border border-border p-4">
              <div className="font-mono text-2xl text-text-primary">{trades.length}</div>
              <div className="font-mono text-xs text-text-muted">TRADES</div>
            </div>
            <div className="bg-surface border border-border p-4">
              <div className="font-mono text-2xl text-text-primary">{marketSummaries.length}</div>
              <div className="font-mono text-xs text-text-muted">MARKETS</div>
            </div>
            <div className="bg-surface border border-border p-4">
              <div className="font-mono text-2xl text-success">{winningMarkets}</div>
              <div className="font-mono text-xs text-text-muted">WINNING</div>
            </div>
            <div className="bg-surface border border-border p-4">
              <div className="font-mono text-2xl text-danger">{losingMarkets}</div>
              <div className="font-mono text-xs text-text-muted">LOSING</div>
            </div>
          </div>
        )}

        {/* Market-by-market P&L */}
        {!loading && marketSummaries.length > 0 && (
          <div className="bg-surface border border-border p-4 mb-8">
            <div className="font-mono text-xs text-text-muted mb-4">
              $ polymarket-scan --wallet {address?.slice(0, 10)}... --pnl-by-market
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[500px]">
                <div className="text-border text-xs font-mono">{'─'.repeat(70)}</div>
                <div className="grid grid-cols-12 gap-2 py-2 text-xs text-text-muted font-mono">
                  <div className="col-span-5">MARKET</div>
                  <div className="col-span-2 text-right">BOUGHT</div>
                  <div className="col-span-2 text-right">SOLD</div>
                  <div className="col-span-2 text-right">P&L</div>
                  <div className="col-span-1 text-right">#</div>
                </div>
                <div className="text-border text-xs font-mono">{'─'.repeat(70)}</div>

                <div className="divide-y divide-border">
                  {marketSummaries.slice(0, 20).map((m) => (
                    <div
                      key={m.conditionId}
                      className="grid grid-cols-12 gap-2 py-2 text-sm font-mono hover:bg-background/50 transition-colors"
                    >
                      <div className="col-span-5 truncate text-text-primary">
                        {m.title}
                      </div>
                      <div className="col-span-2 text-right text-text-muted">
                        {formatUsd(m.buyCost)}
                      </div>
                      <div className="col-span-2 text-right text-text-muted">
                        {formatUsd(m.sellRevenue)}
                      </div>
                      <div className={`col-span-2 text-right font-semibold ${
                        m.pnl >= 0 ? 'text-success' : 'text-danger'
                      }`}>
                        {m.pnl >= 0 ? '+' : ''}{formatUsd(m.pnl)}
                      </div>
                      <div className="col-span-1 text-right text-text-muted">
                        {m.tradeCount}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-border text-xs font-mono mt-2">{'─'.repeat(70)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Trade history */}
        <div className="bg-surface border border-border p-4">
          <div className="font-mono text-xs text-text-muted mb-4">
            $ polymarket-scan --wallet {address?.slice(0, 10)}... --trades
          </div>
          <TradeHistory trades={trades} loading={loading} />
          <div className="mt-4 font-mono text-xs text-text-muted">
            {'>'} Showing {trades.length} trades | Source: Polymarket Data API
          </div>
        </div>
      </main>
    </div>
  )
}
