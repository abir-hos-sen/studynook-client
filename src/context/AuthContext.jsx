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

    // Setup Axios Interceptor — runs before EVERY request, reads token fresh from localStorage
    useEffect(() => {
        axios.defaults.withCredentials = true;
        const interceptor = axios.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        });
        // Cleanup interceptor on unmount
        return () => axios.interceptors.request.eject(interceptor);
    }, []);

    // Fetch user from our backend to verify JWT token
    const fetchUser = async () => {
        // If no API URL configured, skip fetch and set user to null
        if (!import.meta.env.VITE_API_URL) {
            setUser(null);
            setLoading(false);
            return;
        }
        const token = localStorage.getItem('token');
        // No token means user is not logged in - skip API call entirely
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`);
            // Strictly validate the response - must have _id and email
            if (data && data._id && data.email) {
                setUser(data);
            } else {
                setUser(null);
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
            }
        } catch {
            // Token invalid/expired — clear it and set user to null
            setUser(null);
            localStorage.removeItem('token');
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
            }, { withCredentials: true });
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
