import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface WalletSearchProps {
  compact?: boolean
}

export function WalletSearch({ compact = false }: WalletSearchProps) {
  const [address, setAddress] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = address.trim()
    if (trimmed) {
      navigate(`/wallet/${trimmed}`)
      setAddress('')
    }
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x... wallet address"
          className="bg-surface border border-border px-2 py-2 text-xs text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-text-muted font-mono w-48"
        />
        <button
          type="submit"
          className="bg-danger/20 border border-danger/30 border-l-0 px-3 py-2 text-xs text-danger font-mono hover:bg-danger/30 transition-colors"
        >
          SCAN
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="font-mono text-xs text-text-muted mb-2">
        $ polymarket-scan --wallet
      </div>
      <div className="flex">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter wallet address (0x...)"
          className="flex-1 bg-surface border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-danger font-mono"
        />
        <button
          type="submit"
          className="bg-danger text-white px-6 py-3 text-sm font-mono uppercase tracking-wider hover:bg-danger/80 transition-colors"
        >
          SCAN WALLET
        </button>
      </div>
    </form>
  )
}
