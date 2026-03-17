import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Markets from './pages/Markets'
import Leaderboard from './pages/Leaderboard'
import Wallet from './pages/Wallet'
import MarketDetail from './pages/MarketDetail'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/wallet/:address" element={<Wallet />} />
        <Route path="/market/:conditionId" element={<MarketDetail />} />
      </Routes>
    </div>
  )
}

export default App
