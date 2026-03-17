import { Link } from 'react-router-dom'
import type { LeaderboardEntry } from '../types'

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
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

export function LeaderboardTable({ entries, loading }: LeaderboardTableProps) {
  if (loading) {
    return (
      <div className="font-mono text-text-muted text-sm animate-pulse py-8 text-center">
        Loading leaderboard data...
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="font-mono text-text-muted text-sm py-8 text-center">
        No data available.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="text-border text-xs font-mono">{'─'.repeat(80)}</div>

        <div className="grid grid-cols-12 gap-2 py-2 text-xs text-text-muted font-mono">
          <div className="col-span-1">#</div>
          <div className="col-span-3">TRADER</div>
          <div className="col-span-3">WALLET</div>
          <div className="col-span-3 text-right">P&L</div>
          <div className="col-span-2 text-right">VOLUME</div>
        </div>

        <div className="text-border text-xs font-mono">{'─'.repeat(80)}</div>

        <div className="divide-y divide-border">
          {entries.map((entry) => (
            <Link
              key={entry.proxyWallet}
              to={`/wallet/${entry.proxyWallet}`}
              className="grid grid-cols-12 gap-2 py-2.5 text-sm font-mono hover:bg-surface/50 transition-colors block"
            >
              <div className="col-span-1 text-text-muted">
                {entry.rank}
              </div>
              <div className="col-span-3 text-text-primary truncate">
                {entry.userName || 'Anonymous'}
                {entry.verifiedBadge && (
                  <span className="text-blue-400 ml-1 text-xs">✓</span>
                )}
              </div>
              <div className="col-span-3 text-text-muted text-xs">
                {shortenAddress(entry.proxyWallet)}
              </div>
              <div className={`col-span-3 text-right font-semibold ${
                entry.pnl >= 0 ? 'text-success' : 'text-danger'
              }`}>
                {entry.pnl >= 0 ? '+' : ''}{formatUsd(entry.pnl)}
              </div>
              <div className="col-span-2 text-right text-text-muted">
                {formatUsd(entry.vol)}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-border text-xs font-mono mt-2">{'─'.repeat(80)}</div>
      </div>
    </div>
  )
}
