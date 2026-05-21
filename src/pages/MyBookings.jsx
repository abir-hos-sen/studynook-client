import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings/my-bookings`);
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings', error);
            toast.error('Failed to load your bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "StudyNook - My Bookings";
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchBookings();
    }, []);

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await axios.patch(`${import.meta.env.VITE_API_URL}/api/bookings/${id}/cancel`);
                toast.success('Booking cancelled');
                // Update local state
                setBookings(bookings.map(booking => 
                    booking._id === id ? { ...booking, status: 'cancelled' } : booking
                ));
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to cancel booking');
            }
        }
    };

    const isFutureBooking = (dateString, startHour) => {
        const today = new Date();
        const bookingDate = new Date(dateString);
        
        // If booking date is in the future
        if (bookingDate > new Date(today.setHours(0,0,0,0))) return true;
        
        // If booking date is today, check if start hour is in the future
        if (bookingDate.getTime() === new Date(today.setHours(0,0,0,0)).getTime()) {
            return startHour > new Date().getHours();
        }
        
        return false;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">My Bookings</h1>
                <p className="text-gray-600 dark:text-gray-400">View and manage your study room reservations.</p>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-20 glass rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="text-5xl mb-4">📅</div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">You have no bookings yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Find the perfect room for your next study session.</p>
                    <a href="/rooms" className="btn-primary">Explore Rooms</a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking, index) => (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            key={booking._id} 
                            className="card flex flex-col"
                        >
                            <div className="relative h-40 w-full overflow-hidden">
                                <img 
                                    src={booking.room?.image || 'https://via.placeholder.com/400x200'} 
                                    alt={booking.room?.name || 'Room'} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md text-white ${
                                        booking.status === 'confirmed' ? 'bg-green-500' : 'bg-red-500'
                                    }`}>
                                        {booking.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    {booking.room?.name || 'Deleted Room'}
                                </h3>
                                
                                <div className="space-y-3 mb-6 flex-grow">
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                        <span className="w-6 text-center mr-2 text-lg">📅</span> 
                                        {new Date(booking.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                        <span className="w-6 text-center mr-2 text-lg">⏰</span> 
                                        {`${booking.startHour.toString().padStart(2, '0')}:00 - ${booking.endHour.toString().padStart(2, '0')}:00`}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                        <span className="w-6 text-center mr-2 text-lg">💳</span> 
                                        <span className="font-semibold text-primary-600 dark:text-primary-400">Total: ${booking.totalCost}</span>
                                    </div>
                                </div>

                                {booking.status === 'confirmed' && isFutureBooking(booking.date, booking.startHour) && (
                                    <button 
                                        onClick={() => handleCancel(booking._id)} 
                                        className="w-full mt-auto py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors font-medium"
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
