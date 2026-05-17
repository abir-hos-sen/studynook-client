import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        photoURL: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { loginWithGoogle, setLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "StudyNook - Register";
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validatePassword = (password) => {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const isLengthValid = password.length >= 6;
        return hasUppercase && hasLowercase && isLengthValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validatePassword(formData.password)) {
            setError('Password must be at least 6 characters and contain at least one uppercase and one lowercase letter.');
            return;
        }
        
        try {
            setLoading(true);
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
            toast.success(data.message || 'Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            toast.success("Registration/Login successful");
            navigate('/');
        } catch (err) {
            toast.error(err.message || 'Google login failed');
        }
    };

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
                        Create an Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Join StudyNook to book your first room
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
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-2" htmlFor="name">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="input-premium"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
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
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-2" htmlFor="photoURL">
                                Photo URL
                            </label>
                            <input
                                id="photoURL"
                                name="photoURL"
                                type="url"
                                required
                                className="input-premium"
                                placeholder="https://example.com/photo.jpg"
                                value={formData.photoURL}
                                onChange={handleChange}
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
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="w-full btn-premium-primary py-3.5 text-base font-bold">
                            Register
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
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
