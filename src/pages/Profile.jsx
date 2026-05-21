import { useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiArrowLeft, FiCamera, FiSettings, FiMail, FiPhone, FiCalendar, FiCheckCircle, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, updateAuthUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
    const [newPhotoURL, setNewPhotoURL] = useState('');
    const [loading, setLoading] = useState(false);

    if (!user) return null;

    const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1a3a6b&color=fff&size=128&bold=true`;

    const handlePhotoUpdate = async (e) => {
        e.preventDefault();
        if (!newPhotoURL.trim()) {
            setIsUpdatingPhoto(false);
            return;
        }
        
        setLoading(true);
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/update-profile`, {
                name: user.name, // Keep existing name
                email: user.email,
                phone: user.phone,
                birthday: user.birthday,
                photoURL: newPhotoURL.trim()
            });
            updateAuthUser(data.user);
            toast.success('Profile picture updated successfully!');
            setIsUpdatingPhoto(false);
            setNewPhotoURL('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update photo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pt-20 pb-16">
            <div className="max-w-2xl mx-auto px-4">

                {/* Back to Home */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                >
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors"
                    >
                        <FiArrowLeft size={15} /> Back to Home
                    </Link>
                </motion.div>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800/60"
                >
                    {/* Banner */}
                    <div className="h-36 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 relative">
                        {/* Edit Settings Button */}
                        <button
                            onClick={() => navigate('/profile/settings')}
                            className="absolute top-4 right-4 flex items-center gap-2 bg-white/90 hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold px-4 py-2 rounded-full shadow-md transition-all hover:scale-105 border border-white/20"
                        >
                            <FiSettings size={13} /> Edit Settings
                        </button>
                    </div>

                    {/* Avatar Area */}
                    <div className="px-8 pb-8">
                        <div className="flex items-end gap-4 -mt-12 mb-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-900 shadow-xl bg-slate-200">
                                    <img
                                        src={user.photoURL || avatarFallback}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = avatarFallback; }}
                                    />
                                </div>
                                <button
                                    onClick={() => setIsUpdatingPhoto(true)}
                                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                                    title="Change Profile Picture via URL"
                                >
                                    <FiCamera size={12} />
                                </button>
                            </div>
                        </div>

                        {/* Photo URL Update Modal */}
                        <AnimatePresence>
                            {isUpdatingPhoto && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }} 
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-8 overflow-hidden"
                                >
                                    <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 relative">
                                        <button 
                                            onClick={() => setIsUpdatingPhoto(false)}
                                            className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        >
                                            <FiX size={16} />
                                        </button>
                                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Update Profile Picture</h3>
                                        <form onSubmit={handlePhotoUpdate} className="flex gap-2">
                                            <input
                                                type="url"
                                                placeholder="Enter image URL..."
                                                className="flex-1 px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                                value={newPhotoURL}
                                                onChange={(e) => setNewPhotoURL(e.target.value)}
                                                autoFocus
                                            />
                                            <button 
                                                type="submit" 
                                                disabled={loading}
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-70"
                                            >
                                                {loading ? 'Saving...' : 'Save'}
                                            </button>
                                        </form>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Name & Email */}
                        <div className="mb-7">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{user.name}</h1>
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40">
                                    <FiCheckCircle size={13} className="text-blue-600 dark:text-blue-400" />
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                                <FiMail size={13} />
                                <span>{user.email}</span>
                            </div>
                        </div>

                        {/* Info Cards */}
                        <div className="grid grid-cols-3 gap-4">
                            {/* Status */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/40">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Status</p>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Verified User</span>
                                </div>
                            </div>

                            {/* Date of Birth */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/40">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Date of Birth</p>
                                <div className="flex items-center gap-1.5">
                                    <FiCalendar size={13} className="text-slate-400 shrink-0" />
                                    <span className={`text-sm font-bold ${user.birthday ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>
                                        {user.birthday || 'Not specified'}
                                    </span>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/40">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Phone Number</p>
                                <div className="flex items-center gap-1.5">
                                    <FiPhone size={13} className="text-slate-400 shrink-0" />
                                    <span className={`text-sm font-bold ${user.phone ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>
                                        {user.phone || 'Not specified'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default Profile;
