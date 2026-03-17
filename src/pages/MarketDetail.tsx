import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Nav } from '../components/Nav'
import { PnlDistribution } from '../components/PnlDistribution'
import { fetchMarketPositions, fetchMarketTitle, searchMarkets } from '../api/polymarket'
import type { MarketPosition, MarketPositionResponse } from '../types'

export default function MarketDetail() {
  const { conditionId } = useParams<{ conditionId: string }>()
  const navigate = useNavigate()
  const [positions, setPositions] = useState<MarketPosition[]>([])
  const [title, setTitle] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!conditionId) return

    // If conditionId doesn't look like a hex hash, treat it as a search query
    const isSearch = !conditionId.startsWith('0x')

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        if (isSearch) {
          const results = await searchMarkets(decodeURIComponent(conditionId), 1)
          if (results.length > 0) {
            navigate(`/market/${results[0].conditionId}`, { replace: true })
            return
          }
          setError(`No market found for "${decodeURIComponent(conditionId)}"`)
          setLoading(false)
          return
        }

        const [posData, marketTitle] = await Promise.all([
          fetchMarketPositions(conditionId, 'TOTAL_PNL', 'DESC', 100),
          fetchMarketTitle(conditionId),
        ])

        const allPositions = posData.flatMap(
          (r: MarketPositionResponse) => r.positions,
        )
        allPositions.sort((a, b) => b.totalPnl - a.totalPnl)

        setPositions(allPositions)
        setTitle(marketTitle)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [conditionId, navigate])

  const totalPnlPositive = useMemo(
    () => positions.filter(p => p.totalPnl > 0).reduce((s, p) => s + p.totalPnl, 0),
    [positions],
  )
  const totalPnlNegative = useMemo(
    () => positions.filter(p => p.totalPnl < 0).reduce((s, p) => s + p.totalPnl, 0),
    [positions],
  )

  return (
    <div className="min-h-screen">
      <Nav />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-mono text-xl text-text-primary mb-2">
            {title ?? 'MARKET ANALYSIS'}
          </h1>
          <div className="font-mono text-xs text-text-muted break-all">
            Condition ID: {conditionId}
          </div>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/30 p-4 mb-6 font-mono text-sm text-danger">
            ERROR: {error}
          </div>
        )}

        {/* Zero-sum callout */}
        {!loading && positions.length > 0 && (
          <div className="bg-surface border border-border p-4 mb-8">
            <div className="font-mono text-xs text-text-muted mb-3">
              ZERO-SUM REALITY CHECK
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1 text-center">
                <div className="font-mono text-2xl text-success">
                  +${(totalPnlPositive / 1000).toFixed(1)}K
                </div>
                <div className="font-mono text-xs text-text-muted">WINNERS GAINED</div>
              </div>
              <div className="font-mono text-2xl text-text-muted">=</div>
              <div className="flex-1 text-center">
                <div className="font-mono text-2xl text-danger">
                  -${(Math.abs(totalPnlNegative) / 1000).toFixed(1)}K
                </div>
                <div className="font-mono text-xs text-text-muted">LOSERS LOST</div>
              </div>
            </div>
            <div className="font-mono text-xs text-text-muted text-center">
              Every dollar won is a dollar someone else lost. Who&apos;s on the other side of your bet?
            </div>
          </div>
        )}

        {/* Positions */}
        <div className="bg-surface border border-border p-4">
          <div className="font-mono text-xs text-text-muted mb-4">
            $ polymarket-scan --market {conditionId?.slice(0, 12)}... --positions
          </div>
          <PnlDistribution positions={positions} loading={loading} />
          <div className="mt-4 font-mono text-xs text-text-muted">
            {'>'} Showing {positions.length} positions | Source: Polymarket Data API
          </div>
        </div>
      </main>
    </div>
  )
}
