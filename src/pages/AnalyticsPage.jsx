import { useState, useEffect } from 'react';
import API from '../api/axios';

const AnalyticsPage = () => {
  const [data, setData] = useState({ users: [], posts: [] });

  useEffect(() => {
    const fetchData = async () => {
      const [uRes, pRes] = await Promise.all([
        API.get('/admin/users'),
        API.get('/admin/posts')
      ]);
      setData({ users: uRes.data, posts: pRes.data });
    };
    fetchData();
  }, []);

  const activeUsers = data.users.filter(u => u.status === 'active').length;
  
  return (
    <div className="analytics-page">
      <h1>Admin Analytics</h1>
      <div className="grid">
        <div className="card"><h3>Total Users</h3><p>{data.users.length}</p></div>
        <div className="card"><h3>Active</h3><p>{activeUsers}</p></div>
        <div className="card"><h3>Total Posts</h3><p>{data.posts.length}</p></div>
      </div>
    </div>
  );
};
export default AnalyticsPage;