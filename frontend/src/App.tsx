import { useState } from 'react'
import Landing from './components/Landing'
import Login from './components/Login'
import Signup from './components/Signup'
import Home from './components/Home'
import Lobby from './components/Lobby'
import MatchRoom from './components/MatchRoom'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')

  const handleNavigateToLogin = () => setCurrentPage('login')
  const handleNavigateToSignup = () => setCurrentPage('signup')
  const handleNavigateToLanding = () => setCurrentPage('landing')
  const handleNavigateToHome = () => setCurrentPage('home')
  const handleNavigateToLobby = () => setCurrentPage('lobby')
  const handleStartMatch = () => setCurrentPage('match')
  const handleMatchEnd = (result: 'win' | 'loss' | 'forfeit') => {
    console.log('Match ended with result:', result)
    // Here you would handle match results, update stats, etc.
    setCurrentPage('home')
  }

  // Render the appropriate page based on currentPage state
  if (currentPage === 'login') {
    return <Login onNavigateToSignup={handleNavigateToSignup} onNavigateToLanding={handleNavigateToLanding} onNavigateToHome={handleNavigateToHome} />
  } else if (currentPage === 'signup') {
    return <Signup onNavigateToLogin={handleNavigateToLogin} onNavigateToLanding={handleNavigateToLanding} onNavigateToHome={handleNavigateToHome} />
  } else if (currentPage === 'home') {
    return <Home onNavigateToLanding={handleNavigateToLanding} onNavigateToLobby={handleNavigateToLobby} />
  } else if (currentPage === 'lobby') {
    return <Lobby onNavigateToLanding={handleNavigateToLanding} onNavigateToHome={handleNavigateToHome} onStartMatch={handleStartMatch} />
  } else if (currentPage === 'match') {
    return <MatchRoom onNavigateToLanding={handleNavigateToLanding} onMatchEnd={handleMatchEnd} />
  } else {
    return <Landing onNavigateToLogin={handleNavigateToLogin} />
  }
}

export default App
