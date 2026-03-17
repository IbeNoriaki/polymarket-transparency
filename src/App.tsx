import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Markets from './pages/Markets'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/markets" element={<Markets />} />
      </Routes>
    </div>
  )
}

export default App
