import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function RegisterPage() {
    const { setUser } = useAuth();
    const navigate = useNavigate();

    // 1. FORM STATE (Kept your structure, added email/password)
    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        email: '',     // Added for Backend
        password: '',  // Added for Backend
        dob: '',
        interest: '',
        agreed: false
    });

    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState('??');
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ title: '', message: '', isError: false });

    // 2. XP BAR LOGIC (Updated to include new fields)
    useEffect(() => {
        const requiredFields = ['fullname', 'username', 'email', 'password', 'dob', 'interest'];
        let filled = 0;

        requiredFields.forEach(field => {
            if (formData[field] && formData[field].length > 0) filled++;
        });
        if (formData.agreed) filled++;

        const progress = Math.round((filled / 7) * 100);
        setXp(progress);
    }, [formData]);

    // 3. LEVEL CALCULATION
    const calculateLevel = (dateString) => {
        if (!dateString) return 0;
        const birthDate = new Date(dateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        return age > 0 ? age : 0;
    };

    const handleDobChange = (e) => {
        const date = e.target.value;
        const age = calculateLevel(date);
        setFormData({ ...formData, dob: date });
        setLevel(age);
    };

    // 4. SUBMISSION LOGIC (MERN Integrated)
    const handleSubmit = async (e) => {
    e.preventDefault();

        if (formData.interest === "Hardcore" && level < 13) {
            setModalConfig({
                title: "LEVEL TOO LOW!",
                message: "Level 13+ needed for Hardcore tier!",
                isError: true
            });
            setShowModal(true);
            return;
        }

        const formattedDob = new Date(formData.dob).toISOString().split('T')[0];

    try {            
    const response = await API.post('/auth/register', {
        name: formData.fullname,
        email: formData.email,
        password: formData.password,
        gamer_tag: formData.username,
        dob: formData.dob,
        interest_level: formData.interest,
        role: 'member', 
        status: 'active'
    });

        localStorage.setItem('token', response.data.token);
        
        if (response.data && typeof setUser === 'function') {
        setUser({
            id: response.data.user?.id || response.data.id,
            name: response.data.user?.name || response.data.name,
            email: response.data.user?.email || response.data.email
        });
    } else {
        console.warn("User saved, but setUser is missing from context.");
    }

        setModalConfig({
        title: "QUEST COMPLETE!",
        message: `Welcome to the Guild, ${formData.username.toUpperCase()}!`,
        isError: false
    });
    setShowModal(true);
    setTimeout(() => navigate('/home'), 1500);

   } catch (err) {
        // Log the actual error object to the browser console
        console.dir(err); 
        setModalConfig({
            title: "QUEST FAILED!",
            message: err.response?.data?.message || "Check Database Constraints",
            isError: true
        });
        setShowModal(true);
    }
};

    return (
        <main className="comic-page">
            {/* Kept your exact classes: content panel panel-full */}
            <section className="content panel panel-full" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h2>Sign Up for Updates</h2>
                <p>Sign up to receive gaming news, community updates, and event announcements.</p>

                <form onSubmit={handleSubmit} id="registration-form">
                    {/* XP PROGRESS BAR */}
                    <div className="xp-container" style={{ marginBottom: '20px' }}>
                        <div id="xp-bar" style={{ width: `${xp}%`, transition: 'width 0.4s ease' }}></div>
                        <span className="xp-text">
                            {xp === 100 ? "LEVEL UP! 🌟" : `FORM PROGRESS: ${xp}%`}
                        </span>
                    </div>

                    <label>Full Name:</label>
                    <input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={formData.fullname}
                        onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    />

                    <label>Preferred Gamer Tag:</label>
                    <input
                        type="text"
                        placeholder="Username"
                        required
                        minLength="3"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />

                    {/* NEW: Email Field */}
                    <label>Email Address:</label>
                    <input
                        type="email"
                        placeholder="hero@example.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    {/* NEW: Password Field */}
                    <label>Password:</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        required
                        minLength="6"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />

                    <label>Date of Birth:</label>
                    <input
                        type="date"
                        required
                        value={formData.dob}
                        onChange={handleDobChange}
                    />
                    <p className="form-hint">Current Level: {level}</p>
                    <p className="form-hint">Note: You must be Level 13+ to join the Hardcore tier.</p>

                    <label>Interest Level:</label>
                    <div className="radio-group" style={{ display: 'flex', gap: '15px', margin: '10px 0' }}>
                        {['Casual', 'Competitive', 'Hardcore'].map((lvl) => (
                            <label key={lvl} style={{ cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="level"
                                    value={lvl}
                                    checked={formData.interest === lvl}
                                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                                    required
                                /> {lvl}
                            </label>
                        ))}
                    </div>

                    <label style={{ display: 'block', margin: '20px 0' }}>
                        <input
                            type="checkbox"
                            required
                            checked={formData.agreed}
                            onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                        /> I agree to the terms
                    </label>

                    <div style={{ position: 'relative' }}>
                        {/* 1:1 Positioning of the BAM! sound effect */}
                        <span className="sound-effect" style={{ top: '-920px', right: '-55px' }}>BAM!</span>
                        <button type="submit" className="critical-hit-btn">Register Now!</button>
                    </div>
                </form>
            </section>

            {/* MODAL OVERLAY (1:1 Logic) */}
            {showModal && (
                <div className="modal-overlay" style={{ display: 'flex' }}>
                    <div className="comic-popup">
                        <div className="popup-header"><span className="system-text">QUEST LOG:</span></div>
                        <div className="popup-content">
                            <div className="quest-bam" style={{ color: modalConfig.isError ? "#ff4d4d" : "var(--yellow)" }}>
                                {modalConfig.title}
                            </div>
                            <p>{modalConfig.message}</p>
                            <button onClick={() => setShowModal(false)} className="comic-button-label">OK</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}