import { useContext, useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        if (!isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Rooms', path: '/rooms' },
    ];

    if (user) {
        navLinks.push(
            { name: 'Add Room', path: '/add-room' },
            { name: 'My Listings', path: '/my-listings' },
            { name: 'My Bookings', path: '/my-bookings' }
        );
    }

    return (
        <nav className="glass sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-500">
                            StudyNook
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="flex space-x-6">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-primary-600 font-semibold"
                                            : "text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors"
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>

                        <div className="flex items-center space-x-4 border-l pl-4 border-gray-200 dark:border-gray-700">
                            <button onClick={toggleTheme} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none">
                                {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                            </button>

                            {user ? (
                                <div className="relative group cursor-pointer">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-500">
                                        <img src={user.photoURL || 'https://via.placeholder.com/150'} alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right border border-gray-100 dark:border-gray-700">
                                        <div className="px-4 py-2 border-b dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                                        </div>
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-x-4">
                                    <Link to="/login" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 transition-colors font-medium">Login</Link>
                                    <Link to="/register" className="btn-primary">Register</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden space-x-4">
                        <button onClick={toggleTheme} className="p-2 text-gray-500">
                            {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                        </button>
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 focus:outline-none">
                            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass border-t border-gray-200 dark:border-gray-700">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded-md text-base font-medium ${
                                        isActive ? "bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400" : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        {!user ? (
                            <div className="mt-4 flex flex-col space-y-2 px-3">
                                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center py-2 text-primary-600 border border-primary-600 rounded-md font-medium">Login</Link>
                                <Link to="/register" onClick={() => setIsOpen(false)} className="w-full text-center py-2 bg-primary-600 text-white rounded-md font-medium">Register</Link>
                            </div>
                        ) : (
                            <div className="mt-4 px-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center px-2">
                                    <div className="flex-shrink-0">
                                        <img className="h-10 w-10 rounded-full object-cover" src={user.photoURL} alt="" />
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-gray-800 dark:text-white">{user.name}</div>
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{user.email}</div>
                                    </div>
                                </div>
                                <div className="mt-3 px-2">
                                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800">
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
