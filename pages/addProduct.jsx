import React from 'react';
import Navbar from '@/components/Navbar/Navbar';

export default function Layout({ children }) {
    return (
        <div className="bg-gray-300 min-h-screen">
            <Navbar />
            <main className="p-4">
                {children}
            </main>
        </div>
    );
}
