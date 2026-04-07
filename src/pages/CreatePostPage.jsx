import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios'; // Ensure this points to your axios instance

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    
    // --- MODAL STATE ---
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: 'FAILED!',
        message: '',
        isError: false
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. CRITICAL: You MUST use FormData for Multer/Images to work
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) {
            formData.append('image', image); // 'image' must match your backend upload.single('image')
        }

        try {
            // 2. Send formData with the correct headers
            await API.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            // 🟢 SUCCESS POPUP
            setModalConfig({
                title: 'SUCCESSFUL!',
                message: 'MISSION ACCOMPLISHED: INTEL POSTED TO THE BOARD!',
                isError: false
            });
            setShowModal(true);

            // Clear inputs
            setTitle('');
            setContent('');
            setImage(null);
        } catch (err) {
            console.error("DETAILED ERROR:", err.response?.data || err.message);
            
            // 🔴 ERROR POPUP
            setModalConfig({
                title: 'OOF!',
                message: 'QUEST FAILED: COULD NOT BROADCAST INTEL.',
                isError: true
            });
            setShowModal(true);
        }
    };

    // Helper to handle closing the modal and navigating
    const handleModalClose = () => {
        setShowModal(false);
        if (!modalConfig.isError) {
            navigate('/feed');
        }
    };

    return (
        <main className="feed-wrapper">
            <div className="main-panel guild-board" style={{ maxWidth: '600px' }}>
                <h1 className="banger-text">CREATE NEW MISSION</h1>
                <form onSubmit={handleSubmit} className="comic-form">
                    <div className="input-group">
                        <label className="banger-text">MISSION TITLE</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                            placeholder="Enter Mission Name..."
                        />
                    </div>

                    <div className="input-group">
                        <label className="banger-text">INTEL DETAILS</label>
                        <textarea 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            required 
                            placeholder="Describe the mission objective..."
                        />
                    </div>

                    <div className="input-group">
                        <label className="banger-text">ATTACH VISUAL (OPTIONAL)</label>
                        <input 
                            type="file" 
                            onChange={(e) => setImage(e.target.files[0])} 
                            accept="image/*"
                        />
                    </div>

                    <button type="submit" className="comic-button-label" style={{ width: '100%', marginTop: '20px' }}>
                        BROADCAST INTEL
                    </button>
                </form>
            </div>

            {/* --- UNIQUE QUEST LOG POPUP --- */}
            {showModal && (
                <div className="modal-overlay" style={{ display: 'flex' }}>
                    <div className="comic-popup">
                        <div className="popup-header">
                            <span className="system-text">QUEST LOG:</span>
                        </div>
                        <div className="popup-content">
                            <div 
                                className="quest-bam" 
                                style={{ color: modalConfig.isError ? "#ff4d4d" : "var(--yellow)" }}
                            >
                                {modalConfig.title}
                            </div>
                            <p>{modalConfig.message}</p>
                            <button 
                                onClick={handleModalClose} 
                                className="comic-button-label"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default CreatePostPage;