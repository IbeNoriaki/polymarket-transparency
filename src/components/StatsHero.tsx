import type { OverallStats } from '../types'

interface StatsHeroProps {
  stats: OverallStats
}

export function StatsHero({ stats }: StatsHeroProps) {
  return (
    <section className="relative py-16 px-4 overflow-hidden">
      {/* Warning banner */}
      <div className="pulse-warning bg-danger/10 border border-danger/30 py-3 mb-12">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 font-mono text-sm tracking-wider">
          <span className="text-danger">⚠️</span>
          <span className="text-danger font-semibold">POLYMARKET EXPOSED</span>
          <span className="text-danger">⚠️</span>
        </div>
      </div>

      {/* Main stat */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="glitch mb-6">
          <span className="font-mono text-[120px] md:text-[180px] font-bold text-danger leading-none">
            {stats.avgWashPercent}%
          </span>
        </div>
        <h1 className="font-mono text-2xl md:text-4xl font-semibold text-text-primary mb-4 tracking-wide">
          FAKE TRADING VOLUME
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">
          Columbia University research reveals that approximately 25% of all Polymarket
          trading volume is wash trading — self-dealing to inflate activity metrics.
        </p>
      </div>

      {/* Volume bar */}
      <div className="max-w-3xl mx-auto mb-16">
        <div className="h-8 bg-surface border border-border rounded overflow-hidden flex">
          <div
            className="bg-danger h-full transition-all duration-1000"
            style={{ width: `${stats.avgWashPercent}%` }}
          />
          <div
            className="bg-success/30 h-full transition-all duration-1000"
            style={{ width: `${100 - stats.avgWashPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 font-mono text-sm">
          <span className="text-danger">▲ Wash Trading ({stats.avgWashPercent}%)</span>
          <span className="text-success">▲ Legitimate ({100 - stats.avgWashPercent}%)</span>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="font-mono text-sm text-text-muted mb-4 tracking-widest">
          WASH TRADING BY CATEGORY
        </h2>
        <div className="space-y-3">
          {stats.categoryBreakdown
            .sort((a, b) => b.washPercent - a.washPercent)
            .map((cat) => (
              <div key={cat.category} className="flex items-center gap-4">
                <span className="font-mono text-sm text-text-muted w-24 uppercase">
                  {cat.category}
                </span>
                <div className="flex-1 h-6 bg-surface border border-border rounded overflow-hidden">
                  <div
                    className="h-full bg-danger/80 transition-all duration-700"
                    style={{ width: `${cat.washPercent}%` }}
                  />
                </div>
                <span className="font-mono text-sm text-danger w-12 text-right">
                  {cat.washPercent}%
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Source attribution */}
      <div className="text-center">
        <p className="font-mono text-xs text-text-muted">
          Source: {stats.source}
        </p>
      </div>
    </section>
  )
}
