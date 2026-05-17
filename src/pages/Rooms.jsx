import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [minRate, setMinRate] = useState('');
    const [maxRate, setMaxRate] = useState('');
    const [selectedAmenities, setSelectedAmenities] = useState([]);

    const amenitiesList = ['Whiteboard', 'Projector', 'Wi-Fi', 'Power Outlets', 'Quiet Zone', 'Air Conditioning'];

    useEffect(() => {
        document.title = "StudyNook - Available Rooms";
        fetchRooms();
    }, []);

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
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Available Study Rooms</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">Find and book the perfect room for your next study session.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 mb-12">
                {/* Filters Sidebar */}
                <div className="w-full md:w-1/4 glass p-6 rounded-xl border border-gray-200 dark:border-gray-700 h-fit sticky top-24">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Filters</h2>
                    
                    <form onSubmit={handleSearch}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search by Name</label>
                            <input 
                                type="text" 
                                className="input-field" 
                                placeholder="Search rooms..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hourly Rate ($)</label>
                            <div className="flex items-center space-x-2">
                                <input 
                                    type="number" 
                                    className="input-field w-full" 
                                    placeholder="Min" 
                                    value={minRate}
                                    onChange={(e) => setMinRate(e.target.value)}
                                />
                                <span>-</span>
                                <input 
                                    type="number" 
                                    className="input-field w-full" 
                                    placeholder="Max" 
                                    value={maxRate}
                                    onChange={(e) => setMaxRate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amenities</label>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {amenitiesList.map(amenity => (
                                    <div key={amenity} className="flex items-center">
                                        <input 
                                            id={`amenity-${amenity}`} 
                                            type="checkbox" 
                                            className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                            checked={selectedAmenities.includes(amenity)}
                                            onChange={() => handleAmenityChange(amenity)}
                                        />
                                        <label htmlFor={`amenity-${amenity}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                            {amenity}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="w-full btn-primary py-2">Apply Filters</button>
                    </form>
                </div>

                {/* Rooms Grid */}
                <div className="w-full md:w-3/4">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : rooms.length === 0 ? (
                        <div className="text-center py-20 glass rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="text-5xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No rooms found</h3>
                            <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search criteria.</p>
                            <button 
                                onClick={() => {
                                    setSearch(''); setMinRate(''); setMaxRate(''); setSelectedAmenities([]);
                                    setTimeout(fetchRooms, 100);
                                }}
                                className="mt-6 btn-outline"
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
                                    className="card group flex flex-col"
                                >
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <img 
                                            src={room.image} 
                                            alt={room.name} 
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 right-4 bg-white dark:bg-dark-card px-3 py-1 rounded-full text-sm font-bold text-primary-600 shadow-md">
                                            ${room.hourlyRate}/hr
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{room.name}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                            {room.description}
                                        </p>
                                        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                                            <span className="flex items-center"><span className="mr-2">📍</span> Floor: {room.floor}</span>
                                            <span className="flex items-center"><span className="mr-2">👥</span> {room.capacity}</span>
                                        </div>
                                        <div className="mt-auto">
                                            <Link to={`/rooms/${room._id}`} className="btn-primary w-full text-center block">
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Rooms;
