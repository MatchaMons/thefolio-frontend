import React from 'react';
import { useNavigate } from 'react-router-dom';

const SplashPage = () => {
    const navigate = useNavigate();

    const openBook = () => {
        const cover = document.getElementById('comic-cover');
        
        // Triggers the CSS animation from your style.css
        cover.classList.add('open-effect');
        
        // Wait for the animation (0.6s) before navigating to home
        setTimeout(() => {
            navigate("/home");
        }, 600); 
    };

    return (
        <div className="splash-body">
            <div id="comic-cover">
                <div className="cover-content">
                    <h3 className="project-number">Project #1</h3>
                    <h1 className="cover-title">Gaming <br /> Portfolio</h1>
                    <p className="author-name">By Manrijan Barbosa</p>
                    
                    <button onClick={openBook} className="comic-button-label">
                        Open Comic
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SplashPage;