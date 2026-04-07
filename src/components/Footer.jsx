import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();
  const [isTriggering, setIsTriggering] = useState(false);

  const triggerSecret = () => {
    setIsTriggering(true);
    console.log("%c [SECRET] %c Initializing Boss Battle...", "color: red; font-weight: bold;", "color: white;");
    
    // Redirect after a small delay for the animation to play
    setTimeout(() => {
      navigate('/boss/ghost');
    }, 500);
  };

  return (
    <footer className="main-footer" style={{ 
      position: 'relative', 
      padding: '30px 20px', 
      textAlign: 'center',
      borderTop: '4px solid black', 
      fontFamily: 'Bangers, cursive',
    }}>
      <p style={{ margin: '5px 0', fontSize: '1.1rem', letterSpacing: '1px' }}>
        CONTACT: USER@EMAIL.COM
      </p>
      <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>
        © 2026 MANRIJAN M. BARBOSA. ALL RIGHTS RESERVED.
      </p>
      
      {/* Phantom Trigger Secret */}
      <div 
        id="phantom-trigger" 
        onClick={triggerSecret}
        style={{ 
          position: 'absolute', 
          bottom: '15px', 
          right: '20px', 
          cursor: 'help', 
          fontSize: '1.5rem', 
          opacity: isTriggering ? '0' : '0.1', 
          filter: isTriggering ? 'none' : 'grayscale(1)',
          transform: isTriggering ? 'scale(1.4)' : 'scale(1)',
          transition: 'all 0.4s ease'
        }}
      >
        👾
      </div>
    </footer>
  );
}

export default Footer;