import { Link } from 'react-router-dom'
import { Nav } from '../components/Nav'
import { StatsHero } from '../components/StatsHero'
import { WashScoreCard } from '../components/WashScoreCard'
import { WalletSearch } from '../components/WalletSearch'
import washStats from '../data/wash-stats.json'
import type { OverallStats } from '../types'

export default function Home() {
  const stats = washStats as OverallStats

  return (
    <div className="min-h-screen">
      <Nav />

      {/* Hero Section */}
      <StatsHero stats={stats} />

      {/* Wallet Search CTA */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-surface border border-border p-8 text-center">
          <h2 className="font-mono text-xl text-text-primary mb-2">
            SCAN ANY WALLET
          </h2>
          <p className="text-text-muted text-sm mb-6">
            Enter a Polymarket wallet address to see their real P&L, trade history, and
            whether they&apos;re a winner or loser.
          </p>
          <WalletSearch />
        </div>
      </section>

      {/* Navigation cards */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/leaderboard"
            className="bg-surface border border-border p-6 hover:border-success/50 transition-colors group"
          >
            <div className="font-mono text-lg text-text-primary mb-2 group-hover:text-success transition-colors">
              LEADERBOARD
            </div>
            <p className="text-text-muted text-sm">
              Top 50 traders by profit. See who&apos;s really winning — and ask whether
              it&apos;s skill or manipulation.
            </p>
            <div className="font-mono text-xs text-success mt-4">
              → View rankings
            </div>
          </Link>
          <Link
            to="/markets"
            className="bg-surface border border-border p-6 hover:border-danger/50 transition-colors group"
          >
            <div className="font-mono text-lg text-text-primary mb-2 group-hover:text-danger transition-colors">
              MARKET ANALYSIS
            </div>
            <p className="text-text-muted text-sm">
              Browse markets by wash trading percentage. See which markets have
              the most suspicious activity.
            </p>
            <div className="font-mono text-xs text-danger mt-4">
              → Browse markets
            </div>
          </Link>
        </div>
      </section>

      {/* Top Wash Markets */}
      <section className="max-w-6xl mx-auto px-4 py-12 border-t border-border">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-mono text-lg text-text-primary tracking-wider">
            TOP SUSPICIOUS MARKETS
          </h2>
          <Link
            to="/markets"
            className="font-mono text-sm text-danger border border-danger px-4 py-2 hover:bg-danger/10 transition-colors uppercase tracking-wider"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.topWashMarkets.slice(0, 6).map((market) => (
            <WashScoreCard key={market.marketId} market={market} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-text-muted font-mono text-xs">
            <div>
              Data sources: Columbia University Research (Nov 2024), Polymarket Data API
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
