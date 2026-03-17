import type { MarketPosition } from '../types'

interface PnlHistogramProps {
  positions: MarketPosition[]
}

interface Bin {
  min: number
  max: number
  count: number
  label: string
  isPositive: boolean
}

function computeConcentration(positions: MarketPosition[]): {
  top1PctShare: number
  top10PctShare: number
  label: string
  severity: 'extreme' | 'high' | 'moderate' | 'normal'
} {
  const winners = positions
    .filter(p => p.totalPnl > 0)
    .sort((a, b) => b.totalPnl - a.totalPnl)

  if (winners.length === 0) {
    return { top1PctShare: 0, top10PctShare: 0, label: 'NO WINNERS', severity: 'normal' }
  }

  const totalWinPnl = winners.reduce((s, p) => s + p.totalPnl, 0)
  const top1Count = Math.max(1, Math.ceil(winners.length * 0.01))
  const top10Count = Math.max(1, Math.ceil(winners.length * 0.1))
  const top1Pnl = winners.slice(0, top1Count).reduce((s, p) => s + p.totalPnl, 0)
  const top10Pnl = winners.slice(0, top10Count).reduce((s, p) => s + p.totalPnl, 0)

  const top1PctShare = (top1Pnl / totalWinPnl) * 100
  const top10PctShare = (top10Pnl / totalWinPnl) * 100

  let label: string
  let severity: 'extreme' | 'high' | 'moderate' | 'normal'

  if (top1PctShare > 80) {
    label = 'EXTREME LONG-TAIL'
    severity = 'extreme'
  } else if (top1PctShare > 50 || top10PctShare > 90) {
    label = 'LONG-TAIL'
    severity = 'high'
  } else if (top10PctShare > 70) {
    label = 'MODERATELY SKEWED'
    severity = 'moderate'
  } else {
    label = 'RELATIVELY NORMAL'
    severity = 'normal'
  }

  return { top1PctShare, top10PctShare, label, severity }
}

function buildBins(positions: MarketPosition[]): Bin[] {
  if (positions.length === 0) return []

  const pnls = positions.map(p => p.totalPnl)
  const minPnl = Math.min(...pnls)
  const maxPnl = Math.max(...pnls)

  // Create logarithmic-ish bins
  const boundaries: number[] = []
  const negValues = [
    -1_000_000, -500_000, -100_000, -50_000, -10_000, -5_000, -1_000, -500, -100, -10,
  ].filter(v => v >= minPnl)
  const posValues = [
    0, 10, 100, 500, 1_000, 5_000, 10_000, 50_000, 100_000, 500_000, 1_000_000, 5_000_000,
  ].filter(v => v <= maxPnl + 1)

  boundaries.push(...negValues, ...posValues)
  boundaries.sort((a, b) => a - b)

  // Deduplicate
  const unique = [...new Set(boundaries)]

  const bins: Bin[] = []
  for (let i = 0; i < unique.length - 1; i++) {
    const bMin = unique[i]
    const bMax = unique[i + 1]
    const count = pnls.filter(p => p >= bMin && p < bMax).length
    if (count === 0) continue

    bins.push({
      min: bMin,
      max: bMax,
      count,
      label: formatBinLabel(bMin, bMax),
      isPositive: bMin >= 0,
    })
  }

  // Catch overflow (values >= last boundary)
  const lastBound = unique[unique.length - 1]
  const overflowCount = pnls.filter(p => p >= lastBound).length
  if (overflowCount > 0) {
    bins.push({
      min: lastBound,
      max: maxPnl + 1,
      count: overflowCount,
      label: `>${formatShort(lastBound)}`,
      isPositive: lastBound >= 0,
    })
  }

  return bins
}

function formatShort(n: number): string {
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(0)}M`
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}K`
  return `${sign}$${abs.toFixed(0)}`
}

function formatBinLabel(min: number, _max: number): string {
  return `${formatShort(min)}`
}

const SVG_WIDTH = 600
const SVG_HEIGHT = 180
const MARGIN = { top: 10, right: 10, bottom: 40, left: 10 }
const CHART_W = SVG_WIDTH - MARGIN.left - MARGIN.right
const CHART_H = SVG_HEIGHT - MARGIN.top - MARGIN.bottom

export function PnlHistogram({ positions }: PnlHistogramProps) {
  const bins = buildBins(positions)
  const concentration = computeConcentration(positions)

  if (bins.length === 0) return null

  const maxCount = Math.max(...bins.map(b => b.count))
  const barWidth = Math.max(4, CHART_W / bins.length - 2)
  const gap = 2

  const severityColor = {
    extreme: 'text-danger',
    high: 'text-warning',
    moderate: 'text-yellow-500',
    normal: 'text-success',
  }

  const severityBg = {
    extreme: 'bg-danger/10 border-danger/30',
    high: 'bg-warning/10 border-warning/30',
    moderate: 'bg-yellow-500/10 border-yellow-500/30',
    normal: 'bg-success/10 border-success/30',
  }

  return (
    <div className="mb-6">
      <div className="font-mono text-xs text-text-muted mb-3">P&L DISTRIBUTION SHAPE</div>

      {/* SVG Histogram */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full max-w-[600px]"
          style={{ minWidth: '300px' }}
        >
          {/* Bars */}
          {bins.map((bin, i) => {
            const barH = (bin.count / maxCount) * CHART_H
            const x = MARGIN.left + i * (barWidth + gap)
            const y = MARGIN.top + CHART_H - barH

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  fill={bin.isPositive ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)'}
                  rx={1}
                />
                {/* Count label on tall bars */}
                {barH > 20 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 3}
                    textAnchor="middle"
                    fill="#a0a0a0"
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {bin.count}
                  </text>
                )}
              </g>
            )
          })}

          {/* X-axis line */}
          <line
            x1={MARGIN.left}
            y1={MARGIN.top + CHART_H}
            x2={MARGIN.left + bins.length * (barWidth + gap)}
            y2={MARGIN.top + CHART_H}
            stroke="#2a2a2a"
            strokeWidth={1}
          />

          {/* X-axis labels (show every few) */}
          {bins.map((bin, i) => {
            const showLabel = i === 0 || i === bins.length - 1 ||
              (bins.length <= 10) ||
              (i % Math.ceil(bins.length / 6) === 0)
            if (!showLabel) return null

            const x = MARGIN.left + i * (barWidth + gap) + barWidth / 2

            return (
              <text
                key={`label-${i}`}
                x={x}
                y={MARGIN.top + CHART_H + 14}
                textAnchor="middle"
                fill="#a0a0a0"
                fontSize="8"
                fontFamily="JetBrains Mono, monospace"
                transform={`rotate(-30, ${x}, ${MARGIN.top + CHART_H + 14})`}
              >
                {bin.label}
              </text>
            )
          })}

          {/* Zero line marker */}
          {(() => {
            const zeroIdx = bins.findIndex(b => b.min >= 0)
            if (zeroIdx <= 0) return null
            const x = MARGIN.left + zeroIdx * (barWidth + gap) - gap / 2
            return (
              <line
                x1={x}
                y1={MARGIN.top}
                x2={x}
                y2={MARGIN.top + CHART_H}
                stroke="#f5f5f5"
                strokeWidth={1}
                strokeDasharray="3,3"
                opacity={0.3}
              />
            )
          })()}
        </svg>
      </div>

      {/* Concentration callout */}
      <div className={`mt-3 p-3 border ${severityBg[concentration.severity]}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-mono text-sm font-semibold ${severityColor[concentration.severity]}`}>
            {concentration.label}
          </span>
        </div>
        <div className="font-mono text-xs text-text-muted">
          Top 1% of winners captured {concentration.top1PctShare.toFixed(0)}% of all profits.
          {' '}Top 10% captured {concentration.top10PctShare.toFixed(0)}%.
          {concentration.severity === 'extreme' && (
            <span className="text-danger"> This market is dominated by a single whale.</span>
          )}
          {concentration.severity === 'high' && (
            <span className="text-warning"> A small group of traders took most of the profit.</span>
          )}
        </div>
      </div>
    </div>
  )
}
