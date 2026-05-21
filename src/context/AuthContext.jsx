/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const setAuthToken = (token) => {
        if (token) {
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    // Setup Axios Interceptor for credentials
    useEffect(() => {
        axios.defaults.withCredentials = true;
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

    // Fetch user from our backend to verify JWT cookie
    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`);
            setUser(data);
        } catch {
            setUser(null);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUser();
    }, []);

    const loginWithGoogle = async (googleUserData) => {
        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
                name: googleUserData.name,
                email: googleUserData.email,
                photoURL: googleUserData.photoURL
            });
            const { user, token } = res.data;
            if (token) {
                setAuthToken(token);
            }
            setUser(user);
            return res.data;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            // Logout from backend (clear cookie)
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`);
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            setAuthToken(null);
            setUser(null);
            setLoading(false);
        }
    };

    const updateAuthUser = (userData) => {
        setUser(userData);
    }

    const authInfo = {
        user,
        loading,
        setLoading,
        loginWithGoogle,
        logout,
        updateAuthUser,
        fetchUser,
        setAuthToken
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};
