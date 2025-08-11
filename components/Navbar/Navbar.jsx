import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, MapPin, ChevronDown, Plus, User, LogOut } from 'lucide-react';
import Button from '../ui/Button';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useUser } from '@/context/UserContext';
import axios from 'axios';

export default function Navbar() {
    const router = useRouter();
    const token = Cookies.get("token");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();
    const { profile } = useUser();
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const logOutUser = async () => {
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_CAMBOO}/logout`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (res.data.success) {
                Cookies.remove('token');
                router.push('/')
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <nav className="h-16 bg-white px-4 md:px-6 py-3 flex items-center justify-between w-full">
            <div className="flex items-center gap-4" onClick={() => router.push('/home')}>
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
                            src={profile?.profile_image}
                            alt="User"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-gray-700 text-sm hidden sm:inline">{profile?.first_name}</span>
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
                                        className="w-full flex cursor-pointer items-center gap-2 px-4 py-2 text-left hover:bg-gray-100"
                                    >
                                        <User size={16} />
                                        Profile
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            logOutUser();
                                            setDropdownOpen(false);
                                        }}
                                        className="w-full flex cursor-pointer items-center gap-2 px-4 py-2 text-left hover:bg-gray-100"
                                    >
                                        <LogOut size={16} />
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
