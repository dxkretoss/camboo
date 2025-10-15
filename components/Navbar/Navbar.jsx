import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, MapPin, ChevronDown, Plus, User, LogOut, Edit3, X } from 'lucide-react';
import Button from '../ui/Button';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useUser } from '@/context/UserContext';
import axios from 'axios';
import { useSearch } from '@/context/SearchContext';

const brazilStates = [
    { name: "Acre", code: "AC" },
    { name: "Alagoas", code: "AL" },
    { name: "Amapá", code: "AP" },
    { name: "Amazonas", code: "AM" },
    { name: "Bahia", code: "BA" },
    { name: "Ceará", code: "CE" },
    { name: "Distrito Federal (Federal District)", code: "DF" },
    { name: "Espírito Santo", code: "ES" },
    { name: "Goiás", code: "GO" },
    { name: "Maranhão", code: "MA" },
    { name: "Mato Grosso", code: "MT" },
    { name: "Mato Grosso do Sul", code: "MS" },
    { name: "Minas Gerais", code: "MG" },
    { name: "Pará", code: "PA" },
    { name: "Paraíba", code: "PB" },
    { name: "Paraná", code: "PR" },
    { name: "Pernambuco", code: "PE" },
    { name: "Piauí", code: "PI" },
    { name: "Rio de Janeiro", code: "RJ" },
    { name: "Rio Grande do Norte", code: "RN" },
    { name: "Rio Grande do Sul", code: "RS" },
    { name: "Rondônia", code: "RO" },
    { name: "Roraima", code: "RR" },
    { name: "Santa Catarina", code: "SC" },
    { name: "São Paulo", code: "SP" },
    { name: "Sergipe", code: "SE" },
    { name: "Tocantins", code: "TO" }
];

export default function Navbar() {
    const router = useRouter();
    const token = Cookies.get("token");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();
    const { profile } = useUser();
    // const [searchItems, setsearchItems] = useState('');
    const { searchItems, setsearchItems } = useSearch();
    const [logOut, setlogOut] = useState(false);
    const [selectedArea, setSelectedArea] = useState({ name: "Recife", code: "PE" });

    const requiredFields = [
        "first_name",
        "last_name",
        "email",
        "phone_number",
        "about_me",
        "what_are_you_interested_in",
        // "professional_experience",
        "street",
        "city",
        "post_code",
    ];

    const isComplete = requiredFields.every((field) => {
        const value = profile?.[field];
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return value !== null && value !== undefined && value !== "";
    });

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
        setlogOut(true);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_CAMBOO}/logout`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (res?.data?.success) {
                Cookies.remove('token');
                router.push('/')
            }
        } catch (err) {
            console.error(err);
        } finally {
            setlogOut(false);
        }
    };

    const [showArea, setshowArea] = useState(false);
    const locdropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (locdropdownRef.current && !locdropdownRef.current.contains(e.target)) {
                setshowArea(false);
            }
        }

        if (showArea) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showArea]);

    return (
        <nav className="h-16 bg-white px-4 md:px-6 py-3 flex items-center justify-between w-full">
            <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => router.push('/home')}
            >
                <img
                    src="/logo3.jpeg"
                    alt="Logo Small"
                    className="h-12 w-auto block sm:hidden"
                />
                <img
                    src="/logo2.jpeg"
                    alt="Logo Medium"
                    className="h-14 w-auto hidden sm:block md:hidden"
                />
                <img
                    src="/logo1.jpeg"
                    alt="Logo Large"
                    className="h-14 w-auto hidden md:block"
                />
            </div>

            <div className="flex-1 mx-4 max-w-md hidden sm:block">
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 relative">
                    <Search className="w-5 h-5 text-[#000F5C]" />
                    <input
                        type="text"
                        placeholder="Search here..."
                        className="bg-transparent outline-none px-3 w-full text-sm"
                        value={searchItems}
                        onChange={(e) => setsearchItems(e.target.value)}
                    />

                    {searchItems && (
                        <X
                            className="w-4 h-4 text-gray-500 absolute right-3 cursor-pointer hover:text-gray-700"
                            onClick={() => setsearchItems("")}
                        />
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {isComplete ?
                    <>
                        <div ref={locdropdownRef}
                            className="relative hidden lg:flex items-center text-gray-700 gap-1">
                            <MapPin className="w-5 h-5" />
                            {/* Show selected area */}
                            <span className="text-sm">{selectedArea.name}, {selectedArea.code}</span>

                            <ChevronDown
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => setshowArea(!showArea)}
                            />

                            {showArea && (
                                <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-md w-40 z-50 max-h-60 overflow-y-auto">
                                    {brazilStates.map((state, idx) => (
                                        <button
                                            key={idx}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-blue-100 cursor-pointer"
                                            onClick={() => {
                                                setSelectedArea(state);
                                                setshowArea(false);
                                            }}
                                        >
                                            {state.name} ({state.code})
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="md:hidden">
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#000F5C] text-white"
                                onClick={() => router.push('/addProduct')}>
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="hidden md:block">
                            <Button
                                className="flex items-center gap-2  px-4 py-2"
                                onClick={() => router.push('/addProduct')}
                            >
                                <Plus className="w-4 h-4" />
                                New Ad
                            </Button>
                        </div>
                    </>
                    :
                    <>
                        <div className="md:hidden">
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#000F5C] text-white"
                                onClick={() => router.push('/editProfile')}>
                                <Edit3 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="hidden md:block">
                            <Button
                                className="flex items-center gap-2  px-4 py-2"
                                onClick={() => router.push('/editProfile')}
                            >
                                <Edit3 className="w-4 h-4" />
                                Complete Your Profile
                            </Button>
                        </div>
                    </>
                }

                <div className="relative w-10 h-10 flex items-center justify-center bg-[#000F5C] rounded-full cursor-pointer"
                    onClick={() => router.push('notification')}>
                    <Bell className="w-5 h-5 text-white" />
                    {/* <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" /> */}
                </div>

                <div className="relative" ref={dropdownRef}>
                    <div
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <div className="relative w-10 h-10">
                            {!profile?.profile_image && (
                                <div className="absolute inset-0 rounded-full bg-gray-200 animate-pulse"></div>
                            )}

                            <img
                                src={profile?.profile_image}
                                alt="User"
                                loading="lazy"
                                onLoad={(e) => e.currentTarget.classList.remove("opacity-0", "blur-md")}
                                className="w-10 h-10 rounded-full object-contain opacity-0 blur-md transition-all duration-500"
                            />
                        </div>

                        <span className="text-gray-700 text-sm hidden sm:inline">
                            {!profile?.first_name && (
                                <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                            )}
                            {profile?.first_name}
                        </span>
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

                    {logOut && (
                        <div className="fixed inset-0 flex justify-center items-center bg-black/10 backdrop-blur-sm z-50 transition-opacity duration-300">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 bg-[#000F5C] rounded-full animate-bounce"></div>
                                <div className="w-3 h-3 bg-[#000F5C] rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                                <div className="w-3 h-3 bg-[#000F5C] rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </nav>
    );
}
