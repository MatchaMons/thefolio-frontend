import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const BACKEND_URL = 'https://thefolio-backend-u3mx.onrender.com';

const ProfilePage = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [pic, setPic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleAvatarClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPic(file);
      setPreview(URL.createObjectURL(file));
      setMsg('NEW AVATAR READY! PRESS SAVE STATS.');
    }
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setMsg('UPLOADING DATA...');
    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio', bio);
    if (pic) fd.append('profilePic', pic);

    try {
      const { data } = await API.put('/auth/profile', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (setUser) setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      setMsg('SUCCESS: PLAYER DATA UPDATED!');
      setPreview(null);
    } catch (err) {
      setMsg(err.response?.data?.message || 'CRITICAL ERROR: UPDATE FAILED');
    }
};

 const handlePassword = async (e) => {
    e.preventDefault();
    setMsg('INITIATING SECURITY UPGRADE...');
    
    try {
      // ✅ Simplified to use your API tool
      const { data } = await API.put('/auth/change-password', 
        { currentPassword: curPw, newPassword: newPw }
      );
      setMsg(data.message);
      setCurPw(''); 
      setNewPw('');
    } catch (err) {
      setMsg(err.response?.data?.message || 'ERROR: WRONG CURRENT PASSWORD');
    }
};

    const picSrc = user?.profilePic 
    ? `${BACKEND_URL}/uploads/${user.profilePic}` 
    : '/default-avatar.png';

  return (
    <main className="comic-page profile-layout">
      {/* --- HEADER --- */}
      <section className="content panel profile-header-panel">
        <div className="comic-badge profile-sticker">CHARACTER SELECT</div>
        <div className="profile-top">
          <div className="avatar-select-container" onClick={handleAvatarClick}>
            <div className="avatar-frame">
              <img src={preview || picSrc} alt="Profile" className="profile-pic-preview" />
              <div className="avatar-overlay"><span>CHANGE ART</span></div>
            </div>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
          </div>
          <div className="profile-identity">
            <h2 className="player-name-text">{(user?.name || 'OPERATOR').toUpperCase()}</h2>
            <p className="player-rank">RANK: NOVICE DEVELOPER</p>
          </div>
        </div>
        {msg && <div className={`comic-msg-bubble ${msg.includes('ERROR') ? 'msg-error' : 'msg-success'}`}>{msg}</div>}
      </section>

      {/* --- FORMS --- */}
      <div className="profile-grid">
        <section className="content panel">
          <h3 className="panel-sub-title">EDIT PLAYER STATS</h3>
          <form onSubmit={handleProfile} className="comic-form">
            <label>DISPLAY NAME</label>
            <input value={name} onChange={e => setName(e.target.value)} required />
            <label>PLAYER BIO</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} />
            <button type="submit" className="critical-hit-btn">SAVE STATS</button>
          </form>
        </section>

        {/* --- SECURITY PANEL --- */}
        <section className="content panel">
          <h3 className="panel-sub-title">SECURITY UPGRADE</h3>
          <form onSubmit={handlePassword} className="comic-form">
            <label style={{ color: '#000', fontWeight: 'bold' }}>CURRENT PASSWORD</label>
            {/* 🟢 REMOVED ALL RED BORDER INLINE STYLES HERE */}
            <input 
              type="password" 
              value={curPw} 
              onChange={e => setCurPw(e.target.value)} 
              required 
              style={{ border: '3px solid #000', boxShadow: '4px 4px 0px #000' }}
            />
            
            <label style={{ color: '#000', fontWeight: 'bold', marginTop: '10px' }}>NEW PASSWORD</label>
            <input 
              type="password" 
              value={newPw} 
              onChange={e => setNewPw(e.target.value)} 
              required 
              minLength={6} 
              style={{ border: '3px solid #000', boxShadow: '4px 4px 0px #000' }}
            />
            
            <button type="submit" className="critical-hit-btn security-btn" style={{ marginTop: '20px' }}>
              CHANGE PASSWORD
            </button>
          </form>
        </section>
      </div>

      <div className="danger-zone-container">
        <button onClick={() => { logout(); navigate('/'); }} className="logout-btn-comic">EXIT TO SPLASH SCREEN</button>
      </div>
    </main>
  );
};

export default ProfilePage;