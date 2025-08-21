import React, { useState } from 'react'

interface HomeProps {
  onNavigateToLanding: () => void
  onNavigateToLobby: () => void
}

const Home: React.FC<HomeProps> = ({ onNavigateToLanding, onNavigateToLobby }) => {
  const [username] = useState('Coder123') // This would come from auth context
  const [isCreatingLobby, setIsCreatingLobby] = useState(false)
  const [lobbyCode, setLobbyCode] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium')

  const handleCreateLobby = () => {
    setIsCreatingLobby(true)
    // Here you would make an API call to create a lobby
    // For now, we'll just show the UI
  }

  const handleJoinLobby = () => {
    if (lobbyCode.trim()) {
      // Here you would make an API call to join the lobby
      console.log('Joining lobby:', lobbyCode)
      onNavigateToLobby()
    }
  }

  const handleLogout = () => {
    // Here you would handle logout logic
    onNavigateToLanding()
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
    <div className="home-page">
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
            <span className="welcome-text">Welcome, {username}!</span>
            <button className="nav-signin" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="home-container">
        <div className="home-header">
          <h1>Ready to Code?</h1>
          <p>Choose your battle strategy</p>
        </div>

        <div className="lobby-options">
          {/* Create Lobby Section */}
          <div className="lobby-card create-lobby">
            <div className="lobby-icon">🏗️</div>
            <h2>Create a Lobby</h2>
            <p>Start a new coding battle and invite others to join</p>
            
            {!isCreatingLobby ? (
              <div className="create-lobby-form">
                <div className="difficulty-selector">
                  <label>Select Difficulty:</label>
                  <div className="difficulty-options">
                    {['Easy', 'Medium', 'Hard'].map((difficulty) => (
                      <button
                        key={difficulty}
                        className={`difficulty-option ${selectedDifficulty === difficulty ? 'selected' : ''}`}
                        onClick={() => setSelectedDifficulty(difficulty)}
                        style={{
                          backgroundColor: selectedDifficulty === difficulty ? getDifficultyColor(difficulty) : 'transparent',
                          borderColor: getDifficultyColor(difficulty)
                        }}
                      >
                        {difficulty}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="lobby-btn primary" onClick={handleCreateLobby}>
                  Create Lobby
                </button>
              </div>
            ) : (
              <div className="lobby-creation">
                <div className="lobby-info">
                  <h3>Lobby Created!</h3>
                  <div className="lobby-details">
                    <div className="lobby-detail">
                      <span>Difficulty:</span>
                      <span 
                        className="difficulty-badge"
                        style={{ backgroundColor: getDifficultyColor(selectedDifficulty) }}
                      >
                        {selectedDifficulty}
                      </span>
                    </div>
                  </div>
                  <div className="lobby-code">
                    <span>Share this code:</span>
                    <div className="code-display">
                      <span className="code-text">ABC123</span>
                      <button className="copy-btn" onClick={() => navigator.clipboard.writeText('ABC123')}>
                        📋
                      </button>
                    </div>
                  </div>
                  <p className="waiting-text">Waiting for opponent to join...</p>
                </div>
                <button className="lobby-btn secondary" onClick={() => setIsCreatingLobby(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Join Lobby Section */}
          <div className="lobby-card join-lobby">
            <div className="lobby-icon">🚪</div>
            <h2>Join a Lobby</h2>
            <p>Enter a lobby code to join an existing battle</p>
            
            <div className="join-form">
              <input
                type="text"
                placeholder="Enter lobby code"
                value={lobbyCode}
                onChange={(e) => setLobbyCode(e.target.value.toUpperCase())}
                className="lobby-input"
                maxLength={6}
              />
              <button 
                className="lobby-btn primary" 
                onClick={handleJoinLobby}
                disabled={!lobbyCode.trim()}
              >
                Join Lobby
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-section">
          <h2>Your Stats</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">12</div>
              <div className="stat-label">Battles Won</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">8</div>
              <div className="stat-label">Battles Lost</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">60%</div>
              <div className="stat-label">Win Rate</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h2>Recent Battles</h2>
          <div className="activity-list">
            <div className="activity-item win">
              <div className="activity-icon">✅</div>
              <div className="activity-details">
                <span className="activity-result">Victory</span>
                <span className="activity-opponent">vs. CodeMaster99</span>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            <div className="activity-item loss">
              <div className="activity-icon">❌</div>
              <div className="activity-details">
                <span className="activity-result">Defeat</span>
                <span className="activity-opponent">vs. AlgoWizard</span>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
            <div className="activity-item win">
              <div className="activity-icon">✅</div>
              <div className="activity-details">
                <span className="activity-result">Victory</span>
                <span className="activity-opponent">vs. DataStruct</span>
                <span className="activity-time">3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
