import React, { useState } from 'react'

interface LobbyProps {
  onNavigateToLanding: () => void
  onNavigateToHome: () => void
  onStartMatch: () => void
}

interface LobbyMember {
  id: string
  username: string
  isHost: boolean
  isReady: boolean
  rating: number
  avatar?: string
}

const Lobby: React.FC<LobbyProps> = ({ onNavigateToLanding, onNavigateToHome, onStartMatch }) => {
  const [lobbyCode] = useState('ABC123')
  const [lobbyMembers, setLobbyMembers] = useState<LobbyMember[]>([
    {
      id: '1',
      username: 'Coder123',
      isHost: true,
      isReady: false,
      rating: 1250
    },
    {
      id: '2',
      username: 'AlgoWizard',
      isHost: false,
      isReady: true,
      rating: 1180
    }
  ])
  const [countdown, setCountdown] = useState<number | null>(null)
  const [isHost] = useState(true)
  const [problemDifficulty] = useState('Medium')
  const [timeLimit] = useState(30)

  const handleReadyToggle = () => {
    setLobbyMembers(prev => 
      prev.map(member => 
        member.id === '1' 
          ? { ...member, isReady: !member.isReady }
          : member
      )
    )
  }

  const handleStartMatch = () => {
    if (lobbyMembers.every(member => member.isReady)) {
      // Start countdown when Start Match is clicked
      setCountdown(3)
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timer)
            onStartMatch()
            return null
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  const handleLeaveLobby = () => {
    onNavigateToHome()
  }

  const copyLobbyCode = () => {
    navigator.clipboard.writeText(lobbyCode)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#27ca3f'
      case 'Medium': return '#ffbd2e'
      case 'Hard': return '#ff6b6b'
      default: return '#a8b2d1'
    }
  }

  return (
    <div className="lobby-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={onNavigateToLanding}>
            <span className="logo-text">
              <span className="leet">Leet</span>
              <span className="beef">Beef</span>
            </span>
          </div>
          
          <div className="nav-menu">
            <button className="nav-signin" onClick={handleLeaveLobby}>Leave Lobby</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="lobby-container">
        {/* Lobby Header */}
        <div className="lobby-header">
          <div className="lobby-info">
            <h1>Lobby: {lobbyCode}</h1>
            <p>Waiting for players to get ready...</p>
          </div>
          <div className="lobby-code-display">
            <span>Share Code:</span>
            <div className="code-box">
              <span className="code-text">{lobbyCode}</span>
              <button className="copy-btn" onClick={copyLobbyCode}>
                📋
              </button>
            </div>
          </div>
        </div>

        {/* Countdown Overlay */}
        {countdown !== null && (
          <div className="countdown-overlay">
            <div className="countdown-content">
              <h2>Match Starting In...</h2>
              <div className="countdown-number">{countdown}</div>
              <p>Get ready to code!</p>
            </div>
          </div>
        )}

        {/* Lobby Content */}
        <div className="lobby-content">
          {/* Players Section */}
          <div className="players-section">
            <h2>Players ({lobbyMembers.length}/2)</h2>
            <div className="players-grid">
              {lobbyMembers.map((member) => (
                <div key={member.id} className={`player-card ${member.isHost ? 'host' : ''} ${member.isReady ? 'ready' : ''}`}>
                  <div className="player-avatar">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.username} />
                    ) : (
                      <span className="avatar-placeholder">
                        {member.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                    {member.isHost && <span className="host-badge">👑</span>}
                  </div>
                  <div className="player-info">
                    <h3 className="player-username">{member.username}</h3>
                    <div className="player-rating">Rating: {member.rating}</div>
                    <div className="player-status">
                      {member.isReady ? (
                        <span className="status ready">✅ Ready</span>
                      ) : (
                        <span className="status not-ready">⏳ Not Ready</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Match Settings */}
          <div className="match-settings">
            <h2>Match Settings</h2>
            <div className="settings-grid">
              <div className="setting-item">
                <label>Difficulty:</label>
                <div className="setting-value">
                  <span 
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(problemDifficulty) }}
                  >
                    {problemDifficulty}
                  </span>
                </div>
              </div>
              <div className="setting-item">
                <label>Time Limit:</label>
                <div className="setting-value">{timeLimit} minutes</div>
              </div>
            </div>
          </div>

          {/* Ready Controls */}
          <div className="ready-controls">
            <div className="ready-toggle">
              <label className="ready-checkbox">
                <input
                  type="checkbox"
                  checked={lobbyMembers.find(m => m.id === '1')?.isReady || false}
                  onChange={handleReadyToggle}
                />
                <span className="checkmark"></span>
                I'm Ready
              </label>
            </div>
            
            {isHost && (
              <button 
                className="start-match-btn"
                onClick={handleStartMatch}
                disabled={!lobbyMembers.every(member => member.isReady)}
              >
                Start Match
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Lobby
