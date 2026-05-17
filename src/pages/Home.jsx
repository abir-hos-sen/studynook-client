import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiArrowRight, FiActivity, FiShield, FiDollarSign, FiMapPin, FiUsers } from 'react-icons/fi';

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
        <div className="relative overflow-hidden min-h-screen pt-20">
            {/* Glowing mesh background */}
            <div className="bg-mesh-glow"></div>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-7 text-left space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                            ✨ Redefining Study Spaces
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
                            Find Your Perfect <br />
                            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                                Quiet Study Nook
                            </span>
                        </h1>
                        <p className="max-w-xl text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                            Discover soundproof, premium study rooms in your university library. Book instantly, coordinate projects, and boost your focus.
                        </p>
                        <div className="pt-4 flex flex-wrap gap-4">
                            <Link to="/rooms" className="btn-premium-primary">
                                Explore Nooks <FiArrowRight />
                            </Link>
                            <Link to="/register" className="btn-premium-secondary">
                                Join Now
                            </Link>
                        </div>
                    </motion.div>

                    {/* Hero Visual Mockup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:col-span-5 relative"
                    >
                        <div className="relative mx-auto w-full max-w-[400px] h-[450px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30 dark:border-slate-800/40 transform lg:rotate-3 hover:rotate-0 transition-transform duration-500">
                            <img 
                                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt="Cozy Study Room" 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                            
                            {/* Floating Info tag */}
                            <div className="absolute bottom-6 left-6 right-6 glass-card p-5 border border-white/20 dark:border-slate-800/60 backdrop-blur-md">
                                <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-1">Featured Room</p>
                                <h3 className="text-lg font-bold text-white mb-2">The Glass Pavilion</h3>
                                <div className="flex justify-between items-center text-xs text-slate-300">
                                    <span className="flex items-center gap-1"><FiMapPin /> 3rd Floor</span>
                                    <span className="font-bold text-accent-500">$8/hr</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Dynamic Section - Available Study Rooms */}
            <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <div className="badge-premium inline-block">Study Suite Catalog</div>
                    <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        Latest Available Nooks
                    </h2>
                    <p className="max-w-2xl mx-auto text-slate-500 dark:text-slate-400 font-medium">
                        Reserve one of our premium high-focus study suites. Configured with state-of-the-art academic amenities.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rooms.map((room, index) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                key={room._id} 
                                className="glass-card-hover flex flex-col group overflow-hidden"
                            >
                                <div className="relative h-56 w-full overflow-hidden">
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
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-200 mb-2">
                                        {room.name}
                                    </h3>
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
                                        <Link to={`/rooms/${room._id}`} className="btn-premium-primary py-2.5 text-sm w-full">
                                            View Nook Details
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Extra Section 1: Features */}
            <div className="py-24 bg-white/40 dark:bg-slate-900/10 backdrop-blur-sm border-y border-slate-100 dark:border-slate-900/60 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <div className="badge-premium inline-block">Designed for Students</div>
                        <h2 className="text-3xl sm:text-5xl font-extrabold">Why Choose StudyNook?</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="glass-card-hover p-8 text-left border border-white/20 dark:border-slate-800/40">
                            <div className="w-14 h-14 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-lg shadow-primary-500/15">
                                <FiActivity />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">Instant Booking</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Book your preferred workspace instantly. Get immediate approval and secure door code access.</p>
                        </div>
                        <div className="glass-card-hover p-8 text-left border border-white/20 dark:border-slate-800/40">
                            <div className="w-14 h-14 bg-gradient-to-r from-accent-600 to-accent-500 text-white rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-lg shadow-accent-500/15">
                                <FiShield />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">Zero Conflict Guarantee</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Our advanced algorithm completely eliminates overlap or double-bookings. Your time slot is strictly yours.</p>
                        </div>
                        <div className="glass-card-hover p-8 text-left border border-white/20 dark:border-slate-800/40">
                            <div className="w-14 h-14 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-lg shadow-primary-500/15">
                                <FiDollarSign />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">List & Earn</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Own a premium designated study room or lab? Rent it out when not in use to support peers and earn side cash.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Extra Section 2: CTA */}
            <div className="relative py-24 bg-gradient-to-r from-primary-900 to-slate-950 border-t border-slate-900 overflow-hidden text-center z-10">
                {/* Floating ambient glow in CTA */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15)_0%,transparent_70%)] pointer-events-none"></div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 space-y-6">
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                        Ready to Boost Your Academic Productivity?
                    </h2>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                        Join thousands of focused students who coordinate work, schedule prep sessions, and excel through StudyNook.
                    </p>
                    <div className="pt-6 flex justify-center">
                        <Link to="/register" className="btn-premium-primary bg-white text-primary-900 hover:bg-slate-100 text-lg px-8 py-4 shadow-2xl">
                            Get Started Now <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
