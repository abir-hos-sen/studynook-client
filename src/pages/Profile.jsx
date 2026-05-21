import { useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiArrowLeft, FiCamera, FiSettings, FiMail, FiPhone, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    if (!user) return null;

    const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1a3a6b&color=fff&size=128&bold=true`;

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
                                    onClick={() => navigate('/profile/settings')}
                                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                                >
                                    <FiCamera size={12} />
                                </button>
                            </div>
                        </div>

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

                {/* Hidden file input ref (unused but kept for future) */}
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" />
            </div>
        </div>
    );
};

export default Profile;
