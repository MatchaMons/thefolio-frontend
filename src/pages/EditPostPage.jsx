import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const EditPostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            const { data } = await API.get(`/posts/${id}`);
            setTitle(data.title);
            setContent(data.content);
        };
        fetchPost();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/posts/${id}`, { title, content });
            navigate(`/post/${id}`);
        } catch (err) {
            alert("UPDATE FAILED");
        }
    };

    return (
        <main className="comic-page">
            <section className="content panel panel-full" style={{ maxWidth: '700px', margin: '0 auto' }}>
                <h2 className="banger-text">REVISE INTEL</h2>
                <form onSubmit={handleUpdate} className="comic-form">
                    <label>UPDATED TITLE</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

                    <label>UPDATED CONTENT</label>
                    <textarea rows="6" value={content} onChange={(e) => setContent(e.target.value)} required />

                    <button type="submit" className="critical-hit-btn">UPDATE LOGS</button>
                </form>
            </section>
        </main>
    );
};

export default EditPostPage;