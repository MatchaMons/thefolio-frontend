import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    // The backend address where your images are hosted
    const BACKEND_URL = "http://localhost:5000";

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Fetching the joined data from your updated PostgreSQL route
                const { data } = await API.get('/posts');
                setPosts(data);
                setLoading(false);
            } catch (err) {
                console.error("FAILED TO RETRIEVE INTEL:", err);
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="feed-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <h2 className="banger-text" style={{ fontSize: '3rem', color: '#ffcc00', textShadow: '4px 4px 0px black' }}>
                    DECRYPTING DATA...
                </h2>
            </div>
        );
    }

    return (
        <main className="feed-wrapper">
            <section className="main-panel guild-board">
                <header className="board-header">
                    <h1 className="banger-text">GUILD NOTICE BOARD</h1>
                    <div className="status-bar">SYSTEM STATUS: ONLINE | OPERATORS ACTIVE</div>
                </header>

                <div className="comic-grid">
                    {posts.length > 0 ? (
                        posts.map((post, index) => (
                            <article 
                                key={post.id} // 🟢 FIX: Changed from _id to id for Postgres
                                className={`post-panel ${index % 3 === 0 ? 'large-panel' : ''}`}
                                onClick={() => navigate(`/posts/${post.id}`)}
                            >
                                <div className="panel-edge-tag">INTEL #{index + 1}</div>
                                
                                {post.image ? (
                                    <div className="panel-img-container">
                                        {/* 🟢 FIX: Correctly mapping the backend URL to the stored path */}
                                        <img src={`${BACKEND_URL}${post.image}`} alt="Mission Intel" />
                                    </div>
                                ) : (
                                    <div className="panel-placeholder">NO VISUAL ATTACHED</div>
                                )}

                                <div className="panel-content">
                                    <h3 className="post-title">{(post.title || "Untitled Mission").toUpperCase()}</h3>
                                    <p className="post-excerpt">
                                        {/* 🟢 FIX: Changed from post.content to post.body to match DB column */}
                                        {post.body ? post.body.substring(0, 80) : "No intel details provided..."}
                                        {post.body?.length > 80 && "..."}
                                    </p>
                                    
                                    <div className="post-footer">
                                        {/* 🟢 FIX: Using the author_name alias from our SQL JOIN */}
                                        <span className="post-author">OP: {(post.author_name || "Unknown Operator").toUpperCase()}</span>
                                        <span className="view-btn">VIEW →</span>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="empty-state">
                            <h2 className="banger-text">NO MISSIONS AVAILABLE</h2>
                            <p>THE BOARD IS CLEAR, OPERATOR. CHECK BACK LATER.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* FLOATING CREATE BUTTON */}
            {user && (
                <div 
                    className="create-post-fab" 
                    onClick={() => navigate('/create-post')}
                    title="POST NEW INTEL"
                >
                    <div className="fab-inner">
                        <span className="plus-sign">+</span>
                        <span className="fab-text">POST!</span>
                    </div>
                </div>
            )}
        </main>
    );
};

export default FeedPage;