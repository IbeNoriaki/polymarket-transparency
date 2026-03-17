import { Link } from 'react-router-dom'
import { StatsHero } from '../components/StatsHero'
import { WashScoreCard } from '../components/WashScoreCard'
import washStats from '../data/wash-stats.json'
import type { OverallStats } from '../types'

export default function Home() {
  const stats = washStats as OverallStats

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <StatsHero stats={stats} />

      {/* Top Wash Markets */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-mono text-lg text-text-primary tracking-wider">
            TOP SUSPICIOUS MARKETS
          </h2>
          <Link
            to="/markets"
            className="font-mono text-sm text-danger border border-danger px-4 py-2 hover:bg-danger/10 transition-colors uppercase tracking-wider"
          >
            View All Markets →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.topWashMarkets.slice(0, 6).map((market) => (
            <WashScoreCard key={market.marketId} market={market} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-16">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="font-mono text-2xl text-text-primary mb-4">
            EXPLORE THE DATA
          </h2>
          <p className="text-text-muted mb-8">
            Dive into the full dataset. Filter by category, sort by wash trading
            percentage, and discover which markets have the most suspicious activity.
          </p>
          <Link
            to="/markets"
            className="inline-block font-mono text-sm bg-danger text-white px-8 py-3 hover:bg-danger/80 transition-colors uppercase tracking-widest"
          >
            [ EXPLORE MARKETS ]
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-text-muted font-mono text-xs">
            <div>
              Data sources: Columbia University Research (Nov 2024), Dune Analytics
            </div>
            <div className="flex gap-4">
              <a
                href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5035153"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-text-primary transition-colors"
              >
                [Research Paper]
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-text-primary transition-colors"
              >
                [GitHub]
              </a>
            </div>
          </div>
          <div className="mt-4 text-center text-text-muted/50 font-mono text-xs">
            Last updated: {new Date(stats.updatedAt).toLocaleString()}
          </div>
        </div>
      </footer>
    </div>
  )
}
