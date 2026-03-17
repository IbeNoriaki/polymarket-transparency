import { Link } from 'react-router-dom'
import type { Trade } from '../types'

interface TradeHistoryProps {
  trades: Trade[]
  loading: boolean
}

function formatUsd(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (abs >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${n.toFixed(2)}`
}

function formatTime(ts: number): string {
  return new Date(ts * 1000).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function TradeHistory({ trades, loading }: TradeHistoryProps) {
  if (loading) {
    return (
      <div className="font-mono text-text-muted text-sm animate-pulse py-8 text-center">
        Loading trades...
      </div>
    )
  }

  if (trades.length === 0) {
    return (
      <div className="font-mono text-text-muted text-sm py-8 text-center">
        No trades found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        <div className="text-border text-xs font-mono">{'─'.repeat(90)}</div>

        <div className="grid grid-cols-12 gap-2 py-2 text-xs text-text-muted font-mono">
          <div className="col-span-1">SIDE</div>
          <div className="col-span-4">MARKET</div>
          <div className="col-span-2">OUTCOME</div>
          <div className="col-span-1 text-right">SIZE</div>
          <div className="col-span-1 text-right">PRICE</div>
          <div className="col-span-1 text-right">COST</div>
          <div className="col-span-2 text-right">TIME</div>
        </div>

        <div className="text-border text-xs font-mono">{'─'.repeat(90)}</div>

        <div className="divide-y divide-border">
          {trades.map((trade, i) => (
            <div
              key={`${trade.transactionHash}-${i}`}
              className="grid grid-cols-12 gap-2 py-2 text-sm font-mono hover:bg-surface/50 transition-colors"
            >
              <div className={`col-span-1 text-xs font-semibold ${
                trade.side === 'BUY' ? 'text-success' : 'text-danger'
              }`}>
                {trade.side}
              </div>
              <div className="col-span-4 truncate">
                <Link
                  to={`/market/${trade.conditionId}`}
                  className="text-text-primary hover:text-danger transition-colors"
                >
                  {trade.title}
                </Link>
              </div>
              <div className="col-span-2 text-text-muted text-xs">
                {trade.outcome}
              </div>
              <div className="col-span-1 text-right text-text-primary">
                {trade.size.toFixed(1)}
              </div>
              <div className="col-span-1 text-right text-text-muted">
                {trade.price.toFixed(2)}
              </div>
              <div className="col-span-1 text-right text-text-primary">
                {formatUsd(trade.size * trade.price)}
              </div>
              <div className="col-span-2 text-right text-text-muted text-xs">
                {formatTime(trade.timestamp)}
              </div>
            </div>
          ))}
        </div>

        <div className="text-border text-xs font-mono mt-2">{'─'.repeat(90)}</div>
      </div>
    </div>
  )
}
