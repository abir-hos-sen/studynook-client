import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "StudyNook - Home";
        const fetchLatestRooms = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/rooms/latest`);
                setRooms(data);
            } catch (error) {
                console.error('Error fetching rooms', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestRooms();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <div className="relative bg-primary-600 dark:bg-primary-900 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        className="w-full h-full object-cover opacity-20"
                        src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                        alt="Library background"
                    />
                </div>
                <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Find Your Perfect Study Room
                        </h1>
                        <p className="mt-6 max-w-2xl mx-auto text-xl text-primary-100">
                            Browse and book quiet, private study rooms in your library. List your own room and earn.
                        </p>
                        <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                            <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5">
                                <Link to="/rooms" className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors shadow-lg hover:shadow-xl">
                                    Explore Rooms
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Dynamic Section - Available Study Rooms */}
            <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                        Latest Available Rooms
                    </h2>
                    <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                        Book a space that fits your needs
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rooms.map((room, index) => (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
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
                                        <span className="flex items-center"><span className="mr-2">👥</span> {room.capacity} people</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {room.amenities.slice(0, 3).map((amenity, i) => (
                                            <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-md text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                                {amenity}
                                            </span>
                                        ))}
                                        {room.amenities.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-md text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                                +{room.amenities.length - 3} more
                                            </span>
                                        )}
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

            {/* Extra Section 1: Features */}
            <div className="bg-gray-50 dark:bg-gray-900/50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Why Choose StudyNook?</h2>
                    </div>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6 bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⚡</div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Instant Booking</h3>
                            <p className="text-gray-600 dark:text-gray-400">Book your preferred room instantly without any waiting time.</p>
                        </div>
                        <div className="p-6 bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🛡️</div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Double Booking</h3>
                            <p className="text-gray-600 dark:text-gray-400">Our smart system ensures your selected slot is guaranteed yours.</p>
                        </div>
                        <div className="p-6 bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">💰</div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Earn by Listing</h3>
                            <p className="text-gray-600 dark:text-gray-400">Have a space? List it on our platform and start earning money.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Extra Section 2: CTA */}
            <div className="bg-primary-600 dark:bg-primary-800 py-12 px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
                    Ready to boost your productivity?
                </h2>
                <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
                    Join thousands of students who have found their perfect study environment through StudyNook.
                </p>
                <Link to="/register" className="inline-block bg-white text-primary-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
                    Get Started Today
                </Link>
            </div>
        </div>
    );
};

export default Home;
