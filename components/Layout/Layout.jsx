import React from 'react';
import Navbar from '../Navbar/Navbar';

export default function Layout({ children }) {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <main className="md:pt-12 p-4">
                {children}
            </main>
        </div>
    );
}
