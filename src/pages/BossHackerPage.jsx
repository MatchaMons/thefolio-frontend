import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BossHackerPage() {
    const navigate = useNavigate();
    const [nextNum, setNextNum] = useState(1);
    const [integrity, setIntegrity] = useState(100);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isVictory, setIsVictory] = useState(false);
    const [displayText, setDisplayText] = useState("");
    
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const gameActive = useRef(true);
    const integrityRef = useRef(100);
    const audioCtx = useRef(null);

    // --- AUDIO ENGINE (With Non-Finite Safety Fix) ---
    const playSound = useCallback((freq, type, duration, vol = 0.1) => {
        const safeFreq = isFinite(freq) ? freq : 440;
        const safeVol = isFinite(vol) ? vol : 0.1;
        const safeDur = isFinite(duration) ? duration : 0.1;

        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.current.state === 'suspended') audioCtx.current.resume();
        
        const osc = audioCtx.current.createOscillator();
        const gain = audioCtx.current.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(safeFreq, audioCtx.current.currentTime);
        gain.gain.setValueAtTime(safeVol, audioCtx.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.current.currentTime + safeDur);
        osc.connect(gain);
        gain.connect(audioCtx.current.destination);
        osc.start();
        osc.stop(audioCtx.current.currentTime + safeDur);
    }, []);

    // --- MATRIX ANIMATION ---
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        const draw = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#0f0";
            ctx.font = fontSize + "px Courier New";
            for (let i = 0; i < drops.length; i++) {
                const text = letters.charAt(Math.floor(Math.random() * letters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        };
        const interval = setInterval(draw, 33);
        return () => clearInterval(interval);
    }, []);

    // --- GAME OVER LOGIC ---
    const handleDefeat = useCallback(() => {
        if (!gameActive.current) return;
        gameActive.current = false;
        setIsGameOver(true);
        setIsVictory(false);
        playSound(100, 'sawtooth', 0.8, 0.3);
    }, [playSound]);

    const handleVictory = useCallback(() => {
        gameActive.current = false;
        setIsGameOver(true);
        setIsVictory(true);
        playSound(523, 'sine', 0.3, 0.1);
        const tag = localStorage.getItem('playerTag') || "OPERATOR";
        let text = `Excellent work, ${tag.toUpperCase()}. The intruder has been neutralized.`;
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayText(prev => prev + text.charAt(i));
                playSound(900 + (Math.random() * 300), 'square', 0.04, 0.02);
                i++;
            } else { clearInterval(timer); }
        }, 40);
    }, [playSound]);

    // --- INTEGRITY TIMER ---
    useEffect(() => {
        const timer = setInterval(() => {
            if (!gameActive.current) return;
            setIntegrity(prev => {
                const next = prev - 0.5;
                integrityRef.current = next;
                if (next <= 0) {
                    clearInterval(timer);
                    handleDefeat();
                    return 0;
                }
                return next;
            });
        }, 100);
        return () => clearInterval(timer);
    }, [handleDefeat]);

    // --- DYNAMIC NODE CREATION ---
    const createNode = (num, isFake = false) => {
        if (!gameActive.current) return;
        const node = document.createElement('div');
        node.className = `target-node ${isFake ? 'fake-node' : ''}`;
        node.innerText = isFake ? Math.floor(Math.random() * 99) : num;
        
        const x = Math.random() * (window.innerWidth - 120);
        const y = 150 + Math.random() * (window.innerHeight - 300);
        node.style.left = x + 'px';
        node.style.top = y + 'px';

        node.onclick = () => {
            if (isFake) {
                playSound(150, 'sawtooth', 0.3, 0.2);
                setIntegrity(prev => Math.max(0, prev - 10));
                node.classList.add('glitch-shake');
                setTimeout(() => node.remove(), 200);
            } else {
                const currentNum = parseInt(num) || 0;
                playSound(800 + (currentNum * 50), 'sine', 0.1, 0.1);
                setNextNum(prev => {
                    const next = prev + 1;
                    if (next > 15) handleVictory();
                    else {
                        createNode(next, false);
                        createNode(0, true);
                        createNode(0, true);
                    }
                    return next;
                });
                node.remove();
            }
        };

        if (containerRef.current) containerRef.current.appendChild(node);

        let velX = (Math.random() - 0.5) * 4;
        let velY = (Math.random() - 0.5) * 4;
        const move = () => {
            if (!node.parentNode || !gameActive.current) return;
            let speedMult = 1 + (100 - integrityRef.current) / 33; 
            let curX = parseFloat(node.style.left);
            let curY = parseFloat(node.style.top);
            if (curX <= 0 || curX >= window.innerWidth - 100) velX *= -1;
            if (curY <= 100 || curY >= window.innerHeight - 100) velY *= -1;
            node.style.left = (curX + (velX * speedMult)) + 'px';
            node.style.top = (curY + (velY * speedMult)) + 'px';
            requestAnimationFrame(move);
        };
        move();
    };

    useEffect(() => {
        const initGame = () => {
            if (containerRef.current) createNode(1, false);
        };
        initGame();
    }, []); 

    return (
        <main style={styles.page}>
            {/* ONLY this div glitches */}
            <div 
                ref={containerRef} 
                className={integrity < 70 && !isGameOver ? 'active-glitch' : ''} 
                style={styles.gameView}
            >
                <canvas ref={canvasRef} style={styles.canvas} />
                <div style={styles.crt} />
            </div>

            {/* Static HUD */}
            <div style={styles.hud}>
                <h1 style={styles.title}>SYSTEM INTRUSION DETECTED</h1>
                <p style={{fontSize: '1.2rem', margin: 0}}>
                    ELIMINATE NODES IN ORDER: <span style={{color: 'white'}}>{nextNum > 15 ? 'CLEARED' : nextNum}</span> / 15
                </p>
            </div>

            {/* Static Integrity Bar */}
            <div style={styles.integrityContainer}>
                <div style={{...styles.integrityBar, width: `${integrity}%`}} />
                <div style={styles.integrityLabel}>SYSTEM INTEGRITY</div>
            </div>

            {/* Static Modal */}
            {isGameOver && (
                <div style={styles.modalOverlay}>
                    <div style={{...styles.alertBox, borderColor: isVictory ? '#0f0' : '#f00'}}>
                        <div style={{color: isVictory ? '#0f0' : '#f00', fontFamily: 'monospace'}}>
                            {isVictory ? "> TERMINAL: MISSION SUCCESS" : "> TERMINAL: CRITICAL FAILURE"}
                        </div>
                        <h2 style={{fontSize: '2.5rem', margin: '10px 0', color: isVictory ? 'white' : '#f00'}}>
                            {isVictory ? "INTRUDER PURGED!" : "SYSTEM ERASED"}
                        </h2>
                        <p style={{color: 'white', minHeight: '50px'}}>{isVictory ? displayText : "The firewall collapsed."}</p>
                        <button 
                            style={{...styles.btn, backgroundColor: isVictory ? '#0f0' : '#f00'}}
                            onClick={() => isVictory ? navigate('/quest') : window.location.reload()}
                        >
                            {isVictory ? "RETURN TO QUEST HUB" : "REBOOT SYSTEM"}
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                .target-node { 
                    position: absolute; padding: 10px 20px; font-family: 'Bangers', cursive; 
                    font-size: 2rem; background: rgba(0, 0, 0, 0.9); border: 2px solid #0f0; 
                    color: #0f0; cursor: pointer; z-index: 50; user-select: none;
                }
                .fake-node { border-color: #f00; color: #f00; box-shadow: 0 0 10px #f00; }
                
                @keyframes intenseGlitch {
                    0% { transform: translate(0,0); filter: hue-rotate(0deg); }
                    20% { transform: translate(-4px, 2px); filter: hue-rotate(90deg) brightness(1.2); }
                    40% { transform: translate(4px, -2px); }
                    60% { transform: translate(-4px, -2px); filter: hue-rotate(180deg); }
                    80% { transform: translate(4px, 2px); }
                    100% { transform: translate(0,0); filter: hue-rotate(0deg); }
                }
                .active-glitch { animation: intenseGlitch 0.2s infinite !important; }
                
                @keyframes shake {
                    0%, 100% { transform: translate(0,0); }
                    25% { transform: translate(5px, 5px); }
                    50% { transform: translate(-5px, -5px); }
                }
                .glitch-shake { animation: shake 0.1s infinite; }
            `}</style>
        </main>
    );
}

const styles = {
    page: { backgroundColor: 'black', height: '100vh', width: '100vw', overflow: 'hidden', color: '#0f0', position: 'relative', margin: 0 },
    gameView: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5 },
    canvas: { position: 'absolute', top: 0, left: 0, opacity: 0.3 },
    crt: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%)', backgroundSize: '100% 3px' },
    hud: { position: 'fixed', top: '20px', width: '100%', textAlign: 'center', zIndex: 100, textShadow: '0 0 10px #0f0' },
    title: { fontFamily: 'Bangers, cursive', fontSize: '3rem', margin: 0 },
    integrityContainer: { position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '20px', border: '2px solid #0f0', zIndex: 100 },
    integrityBar: { height: '100%', background: '#0f0', boxShadow: '0 0 15px #0f0', transition: 'width 0.1s linear' },
    integrityLabel: { position: 'absolute', width: '100%', textAlign: 'center', top: '-25px', fontFamily: 'Bangers, cursive' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
    alertBox: { minWidth: '320px', textAlign: 'center', background: '#000', padding: '30px', border: '4px solid', fontFamily: 'Bangers, cursive' },
    btn: { color: 'black', padding: '10px 20px', border: 'none', cursor: 'pointer', fontSize: '1.2rem', width: '100%', marginTop: '20px', fontFamily: 'Bangers, cursive' }
};