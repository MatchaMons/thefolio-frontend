import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Added missing loading state

    // 1. Check for existing token on load
    useEffect(() => {
    const token = localStorage.getItem('token');
    
    const verifyUser = async () => {
        if (token) {
            try {
                // Call an endpoint like /auth/me that returns the full user object
                const res = await API.get('/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
                localStorage.setItem('user', JSON.stringify(res.data));
            } catch (e) {
                console.error("Token invalid or expired");
                logout(); // Clears everything if the token is bad
            }
        }
        setLoading(false);
    };

    verifyUser();
}, []);

    // 2. Login Logic
    const login = async (email, password) => {
    try {
        const res = await API.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        
        // Handle nested or flat structure
        const userData = res.data.user || res.data; 
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    } catch (err) { throw err; }
};

    // 3. Logout Logic
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    // 4. THE SINGLE RETURN (Includes everything in the value)
    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);