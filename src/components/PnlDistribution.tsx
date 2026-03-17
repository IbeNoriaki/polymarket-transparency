import { Link } from 'react-router-dom'
import { PnlHistogram } from './PnlHistogram'
import type { MarketPosition } from '../types'

interface PnlDistributionProps {
  positions: MarketPosition[]
  loading: boolean
}

function formatUsd(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (abs >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${n.toFixed(0)}`
}

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export function PnlDistribution({ positions, loading }: PnlDistributionProps) {
  if (loading) {
    return (
      <div className="font-mono text-text-muted text-sm animate-pulse py-8 text-center">
        Loading positions...
      </div>
    )
  }

  if (positions.length === 0) {
    return (
      <div className="font-mono text-text-muted text-sm py-8 text-center">
        No position data available for this market.
      </div>
    )
  }

  const winners = positions.filter(p => p.totalPnl > 0)
  const losers = positions.filter(p => p.totalPnl < 0)
  const totalWinPnl = winners.reduce((sum, p) => sum + p.totalPnl, 0)
  const totalLossPnl = losers.reduce((sum, p) => sum + p.totalPnl, 0)

  const maxPnl = Math.max(
    ...positions.map(p => Math.abs(p.totalPnl)),
    1,
  )

  return (
    <div>
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-success/10 border border-success/20 p-3">
          <div className="font-mono text-2xl text-success">
            {winners.length}
          </div>
          <div className="font-mono text-xs text-text-muted">
            WINNERS (+{formatUsd(totalWinPnl)})
          </div>
        </div>
        <div className="bg-danger/10 border border-danger/20 p-3">
          <div className="font-mono text-2xl text-danger">
            {losers.length}
          </div>
          <div className="font-mono text-xs text-text-muted">
            LOSERS ({formatUsd(totalLossPnl)})
          </div>
        </div>
        <div className="bg-surface border border-border p-3">
          <div className="font-mono text-2xl text-text-primary">
            {positions.length}
          </div>
          <div className="font-mono text-xs text-text-muted">
            TOTAL TRADERS
          </div>
        </div>
      </div>

      {/* Histogram */}
      <PnlHistogram positions={positions} />

      {/* PnL bar distribution */}
      <div className="mb-6">
        <div className="font-mono text-xs text-text-muted mb-2">P&L DISTRIBUTION</div>
        <div className="space-y-1">
          {positions.slice(0, 30).map((pos, i) => {
            const width = (Math.abs(pos.totalPnl) / maxPnl) * 100
            const isWinner = pos.totalPnl >= 0
            return (
              <div key={`${pos.proxyWallet}-${i}`} className="flex items-center gap-2">
                <Link
                  to={`/wallet/${pos.proxyWallet}`}
                  className="font-mono text-xs text-text-muted w-28 truncate hover:text-text-primary transition-colors"
                >
                  {pos.name || shortenAddress(pos.proxyWallet)}
                </Link>
                <div className="flex-1 h-4 flex items-center">
                  {isWinner ? (
                    <div
                      className="h-full bg-success/60"
                      style={{ width: `${width}%` }}
                    />
                  ) : (
                    <div className="flex-1 flex justify-end">
                      <div
                        className="h-full bg-danger/60"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  )}
                </div>
                <span className={`font-mono text-xs w-20 text-right ${
                  isWinner ? 'text-success' : 'text-danger'
                }`}>
                  {isWinner ? '+' : ''}{formatUsd(pos.totalPnl)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="text-border text-xs font-mono">{'─'.repeat(80)}</div>

          <div className="grid grid-cols-12 gap-2 py-2 text-xs text-text-muted font-mono">
            <div className="col-span-3">TRADER</div>
            <div className="col-span-2">OUTCOME</div>
            <div className="col-span-2 text-right">AVG PRICE</div>
            <div className="col-span-2 text-right">SIZE</div>
            <div className="col-span-3 text-right">TOTAL P&L</div>
          </div>

          <div className="text-border text-xs font-mono">{'─'.repeat(80)}</div>

          <div className="divide-y divide-border">
            {positions.map((pos, i) => (
              <Link
                key={`${pos.proxyWallet}-${i}`}
                to={`/wallet/${pos.proxyWallet}`}
                className="grid grid-cols-12 gap-2 py-2 text-sm font-mono hover:bg-surface/50 transition-colors block"
              >
                <div className="col-span-3 truncate text-text-primary">
                  {pos.name || shortenAddress(pos.proxyWallet)}
                </div>
                <div className="col-span-2 text-text-muted text-xs">
                  {pos.outcome}
                </div>
                <div className="col-span-2 text-right text-text-muted">
                  {pos.avgPrice.toFixed(3)}
                </div>
                <div className="col-span-2 text-right text-text-primary">
                  {pos.size.toFixed(1)}
                </div>
                <div className={`col-span-3 text-right font-semibold ${
                  pos.totalPnl >= 0 ? 'text-success' : 'text-danger'
                }`}>
                  {pos.totalPnl >= 0 ? '+' : ''}{formatUsd(pos.totalPnl)}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-border text-xs font-mono mt-2">{'─'.repeat(80)}</div>
        </div>
      </div>
    </div>
  )
}
