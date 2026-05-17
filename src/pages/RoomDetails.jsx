import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

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
            
            // Optionally update booking count locally
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
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
            </div>
        );
    }

    if (!room) return null;

    const totalCost = (startHour && endHour && parseInt(endHour) > parseInt(startHour)) 
        ? (parseInt(endHour) - parseInt(startHour)) * room.hourlyRate 
        : 0;

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="glass rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
                <div className="flex flex-col lg:flex-row">
                    {/* Image Section */}
                    <div className="w-full lg:w-1/2 h-96 lg:h-auto relative">
                        <img src={room.image} alt={room.name} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden"></div>
                        <div className="absolute bottom-4 left-4 lg:hidden">
                            <span className="px-3 py-1 bg-primary-600 text-white rounded-full text-sm font-bold shadow-lg">
                                ${room.hourlyRate}/hr
                            </span>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="w-full lg:w-1/2 p-8 md:p-12">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{room.name}</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Added by: {room.owner?.name}</p>
                            </div>
                            <div className="hidden lg:block text-right">
                                <span className="block text-3xl font-bold text-primary-600 dark:text-primary-500">${room.hourlyRate}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">per hour</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-8 text-sm">
                            <div className="flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700">
                                <span className="text-xl mr-2">📍</span> Floor {room.floor}
                            </div>
                            <div className="flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700">
                                <span className="text-xl mr-2">👥</span> {room.capacity} People Max
                            </div>
                            <div className="flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700">
                                <span className="text-xl mr-2">🔥</span> Booked {room.bookingCount} times
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About this room</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                                {room.description}
                            </p>
                        </div>

                        <div className="mb-10">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Amenities</h3>
                            <div className="flex flex-wrap gap-2">
                                {room.amenities.map((amenity, index) => (
                                    <span key={index} className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-md text-sm font-medium border border-primary-100 dark:border-primary-800/50">
                                        ✓ {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-auto">
                            <button 
                                onClick={handleBookNowClick}
                                className="w-full btn-primary py-4 text-lg shadow-lg hover:shadow-xl transition-all"
                            >
                                {user ? 'Book Now' : 'Login to Book'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-dark-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 transform transition-all">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Book {room.name}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleBookingSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                                    <input 
                                        type="date" 
                                        required 
                                        className="input-field" 
                                        min={new Date().toISOString().split('T')[0]}
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                                        <select required className="input-field" value={startHour} onChange={(e) => setStartHour(e.target.value)}>
                                            <option value="" disabled>Select Time</option>
                                            {[...Array(13)].map((_, i) => {
                                                const hour = i + 8; // 8 AM to 8 PM
                                                return <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}:00</option>
                                            })}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                                        <select required className="input-field" value={endHour} onChange={(e) => setEndHour(e.target.value)}>
                                            <option value="" disabled>Select Time</option>
                                            {[...Array(13)].map((_, i) => {
                                                const hour = i + 8;
                                                return <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}:00</option>
                                            })}
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Special Note (Optional)</label>
                                    <textarea 
                                        className="input-field resize-none" 
                                        rows="2"
                                        value={specialNote}
                                        onChange={(e) => setSpecialNote(e.target.value)}
                                        placeholder="Any special requests?"
                                    ></textarea>
                                </div>

                                <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg flex justify-between items-center border border-primary-100 dark:border-primary-800">
                                    <span className="font-medium text-primary-800 dark:text-primary-300">Total Cost:</span>
                                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                                        ${totalCost}
                                    </span>
                                </div>

                                <div className="pt-2">
                                    <button 
                                        type="submit" 
                                        disabled={bookingLoading} 
                                        className="w-full btn-primary py-3 flex justify-center items-center"
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
