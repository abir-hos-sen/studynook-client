import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

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
            await axios.post(`${import.meta.env.VITE_API_URL}/api/rooms`, newRoom);
            toast.success('Room added successfully');
            navigate('/my-listings');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add room');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="glass p-8 md:p-12 rounded-2xl shadow-xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Add a New Study Room</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">List your private space for others to book.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Name</label>
                            <input type="text" name="name" required className="input-field" placeholder="e.g., Silent Corner 101" />
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                            <input type="url" name="image" required className="input-field" placeholder="https://example.com/image.jpg" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Floor</label>
                            <input type="text" name="floor" required className="input-field" placeholder="e.g., 3rd Floor" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity</label>
                            <input type="number" name="capacity" required min="1" className="input-field" placeholder="e.g., 4" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hourly Rate ($)</label>
                            <input type="number" name="hourlyRate" required min="0" step="0.5" className="input-field" placeholder="e.g., 5" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amenities</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-gray-50 dark:bg-dark-bg p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                {amenitiesOptions.map(amenity => (
                                    <div key={amenity} className="flex items-center">
                                        <input 
                                            id={amenity} 
                                            type="checkbox" 
                                            className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                            checked={selectedAmenities.includes(amenity)}
                                            onChange={() => handleAmenityChange(amenity)}
                                        />
                                        <label htmlFor={amenity} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                            {amenity}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                            <textarea name="description" required rows="4" className="input-field resize-none" placeholder="Describe the room..."></textarea>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button type="submit" disabled={loading} className="btn-primary py-3 px-8 text-lg w-full md:w-auto">
                            {loading ? 'Adding...' : 'Add Room'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRoom;
