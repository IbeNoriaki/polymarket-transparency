import type { MarketWashStats } from '../types'

interface WashScoreCardProps {
  market: MarketWashStats
}

export function WashScoreCard({ market }: WashScoreCardProps) {
  const getWashLevel = (percent: number) => {
    if (percent >= 50) return { label: 'CRITICAL', color: 'text-danger', bg: 'bg-danger/20' }
    if (percent >= 30) return { label: 'HIGH', color: 'text-warning', bg: 'bg-warning/20' }
    if (percent >= 15) return { label: 'MODERATE', color: 'text-yellow-500', bg: 'bg-yellow-500/20' }
    return { label: 'LOW', color: 'text-success', bg: 'bg-success/20' }
  }

  const level = getWashLevel(market.washPercent)

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`
    if (vol >= 1000) return `$${(vol / 1000).toFixed(0)}K`
    return `$${vol}`
  }

  return (
    <div className="bg-surface border border-border p-4 hover:border-text-muted/30 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-mono text-sm text-text-primary truncate mb-1">
            {market.title}
          </h3>
          <span className="font-mono text-xs text-text-muted uppercase">
            {market.category}
          </span>
        </div>
        <div className={`${level.bg} px-2 py-1 rounded`}>
          <span className={`font-mono text-xs font-semibold ${level.color}`}>
            {level.label}
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-3xl font-bold text-danger">
            {market.washPercent}%
          </div>
          <div className="font-mono text-xs text-text-muted">
            wash trading
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-sm text-text-primary">
            {formatVolume(market.totalVolume)}
          </div>
          <div className="font-mono text-xs text-text-muted">
            total volume
          </div>
        </div>
      </div>

      {/* Visual bar */}
      <div className="mt-3 h-2 bg-border rounded overflow-hidden">
        <div
          className="h-full bg-danger transition-all duration-500"
          style={{ width: `${market.washPercent}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between font-mono text-xs text-text-muted">
        <span>{market.suspiciousWallets} suspicious wallets</span>
        <span className="text-text-muted/50">{market.marketId}</span>
      </div>
    </div>
  )
}
