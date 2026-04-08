import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({ title: '', message: '' });

    useEffect(() => {
        // --- 1. CONSOLE HACKER SECRET ---
        window.startBattle = () => {
            console.log("%c INTERCEPTING SIGNAL...", "color: lime; font-weight: bold;");
            setModalData({ title: "SYSTEM BREACH!", message: "Hacker detected. Entering the Matrix..." });
            setShowModal(true);
            setTimeout(() => { navigate('/boss/hacker'); }, 2000);
            return "Connection established. Good luck, Operator.";
        };

        // --- 2. KONAMI CODE LISTENER ---
        const sequence = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
        let userKeys = [];

        const handleKeyDown = (e) => {
            userKeys.push(e.key.toLowerCase());
            userKeys = userKeys.slice(-sequence.length);
            if (userKeys.join('') === sequence.join('')) {
                triggerSecret('/boss/code');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        
        // Logs the secret hint to the console just like your HTML script
        console.log("%c [SECRET] %c Type %cstartBattle()%c to bypass the firewall.", 
            "color: #ff00ff; font-weight: bold;", "color: white;", 
            "color: lime; font-family: monospace;", "color: white;");

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            delete window.startBattle;
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
            
            {/* ROW 1: What I Love */}
            <div className="comic-row" style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'stretch' }}>
                <section className="panel panel-two-third" style={{ flex: '2', position: 'relative' }}>
                    <h2>What I Love About Gaming</h2>
                    <p>
                        Gaming has always been a meaningful hobby for me. It challenges my
                        thinking, improves my reflexes, and allows me to connect with others.
                        Through gaming, I've learned patience, teamwork, and strategic planning.
                    </p>
                    <span className="sound-effect">BAM!</span>
                </section>

                <section className="content panel panel-third" style={{ flex: '1', margin: 0 }}>
                    <img 
                        src={loveGamingImg} 
                        alt="Student coding on a laptop" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }} 
                    />
                </section>
            </div>

            {/* ROW 2: My Journey */}
            <div className="comic-row" style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'stretch' }}>
                <section className="content panel panel-third" style={{ flex: '1', margin: 0 }}>
                    <img 
                        src={myJourneyImg} 
                        alt="Gaming workspace" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }} 
                    />
                </section>

                <section className="panel panel-two-third" style={{ flex: '2', position: 'relative' }}>
                    <h2>My Journey with Gaming</h2>
                    <p>
                        I began learning Gaming back before I even started attending school and quickly became interested in gaming.
                        Over time, I improved my skills and began participating in online competitions.
                    </p>

                    <ol>
                        <li>Playing casual games and learning basic mechanics</li>
                        <li>Exploring competitive and multiplayer games</li>
                        <li>Improving strategy, reaction time, and teamwork</li>
                        <li>Learning about game design and mechanics</li>
                    </ol>
                    <span className="sound-effect">BAM!</span>
                </section>
            </div>

            {/* QUOTE SECTION (Centralized) */}
            <div className="panel-full" style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                margin: '80px 0',
                perspective: '1000px' /* Adds a tiny bit of depth for the slide */
            }}>
                <blockquote className="panel" style={{ 
                    margin: 0, 
                    textAlign: 'center', 
                    fontSize: '1.2rem',
                    color: '#000',
                    fontWeight: '700', /* Making the text bold to match the comic feel */
                    
                    /* THE SHAPE: Capsule/Oblong */
                    maxWidth: '850px',
                    width: 'fit-content', /* Wraps tight around the text */
                    padding: '20px 60px', /* Tight top/bottom, wide sides */
                    borderRadius: '100px', /* This creates the perfect "C" curve on the ends */
                    
                    backgroundColor: '#fff', 
                    border: '3px solid #000',
                    position: 'relative',
                    zIndex: 2,
                    
                    /* THE LAYERED SHADOW (Exact offset from your image) */
                    boxShadow: `8px 8px 0px 0px #000`,
                    
                    /* ANIMATION */
                    animation: 'slideIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
                }}>
                    <span style={{ fontSize: '2rem', marginRight: '5px' }}>"</span>
                    Gaming is not about winning — it's about learning, strategy, and enjoyment.
                    <span style={{ fontSize: '2rem', marginLeft: '5px' }}>"</span>
                </blockquote>

                <style>
                    {`
                    @keyframes slideIn {
                        0% {
                            transform: scale(0.5) translateY(100px);
                            opacity: 0;
                        }
                        100% {
                            transform: scale(1) translateY(0);
                            opacity: 1;
                        }
                    }
                    `}
                </style>
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