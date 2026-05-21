import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiSearch, FiSliders, FiUsers, FiMapPin } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [minRate, setMinRate] = useState('');
    const [maxRate, setMaxRate] = useState('');
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleViewDetails = (roomId) => {
        if (!user) {
            navigate('/login', { state: { from: { pathname: `/rooms/${roomId}` } } });
        } else {
            navigate(`/rooms/${roomId}`);
        }
    };

    const amenitiesList = ['Whiteboard', 'Projector', 'Wi-Fi', 'Power Outlets', 'Quiet Zone', 'Air Conditioning'];

    const fetchRooms = async () => {
        setLoading(true);
        try {
            let url = `${import.meta.env.VITE_API_URL}/api/rooms?`;
            if (search) url += `search=${search}&`;
            if (minRate) url += `minRate=${minRate}&`;
            if (maxRate) url += `maxRate=${maxRate}&`;
            if (selectedAmenities.length > 0) {
                url += `amenities=${selectedAmenities.join(',')}&`;
            }

            const { data } = await axios.get(url);
            setRooms(data);
        } catch (error) {
            console.error('Error fetching rooms', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "StudyNook - Available Rooms";
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchRooms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRooms();
    };

    const handleAmenityChange = (amenity) => {
        setSelectedAmenities(prev => 
            prev.includes(amenity) 
            ? prev.filter(a => a !== amenity)
            : [...prev, amenity]
        );
    };

    return (
        <div className="relative min-h-screen pt-24 pb-16 overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="bg-mesh-glow"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <div className="badge-premium inline-block">Study Suite Catalog</div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Available Study Rooms</h1>
                    <p className="max-w-2xl mx-auto text-slate-500 dark:text-slate-400 font-medium">Find and book the perfect room for your next study session.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="w-full lg:w-1/4">
                        <div className="glass-card p-6 border border-white/20 dark:border-slate-800/40 h-fit sticky top-28 space-y-6">
                            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                                <FiSliders className="text-primary-500" size={18} />
                                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Filters</h2>
                            </div>

                            <form onSubmit={handleSearch} className="space-y-6">
                                {/* Search by Name */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Search by Name</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            className="input-premium pl-10" 
                                            placeholder="Search rooms..." 
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                        <FiSearch className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                                    </div>
                                </div>

                                {/* Hourly Rate Range */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Hourly Rate ($)</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="number" 
                                            className="input-premium py-2.5 text-center text-sm" 
                                            placeholder="Min" 
                                            value={minRate}
                                            onChange={(e) => setMinRate(e.target.value)}
                                        />
                                        <span className="text-slate-400 font-medium">to</span>
                                        <input 
                                            type="number" 
                                            className="input-premium py-2.5 text-center text-sm" 
                                            placeholder="Max" 
                                            value={maxRate}
                                            onChange={(e) => setMaxRate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Amenities list */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Amenities</label>
                                    <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                                        {amenitiesList.map(amenity => (
                                            <div key={amenity} className="flex items-center">
                                                <input 
                                                    id={`amenity-${amenity}`} 
                                                    type="checkbox" 
                                                    className="h-4.5 w-4.5 text-primary-600 border-slate-300 dark:border-slate-800 rounded focus:ring-primary-500 bg-white/20 dark:bg-slate-900/30"
                                                    checked={selectedAmenities.includes(amenity)}
                                                    onChange={() => handleAmenityChange(amenity)}
                                                />
                                                <label htmlFor={`amenity-${amenity}`} className="ml-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 select-none">
                                                    {amenity}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" className="w-full btn-premium-primary py-2.5">
                                    Apply Filters
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Rooms Grid */}
                    <div className="w-full lg:w-3/4">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
                            </div>
                        ) : rooms.length === 0 ? (
                            <div className="text-center py-20 glass-card border border-white/20 dark:border-slate-800/40">
                                <div className="text-5xl mb-4">🔍</div>
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">No rooms found</h3>
                                <p className="text-slate-400 font-medium mb-6">Try adjusting your filters or search criteria.</p>
                                <button 
                                    onClick={() => {
                                        setSearch(''); setMinRate(''); setMaxRate(''); setSelectedAmenities([]);
                                        setTimeout(fetchRooms, 100);
                                    }}
                                    className="btn-premium-secondary mx-auto"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {rooms.map((room) => (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={room._id} 
                                        className="glass-card-hover flex flex-col group overflow-hidden"
                                    >
                                        <div className="relative h-52 w-full overflow-hidden">
                                            <img 
                                                src={room.image} 
                                                alt={room.name} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-accent-500 border border-white/10 shadow-lg">
                                                ${room.hourlyRate}/hr
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-200 mb-2">{room.name}</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5 line-clamp-2">
                                                {room.description}
                                            </p>
                                            
                                            <div className="flex justify-between items-center text-xs text-slate-400 mb-5 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                                                <span className="flex items-center gap-1"><FiMapPin className="text-primary-500" /> Floor: {room.floor}</span>
                                                <span className="flex items-center gap-1"><FiUsers className="text-primary-500" /> Max {room.capacity}</span>
                                            </div>

                                            <div className="flex flex-wrap gap-1.5 mb-6">
                                                {room.amenities.slice(0, 3).map((amenity, i) => (
                                                    <span key={i} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800/80 text-[10px] font-bold rounded-lg text-slate-600 dark:text-slate-300 border border-slate-200/40 dark:border-slate-700/40">
                                                        {amenity}
                                                    </span>
                                                ))}
                                                {room.amenities.length > 3 && (
                                                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800/80 text-[10px] font-bold rounded-lg text-slate-600 dark:text-slate-300 border border-slate-200/40 dark:border-slate-700/40">
                                                        +{room.amenities.length - 3} More
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-auto pt-2">
                                                <button 
                                                    onClick={() => handleViewDetails(room._id)}
                                                    className="btn-premium-primary py-2.5 text-sm w-full"
                                                >
                                                    View Nook Details
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rooms;
