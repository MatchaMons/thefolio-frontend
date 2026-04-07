import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

function Navbar() {
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user } = useAuth(); // Removed logout from destructuring since we don't use it here
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <header>
      <h1>Gaming</h1>
      <nav>
        <button 
          id="theme-toggle" 
          className="comic-button-label" 
          onClick={() => setIsDark(!isDark)}
          style={{ padding: '5px 10px', marginLeft: '10px', cursor: 'pointer' }}
        >
          {isDark ? "☀️ Day Mode" : "🌙 Night Mode"}
        </button>

        <button 
          id="menu-btn" 
          className="comic-button-label mobile-only"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? "✖ CLOSE" : "☰ MENU"}
        </button>

        <ul id="nav-menu" className={isMenuOpen ? "active" : ""}>
          <li>
            <NavLink to="/home" className={({ isActive }) => isActive ? "active" : ""}>
              Home
            </NavLink>
          </li>
          
          {/* THE GUILD BOARD LINK */}
          <li>
            <NavLink to="/feed" className={({ isActive }) => isActive ? "active" : ""}>
              Guild Board
            </NavLink>
          </li>

          <li>
            <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>
              Contact
            </NavLink>
          </li>

          {user ? (
              <>
                <li>
                  <NavLink to="/quest" className={({ isActive }) => isActive ? "active" : ""}>
                    Quests
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/profile" 
                    className="profile-btn"
                    style={({ isActive }) => ({
                      background: isActive ? '#ffcc00' : '#41e02c', 
                      padding: '5px 15px',
                      borderRadius: '4px',
                      color: 'white',
                      fontWeight: 'bold',
                      textDecoration: 'none'
                    })}
                  >
                    PROFILE
                  </NavLink>
                </li>
              </>
            ) : (
            <>
              <li>
                <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className={({ isActive }) => isActive ? "active" : ""}>
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;