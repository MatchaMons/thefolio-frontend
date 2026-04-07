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

    const BACKEND_URL = "http://localhost:5000";

    useEffect(() => {
        const fetchFullIntel = async () => {
            try {
                const { data } = await API.get(`/posts/${id}`);
                setPost(data);
                setReactionCount(parseInt(data.reaction_count) || 0);
                setUserReaction(data.user_reaction || null);

                const commentRes = await API.get(`/comments/${id}`);
                setComments(commentRes.data);
            } catch (err) {
                console.error("FAILED TO DECRYPT INTEL:", err);
            }
        };
        fetchFullIntel();
    }, [id]);

    const handleDeletePost = async () => {
        if (!window.confirm("ARE YOU SURE YOU WANT TO SCRUB THIS INTEL?")) return;
        try {
            await API.delete(`/posts/${id}`);
            setModalConfig({ title: 'BAM!', message: 'MISSION SCRUBBED: INTEL REMOVED.', isError: false });
            setShowModal(true);
        } catch (err) {
            setModalConfig({ title: 'OOF!', message: 'SCRUB FAILED.', isError: true });
            setShowModal(true);
        }
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

    const handleModalClose = () => {
        setShowModal(false);
        if (!modalConfig.isError) navigate('/feed'); 
    };

    if (!post) return <div className="comic-page"><h2>LOADING INTEL...</h2></div>;

    return (
        <main className="comic-page post-detail-container">
            <section className="content panel panel-full post-content-panel">
                {/* --- HEADER --- */}
                <div className="post-header">
                    <Link to="/feed" className="back-link">← BACK TO GUILD BOARD</Link>
                    <h1 className="banger-text post-title-extra-large">{post.title?.toUpperCase()}</h1>
                    <p className="post-meta">
                        BY: {(post.author_name || "UNKNOWN").toUpperCase()} | RANK: {post.author_rank || 'MEMBER'}
                    </p>
                </div>

                {/* --- MAIN IMAGE --- */}
                {post.image && (
                    <div className="post-image-frame post-image-wrapper">
                        <img 
                            src={`${BACKEND_URL}${post.image}`} 
                            alt="Intel" 
                            className="post-image-large" 
                        />
                    </div>
                )}

                {/* --- BODY CONTENT --- */}
                <div className="post-content-body post-body-text">
                    <p>{post.body || post.content}</p>
                </div>

                {/* --- OWNER ACTIONS --- */}
                {(user?.id === post.author_id || user?.role === 'admin') && (
                    <div className="post-actions" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        {user.id === post.author_id && (
                            <button onClick={() => navigate(`/edit-post/${post.id}`)} className="comic-button-label">EDIT</button>
                        )}
                        <button onClick={handleDeletePost} className="logout-btn-comic" style={{ backgroundColor: '#ff4d4d' }}>DELETE</button>
                    </div>
                )}

                {/* --- REACTIONS --- */}
                <div className="reaction-bar">
                   <button className="critical-hit-btn">
                     👍 {reactionCount} OPERATORS REACTED
                   </button>
                </div>

                <hr className="comic-divider" />

                {/* --- COMMENT SECTION --- */}
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

            {/* --- MODAL --- */}
            {showModal && (
                <div className="modal-overlay" style={{ display: 'flex' }}>
                    <div className="comic-popup">
                        <div className="popup-header"><span className="system-text">QUEST LOG:</span></div>
                        <div className="popup-content">
                            <div className="quest-bam" style={{ color: modalConfig.isError ? "#ff4d4d" : "var(--yellow)" }}>
                                {modalConfig.title}
                            </div>
                            <p>{modalConfig.message}</p>
                            <button onClick={handleModalClose} className="comic-button-label">OK</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default PostPage;