import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({ title: '', message: '' });

    useEffect(() => {
        // --- 1. RPG WELCOME ALERT LOGIC ---
        const savedTag = localStorage.getItem('playerTag');
        const hasBeenGreeted = sessionStorage.getItem('hasBeenGreeted');
        const alertBox = document.getElementById('rpg-alert');
        const alertText = document.getElementById('alert-text');

        if (savedTag && !hasBeenGreeted && alertBox && alertText) {
            alertText.innerHTML = `WELCOME BACK, <span style="color: #ffde59;">${savedTag.toUpperCase()}!</span>`;
            alertBox.style.display = 'block';
            sessionStorage.setItem('hasBeenGreeted', 'true');

            setTimeout(() => {
                alertBox.style.animation = 'slideOut 0.5s forwards';
                setTimeout(() => { alertBox.style.display = 'none'; }, 500);
            }, 2500);
        }

        // --- 2. CONSOLE HACKER SECRET ---
        window.startBattle = () => {
          console.log("%c INTERCEPTING SIGNAL...", "color: lime; font-weight: bold;");
          setModalData({ title: "SYSTEM BREACH!", message: "Hacker detected. Entering the Matrix..." });
          setShowModal(true);
          
          setTimeout(() => {
              setShowModal(false);
              // Match path="/boss/hacker"
              navigate('/boss/hacker'); 
          }, 2000); 
    return "Connection established. Good luck, Operator.";
         };

        // --- 3. KONAMI CODE LISTENER ---
        const sequence = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
        let userKeys = [];

        const handleKeyDown = (e) => {
            userKeys.push(e.key.toLowerCase());
            userKeys = userKeys.slice(-sequence.length);
            if (userKeys.join('') === sequence.join('')) {
            triggerSecret('/boss/code'); 
            userKeys = []; 
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            delete window.startBattle; // Clean up the console command when leaving home
        };
    }, [navigate]);

    const triggerSecret = (targetUrl) => {
        setModalData({ title: "HIDDEN LEVEL UNLOCKED!", message: "Initializing Boss Battle..." });
        setShowModal(true);
        setTimeout(() => {
            setShowModal(false);
            navigate(targetUrl);
        }, 2000);
    };

    return (
        <main className="comic-page">
            {/* System Message Alert (Unique to Home) */}
            <div id="rpg-alert" className="panel" style={{ display: 'none', position: 'fixed', top: '20px', right: '20px', zIndex: 1000, minWidth: '250px', border: '3px solid #ffde59', background: 'rgba(0,0,0,0.9)', color: 'white', padding: '15px', boxShadow: '5px 5px 0px #ffde59' }}>
                <div className="system-text" style={{ fontSize: '0.8rem', color: '#ffde59', marginBottom: '5px' }}>SYSTEM MESSAGE:</div>
                <div id="alert-text" style={{ fontFamily: "'Bangers'", fontSize: '1.2rem' }}>WELCOME BACK, PLAYER!</div>
            </div>

            {/* Top Row: Hero & Why I Love Gaming */}
            <div className="comic-row" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <section className="hero panel panel-two-third" style={{ flex: '2', margin: 0 }}>
                    <div>
                        <h2>Exploring the World Of Gaming</h2>
                        <p>Gaming is more than just entertainment — it builds strategy, teamwork, problem-solving, and creativity. 
                          This portfolio showcases my passion for gaming, the skills I've developed, and the experiences that shaped my interest in the gaming world.</p>
                    </div>
                    <img src={setUpImg} alt="Gaming setup" />
                </section>

                <section className="content panel panel-third" style={{ flex: '1', margin: 0, position: 'relative' }}>
                    <span className="sound-effect">BAM!</span>
                    <h3>Why I Love Gaming</h3>
                    <ul>
                        <li>Improves strategic and critical thinking</li>
                        <li>Encourages teamwork and communication</li>
                        <li>Enhances hand-eye coordination</li>
                        <li>Provides immersive experiences</li>
                    </ul>
                </section>
            </div>

            {/* BOTTOM ROW: The 3 Navigation Cards */}
            <div className="panel-full">
                <section className="cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
                    <div className="card panel" style={{ display: 'flex', flexDirection: 'column', margin: 0 }}>
                        <h4>About This Portfolio</h4>
                        <p style={{ flex: 1 }}>Learn more about my background.</p>
                        <Link to="/about" className="comic-button-label" data-tooltip="GAIN EXP!" style={{ textDecoration: 'none', marginTop: 'auto', alignSelf: 'flex-start' }}>Read More</Link>
                    </div>

                    <div className="card panel" style={{ display: 'flex', flexDirection: 'column', margin: 0 }}>
                        <h4>Resources & Contact</h4>
                        <p style={{ flex: 1 }}>Find ways to get in touch.</p>
                        <Link to="/contact" className="comic-button-label" data-tooltip="EXPLORE WITH US!" style={{ textDecoration: 'none', marginTop: 'auto', alignSelf: 'flex-start' }}>Explore</Link>
                    </div>

                    <div className="card panel" style={{ display: 'flex', flexDirection: 'column', margin: 0 }}>
                        <h4>Join the Community</h4>
                        <p style={{ flex: 1 }}>Sign up for updates.</p>
                        <Link to="/register" className="comic-button-label" data-tooltip="JOIN THE SQUAD!" style={{ textDecoration: 'none', marginTop: 'auto', alignSelf: 'flex-start' }}>Register</Link>
                    </div>
                </section>
            </div>

            {/* PROFESSOR'S CHALLENGE BUTTON */}
            <div id="edu-launcher" onClick={() => navigate('/training')} style={{ zIndex: 9999, right: '48px', bottom: '30px' }}>
                <div className="edu-tooltip">Professor's Challenge</div>
                <span>🎓</span>
            </div>

            {/* PHANTOM TRIGGER (Hidden in Footer area but kept here for logic) */}
            <div id="phantom-trigger" 
              onClick={() => triggerSecret('/boss/ghost')} 
              style={{ position: 'fixed', bottom: '10px', right: '10px', cursor: 'help', fontSize: '1.2rem', opacity: 0.2, filter: 'grayscale(1)' }}>
              👾
            </div>

            {/* MODAL SYSTEM */}
            {showModal && (
                <div className="modal-overlay" style={{ display: 'flex' }}>
                    <div className="comic-popup">
                        <div className="popup-header"><span className="system-text">QUEST LOG SAYS:</span></div>
                        <div className="popup-content">
                            <div className="quest-bam">{modalData.title}</div>
                            <p>{modalData.message}</p>
                            <button onClick={() => setShowModal(false)} className="comic-button-label">OK</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}