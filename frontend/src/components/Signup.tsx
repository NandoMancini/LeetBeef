import React from 'react'

interface SignupProps {
  onNavigateToLogin: () => void
  onNavigateToLanding: () => void
  onNavigateToHome: () => void
}

const Signup: React.FC<SignupProps> = ({ onNavigateToLogin, onNavigateToLanding, onNavigateToHome }) => {
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would handle actual signup logic
    // For now, just redirect to home
    onNavigateToHome()
  }

  return (
    <div className="auth-page">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={onNavigateToLanding}>
            <span className="logo-text">
              <span className="leet">Leet</span>
              <span className="beef">Beef</span>
            </span>
          </div>
        </div>
      </nav>
      
      <div className="auth-container">
        <div className="auth-card">
          <h2>Join leetBeef</h2>
          <p className="auth-subtitle">Start your competitive coding adventure today</p>
          
          <form className="auth-form" onSubmit={handleSignup}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" placeholder="Choose a username" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="signup-email">Email</label>
              <input type="email" id="signup-email" placeholder="Enter your email" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <input type="password" id="signup-password" placeholder="Create a password" required />
            </div>
            
            <button type="submit" className="auth-btn">Create Account</button>
          </form>
          
          <div className="auth-footer">
            <p>Already have an account? <button className="link-btn" onClick={onNavigateToLogin}>Login</button></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
