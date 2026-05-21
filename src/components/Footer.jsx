import { Link } from 'react-router-dom';
import { FiFacebook, FiLinkedin, FiInstagram, FiBookOpen, FiMail, FiPhone } from 'react-icons/fi';
import { FaXTwitter } from 'react-icons/fa6'; // New X logo

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-gray-800 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-primary-600 dark:text-primary-500">
                                <FiBookOpen size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">StudyNook</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            Quiet study rooms, booked by the hour. Built for students, scholars, and lifelong learners.
                        </p>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Useful Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link to="/rooms" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">Rooms</Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">About</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Contact</h3>
                        <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                            <li className="flex items-center gap-3 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer">
                                <FiMail size={16} />
                                <span>abirkhan0495@gmail.com</span>
                            </li>
                            <li className="flex items-center gap-3 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer">
                                <FiPhone size={16} />
                                <span>+8801813990122</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Follow</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                                <span className="sr-only">Facebook</span>
                                <FiFacebook size={24} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                                <span className="sr-only">X (Twitter)</span>
                                <FaXTwitter size={24} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                                <span className="sr-only">LinkedIn</span>
                                <FiLinkedin size={24} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                                <span className="sr-only">Instagram</span>
                                <FiInstagram size={24} />
                            </a>
                        </div>
                    </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center">
                    <p className="text-base text-gray-500 dark:text-gray-500">
                        &copy; {new Date().getFullYear()} StudyNook. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
