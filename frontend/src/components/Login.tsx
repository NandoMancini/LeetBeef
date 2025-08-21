import React from 'react'

interface LoginProps {
  onNavigateToSignup: () => void
  onNavigateToLanding: () => void
  onNavigateToHome: () => void
}

const Login: React.FC<LoginProps> = ({ onNavigateToSignup, onNavigateToLanding, onNavigateToHome }) => {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would handle actual login logic
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
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Ready to continue your coding journey?</p>
          
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Enter your password" required />
            </div>
            
            <button type="submit" className="auth-btn">Login</button>
          </form>
          
          <div className="auth-footer">
            <p>Don't have an account? <button className="link-btn" onClick={onNavigateToSignup}>Sign up</button></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
