import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const PostPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [reactionCount, setReactionCount] = useState(0);
    const [userReaction, setUserReaction] = useState(null);

    // --- POPUP STATE ---
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ title: '', message: '', isError: false });

    const BACKEND_URL = "https://thefolio-backend-u3mx.onrender.com";
    const IMAGE_BASE_URL = BACKEND_URL.replace('/api', '');

    useEffect(() => {
        const fetchFullIntel = async () => {
            try {
                const { data } = await API.get(`/posts/${id}`);
                setPost(data);
                setReactionCount(parseInt(data.reaction_count) || 0);
                setUserReaction(data.user_reaction || null);
            } catch (err) {
                console.error("POST FETCH ERROR:", err);
                // Optional: navigate('/feed') if post is missing
            }

            try {
                const commentRes = await API.get(`/comments/${id}`);
                setComments(commentRes.data);
            } catch (err) {
                console.warn("COMMENT FETCH ERROR:", err);
            }
        };
        if (id) fetchFullIntel();
    }, [id]);

    const handleReaction = async () => {
        if (!user) return navigate('/login');
        try {
            const { data } = await API.post(`/posts/${id}/react`);
            setReactionCount(data.reactionCount);
            setUserReaction(data.userReaction);
        } catch (err) {
            console.error("REACTION FAILED:", err);
        }
    };

    const handleDeletePost = () => {
        setModalConfig({ 
            title: 'CAUTION!', 
            message: 'ARE YOU SURE YOU WANT TO SCRUB THIS INTEL? THIS ACTION IS PERMANENT.', 
            isError: true 
        });
        setShowModal(true);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const { data } = await API.post(`/comments/${id}`, { content: newComment });
            setComments([data, ...comments]);
            setNewComment("");
        } catch (err) {
            console.error("COMMENT FAILED:", err);
        }
    };

    const confirmDelete = async () => {
        try {
            await API.delete(`/posts/${id}`);
            setModalConfig({ title: 'BAM!', message: 'MISSION SCRUBBED: INTEL REMOVED.', isError: false });
        } catch (err) {
            setModalConfig({ title: 'OOF!', message: 'SCRUB FAILED.', isError: true });
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        if (modalConfig.title === 'BAM!') {
            navigate('/feed');
        }
    };

    // 🛡️ --- LOADING SHIELD ---
    // This prevents the "Cannot read properties of null" error
    if (!post) {
        return (
            <main className="comic-page post-detail-container">
                <section className="content panel panel-full" style={{ textAlign: 'center', padding: '50px' }}>
                    <h1 className="banger-text">DECRYPTING INTEL...</h1>
                    <p className="system-text">ESTABLISHING SECURE CONNECTION TO DATABASE</p>
                </section>
            </main>
        );
    }

    return (
        <main className="comic-page post-detail-container">
            <section className="content panel panel-full post-content-panel">
                <div className="post-header">
                    <Link to="/feed" className="back-link">← BACK TO GUILD BOARD</Link>
                    <h1 className="banger-text post-title-extra-large">{post.title?.toUpperCase()}</h1>
                    <p className="post-meta">
                        BY: {(post.author_name || "UNKNOWN").toUpperCase()} | RANK: {post.author_rank || 'MEMBER'}
                    </p>
                </div>

                {post.image && (
                    <div className="post-image-frame post-image-wrapper">
                        <img 
                            src={`${IMAGE_BASE_URL}${post.image}`} 
                            alt="Intel" 
                            className="post-image-large" 
                            onError={(e) => { 
                                e.target.onerror = null; 
                                e.target.src = "https://placehold.co/600x400?text=INTEL+NOT+FOUND"; 
                            }}
                        />
                    </div>
                )}

                <div className="post-content-body post-body-text">
                    <p>{post.body || post.content || "NO INTEL PROVIDED"}</p>
                </div>

                {(user?.id === post.author_id || user?.role === 'admin') && (
                    <div className="post-actions" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        {user.id === post.author_id && (
                            <button onClick={() => navigate(`/edit-post/${post.id}`)} className="comic-button-label">EDIT</button>
                        )}
                        <button onClick={handleDeletePost} className="logout-btn-comic" style={{ backgroundColor: '#ff4d4d' }}>DELETE</button>
                    </div>
                )}

                <div className="reaction-bar">
                    <button 
                        onClick={handleReaction} 
                        className={`critical-hit-btn ${userReaction ? 'active' : ''}`}
                    >
                        {userReaction ? '❤️' : '👍'} {reactionCount} OPERATORS REACTED
                    </button>
                </div>

                <hr className="comic-divider" />

                <div className="comment-section-area">
                    <h3 className="panel-sub-title">INTEL FEEDBACK (COMMENTS)</h3>
                    
                    <form onSubmit={handleCommentSubmit} className="comic-form">
                        <textarea 
                            value={newComment} 
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add your intel..."
                            rows="3"
                            required
                        />
                        <button type="submit" className="comic-button-label">TRANSMIT COMMENT</button>
                    </form>

                    <div className="comments-list" style={{ marginTop: '20px' }}>
                        {comments.length > 0 ? (
                            comments.map((c) => (
                                <div key={c.id} className="comment-bubble">
                                    <p className="comment-user">{(c.author_name || "OPERATOR").toUpperCase()}:</p>
                                    <p className="comment-text">{c.content}</p>
                                </div>
                            ))
                        ) : (
                            <p className="system-text">NO FEEDBACK RECORDED FOR THIS MISSION.</p>
                        )}
                    </div>
                </div>
            </section>

            {showModal && (
                <div className="modal-overlay" style={{ display: 'flex' }}>
                    <div className="comic-popup">
                        <div className="popup-header">
                            <span className="system-text">QUEST LOG:</span>
                        </div>
                        <div className="popup-content">
                            <div className="quest-bam" style={{ color: modalConfig.isError ? "#ff4d4d" : "var(--yellow)" }}>
                                {modalConfig.title}
                            </div>
                            <p>{modalConfig.message}</p>
                            {modalConfig.title === 'CAUTION!' ? (
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    <button onClick={confirmDelete} className="comic-button-label" style={{ backgroundColor: '#ff4d4d' }}>CONFIRM</button>
                                    <button onClick={() => setShowModal(false)} className="comic-button-label">ABORT</button>
                                </div>
                            ) : (
                                <button onClick={handleModalClose} className="comic-button-label">OK</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default PostPage;