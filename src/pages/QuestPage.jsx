import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function QuestPage() {
    const navigate = useNavigate();
    
    // --- STATE MANAGEMENT ---
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
    const [showSettings, setShowSettings] = useState(false);
    const [playerTag, setPlayerTag] = useState(localStorage.getItem('playerTag') || "OPERATOR");
    const [audioEnabled, setAudioEnabled] = useState(localStorage.getItem('audioEnabled') !== 'false');
    
    // Quest Progress States
    const [isScholarsDone, setIsScholarsDone] = useState(localStorage.getItem('quest_scholars_trial') === 'completed');
    const [isBreachDone, setIsBreachDone] = useState(localStorage.getItem('quest_system_breach') === 'completed');

    // --- THEME LOGIC ---
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    // --- SETTINGS LOGIC ---
    const saveSettings = () => {
        localStorage.setItem('playerTag', playerTag);
        localStorage.setItem('audioEnabled', audioEnabled);
        setShowSettings(false);
    };

    // Console Secret
    window.startBattle = () => {
        console.log("Initiating System Breach...");
        navigate('/boss/hacker');
    };

    return (
        <div className={`quest-wrapper ${isDarkMode ? 'dark-mode' : ''}`}>
            {/* SETTINGS MODAL */}
            {showSettings && (
                <div style={styles.settingsOverlay}>
                    <div style={styles.settingsMenu}>
                        <h2 style={{ fontSize: '2.5rem', marginTop: 0 }}>SYSTEM CONFIG</h2>
                        <div style={{ margin: '20px 0' }}>
                            <label>AUDIO SYSTEM: </label>
                            <button 
                                onClick={() => setAudioEnabled(!audioEnabled)}
                                style={{
                                    ...styles.configBtn,
                                    borderColor: audioEnabled ? '#0ff' : '#f00',
                                    color: audioEnabled ? '#0ff' : '#f00'
                                }}
                            >
                                {audioEnabled ? "ENABLED" : "MUTED"}
                            </button>
                        </div>
                        <div style={{ margin: '20px 0' }}>
                            <label>CHANGE TAG: </label>
                            <input 
                                type="text" 
                                value={playerTag}
                                onChange={(e) => setPlayerTag(e.target.value.toUpperCase())}
                                maxLength="12" 
                                style={styles.tagInput}
                            />
                        </div>
                        <button onClick={saveSettings} style={styles.saveBtn}>SAVE & CLOSE</button>
                    </div>
                </div>
            )}

            {/* SETTINGS GEAR */}
            <div onClick={() => setShowSettings(true)} style={styles.gearIcon}>⚙️</div>

            <main className="comic-page">
                <section className="panel panel-full" style={{ textAlign: 'center' }}>
                    <h2 className="quest-bam">AVAILABLE MISSIONS</h2>
                    <p>Explore the portfolio to trigger these hidden encounters. Can you achieve 100% completion?</p>
                </section>

                <div className="quest-grid">
                    {/* 1. SCHOLAR'S TRIAL */}
                    <div className="quest-card panel">
                        <div className="difficulty-tag diff-edu">TRAINING</div>
                        <div className="reward-badge" style={{filter: isScholarsDone ? 'none' : 'grayscale(1)'}}>🎓</div>
                        <h3>The Scholar's Trial</h3>
                        <p>Professor's special assignment. Test your knowledge of the web to earn the 'Honor Student' badge.</p>
                        <div className="status-bar">
                            <div className="status-fill" style={{ width: isScholarsDone ? '100%' : '0%' }}></div>
                        </div>
                        <button onClick={() => navigate('/training')} className="mission-btn">ENTER CLASSROOM</button>
                        <p className="hint-text"><strong>Clue:</strong> Random questions pulled from the 50-item database.</p>
                    </div>

                    {/* 2. FOOTER PHANTOM (Passive Quest) */}
                    <div className="quest-card panel">
                        <div className="difficulty-tag diff-easy">EASY</div>
                        <div className="reward-badge">👻</div>
                        <h3>The Footer Phantom</h3>
                        <p>A restless spirit is haunting the bottom of the pages. Find it to initiate the purge.</p>
                        <div className="status-bar"><div className="status-fill" style={{ width: '100%' }}></div></div>
                        <p className="hint-text"><strong>Clue:</strong> Look for the 👾 near the copyright notice.</p>
                    </div>

                    {/* 3. KONAMI PROTOCOL (Passive Quest) */}
                    <div className="quest-card panel">
                        <div className="difficulty-tag diff-medium">MEDIUM</div>
                        <div className="reward-badge">⌨️</div>
                        <h3>The Konami Protocol</h3>
                        <p>The original developers left a backdoor accessible only via a secret keyboard sequence.</p>
                        <div className="status-bar"><div className="status-fill" style={{ width: '100%' }}></div></div>
                        <p className="hint-text"><strong>Clue:</strong> ↑ ↑ ↓ ↓ ← → ← → B A</p>
                    </div>

                    {/* 4. SYSTEM BREACH */}
                    <div className="quest-card panel">
                        <div className="difficulty-tag diff-hard">HARD</div>
                        <div className="reward-badge" style={{filter: isBreachDone ? 'none' : 'grayscale(1)'}}>💻</div>
                        <h3>System Breach</h3>
                        <p>A hacker has bypassed the firewall. You must enter the developer console to intercept them.</p>
                        <div className="status-bar">
                            <div className="status-fill" style={{ width: isBreachDone ? '100%' : '0%' }}></div>
                        </div>
                        <button onClick={() => navigate('/boss/hacker')} className="mission-btn">INTERCEPT HACKER</button>
                        <p className="hint-text"><strong>Clue:</strong> Inspect Element -{'>'} Console -{'>'} startBattle()</p>
                    </div>

                    {/* 5. THE ORIGIN CORE (Locked until Breach is done) */}
                    <div className={`quest-card panel ${!isBreachDone ? 'locked-card' : ''}`}>
                        <div className="difficulty-tag" style={{ background: isBreachDone ? '#ff00ff' : '#ccc' }}>
                            {isBreachDone ? 'LEGENDARY' : 'LOCKED'}
                        </div>
                        <div className="reward-badge">{isBreachDone ? '💠' : '🔒'}</div>
                        <h3 style={{color: isBreachDone ? '#ff00ff' : 'inherit'}}>
                            {isBreachDone ? "THE ORIGIN CORE" : "???"}
                        </h3>
                        <p>
                            {isBreachDone 
                             ? "The source code of reality is exposed. Enter the core to end this." 
                             : "Requirement: Complete 'System Breach' to reveal this legendary quest."}
                        </p>
                        <div className="status-bar">
                            <div className="status-fill" style={{ width: '0%', background: isBreachDone ? '#ff00ff' : '#999' }}></div>
                        </div>
                        <button 
                            disabled={!isBreachDone}
                            onClick={() => navigate('/boss/final')}
                            className="mission-btn" 
                            style={{ background: isBreachDone ? 'linear-gradient(45deg, #ff00ff, #00ffff)' : '#999' }}
                        >
                            {isBreachDone ? "ENTER THE CORE" : "DATA ENCRYPTED"}
                        </button>
                    </div>
                </div>

                <footer className="panel panel-full" style={{ marginTop: '40px', textAlign: 'center', borderColor: '#000000' }}>
                    <h3 className="system-text"><span style={{color: '#000000'}}>CURRENT RANK: {isBreachDone ? "ELITE BREACHER" : "NOVICE DEVELOPER"}</span></h3>
                    <p>Logged in as: <span style={{color: '#000000'}}>{playerTag}</span></p>
                    <button onClick={() => navigate('/')} className="mission-btn" style={{ background: '#ffde59', color: 'black' }}>
                        BACK TO WORLD MAP
                    </button>
                </footer>
            </main>

            <style>{`
                .comic-page { display: block; width: 90%; max-width: 1400px; margin: 0 auto; padding: 40px 20px; }
                .quest-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; margin: 40px 0; }
                .quest-card { 
                    display: flex; flex-direction: column; background: rgba(255, 255, 255, 0.95); 
                    border: 4px solid black; padding: 25px; min-height: 450px; position: relative; 
                    box-shadow: 12px 12px 0px rgba(0,0,0,0.2); transition: all 0.3s ease; 
                }
                .quest-card:hover { transform: translate(-4px, -4px); box-shadow: 16px 16px 0px #ffde59; background: white; }
                .quest-card h3 { font-family: 'Bangers'; font-size: 1.8rem; margin: 15px 0; }
                .difficulty-tag { display: inline-block; padding: 6px 15px; font-family: 'Bangers'; border: 2px solid black; text-transform: uppercase; }
                .diff-edu { background: #00e5ff; } .diff-easy { background: #00ff00; } .diff-medium { background: #ffff00; } .diff-hard { background: #ff4d4d; }
                .reward-badge { position: absolute; top: 15px; right: 15px; font-size: 2.5rem; }
                .status-bar { background: #222; height: 16px; border: 3px solid black; border-radius: 20px; overflow: hidden; margin: 20px 0; }
                .status-fill { height: 100%; background: #ffde59; transition: width 1s ease; }
                .mission-btn { background: black; color: white; font-family: 'Bangers'; padding: 15px; border: none; cursor: pointer; font-size: 1.2rem; }
                .mission-btn:hover { background: #ffde59; color: black; }
                .locked-card { opacity: 0.6; background: rgba(200, 200, 200, 0.8) !important; border-style: dashed !important; }
                .hint-text { font-size: 0.8rem; background: rgba(0,0,0,0.05); padding: 10px; margin-top: 15px; border-left: 4px solid #ffde59; }

                /* DARK MODE OVERRIDES */
                .dark-mode .quest-card { background: #1a1a1a !important; color: white !important; border-color: #ffde59 !important; }
                .dark-mode .quest-card h3, .dark-mode .quest-bam, .dark-mode .system-text { color: #ffde59 !important; }
                .dark-mode .mission-btn { background: #ffde59 !important; color: black !important; }
                .dark-mode .panel-full { background: #1a1a1a !important; border-color: #ffde59 !important; color: white !important; }
                .dark-mode .panel-full p { color: #ccc !important; }
            `}</style>
        </div>
    );
}

const styles = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 5%', background: '#000', color: '#fff' },
    navMenu: { display: 'flex', listStyle: 'none', gap: '20px' },
    navLink: { color: 'white', textDecoration: 'none', fontFamily: 'Bangers', fontSize: '1.2rem' },
    themeToggle: { background: '#333', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', fontFamily: 'Bangers' },
    gearIcon: { position: 'fixed', bottom: '20px', right: '20px', cursor: 'pointer', fontSize: '2.5rem', zIndex: 4000 },
    settingsOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 5000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
    settingsMenu: { border: '3px solid #0ff', padding: '40px', color: '#0ff', fontFamily: 'Bangers', textAlign: 'center', boxShadow: '0 0 30px #0ff', minWidth: '350px' },
    configBtn: { background: '#222', border: '2px solid', padding: '5px 20px', cursor: 'pointer', fontFamily: 'Bangers', fontSize: '1.2rem' },
    tagInput: { background: '#111', color: '#fff', border: '1px solid #0ff', padding: '8px', width: '150px', textAlign: 'center' },
    saveBtn: { background: '#0ff', color: '#000', border: 'none', padding: '15px', fontSize: '1.5rem', cursor: 'pointer', width: '100%', marginTop: '20px', fontFamily: 'Bangers' }
};