import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSettings, FiUser, FiMail, FiCalendar, FiPhone, FiSave, FiShield, FiCamera } from 'react-icons/fi';

const ProfileSettings = () => {
    const { user, updateAuthUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        document.title = 'StudyNook - Account Settings';
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setBirthday(user.birthday || '');
            setPhone(user.phone || '');
        }
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!name.trim()) return toast.error('Name cannot be empty');
        if (!email.trim()) return toast.error('Email cannot be empty');

        setLoading(true);
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/update-profile`, {
                name: name.trim(),
                email: email.trim(),
                birthday,
                phone: phone.trim(),
                photoURL: user.photoURL
            });
            updateAuthUser(data.user);
            toast.success('Settings saved successfully!');
            navigate('/profile');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1a3a6b&color=fff&size=128&bold=true`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pt-20 pb-16">
            <div className="max-w-2xl mx-auto px-4">

                {/* Back to Profile */}
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
                    <Link
                        to="/profile"
                        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors"
                    >
                        <FiArrowLeft size={15} /> Back to Profile
                    </Link>
                </motion.div>

                {/* Settings Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800/60 overflow-hidden"
                >
                    <form onSubmit={handleSave}>
                        <div className="p-8 space-y-7">

                            {/* Header */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/40">
                                    <FiSettings size={22} className="text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Account Settings</h1>
                                    <p className="text-sm text-slate-400 font-medium">Update your profile parameters and contact coordinates</p>
                                </div>
                            </div>



                            {/* Form Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <FiUser size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                            placeholder="Your full name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Birthday */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                        Date of Birth
                                    </label>
                                    <div className="relative">
                                        <FiCalendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="date"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                            value={birthday}
                                            onChange={(e) => setBirthday(e.target.value)}
                                            max={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <FiPhone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="tel"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                            placeholder="+8801XXXXXXXXX"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Important Notice */}
                            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4">
                                <div className="flex gap-3">
                                    <FiShield size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                                        <strong>Important:</strong> If you modify your primary email address, your active auth token session will be securely regenerated and updated instantly. Other accounts will not be able to claim your old email once modified.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-end gap-3">
                            <Link
                                to="/profile"
                                className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold shadow-md hover:shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
                            >
                                <FiSave size={15} />
                                {loading ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfileSettings;
