import { createContext, useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import auth from '../firebase/firebase.config';
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
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const loginWithGoogle = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            // Send to our backend to get JWT cookie
            const { user: firebaseUser } = result;
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
                name: firebaseUser.displayName,
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL
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
            // Logout from firebase
            await signOut(auth);
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
