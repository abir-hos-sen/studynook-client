import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { FiUsers, FiMapPin, FiActivity, FiSparkles, FiCalendar, FiClock, FiDollarSign } from 'react-icons/fi';

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Booking form state
    const [bookingDate, setBookingDate] = useState('');
    const [startHour, setStartHour] = useState('');
    const [endHour, setEndHour] = useState('');
    const [specialNote, setSpecialNote] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/rooms/${id}`);
                setRoom(data);
                document.title = `StudyNook - ${data.name}`;
            } catch (error) {
                toast.error('Failed to load room details');
                navigate('/rooms');
            } finally {
                setLoading(false);
            }
        };
        fetchRoomDetails();
    }, [id, navigate]);

    const handleBookNowClick = () => {
        if (!user) {
            navigate('/login', { state: { from: { pathname: `/rooms/${id}` } } });
            return;
        }
        setShowModal(true);
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        
        if (parseInt(startHour) >= parseInt(endHour)) {
            toast.error("End time must be after start time");
            return;
        }

        const today = new Date().setHours(0,0,0,0);
        const selectedDate = new Date(bookingDate).getTime();
        if (selectedDate < today) {
            toast.error("Cannot book a past date");
            return;
        }

        try {
            setBookingLoading(true);
            await axios.post(`${import.meta.env.VITE_API_URL}/api/bookings`, {
                roomId: id,
                date: bookingDate,
                startHour: parseInt(startHour),
                endHour: parseInt(endHour),
                specialNote
            });
            toast.success('Room booked successfully!');
            setShowModal(false);
            
            // Update booking count locally
            setRoom(prev => ({...prev, bookingCount: prev.bookingCount + 1}));
            
            // Reset form
            setBookingDate(''); setStartHour(''); setEndHour(''); setSpecialNote('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to book room');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!room) return null;

    const totalCost = (startHour && endHour && parseInt(endHour) > parseInt(startHour)) 
        ? (parseInt(endHour) - parseInt(startHour)) * room.hourlyRate 
        : 0;

    return (
        <div className="relative min-h-screen pt-24 pb-16 overflow-hidden">
            {/* Ambient background glow */}
            <div className="bg-mesh-glow"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="glass-card overflow-hidden border border-white/20 dark:border-slate-800/40">
                    <div className="flex flex-col lg:flex-row">
                        {/* Image Section */}
                        <div className="w-full lg:w-1/2 h-96 lg:h-auto relative">
                            <img src={room.image} alt={room.name} className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="badge-premium inline-block mb-3 bg-slate-900/80 backdrop-blur-md border border-white/10 text-accent-500">
                                    ${room.hourlyRate}/hour
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{room.name}</h1>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="w-full lg:w-1/2 p-8 md:p-12 space-y-8 flex flex-col justify-between">
                            <div className="space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Study Suite Overview</h2>
                                        <p className="text-xs font-semibold text-slate-400">HOSTED BY: {room.owner?.name || 'Library Staff'}</p>
                                    </div>
                                    <div className="hidden sm:block text-right">
                                        <span className="block text-2xl font-extrabold text-primary-500">${room.hourlyRate}</span>
                                        <span className="text-xs font-bold text-slate-400">per hour</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="glass-card py-4 border border-white/10 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30">
                                        <FiMapPin className="mx-auto mb-2 text-primary-500" size={18} />
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Floor</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{room.floor}</p>
                                    </div>
                                    <div className="glass-card py-4 border border-white/10 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30">
                                        <FiUsers className="mx-auto mb-2 text-primary-500" size={18} />
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Capacity</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{room.capacity} Max</p>
                                    </div>
                                    <div className="glass-card py-4 border border-white/10 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30">
                                        <FiActivity className="mx-auto mb-2 text-primary-500" size={18} />
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Booked</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{room.bookingCount} Times</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">About this room</h3>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-100 dark:border-slate-900/40">
                                        {room.description}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Room Amenities</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {room.amenities.map((amenity, index) => (
                                            <span key={index} className="px-3.5 py-1.5 bg-primary-500/5 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/10 rounded-xl text-xs font-bold flex items-center gap-1.5">
                                                <FiSparkles size={12} /> {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6">
                                <button 
                                    onClick={handleBookNowClick}
                                    className="w-full btn-premium-primary py-4 text-base font-bold"
                                >
                                    {user ? 'Instantly Book This Nook' : 'Login to Book This Nook'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800/80 transform transition-all">
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/30">
                            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Book {room.name}</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-500 text-3xl font-light focus:outline-none">
                                &times;
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <form onSubmit={handleBookingSubmit} className="space-y-5">
                                {/* Date Input */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                        <FiCalendar /> Select Date
                                    </label>
                                    <input 
                                        type="date" 
                                        required 
                                        className="input-premium" 
                                        min={new Date().toISOString().split('T')[0]}
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                    />
                                </div>

                                {/* Start & End times */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                            <FiClock /> Start Hour
                                        </label>
                                        <select required className="input-premium py-3" value={startHour} onChange={(e) => setStartHour(e.target.value)}>
                                            <option value="" disabled>Select Time</option>
                                            {[...Array(13)].map((_, i) => {
                                                const hour = i + 8; // 8 AM to 8 PM
                                                return <option key={hour} value={hour} className="dark:bg-slate-900">{hour.toString().padStart(2, '0')}:00</option>
                                            })}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                            <FiClock /> End Hour
                                        </label>
                                        <select required className="input-premium py-3" value={endHour} onChange={(e) => setEndHour(e.target.value)}>
                                            <option value="" disabled>Select Time</option>
                                            {[...Array(13)].map((_, i) => {
                                                const hour = i + 8;
                                                return <option key={hour} value={hour} className="dark:bg-slate-900">{hour.toString().padStart(2, '0')}:00</option>
                                            })}
                                        </select>
                                    </div>
                                </div>
                                
                                {/* Special notes */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Special Notes (Optional)</label>
                                    <textarea 
                                        className="input-premium resize-none" 
                                        rows="2"
                                        value={specialNote}
                                        onChange={(e) => setSpecialNote(e.target.value)}
                                        placeholder="Any special requests or accommodation needs?"
                                    ></textarea>
                                </div>

                                {/* Total Cost Display */}
                                <div className="bg-primary-500/5 dark:bg-primary-500/10 p-5 rounded-2xl flex justify-between items-center border border-primary-500/10">
                                    <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                                        <FiDollarSign /> Estimated Total Cost:
                                    </span>
                                    <span className="text-2xl font-extrabold text-primary-500">
                                        ${totalCost}
                                    </span>
                                </div>

                                <div className="pt-2">
                                    <button 
                                        type="submit" 
                                        disabled={bookingLoading} 
                                        className="w-full btn-premium-primary py-3.5"
                                    >
                                        {bookingLoading ? (
                                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                                        ) : null}
                                        Confirm Booking
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomDetails;
