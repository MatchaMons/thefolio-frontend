import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BossCodePage() {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [currentKey, setCurrentKey] = useState('PRESS ANY KEY');
    const [gameActive, setGameActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(100);
    const [showModal, setShowModal] = useState(false);
    const [displayText, setDisplayText] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    
    // --- REFS FOR DIRECT MANIPULATION (Zero Lag) ---
    const containerRef = useRef(null);
    const fillRef = useRef(null);
    const audioCtx = useRef(null);
    const timerRef = useRef(null);
    const lastHeartbeat = useRef(0);
    const keys = ['W', 'A', 'S', 'D', 'R', 'F'];

    const playSound = useCallback((freq, type, duration, vol = 0.1) => {
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.current.state === 'suspended') audioCtx.current.resume();

        const oscillator = audioCtx.current.createOscillator();
        const gainNode = audioCtx.current.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
        gainNode.gain.setValueAtTime(vol, audioCtx.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.current.currentTime + duration);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.current.destination);
        oscillator.start();
        oscillator.stop(audioCtx.current.currentTime + duration);
    }, []);

    const playHeartbeat = useCallback(() => {
        if (!gameActive) return;
        playSound(60, 'sine', 0.2, 0.4); 
        setTimeout(() => {
            if (gameActive) playSound(50, 'sine', 0.2, 0.3);
        }, 150);
    }, [gameActive, playSound]);

    const runTypewriter = (text) => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayText(prev => prev + text.charAt(i));
                playSound(600 + (Math.random() * 400), 'square', 0.05, 0.03);
                i++;
            } else { clearInterval(interval); }
        }, 50);
    };

    const nextKey = useCallback(() => {
        if (score >= 15) return;
        const next = keys[Math.floor(Math.random() * keys.length)];
        setCurrentKey(next);
        setTimeLeft(100);
        setIsSuccess(false);
    }, [score]);

    const startGame = () => {
        setGameActive(true);
        setScore(0);
        nextKey();
    };

    // --- THE CORE TIMER (1:1 MATCH TO YOUR ORIGINAL) ---
    useEffect(() => {
        if (gameActive && !showModal) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    // 1. MATCH YOUR DEPLETION MATH
                    let depletionSpeed = 2.0 + (score * 0.2); 
                    let newTime = prev - depletionSpeed; 

                    const container = containerRef.current;
                    const fill = fillRef.current;

                    // 2. DIRECT STYLE UPDATES (The "fill" you were missing)
                    if (fill) {
                        fill.style.width = newTime + "%";
                        fill.style.backgroundColor = newTime < 30 ? '#ff0000' : '#f0f';
                    }

                    // 3. THE PROGRESSIVE GLITCH
                    if (container) {
                        if (newTime < 50) {
                            container.classList.add('glitch-active');
                            container.style.animationDuration = (newTime / 250).toFixed(2) + "s";
                        } else {
                            container.classList.remove('glitch-active');
                        }
                    }

                    // 4. HEARTBEAT
                    if (newTime < 30) {
                        let now = Date.now();
                        if (now - lastHeartbeat.current > 900) {
                            playHeartbeat();
                            lastHeartbeat.current = now;
                        }
                    }

                    // 5. FAIL CONDITION
                    if (newTime <= 0) {
                        playSound(110, 'sawtooth', 0.4, 0.2);
                        setScore(0);
                        return 100; // Reset
                    }
                    return newTime;
                });
            }, 16);
        }
        return () => clearInterval(timerRef.current);
    }, [gameActive, score, showModal, playHeartbeat, playSound]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (showModal) return;
            if (!gameActive) { startGame(); return; }

            if (e.key.toUpperCase() === currentKey) {
                const newScore = score + 1;
                setIsSuccess(true);
                playSound(800 + (newScore * 20), 'sine', 0.1); 
                
                if (newScore >= 15) {
                    setScore(15);
                    setGameActive(false);
                    setShowModal(true);
                    const gamerTag = localStorage.getItem('playerTag') || "OPERATOR";
                    runTypewriter(`Excellent work, ${gamerTag.toUpperCase()}. System stabilized.`);
                } else {
                    setScore(newScore);
                    setTimeout(nextKey, 100); 
                }
            } else {
                playSound(110, 'sawtooth', 0.4, 0.2);
                setScore(0);
                setTimeLeft(100);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentKey, gameActive, score, showModal, nextKey, playSound]);

    return (
        <main style={styles.body}>
            <div style={styles.scanline} />

            <div 
                ref={containerRef}
                id="game-container"
                style={{
                    ...styles.container,
                    opacity: showModal ? 0.2 : 1,
                }}
            >
                <h1 style={{ fontFamily: 'Bangers', fontSize: '3rem', margin: 0 }}>SOURCE CODE REPAIR</h1>
                <div style={{ margin: '10px 0', fontFamily: 'Courier New' }}>
                    STABILITY: <span style={{ color: '#0f0' }}>{score}</span> / 15
                </div>
                
                <div style={{ 
                    ...styles.displayKey,
                    color: isSuccess ? '#0f0' : '#f0f',
                    transform: isSuccess ? 'scale(1.1)' : 'scale(1)',
                }}>
                    {currentKey}
                </div>

                <p style={{ fontFamily: 'Courier New', fontSize: '0.9rem' }}>Type the characters as they appear!</p>
                
                <div style={styles.timerBar}>
                    {/* The ref here ensures the timer actually moves! */}
                    <div ref={fillRef} style={styles.timerFill} />
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" style={{ display: 'flex' }}>
                    <div className="comic-popup" style={styles.modal}>
                        <div style={styles.modalHeader}>{">"} TERMINAL: MISSION SUCCESS</div>
                        <h2 style={styles.modalTitle}>DATA SECURED!</h2>
                        <p style={styles.typewriterText}>{displayText}</p>
                        <button style={styles.modalBtn} onClick={() => navigate('/quest')}>
                            RETURN TO QUEST HUB
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes gridMove {
                    0% { background-position: 0 0, 0 0, 0 0, center; }
                    100% { background-position: 0 0, 60px 60px, 60px 60px, center; }
                }
                @keyframes scanline {
                    0% { background-position: 0 -100%; }
                    100% { background-position: 0 100%; }
                }
                @keyframes intenseGlitch {
                    0% { transform: translate(0,0); filter: hue-rotate(0deg); }
                    20% { transform: translate(-8px, 5px); filter: hue-rotate(45deg); }
                    40% { transform: translate(8px, -5px); filter: invert(0.1); }
                    60% { transform: translate(-8px, -5px); filter: hue-rotate(-45deg); }
                    80% { transform: translate(8px, 5px); }
                    100% { transform: translate(0,0); filter: hue-rotate(0deg); }
                }
                .glitch-active {
                    animation-name: intenseGlitch;
                    animation-iteration-count: infinite;
                    animation-timing-function: linear;
                }
            `}</style>
        </main>
    );
}

const styles = {
    body: {
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: '#050005',
        backgroundImage: `
            linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
            linear-gradient(90deg, rgba(255, 0, 255, 0.05) 1px, transparent 1px),
            linear-gradient(rgba(255, 0, 255, 0.05) 1px, transparent 1px),
            radial-gradient(circle, rgba(45, 0, 45, 1) 0%, rgba(0, 0, 0, 1) 100%)
        `,
        backgroundSize: '100% 4px, 60px 60px, 60px 60px, cover',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, overflow: 'hidden', animation: 'gridMove 15s linear infinite'
    },
    scanline: {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(255, 0, 255, 0.1) 50%, transparent 100%)',
        backgroundSize: '100% 200%', animation: 'scanline 6s linear infinite',
        pointerEvents: 'none', zIndex: 1
    },
    container: {
        position: 'relative', zIndex: 10, background: 'rgba(0, 0, 0, 0.85)',
        border: '4px solid #f0f', boxShadow: '0 0 20px #f0f, inset 0 0 15px #f0f',
        padding: '50px', borderRadius: '15px', textAlign: 'center', color: '#f0f'
    },
    displayKey: { fontSize: '10rem', fontFamily: 'Bangers', textShadow: '0 0 20px #f0f, 5px 5px #0ff', margin: '20px 0' },
    timerBar: { width: '100%', height: '15px', background: '#222', border: '2px solid #f0f', marginTop: '20px' },
    timerFill: { height: '100%', transition: 'none', backgroundColor: '#f0f' },
    modal: { background: '#000', border: '4px solid #ffde59', padding: '30px', minWidth: '320px', boxShadow: '0 0 20px #ffde59' },
    modalHeader: { color: '#ffde59', fontSize: '0.9rem', marginBottom: '10px', fontFamily: 'monospace' },
    modalTitle: { fontSize: '2.5rem', margin: '10px 0', fontFamily: 'Bangers', color: 'white' },
    typewriterText: { marginBottom: '20px', fontFamily: 'Courier New', minHeight: '50px', color: 'white' },
    modalBtn: { background: '#ffde59', color: 'black', padding: '10px', border: 'none', cursor: 'pointer', fontFamily: 'Bangers', fontSize: '1.2rem', width: '100%' }
};