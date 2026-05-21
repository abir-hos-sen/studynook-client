import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiUser, FiMail, FiPhone, FiCalendar, FiCamera, FiSave, 
    FiSettings, FiEdit3, FiCheck, FiX, FiShield
} from 'react-icons/fi';

const Profile = () => {
    const { user, updateAuthUser } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);

    // Photo state
    const [photoURL, setPhotoURL] = useState('');
    const [photoInput, setPhotoInput] = useState('');
    const [editingPhoto, setEditingPhoto] = useState(false);

    // Profile info state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // Settings state
    const [phone, setPhone] = useState('');
    const [birthday, setBirthday] = useState('');

    useEffect(() => {
        document.title = "StudyNook - My Profile";
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setPhotoURL(user.photoURL || '');
            setPhotoInput(user.photoURL || '');
            setPhone(user.phone || '');
            setBirthday(user.birthday || '');
        }
    }, [user]);

    const handlePhotoSave = async () => {
        if (!photoInput.trim()) return toast.error("Please enter a valid image URL");
        setLoading(true);
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/update-profile`, {
                name: user.name,
                email: user.email,
                phone: user.phone,
                birthday: user.birthday,
                photoURL: photoInput.trim()
            });
            updateAuthUser(data.user);
            setPhotoURL(photoInput.trim());
            setEditingPhoto(false);
            toast.success("Profile photo updated!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update photo");
        } finally {
            setLoading(false);
        }
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        if (!name.trim()) return toast.error("Name cannot be empty");
        setLoading(true);
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/update-profile`, {
                name: name.trim(),
                email: email.trim(),
                photoURL: user.photoURL,
                phone: user.phone,
                birthday: user.birthday
            });
            updateAuthUser(data.user);
            toast.success("Profile info updated!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleSettingsSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/update-profile`, {
                name: user.name,
                email: user.email,
                photoURL: user.photoURL,
                phone: phone.trim(),
                birthday: birthday
            });
            updateAuthUser(data.user);
            toast.success("Settings saved!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save settings");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    const tabs = [
        { id: 'profile', label: 'Profile Info', icon: FiUser },
        { id: 'settings', label: 'Settings', icon: FiSettings },
    ];

    return (
        <div className="relative min-h-screen pt-24 pb-16 overflow-hidden">
            <div className="bg-mesh-glow"></div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-center mb-10"
                >
                    <span className="badge-premium inline-block mb-3">Account</span>
                    <h1 className="text-4xl font-extrabold tracking-tight">My Profile</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage your personal information</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left - Avatar Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1"
                    >
                        <div className="glass-card p-6 border border-white/20 dark:border-slate-800/40 shadow-xl text-center space-y-5">
                            
                            {/* Avatar */}
                            <div className="relative inline-block mx-auto">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-500/40 shadow-2xl mx-auto">
                                    <img 
                                        src={photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7c3aed&color=fff&size=128`} 
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { 
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7c3aed&color=fff&size=128`; 
                                        }}
                                    />
                                </div>
                                <button 
                                    onClick={() => setEditingPhoto(!editingPhoto)}
                                    className="absolute bottom-0 right-0 w-9 h-9 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                                >
                                    <FiCamera size={16} />
                                </button>
                            </div>

                            {/* Name & role */}
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{user.name}</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
                                <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 capitalize">
                                    <FiShield size={11} /> {user.role || 'user'}
                                </span>
                            </div>

                            {/* Photo URL editor */}
                            <AnimatePresence>
                                {editingPhoto && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/60"
                                    >
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-left">Photo URL</p>
                                        <input
                                            type="url"
                                            className="input-premium text-sm"
                                            placeholder="Paste image URL here..."
                                            value={photoInput}
                                            onChange={(e) => setPhotoInput(e.target.value)}
                                        />
                                        {photoInput && (
                                            <div className="w-16 h-16 rounded-xl overflow-hidden mx-auto border-2 border-primary-500/30">
                                                <img 
                                                    src={photoInput} 
                                                    alt="preview" 
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={handlePhotoSave}
                                                disabled={loading}
                                                className="flex-1 btn-premium-primary py-2 text-sm flex items-center justify-center gap-1"
                                            >
                                                <FiCheck size={14}/> {loading ? 'Saving...' : 'Save Photo'}
                                            </button>
                                            <button 
                                                onClick={() => { setEditingPhoto(false); setPhotoInput(photoURL); }}
                                                className="btn-premium-secondary py-2 px-3 text-sm"
                                            >
                                                <FiX size={14}/>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Extra info */}
                            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-left">
                                {user.phone && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                        <FiPhone size={13} className="text-primary-500 shrink-0"/>
                                        <span>{user.phone}</span>
                                    </div>
                                )}
                                {user.birthday && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                        <FiCalendar size={13} className="text-primary-500 shrink-0"/>
                                        <span>{user.birthday}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right - Tabs */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                        className="lg:col-span-2"
                    >
                        <div className="glass-card border border-white/20 dark:border-slate-800/40 shadow-xl overflow-hidden">
                            
                            {/* Tab Header */}
                            <div className="flex border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all duration-200 ${
                                            activeTab === tab.id 
                                                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 bg-white/60 dark:bg-slate-900/40' 
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        <tab.icon size={15}/>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-8">
                                <AnimatePresence mode="wait">

                                    {/* Profile Info Tab */}
                                    {activeTab === 'profile' && (
                                        <motion.form
                                            key="profile"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            onSubmit={handleProfileSave}
                                            className="space-y-6"
                                        >
                                            <div>
                                                <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-1">Profile Information</h3>
                                                <p className="text-sm text-slate-400">Update your name and email address</p>
                                            </div>

                                            <div className="space-y-5">
                                                {/* Name */}
                                                <div className="space-y-2">
                                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                        <FiUser size={12}/> Full Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="input-premium"
                                                        placeholder="Your full name"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                {/* Email */}
                                                <div className="space-y-2">
                                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                        <FiMail size={12}/> Email Address
                                                    </label>
                                                    <input
                                                        type="email"
                                                        className="input-premium"
                                                        placeholder="your@email.com"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                    />
                                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                                        <FiShield size={11}/> Changing email will update your login credentials
                                                    </p>
                                                </div>
                                            </div>

                                            <button 
                                                type="submit" 
                                                disabled={loading}
                                                className="btn-premium-primary py-3 flex items-center justify-center gap-2 w-full"
                                            >
                                                <FiSave size={16}/> 
                                                {loading ? 'Saving...' : 'Save Profile'}
                                            </button>
                                        </motion.form>
                                    )}

                                    {/* Settings Tab */}
                                    {activeTab === 'settings' && (
                                        <motion.form
                                            key="settings"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            onSubmit={handleSettingsSave}
                                            className="space-y-6"
                                        >
                                            <div>
                                                <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-1">Personal Settings</h3>
                                                <p className="text-sm text-slate-400">Add your phone number and birthday</p>
                                            </div>

                                            <div className="space-y-5">
                                                {/* Phone */}
                                                <div className="space-y-2">
                                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                        <FiPhone size={12}/> Phone Number
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        className="input-premium"
                                                        placeholder="+880 1700-000000"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                    />
                                                </div>

                                                {/* Birthday */}
                                                <div className="space-y-2">
                                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                        <FiCalendar size={12}/> Birthday
                                                    </label>
                                                    <input
                                                        type="date"
                                                        className="input-premium"
                                                        value={birthday}
                                                        onChange={(e) => setBirthday(e.target.value)}
                                                        max={new Date().toISOString().split('T')[0]}
                                                    />
                                                </div>
                                            </div>

                                            <button 
                                                type="submit" 
                                                disabled={loading}
                                                className="btn-premium-primary py-3 flex items-center justify-center gap-2 w-full"
                                            >
                                                <FiSave size={16}/>
                                                {loading ? 'Saving...' : 'Save Settings'}
                                            </button>
                                        </motion.form>
                                    )}

                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
