// frontend/src/pages/AdminPage.js
import { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState('users');

  // Analytics Calculations
  const activeUsers = users.filter(u => u.status === 'active').length;
  const inactiveUsers = users.length - activeUsers;

  useEffect(() => {
    API.get('/admin/users').then(r => setUsers(r.data));
    API.get('/admin/posts').then(r => setPosts(r.data));
  }, []);

  const toggleStatus = async (id) => {
    const { data } = await API.put(`/admin/users/${id}/status`);
    setUsers(users.map(u => u._id === id ? data.user : u));
  };

  const removePost = async (id) => {
    await API.put(`/admin/posts/${id}/remove`);
    setPosts(posts.map(p => p._id === id ? { ...p, status: 'removed' } : p));
  };

  const editPost = async (id, currentTitle) => {
    const newTitle = prompt("Edit Post Title:", currentTitle);
    if (newTitle) {
      const { data } = await API.put(`/admin/posts/${id}`, { title: newTitle });
      setPosts(posts.map(p => p._id === id ? data.post : p));
    }
  };

  return (
    <div className='admin-page'>
      <h2>Admin Dashboard</h2>
      
      {/* Analytics Section */}
      <div className='analytics-summary' style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div className='stat-card'>Active Users: <strong>{activeUsers}</strong></div>
        <div className='stat-card'>Inactive Users: <strong>{inactiveUsers}</strong></div>
        <div className='stat-card'>Total Posts: <strong>{posts.length}</strong></div>
      </div>

      <div className='admin-tabs'>
        <button onClick={() => setTab('users')} className={tab === 'users' ? 'active' : ''}>
          Members ({users.length})
        </button>
        <button onClick={() => setTab('posts')} className={tab === 'posts' ? 'active' : ''}>
          All Posts ({posts.length})
        </button>
      </div>

      {tab === 'users' && (
        <table className='admin-table'>
          <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className={`status-badge ${u.status}`}>{u.status}</span></td>
                <td>
                  <button onClick={() => toggleStatus(u._id)} 
                          className={u.status === 'active' ? 'btn-danger' : 'btn-success'}>
                    {u.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === 'posts' && (
        <table className='admin-table'>
          <thead><tr><th>Title</th><th>Author</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {posts.map(p => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{p.author?.name}</td>
                <td><span className={`status-badge ${p.status}`}>{p.status}</span></td>
                <td>
                  {p.status === 'published' && (
                    <>
                      <button onClick={() => editPost(p._id, p.title)} style={{ marginRight: '10px' }}>Edit</button>
                      <button className='btn-danger' onClick={() => removePost(p._id)}>Remove</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;