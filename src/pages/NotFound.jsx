import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-dark-bg transition-colors">
            <div className="text-center">
                <h1 className="text-9xl font-extrabold text-primary-600 dark:text-primary-500 drop-shadow-sm">404</h1>
                <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Page Not Found</p>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <div className="mt-8">
                    <Link to="/" className="btn-primary inline-flex items-center px-6 py-3 shadow-lg hover:shadow-xl transition-all">
                        <span className="mr-2">←</span> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
