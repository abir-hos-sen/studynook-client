import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiHome, FiImage, FiMapPin, FiUsers, FiDollarSign, FiAlignLeft, FiCheck } from 'react-icons/fi';

const AddRoom = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        document.title = "StudyNook - Add Room";
    }, []);

    const amenitiesOptions = ['Whiteboard', 'Projector', 'Wi-Fi', 'Power Outlets', 'Quiet Zone', 'Air Conditioning'];
    const [selectedAmenities, setSelectedAmenities] = useState([]);

    const handleAmenityChange = (amenity) => {
        setSelectedAmenities(prev => 
            prev.includes(amenity) 
            ? prev.filter(a => a !== amenity)
            : [...prev, amenity]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        
        const newRoom = {
            name: form.name.value,
            description: form.description.value,
            image: form.image.value,
            floor: form.floor.value,
            capacity: parseInt(form.capacity.value),
            hourlyRate: parseFloat(form.hourlyRate.value),
            amenities: selectedAmenities
        };

        try {
            setLoading(true);
            await axios.post(`${import.meta.env.VITE_API_URL}/api/rooms`, newRoom, { withCredentials: true });
            toast.success('Room added successfully');
            navigate('/my-listings');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add room');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen pt-24 pb-16 overflow-hidden bg-slate-50 dark:bg-dark-bg">
            {/* Ambient Background Glow */}
            <div className="bg-mesh-glow"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="glass-card p-8 md:p-12 shadow-2xl relative overflow-hidden border border-white/50 dark:border-slate-800/80">
                    
                    {/* Embedded Card Glows */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-500/10 dark:bg-accent-500/5 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="text-center mb-10 relative">
                        <div className="inline-flex items-center justify-center p-3 bg-primary-500/10 rounded-2xl mb-4 text-primary-500">
                            <FiHome size={28} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            List Your Study Room
                        </h1>
                        <p className="mt-3 text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
                            Share your premium quiet space with students and professionals. Fill out the details below to get started.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 relative">
                        <div className="bg-white/40 dark:bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-white/50 dark:border-slate-800/60 backdrop-blur-md">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <FiAlignLeft /> Room Name
                                    </label>
                                    <input type="text" name="name" required className="input-premium" placeholder="e.g., Silent Corner 101" />
                                </div>
                                
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <FiImage /> Image URL
                                    </label>
                                    <input type="url" name="image" required className="input-premium" placeholder="https://example.com/image.jpg" />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <FiMapPin /> Floor/Location
                                    </label>
                                    <input type="text" name="floor" required className="input-premium" placeholder="e.g., 3rd Floor" />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <FiUsers /> Capacity
                                    </label>
                                    <input type="number" name="capacity" required min="1" className="input-premium" placeholder="e.g., 4" />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <FiDollarSign /> Hourly Rate ($)
                                    </label>
                                    <input type="number" name="hourlyRate" required min="0" step="0.5" className="input-premium" placeholder="e.g., 5" />
                                </div>

                                <div className="md:col-span-2 space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800/60">
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                                        Included Amenities
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {amenitiesOptions.map(amenity => {
                                            const isSelected = selectedAmenities.includes(amenity);
                                            return (
                                                <div 
                                                    key={amenity}
                                                    onClick={() => handleAmenityChange(amenity)}
                                                    className={`cursor-pointer flex items-center p-3 rounded-xl border transition-all duration-200 ${
                                                        isSelected 
                                                        ? 'bg-primary-500/10 border-primary-500/50 text-primary-600 dark:text-primary-400' 
                                                        : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary-500/30'
                                                    }`}
                                                >
                                                    <div className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center mr-3 border ${
                                                        isSelected ? 'bg-primary-500 border-primary-500 text-white' : 'border-slate-300 dark:border-slate-600'
                                                    }`}>
                                                        {isSelected && <FiCheck size={14} />}
                                                    </div>
                                                    <span className="text-sm font-semibold">{amenity}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-2 pt-4">
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <FiAlignLeft /> Room Description
                                    </label>
                                    <textarea name="description" required rows="4" className="input-premium resize-none" placeholder="Write a captivating description highlighting what makes this room perfect for studying..."></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button type="submit" disabled={loading} className="btn-premium-primary py-4 px-10 text-base font-bold w-full md:w-auto flex items-center justify-center gap-2">
                                {loading ? (
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                ) : <FiHome size={20} />}
                                {loading ? 'Publishing Room...' : 'Publish Room'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddRoom;
