import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const UpdateRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const amenitiesOptions = ['Whiteboard', 'Projector', 'Wi-Fi', 'Power Outlets', 'Quiet Zone', 'Air Conditioning'];
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        floor: '',
        capacity: '',
        hourlyRate: ''
    });

    useEffect(() => {
        document.title = "StudyNook - Update Room";
        const fetchRoom = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/rooms/${id}`);
                setFormData({
                    name: data.name,
                    description: data.description,
                    image: data.image,
                    floor: data.floor,
                    capacity: data.capacity,
                    hourlyRate: data.hourlyRate
                });
                setSelectedAmenities(data.amenities || []);
            } catch {
                toast.error('Failed to load room details');
                navigate('/my-listings');
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, [id, navigate]);

    const handleAmenityChange = (amenity) => {
        setSelectedAmenities(prev => 
            prev.includes(amenity) 
            ? prev.filter(a => a !== amenity)
            : [...prev, amenity]
        );
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const updatedRoom = {
            ...formData,
            capacity: parseInt(formData.capacity),
            hourlyRate: parseFloat(formData.hourlyRate),
            amenities: selectedAmenities
        };

        try {
            setSaving(true);
            await axios.put(`${import.meta.env.VITE_API_URL}/api/rooms/${id}`, updatedRoom);
            toast.success('Room updated successfully');
            navigate('/my-listings');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update room');
        } finally {
            setSaving(false);
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
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="glass p-8 md:p-12 rounded-2xl shadow-xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Update Room</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Modify the details of your study room.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Name</label>
                            <input type="text" name="name" required className="input-field" value={formData.name} onChange={handleChange} />
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                            <input type="url" name="image" required className="input-field" value={formData.image} onChange={handleChange} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Floor</label>
                            <input type="text" name="floor" required className="input-field" value={formData.floor} onChange={handleChange} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity</label>
                            <input type="number" name="capacity" required min="1" className="input-field" value={formData.capacity} onChange={handleChange} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hourly Rate ($)</label>
                            <input type="number" name="hourlyRate" required min="0" step="0.5" className="input-field" value={formData.hourlyRate} onChange={handleChange} />
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
                            <textarea name="description" required rows="4" className="input-field resize-none" value={formData.description} onChange={handleChange}></textarea>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button type="button" onClick={() => navigate('/my-listings')} className="btn-outline mr-4">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="btn-primary py-3 px-8 text-lg w-full md:w-auto">
                            {saving ? 'Saving...' : 'Update Room'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateRoom;
