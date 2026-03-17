import { useState, useEffect, useCallback } from 'react'
import { Nav } from '../components/Nav'
import { LeaderboardTable } from '../components/LeaderboardTable'
import { fetchLeaderboard } from '../api/polymarket'
import type { LeaderboardEntry, LeaderboardCategory, TimePeriod } from '../types'

const CATEGORIES: { value: LeaderboardCategory; label: string }[] = [
  { value: 'OVERALL', label: 'All' },
  { value: 'SPORTS', label: 'Sports' },
  { value: 'POLITICS', label: 'Politics' },
  { value: 'CRYPTO', label: 'Crypto' },
  { value: 'CULTURE', label: 'Culture' },
  { value: 'ECONOMICS', label: 'Econ' },
]

const TIME_PERIODS: { value: TimePeriod; label: string }[] = [
  { value: 'DAY', label: '24h' },
  { value: 'WEEK', label: '7d' },
  { value: 'MONTH', label: '30d' },
  { value: 'ALL', label: 'All Time' },
]

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState<LeaderboardCategory>('OVERALL')
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('ALL')
  const [orderBy, setOrderBy] = useState<'PNL' | 'VOL'>('PNL')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchLeaderboard(category, timePeriod, orderBy, 50)
      setEntries(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [category, timePeriod, orderBy])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <div className="min-h-screen">
      <Nav />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-mono text-2xl text-text-primary mb-2">
            TRADER LEADERBOARD
          </h1>
          <p className="text-text-muted text-sm">
            Who&apos;s really winning on Polymarket? See the top traders by profit —
            and ask yourself: is it skill, or is it wash trading?
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-text-muted">[CATEGORY]</span>
            <div className="flex gap-1">
              {CATEGORIES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setCategory(value)}
                  className={`px-2 py-1 text-xs font-mono border transition-colors ${
                    category === value
                      ? 'border-danger text-danger bg-danger/10'
                      : 'border-border text-text-muted hover:border-text-muted'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-text-muted">[PERIOD]</span>
            <div className="flex gap-1">
              {TIME_PERIODS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setTimePeriod(value)}
                  className={`px-2 py-1 text-xs font-mono border transition-colors ${
                    timePeriod === value
                      ? 'border-danger text-danger bg-danger/10'
                      : 'border-border text-text-muted hover:border-text-muted'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-text-muted">[SORT]</span>
            <div className="flex gap-1">
              {(['PNL', 'VOL'] as const).map((val) => (
                <button
                  key={val}
                  onClick={() => setOrderBy(val)}
                  className={`px-2 py-1 text-xs font-mono border transition-colors ${
                    orderBy === val
                      ? 'border-danger text-danger bg-danger/10'
                      : 'border-border text-text-muted hover:border-text-muted'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-danger/10 border border-danger/30 p-4 mb-6 font-mono text-sm text-danger">
            ERROR: {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-surface border border-border p-4">
          <div className="font-mono text-xs text-text-muted mb-4">
            $ polymarket-scan --leaderboard --category={category.toLowerCase()} --period={timePeriod.toLowerCase()}
          </div>
          <LeaderboardTable entries={entries} loading={loading} />
          <div className="mt-4 font-mono text-xs text-text-muted">
            {'>'} Showing {entries.length} traders | Source: Polymarket Data API
          </div>
        </div>
      </main>
    </div>
  )
}
