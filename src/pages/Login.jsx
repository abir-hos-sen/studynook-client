import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { loginWithGoogle, updateAuthUser, setLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        document.title = "StudyNook - Login";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            setLoading(true);
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
            updateAuthUser(data.user);
            toast.success(data.message);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setLoading(true);
                const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                    withCredentials: false
                });
                const profile = res.data;
                await loginWithGoogle({
                    name: profile.name,
                    email: profile.email,
                    photoURL: profile.picture
                });
                toast.success("Login successful");
                navigate(from, { replace: true });
            } catch (err) {
                toast.error(err.response?.data?.message || err.message || 'Google login failed');
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            toast.error('Google Sign In failed');
        }
    });

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-dark-bg relative overflow-hidden transition-colors duration-300">
            {/* Ambient Background Glow */}
            <div className="bg-mesh-glow"></div>
            
            <div className="max-w-md w-full glass-card p-8 md:p-10 shadow-2xl relative overflow-hidden border border-white/50 dark:border-slate-800/80">
                {/* Embedded Card Glows */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-500/10 dark:bg-accent-500/5 rounded-full blur-2xl pointer-events-none"></div>

                <div className="relative">
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Sign in to access your account
                    </p>
                </div>

                <form className="mt-8 space-y-6 relative" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-rose-50 dark:bg-rose-950/20 border-l-4 border-rose-500 p-4 rounded-xl">
                            <p className="text-sm text-rose-700 dark:text-rose-400 font-semibold">{error}</p>
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="input-premium"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="input-premium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="w-full btn-premium-primary py-3.5 text-base font-bold">
                            Login
                        </button>
                    </div>
                </form>

                <div className="mt-8 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-slate-800/80"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                        <span className="px-3 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl text-slate-400 dark:text-slate-500">Or continue with</span>
                    </div>
                </div>

                <div className="mt-6 relative">
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full btn-premium-secondary py-3.5 text-sm font-bold"
                    >
                        <FcGoogle className="h-5 w-5 mr-1" />
                        Google Sign In
                    </button>
                </div>

                <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-bold text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
