import { useContext, useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMenu, FiX, FiMoon, FiSun, FiLogOut, FiBookOpen } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
        
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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
        <nav className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
            scrolled 
                ? 'py-3 bg-white/70 dark:bg-dark-bg/75 backdrop-blur-md shadow-lg border-b border-white/20 dark:border-slate-800/60' 
                : 'py-5 bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-12 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight hover:scale-105 transition-transform duration-200">
                            <FiBookOpen className="text-primary-500" size={26} />
                            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                                StudyNook
                            </span>
                        </Link>
                    </div>

                    {/* Middle: Desktop Navigation Links */}
                    <div className="hidden md:flex flex-1 justify-center">
                        <div className="flex space-x-1 bg-slate-100/50 dark:bg-slate-900/40 p-1.5 rounded-full border border-slate-200/40 dark:border-slate-800/40 backdrop-blur-md">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                                            isActive
                                                ? "bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm"
                                                : "text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400"
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="relative group cursor-pointer">
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-500/50 hover:border-primary-500 transition-all duration-200">
                                    <img src={user.photoURL || 'https://via.placeholder.com/150'} alt="Profile" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute right-0 mt-3 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right border border-slate-100 dark:border-slate-800/80">
                                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80">
                                        <p className="text-xs font-semibold text-slate-400">LOGGED IN AS</p>
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                                    </div>
                                    <button 
                                        onClick={handleLogout} 
                                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex items-center gap-2 font-medium"
                                    >
                                        <FiLogOut size={16} /> Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login" className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-primary-600 font-semibold transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-md rounded-xl hover:scale-105 active:scale-95 transition-all">
                                    Register
                                </Link>
                            </div>
                        )}

                        {/* Theme Toggle (Right of Register/Profile) */}
                        <button 
                            onClick={toggleTheme} 
                            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:scale-110 transition-all duration-200 focus:outline-none"
                        >
                            {isDarkMode ? <FiSun size={22} /> : <FiMoon size={22} />}
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden space-x-4">
                        <button 
                            onClick={toggleTheme} 
                            className="text-slate-500 dark:text-slate-400 hover:scale-110 transition-all duration-200 focus:outline-none"
                        >
                            {isDarkMode ? <FiSun size={22} /> : <FiMoon size={22} />}
                        </button>
                        <button 
                            onClick={() => setIsOpen(!isOpen)} 
                            className="p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/60 text-slate-500 bg-white/40 dark:bg-slate-900/30"
                        >
                            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass-card rounded-b-3xl border-t border-slate-200/40 dark:border-slate-800/40 mt-3 mx-4 p-4 shadow-2xl">
                    <div className="space-y-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `block px-4 py-2.5 rounded-xl text-base font-semibold transition-all ${
                                        isActive 
                                            ? "bg-primary-500/10 text-primary-600 dark:text-primary-400" 
                                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        
                        {!user ? (
                            <div className="mt-4 flex flex-col space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                <Link 
                                    to="/login" 
                                    onClick={() => setIsOpen(false)} 
                                    className="w-full text-center py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl font-bold transition-all"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    onClick={() => setIsOpen(false)} 
                                    className="w-full text-center py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-bold transition-all"
                                >
                                    Register
                                </Link>
                            </div>
                        ) : (
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                <div className="flex items-center px-2">
                                    <div className="flex-shrink-0">
                                        <img className="h-10 w-10 rounded-full object-cover" src={user.photoURL} alt="" />
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-bold text-slate-800 dark:text-white">{user.name}</div>
                                        <div className="text-sm font-semibold text-slate-500">{user.email}</div>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <button 
                                        onClick={() => { handleLogout(); setIsOpen(false); }} 
                                        className="w-full text-center py-2.5 text-red-500 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        <FiLogOut size={16} /> Logout
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
