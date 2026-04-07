import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BossGhostPage() {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(20);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isVictory, setIsVictory] = useState(false);
    const [displayText, setDisplayText] = useState("");
    const [isDamaged, setIsDamaged] = useState(false);
    
    const playerRef = useRef(null);
    const containerRef = useRef(null);
    const gameActive = useRef(true);
    const timeLeftRef = useRef(20);
    const audioCtx = useRef(null);

    // --- AUDIO ENGINE ---
    const playSound = useCallback((freq, type, duration, vol = 0.1) => {
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.current.state === 'suspended') audioCtx.current.resume();
        const osc = audioCtx.current.createOscillator();
        const gain = audioCtx.current.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
        gain.gain.setValueAtTime(vol, audioCtx.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.current.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.current.destination);
        osc.start();
        osc.stop(audioCtx.current.currentTime + duration);
    }, []);

    const runTypewriter = (text) => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayText(prev => prev + text.charAt(i));
                playSound(600 + (Math.random() * 400), 'square', 0.05, 0.02);
                i++;
            } else { clearInterval(interval); }
        }, 40);
    };

    // --- BULLET LOGIC ---
    const createBullet = useCallback(() => {
        if (!gameActive.current) return;

        const bullet = document.createElement('div');
        bullet.className = 'bullet';
        bullet.style.left = Math.random() * window.innerWidth + 'px';
        bullet.style.top = "-15px";
        if (containerRef.current) containerRef.current.appendChild(bullet);

        let pos = -15;
        let fallSpeed = 8 + (20 - timeLeftRef.current) * 0.7;

        const bulletInterval = setInterval(() => {
            if (!gameActive.current) {
                clearInterval(bulletInterval);
                bullet.remove();
                return;
            }

            pos += fallSpeed;
            bullet.style.top = pos + 'px';

            const pRect = playerRef.current?.getBoundingClientRect();
            const bRect = bullet.getBoundingClientRect();

            if (pRect && !(pRect.right < bRect.left || pRect.left > bRect.right || 
                           pRect.bottom < bRect.top || pRect.top > bRect.bottom)) {
                handleDefeat();
                clearInterval(bulletInterval);
            }

            if (pos > window.innerHeight) {
                clearInterval(bulletInterval);
                bullet.remove();
            }
        }, 16);
    }, [playSound]);

    const spawnWave = useCallback(() => {
        if (!gameActive.current) return;
        playSound(150, 'sine', 0.1, 0.05);
        for (let i = 0; i < 3; i++) { createBullet(); }
        let nextSpawn = Math.max(40, 150 - (20 - timeLeftRef.current) * 8);
        setTimeout(spawnWave, nextSpawn);
    }, [createBullet, playSound]);

    const handleDefeat = () => {
        if (!gameActive.current) return;
        gameActive.current = false;
        setIsGameOver(true);
        setIsVictory(false);
        setIsDamaged(true);
        playSound(100, 'sawtooth', 0.5, 0.3);
    };

    const handleVictory = () => {
        gameActive.current = false;
        setIsGameOver(true);
        setIsVictory(true);
        playSound(523, 'sine', 0.3, 0.2);
        setTimeout(() => playSound(659, 'sine', 0.3, 0.2), 150);
        const tag = localStorage.getItem('playerTag') || "TRAVELER";
        runTypewriter(`Great survival skills, ${tag.toUpperCase()}! The area is now safe.`);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!gameActive.current || !playerRef.current) return;
            playerRef.current.style.left = e.clientX + 'px';
            playerRef.current.style.top = e.clientY + 'px';
        };

        window.addEventListener('mousemove', handleMouseMove);
        spawnWave();

        const timer = setInterval(() => {
            if (!gameActive.current) return;
            setTimeLeft(prev => {
                const next = prev - 1;
                timeLeftRef.current = next;
                if (next <= 10) playSound(60, 'sine', 0.2, 0.2);
                if (next <= 0) {
                    clearInterval(timer);
                    handleVictory();
                    return 0;
                }
                return next;
            });
        }, 1000);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearInterval(timer);
            gameActive.current = false;
        };
    }, [spawnWave, playSound]);

    return (
        <main 
            ref={containerRef} 
            style={{
                ...styles.fullScreenOverlay,
                backgroundColor: isDamaged ? '#400' : 'black',
                cursor: isGameOver ? 'default' : 'none',
            }} 
            className={timeLeft <= 10 && !isGameOver ? 'glitch-active' : ''}
        >
            {/* Player Dot - hidden when game over to avoid double cursor */}
            {!isGameOver && <div id="player" ref={playerRef} style={styles.player} />}
            
            <div id="timer" style={{
                ...styles.timer,
                color: timeLeft <= 10 ? '#ff0000' : 'cyan',
                textShadow: timeLeft <= 10 ? '0 0 20px red' : '0 0 10px cyan'
            }}>
                SURVIVE: {timeLeft}s
            </div>

            {isGameOver && (
                <div style={styles.modalOverlay}>
                    <div style={{
                        ...styles.alertBox,
                        borderColor: isVictory ? '#ffde59' : 'red',
                        boxShadow: isVictory ? '0 0 30px #ffde59' : '0 0 30px red'
                    }}>
                        <div style={{...styles.terminal, color: isVictory ? '#ffde59' : 'red'}}>
                            {isVictory ? "> TERMINAL: MISSION SUCCESS" : "> TERMINAL: CRITICAL FAILURE"}
                        </div>
                        <h2 style={{...styles.alertTitle, color: isVictory ? '#ffde59' : 'red'}}>
                            {isVictory ? "THREAT EVADED!" : "YOU WERE CAUGHT!"}
                        </h2>
                        <p style={styles.alertText}>
                            {isVictory ? displayText : "The virus has taken over the system!"}
                        </p>
                        <button 
                            style={{
                                ...styles.alertBtn, 
                                backgroundColor: isVictory ? '#ffde59' : 'red',
                                color: isVictory ? 'black' : 'white'
                            }} 
                            onClick={() => isVictory ? navigate('/quest') : window.location.reload()}
                        >
                            {isVictory ? "RETURN TO QUEST HUB" : "RE-ENTER VOID"}
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                .bullet { 
                    position: absolute; width: 12px; height: 12px; 
                    background: red; border-radius: 50%; z-index: 50; 
                    box-shadow: 0 0 12px red; pointer-events: none;
                }
                @keyframes ghostGlitch {
                    0% { transform: translate(0,0) skew(0deg); filter: brightness(1); }
                    20% { transform: translate(-8px, 4px) skew(3deg); filter: brightness(1.5); }
                    40% { transform: translate(8px, -4px) skew(-3deg); }
                    60% { transform: translate(-8px, -4px) hue-rotate(90deg); }
                    100% { transform: translate(0,0) skew(0deg); }
                }
                .glitch-active { 
                    animation: ghostGlitch 0.15s infinite !important; 
                }
            `}</style>
        </main>
    );
}

const styles = {
    fullScreenOverlay: {
        width: '100vw', height: '100vh',
        background: 'radial-gradient(circle, #0a2e2e 0%, #000000 100%)',
        overflow: 'hidden', transition: 'background-color 0.2s',
        position: 'relative'
    },
    player: {
        width: '20px', height: '20px', background: 'cyan', position: 'absolute',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 100, boxShadow: '0 0 15px cyan',
        transform: 'translate(-50%, -50%)'
    },
    timer: {
        fontFamily: 'Bangers, cursive', fontSize: '4rem', textAlign: 'center',
        paddingTop: '30px', position: 'relative', zIndex: 150
    },
    modalOverlay: {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 2000
    },
    alertBox: {
        minWidth: '350px', textAlign: 'center', background: '#000',
        padding: '40px', fontFamily: 'Bangers, cursive', border: '4px solid'
    },
    terminal: { fontSize: '1rem', marginBottom: '10px', fontFamily: 'monospace' },
    alertTitle: { fontSize: '3rem', margin: '10px 0' },
    alertText: { marginBottom: '30px', fontFamily: 'Courier New, monospace', color: 'white' },
    alertBtn: { padding: '15px 30px', border: 'none', cursor: 'pointer', fontSize: '1.4rem', width: '100%', fontFamily: 'Bangers' }
};