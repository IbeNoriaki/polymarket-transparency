import { useState, useMemo } from 'react'
import type { MarketWashStats, Category } from '../types'

interface MarketTableProps {
  markets: MarketWashStats[]
}

type SortKey = 'washPercent' | 'totalVolume' | 'title'
type SortOrder = 'asc' | 'desc'

export function MarketTable({ markets }: MarketTableProps) {
  const [filter, setFilter] = useState<Category | 'All'>('All')
  const [sortKey, setSortKey] = useState<SortKey>('washPercent')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [search, setSearch] = useState('')

  const categories: (Category | 'All')[] = ['All', 'Sports', 'Election', 'Crypto', 'Politics', 'Other']

  const filteredAndSorted = useMemo(() => {
    let result = [...markets]

    // Filter by category
    if (filter !== 'All') {
      result = result.filter(m => m.category === filter)
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(m =>
        m.title.toLowerCase().includes(searchLower) ||
        m.marketId.toLowerCase().includes(searchLower)
      )
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      const modifier = sortOrder === 'asc' ? 1 : -1

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * modifier
      }
      return ((aVal as number) - (bVal as number)) * modifier
    })

    return result
  }, [markets, filter, sortKey, sortOrder, search])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('desc')
    }
  }

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`
    if (vol >= 1000) return `$${(vol / 1000).toFixed(0)}K`
    return `$${vol}`
  }

  const getWashBar = (percent: number) => {
    const bars = Math.round(percent / 10)
    return '█'.repeat(bars) + '░'.repeat(10 - bars)
  }

  return (
    <div className="font-mono">
      {/* Terminal header */}
      <div className="text-text-muted text-sm mb-4">
        $ polymarket-wash --list-markets
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-text-muted text-sm">[FILTER]</span>
          <div className="flex gap-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2 py-1 text-xs border transition-colors ${
                  filter === cat
                    ? 'border-danger text-danger bg-danger/10'
                    : 'border-border text-text-muted hover:border-text-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-text-muted text-sm">[SEARCH]</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="market name or id..."
            className="bg-surface border border-border px-2 py-1 text-xs text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-text-muted w-48"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Header separator */}
          <div className="text-border text-xs">
            {'─'.repeat(100)}
          </div>

          {/* Header */}
          <div className="grid grid-cols-12 gap-2 py-2 text-xs text-text-muted">
            <div className="col-span-1">ID</div>
            <div
              className="col-span-5 cursor-pointer hover:text-text-primary flex items-center gap-1"
              onClick={() => handleSort('title')}
            >
              MARKET
              {sortKey === 'title' && (sortOrder === 'asc' ? '▲' : '▼')}
            </div>
            <div
              className="col-span-3 cursor-pointer hover:text-text-primary flex items-center gap-1"
              onClick={() => handleSort('washPercent')}
            >
              WASH%
              {sortKey === 'washPercent' && (sortOrder === 'asc' ? '▲' : '▼')}
            </div>
            <div
              className="col-span-2 cursor-pointer hover:text-text-primary flex items-center gap-1"
              onClick={() => handleSort('totalVolume')}
            >
              VOLUME
              {sortKey === 'totalVolume' && (sortOrder === 'asc' ? '▲' : '▼')}
            </div>
            <div className="col-span-1">CAT</div>
          </div>

          {/* Header separator */}
          <div className="text-border text-xs">
            {'─'.repeat(100)}
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {filteredAndSorted.map((market) => (
              <div
                key={market.marketId}
                className="grid grid-cols-12 gap-2 py-2 text-sm hover:bg-surface/50 transition-colors"
              >
                <div className="col-span-1 text-text-muted text-xs truncate">
                  {market.marketId.slice(0, 8)}
                </div>
                <div className="col-span-5 text-text-primary truncate">
                  {market.title}
                </div>
                <div className="col-span-3 flex items-center gap-2">
                  <span className={`${market.washPercent >= 50 ? 'text-danger' : market.washPercent >= 30 ? 'text-warning' : 'text-text-muted'}`}>
                    {getWashBar(market.washPercent)}
                  </span>
                  <span className={`text-xs ${market.washPercent >= 50 ? 'text-danger' : market.washPercent >= 30 ? 'text-warning' : 'text-text-primary'}`}>
                    {market.washPercent}%
                  </span>
                </div>
                <div className="col-span-2 text-text-primary">
                  {formatVolume(market.totalVolume)}
                </div>
                <div className="col-span-1 text-text-muted text-xs uppercase">
                  {market.category.slice(0, 4)}
                </div>
              </div>
            ))}
          </div>

          {/* Footer separator */}
          <div className="text-border text-xs mt-2">
            {'─'.repeat(100)}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-text-muted text-xs">
        {'>'} Showing {filteredAndSorted.length} of {markets.length} markets
      </div>
    </div>
  )
}
