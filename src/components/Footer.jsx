import { Link } from 'react-router-dom';
import { FiFacebook, FiLinkedin, FiInstagram } from 'react-icons/fi';
import { FaXTwitter } from 'react-icons/fa6'; // New X logo

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-gray-800 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    <div>
                        <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-500 mb-4">StudyNook</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Your premier destination for booking quiet, private study rooms. Elevate your learning experience with our seamless booking platform.
                        </p>
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
                                <span className="sr-only">Instagram</span>
                                <FiInstagram size={24} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                                <span className="sr-only">LinkedIn</span>
                                <FiLinkedin size={24} />
                            </a>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link to="/rooms" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">Rooms</Link>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">About Us</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h3>
                        <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                            <li>Email: support@studynook.com</li>
                            <li>Phone: +1 (555) 123-4567</li>
                            <li>Address: 123 University Ave, Education City, ED 10001</li>
                        </ul>
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
