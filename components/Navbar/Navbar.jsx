import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, MapPin, ChevronDown, Plus } from 'lucide-react';
import Button from '../ui/Button';
import { useRouter } from 'next/router';

export default function Navbar() {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="fixed top-0 left-0 w-full h-16 bg-white z-50 px-4 md:px-6 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4" onClick={() => router.push('/homePage')}>
                <img
                    src="/logo_camboo.png"
                    alt="Logo"
                    className="h-8 w-auto cursor-pointer"
                />
            </div>


            <div className="flex-1 mx-4 max-w-md hidden sm:block">
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
                    <Search className="w-5 h-5 text-[#000F5C]" />
                    <input
                        type="text"
                        placeholder="Search here..."
                        className="bg-transparent outline-none px-3 w-full text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
                <div className="hidden lg:flex items-center text-gray-700 gap-1">
                    <MapPin className="w-5 h-5" />
                    <span className="text-sm">Recife, PE</span>
                    <ChevronDown className="w-4 h-4" />
                </div>

                <div className="md:hidden">
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#000F5C] text-white"
                        onClick={() => router.push('addProduct')}>
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="hidden md:block">
                    <Button
                        className="flex items-center gap-2  px-4 py-2"
                        onClick={() => router.push('addProduct')}
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Button>
                </div>

                <div className="relative w-10 h-10 flex items-center justify-center bg-[#000F5C] rounded-full cursor-pointer"
                    onClick={() => router.push('notification')}>
                    <Bell className="w-5 h-5 text-white" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
                </div>

                <div className="relative" ref={dropdownRef}>
                    <div
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <img
                            src="https://randomuser.me/api/portraits/men/32.jpg"
                            alt="User"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-gray-700 text-sm hidden sm:inline">Billy Roys</span>
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                    </div>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                            <ul className="py-1 text-sm text-gray-700">
                                <li>
                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            router.push('/profile');
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Profile
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            router.push('/')
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
