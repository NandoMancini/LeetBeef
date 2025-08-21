import React from 'react'

interface LandingProps {
  onNavigateToLogin: () => void
}

const Landing: React.FC<LandingProps> = ({ onNavigateToLogin }) => {

  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="logo-text">
              <span className="leet">Leet</span>
              <span className="beef">Beef</span>
            </span>
          </div>
          
          <div className="nav-menu">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <button className="nav-signin" onClick={onNavigateToLogin}>Login</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="logo-section">
            <h1 className="main-title">
              <span className="leet">Leet</span>
              <span className="beef">Beef</span>
            </h1>
            <p className="tagline">Code. Compete. Conquer.</p>
          </div>
          
          <div className="hero-description">
            <p>Challenge your coding skills in real-time 1v1 battles</p>
            <p>Solve LeetCode problems head-to-head against other developers</p>
          </div>

          <div className="cta-buttons">
            <button className="btn btn-primary" onClick={onNavigateToLogin}>
              Start Coding Battle
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="code-battle-animation">
            <div className="code-window left">
              <div className="window-header">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
                <span className="title">Player 1</span>
              </div>
              <div className="code-content">
                <pre><code>{`function solve(nums) {
  // Your solution here
  return nums.reduce((a, b) => a + b, 0);
}`}</code></pre>
              </div>
            </div>
            
            <div className="vs-badge">VS</div>
            
            <div className="code-window right">
              <div className="window-header">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
                <span className="title">Player 2</span>
              </div>
              <div className="code-content">
                <pre><code>{`function solve(nums) {
  // Competing solution
  let sum = 0;
  for (let num of nums) {
    sum += num;
  }
  return sum;
}`}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Why Choose LeetBeef?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-time Battles</h3>
            <p>Code against opponents in live 1v1 matches with instant feedback</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>    
            <h3>LeetCode Problems</h3>
            <p>Battle with curated problems from easy to hard difficulty</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Instant Results</h3>
            <p>Get immediate feedback on your solution's correctness and performance</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Find a Match</h3>
            <p>Join the queue and get matched with a worthy opponent</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Choose Problem</h3>
            <p>Select from a variety of LeetCode problems</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Code & Compete</h3>
            <p>Write your solution while racing against time and opponent</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Claim Victory</h3>
            <p>Submit first with correct solution to win the battle</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 LeetBeef. Ready to prove your coding skills?</p>
      </footer>
    </>
  )
}

export default Landing
