import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiEdit2, FiCamera, FiShield, FiSave, FiX } from 'react-icons/fi';

const Profile = () => {
    const { user, updateAuthUser } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "StudyNook - Profile";
        if (user) {
            setName(user.name);
            setPhotoURL(user.photoURL);
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            return toast.error("Name cannot be empty");
        }
        setLoading(true);
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/update-profile`, {
                name,
                photoURL
            });
            updateAuthUser(data.user);
            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="relative min-h-screen pt-28 pb-16 overflow-hidden flex items-center justify-center">
            {/* Glow background */}
            <div className="bg-mesh-glow"></div>

            <div className="max-w-2xl w-full mx-4 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 border border-white/20 dark:border-slate-800/40 shadow-2xl space-y-8"
                >
                    <div className="text-center space-y-2">
                        <div className="badge-premium inline-block">Account Settings</div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Your Profile</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your personal information and profile settings</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        {/* Left Side: Avatar Card */}
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="relative group w-32 h-32 rounded-full overflow-hidden border-4 border-primary-500/50 shadow-xl">
                                <img 
                                    src={photoURL || 'https://via.placeholder.com/150'} 
                                    alt={user.name} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                                />
                            </div>
                            <div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 capitalize">
                                    <FiShield size={12} /> {user.role || 'User'}
                                </span>
                            </div>
                        </div>

                        {/* Right Side: Form / Info */}
                        <div className="flex-grow w-full space-y-6">
                            {!isEditing ? (
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><FiUser size={12} /> Full Name</label>
                                        <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{user.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><FiMail size={12} /> Email Address</label>
                                        <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{user.email}</p>
                                    </div>
                                    <div className="pt-4">
                                        <button 
                                            onClick={() => setIsEditing(true)}
                                            className="btn-premium-primary py-2.5 flex items-center justify-center gap-2 w-full md:w-fit px-6"
                                        >
                                            <FiEdit2 size={16} /> Edit Profile
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                            <FiUser size={12} /> Full Name
                                        </label>
                                        <input 
                                            type="text"
                                            className="input-premium"
                                            placeholder="Enter your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                            <FiCamera size={12} /> Profile Photo URL
                                        </label>
                                        <input 
                                            type="url"
                                            className="input-premium"
                                            placeholder="Enter image URL"
                                            value={photoURL}
                                            onChange={(e) => setPhotoURL(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="flex gap-3 pt-4">
                                        <button 
                                            type="submit" 
                                            disabled={loading}
                                            className="btn-premium-primary py-2.5 flex items-center justify-center gap-2 flex-grow"
                                        >
                                            <FiSave size={16} /> {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setName(user.name);
                                                setPhotoURL(user.photoURL);
                                            }}
                                            className="btn-premium-secondary py-2.5 flex items-center justify-center gap-2"
                                        >
                                            <FiX size={16} /> Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
