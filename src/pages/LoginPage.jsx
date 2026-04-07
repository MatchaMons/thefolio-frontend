import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    console.log("🚀 ATTEMPTING LOGIN WITH:", email);

    try {
      // Ensure we are passing both values to the context function
      await login(email, password);
      console.log("✅ LOGIN SUCCESSFUL - REDIRECTING...");
      navigate('/home'); 
    } catch (err) {
      console.error("❌ LOGIN ERROR:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Invalid Credentials');
    }
  };

  return (
    <div className="login-page">
      <div className="comic-box">
        <div className="comic-badge">LOG IN!</div>
        
        <h2 className="panel-title">PLAYER ACCESS</h2>
        
        {error && <div className="error-bubble" style={{ backgroundColor: '#ff4d4d', color: 'white', padding: '10px', marginBottom: '15px', border: '3px solid black', fontWeight: 'bold' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>PLAYER IDENTITY (EMAIL)</label>
            <input 
                type="text" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter email..."
                required 
            />
          </div>

          <div className="input-group">
            <label>PASSWORD</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>

          <button type="submit" className="action-button">
            START GAME
          </button>
        </form>

        <p className="footer-text">
          NEW PLAYER? <Link to="/register">CREATE ACCOUNT</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;