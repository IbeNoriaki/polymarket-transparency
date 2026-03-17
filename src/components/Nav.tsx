import { Link, useLocation } from 'react-router-dom'
import { WalletSearch } from './WalletSearch'

export function Nav() {
  const location = useLocation()

  const links = [
    { to: '/', label: 'OVERVIEW' },
    { to: '/leaderboard', label: 'LEADERBOARD' },
    { to: '/markets', label: 'MARKETS' },
  ]

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-mono text-sm text-danger font-semibold tracking-wider">
            PM<span className="text-text-muted">X</span>
          </Link>
          <div className="flex gap-1">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`font-mono text-xs px-3 py-2.5 transition-colors ${
                  location.pathname === to
                    ? 'text-danger border border-danger/30 bg-danger/10'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden md:block">
          <WalletSearch compact />
        </div>
      </div>
    </nav>
  )
}
