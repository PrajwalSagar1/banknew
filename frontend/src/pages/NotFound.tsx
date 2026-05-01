import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="mt-4 text-xl">Page Not Found</p>
            <Link to="/" className="mt-8 text-blue-600 hover:underline">Go back home</Link>
        </div>
    );
};

export default NotFound;
