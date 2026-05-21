import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const MyListings = () => {
    const { user } = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyRooms = async () => {
        try {
            // Fetch all rooms and filter by user ID since we don't have a specific endpoint for user's rooms
            // Alternatively, in a real app we'd have a `/api/rooms/user/:id` endpoint
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/rooms`);
            if (Array.isArray(data)) {
                const myRooms = data.filter(room => room.owner === user._id || (room.owner && room.owner._id === user._id));
                setRooms(myRooms);
            } else {
                console.error("API error: Did not receive an array", data);
                setRooms([]);
            }
        } catch (error) {
            console.error('Error fetching rooms', error);
            toast.error('Failed to load your listings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "StudyNook - My Listings";
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchMyRooms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/rooms/${id}`);
                toast.success('Room deleted successfully');
                setRooms(rooms.filter(room => room._id !== id));
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete room');
            }
        }
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
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">My Listings</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage the rooms you have listed.</p>
                </div>
                <Link to="/add-room" className="btn-primary">Add New Room</Link>
            </div>

            {rooms.length === 0 ? (
                <div className="text-center py-20 glass rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="text-5xl mb-4">🏠</div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">You haven't listed any rooms yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Start earning by listing your private study space.</p>
                    <Link to="/add-room" className="btn-primary">List a Room Now</Link>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {rooms.map((room) => (
                                <tr key={room._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12">
                                                <img className="h-12 w-12 rounded-lg object-cover" src={room.image} alt="" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{room.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Added {new Date(room.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-white">Floor: {room.floor}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Cap: {room.capacity}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                            ${room.hourlyRate}/hr
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {room.bookingCount || 0} total
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-3">
                                            <Link to={`/update-room/${room._id}`} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                                                <FiEdit2 size={18} />
                                            </Link>
                                            <button onClick={() => handleDelete(room._id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyListings;
