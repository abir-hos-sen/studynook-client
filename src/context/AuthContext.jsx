/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Setup Axios Interceptor for credentials
    useEffect(() => {
        axios.defaults.withCredentials = true;
    }, []);

    // Fetch user from our backend to verify JWT cookie
    const fetchUser = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`);
            setUser(data);
        } catch {
            setUser(null);
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
            setUser(res.data.user);
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
            setUser(null);
        } catch (error) {
            console.error('Logout error', error);
        } finally {
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
        fetchUser
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};
