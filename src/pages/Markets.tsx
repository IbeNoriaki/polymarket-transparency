import { MarketTable } from '../components/MarketTable'
import { Nav } from '../components/Nav'
import washStats from '../data/wash-stats.json'
import type { OverallStats } from '../types'

export default function Markets() {
  const stats = washStats as OverallStats

  return (
    <div className="min-h-screen">
      <Nav />

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-mono text-2xl text-text-primary mb-2">
            MARKET WASH TRADING ANALYSIS
          </h1>
          <p className="text-text-muted text-sm">
            Browse all analyzed markets. Click column headers to sort.
            Filter by category or search for specific markets.
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface border border-border p-4">
            <div className="font-mono text-2xl text-danger">{stats.avgWashPercent}%</div>
            <div className="font-mono text-xs text-text-muted">AVG WASH RATE</div>
          </div>
          <div className="bg-surface border border-border p-4">
            <div className="font-mono text-2xl text-text-primary">{stats.totalMarkets}</div>
            <div className="font-mono text-xs text-text-muted">TOTAL MARKETS</div>
          </div>
          <div className="bg-surface border border-border p-4">
            <div className="font-mono text-2xl text-text-primary">
              ${(stats.totalVolume / 1000000000).toFixed(2)}B
            </div>
            <div className="font-mono text-xs text-text-muted">TOTAL VOLUME</div>
          </div>
          <div className="bg-surface border border-border p-4">
            <div className="font-mono text-2xl text-warning">
              ${(stats.totalWashVolume / 1000000000).toFixed(2)}B
            </div>
            <div className="font-mono text-xs text-text-muted">WASH VOLUME</div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface border border-border p-4">
          <MarketTable markets={stats.topWashMarkets} />
        </div>

        {/* Note */}
        <div className="mt-8 p-4 border border-border bg-surface/50">
          <div className="font-mono text-xs text-text-muted">
            <span className="text-warning">NOTE:</span> This data represents a sample of analyzed markets.
            Wash trading detection is based on clustering algorithms identifying self-dealing patterns.
            For full methodology, see the{' '}
            <a
              href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5035153"
              target="_blank"
              rel="noopener noreferrer"
              className="text-danger hover:underline"
            >
              Columbia University research paper
            </a>.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center font-mono text-xs text-text-muted">
          Updated: {new Date(stats.updatedAt).toLocaleString()} | Source: {stats.source}
        </div>
      </footer>
    </div>
  )
}
