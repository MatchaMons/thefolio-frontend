import React from 'react';
import locationImg from '../assets/Location.jpg';

export default function ContactPage() {
    return (
        /* The inline style here is the 'key' that unlocks your .panel-third classes */
        <main className="comic-page" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(12, 1fr)', 
            gap: '20px' 
        }}>
            
            {/* 1. CONTACT FORM (span 8) */}
            <section className="panel panel-two-third">
                <h2>Contact Me</h2>
                <form id="contact-form">
                    <label>Name:</label>
                    <input type="text" placeholder="Your Name" required />

                    <label>Email:</label>
                    <input type="email" placeholder="example@email.com" required />

                    <label>Message:</label>
                    <textarea placeholder="Your message here" required minLength="10"></textarea>
                    
                    <span className="sound-effect">BAM!</span>
                    <button type="submit" className="critical-hit-btn">Send Message</button>
                </form>
            </section>

            {/* 2. LOCATION (span 4) */}
            <section className="content panel panel-third panel-tall">
                <h2>Location</h2>
                <img 
                    src={locationImg} 
                    alt="Map" 
                    style={{ width: '100%', height: 'auto', border: '3px solid black' }} 
                />
                <span className="sound-effect">POW!</span>
            </section>

            {/* 3. RESOURCES (span 12) */}
            <section className="panel panel-full">
                <h2>Learning Resources</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Resource Name</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><a href="https://www.ign.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-color)' }}>IGN</a></td>
                            <td>Gaming news, reviews, and updates</td>
                        </tr>
                        <tr>
                            <td><a href="https://store.steampowered.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-color)' }}>Steam</a></td>
                            <td>PC gaming platform and community</td>
                        </tr>
                        <tr>
                            <td><a href="https://www.gamespot.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-color)' }}>Gamespot</a></td>
                            <td>Game reviews and gaming culture articles</td>
                        </tr>
                    </tbody>
                </table>
                <span className="sound-effect">ZAP!</span>
            </section>
        </main>
    );
}