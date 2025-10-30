import React, { useState, useRef, useEffect } from 'react';
import {
    Search, Bell, MapPin, ChevronDown, Plus, User,
    LogOut, Edit3, X, Menu, UserRoundPlus
} from 'lucide-react';
import Button from '../ui/Button';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useUser } from '@/context/UserContext';
import axios from 'axios';
import { useSearch } from '@/context/SearchContext';
import {
    TwitterIcon,
    WhatsappIcon,
    TelegramIcon,
    FacebookIcon,
} from "react-share";
import {
    FacebookShareButton,
    WhatsappShareButton,
    TelegramShareButton,
    TwitterShareButton,
} from 'react-share';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import '../../utils/i18n';

// const brazilStates = [
//     { name: "Acre", code: "AC" },
//     { name: "Alagoas", code: "AL" },
//     { name: "Amapá", code: "AP" },
//     { name: "Amazonas", code: "AM" },
//     { name: "Bahia", code: "BA" },
//     { name: "Ceará", code: "CE" },
//     { name: "Distrito Federal (Federal District)", code: "DF" },
//     { name: "Espírito Santo", code: "ES" },
//     { name: "Goiás", code: "GO" },
//     { name: "Maranhão", code: "MA" },
//     { name: "Mato Grosso", code: "MT" },
//     { name: "Mato Grosso do Sul", code: "MS" },
//     { name: "Minas Gerais", code: "MG" },
//     { name: "Pará", code: "PA" },
//     { name: "Paraíba", code: "PB" },
//     { name: "Paraná", code: "PR" },
//     { name: "Pernambuco", code: "PE" },
//     { name: "Piauí", code: "PI" },
//     { name: "Rio de Janeiro", code: "RJ" },
//     { name: "Rio Grande do Norte", code: "RN" },
//     { name: "Rio Grande do Sul", code: "RS" },
//     { name: "Rondônia", code: "RO" },
//     { name: "Roraima", code: "RR" },
//     { name: "Santa Catarina", code: "SC" },
//     { name: "São Paulo", code: "SP" },
//     { name: "Sergipe", code: "SE" },
//     { name: "Tocantins", code: "TO" }
// ];

export default function Navbar() {
    const router = useRouter();
    const token = Cookies.get("token");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();
    const { profile, getUserProfileData, getallNotification } = useUser();
    // const [searchItems, setsearchItems] = useState('');
    const { searchItems, setsearchItems } = useSearch();
    const [logOut, setlogOut] = useState(false);
    const [selectedArea, setSelectedArea] = useState();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [getLocations, setgetLocations] = useState();
    const [locsetting, setlocsetting] = useState(false);
    const [unreadNotification, setunreadNotification] = useState();

    useEffect(() => {
        const getListofunreadnoti = getallNotification?.filter((noti) => noti.is_read === 0);
        setunreadNotification(getListofunreadnoti)
    }, [getallNotification]);

    useEffect(() => {
        if (!token) router.push('/');
        GetAllLocations();
    }, [token])

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

    const GetAllLocations = async () => {
        const token = Cookies.get("token");
        if (token) {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_CAMBOO}/get-location`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res?.data?.success) {
                    setgetLocations(res?.data?.data)
                }
            } catch (error) {
                console.error("❌ Error fetching messages:", error);
            }
        }
    }

    const selectedLocation = async (locId) => {
        const token = Cookies.get("token");
        if (!token) return;
        setlocsetting(true);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_CAMBOO}/user-set-location`,
                { location_id: locId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res?.data?.success) {
                await getUserProfileData();
            }
        } catch (error) {
            console.error("❌ Error fetching messages:", error);
        } finally {
            setlocsetting(false);
        }
    }

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

    const [open, setOpen] = useState(false);

    const [url] = useState("https://camboo-woad.vercel.app");
    const [title] = useState("Please Join this awesome platform!");

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        toast.success("Invite link copied successfully!");
        setOpen(false);
    };

    // useEffect(() => {
    //     const initGoogleTranslate = () => {
    //         const container = document.getElementById("google_translate_element");
    //         if (!container) return;

    //         container.innerHTML = "";

    //         if (window.google?.translate) {
    //             new window.google.translate.TranslateElement(
    //                 { pageLanguage: "en" },
    //                 "google_translate_element"
    //             );

    //             // Filter allowed languages
    //             const filterLanguages = () => {
    //                 const select = document.querySelector(".goog-te-combo");
    //                 if (select) {
    //                     const allowed = ["en", "pt", "br"];
    //                     [...select.options].forEach((opt) => {
    //                         if (!allowed.includes(opt.value)) opt.remove();
    //                     });
    //                 }
    //             };
    //             const interval = setInterval(filterLanguages, 1000);
    //             setTimeout(() => clearInterval(interval), 15000);
    //         }
    //     };

    //     const waitForContainer = () => {
    //         const el = document.getElementById("google_translate_element");
    //         if (el) {
    //             initGoogleTranslate();
    //         } else {
    //             setTimeout(waitForContainer, 300);
    //         }
    //     };

    //     if (!window.googleTranslateScriptLoaded) {
    //         window.googleTranslateScriptLoaded = true;
    //         window.googleTranslateElementInit = initGoogleTranslate;

    //         const script = document.createElement("script");
    //         script.src =
    //             "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    //         script.async = true;
    //         document.body.appendChild(script);
    //     } else {
    //         waitForContainer();
    //     }

    //     return () => {
    //         const el = document.getElementById("google_translate_element");
    //         if (el) el.innerHTML = "";
    //     };
    // }, [router?.asPath]);

    const { t, i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const languages = [
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'br', label: 'Português', flag: '🇧🇷' },
    ];

    const currentLang = languages.find((lang) => lang.code === i18n.language) || languages[0];

    const handleChange = (langCode) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <nav className="h-16 bg-white px-4 md:px-6 py-3 flex items-center justify-between w-full">
            <div className='flex gap-2 items-center'>
                <Menu
                    className="h-8 w-auto block lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                />
                <div
                    className="flex items-center cursor-pointer"
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
            </div>
            {sidebarOpen && (
                <div className="fixed inset-0 z-50">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    ></div>

                    {/* Sidebar */}
                    <div className="absolute top-0 left-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300">
                        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 ">
                            <h2 className="text-lg font-semibold text-[#000F5C]">{t('Menu')}</h2>
                            <button onClick={() => setSidebarOpen(false)}>
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        {/* Send Invite Button */}
                        <div className="px-4 py-4 border-b border-gray-200">
                            <button className="w-full bg-[#4370C2] text-white cursor-pointer py-2 rounded-md font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                onClick={() => setOpen(true)}>
                                <UserRoundPlus className="w-4 h-4" />
                                {t('send_invite')}
                            </button>
                        </div>

                        {open && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 h-screen">
                                <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md relative animate-fadeIn">
                                    <h2 className="text-xl font-semibold mb-5 text-gray-800 text-center">
                                        {t('send_invite_link')}
                                    </h2>

                                    {/* Copy section */}
                                    <div className="flex items-center justify-between border rounded-full px-4 py-2 mb-5">
                                        <span className="text-gray-700 text-sm truncate">{url}</span>
                                        <button
                                            onClick={handleCopy}
                                            className="ml-2 bg-[#000F5C] hover:bg-[#00136e] text-white rounded-full px-3 py-1 text-sm transition"
                                        >
                                            {t('Copy')}
                                        </button>
                                    </div>

                                    {/* Share buttons */}
                                    <div className="flex justify-center gap-4 mb-6">
                                        <WhatsappShareButton url={url} title={title}>
                                            <WhatsappIcon size={48} round />
                                        </WhatsappShareButton>
                                        <FacebookShareButton url={url} title={title}>
                                            <FacebookIcon size={48} round />
                                        </FacebookShareButton>
                                        <TelegramShareButton url={url} title={title}>
                                            <TelegramIcon size={48} round />
                                        </TelegramShareButton>
                                        <TwitterShareButton url={url} title={title}>
                                            <TwitterIcon size={48} round />
                                        </TwitterShareButton>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => setOpen(false)}
                                            className="px-6 py-2 bg-gray-200 rounded-full font-medium hover:bg-gray-300 transition"
                                        >
                                            {t('Close')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="flex flex-col px-2 py-4 space-y-1">
                            <button
                                onClick={() => { router.push("/allGroups") }}
                                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-[#000F5C]"
                            >
                                {t('Groups')}
                            </button>
                            <button
                                onClick={() => { router.push('/suggestedtrades') }}
                                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-[#000F5C]"
                            >
                                {t('Suggested Trades')}
                            </button>

                            <button
                                onClick={() => { router.push('/recentChats') }}
                                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-[#000F5C]"
                            >
                                {t('Recent Chats')}
                            </button>
                            {/* <button
                                onClick={() => { }}
                                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-[#000F5C]"
                            >
                                History Trade
                            </button>
                            <button
                                onClick={() => { }}
                                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-[#000F5C]"
                            >
                                Marketings
                            </button> */}
                        </div>
                    </div>
                </div>
            )}

            <div style={{ position: 'relative', display: 'inline-block', textAlign: 'left' }}>
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    style={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '16px',
                    }}
                >
                    <span>{currentLang.flag}</span> {currentLang.label}
                    <span style={{ marginLeft: '6px' }}>{isOpen ? '▲' : '▼'}</span>
                </button>

                {/* Dropdown menu */}
                {isOpen && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            marginTop: '4px',
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            boxShadow: '0px 2px 6px rgba(0,0,0,0.1)',
                            zIndex: 10,
                            minWidth: '160px',
                        }}
                    >
                        {languages.map((lang) => (
                            <div
                                key={lang.code}
                                onClick={() => handleChange(lang.code)}
                                style={{
                                    padding: '10px 14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    cursor: 'pointer',
                                    backgroundColor: i18n.language === lang.code ? '#f5f5f5' : 'transparent',
                                    fontWeight: i18n.language === lang.code ? '600' : 'normal',
                                }}
                            >
                                <span>{lang.flag}</span> {lang.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex-1 mx-4 max-w-md hidden sm:block">
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 relative">
                    <Search className="w-5 h-5 text-[#000F5C]" />
                    <input
                        type="text"
                        placeholder={`${t("Search here")}...`}
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

            {/* <div id="google_translate_element" /> */}

            <div className="flex items-center gap-4">
                {isComplete ?
                    <>
                        <div ref={locdropdownRef}
                            className="relative hidden lg:flex items-center text-gray-700 gap-1">
                            <MapPin className="w-5 h-5" />

                            {locsetting ? (
                                <span className="inline-block bg-gray-200 rounded-md h-4 w-24 animate-pulse"></span>
                            ) : (
                                <span className="text-sm">{profile?.location || "Select Area"}</span>
                            )}

                            <ChevronDown
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => setshowArea(!showArea)}
                            />

                            {showArea && (
                                <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-md w-40 z-50 max-h-60 overflow-y-auto">
                                    {getLocations?.map((state, idx) => (
                                        <button
                                            key={idx}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-blue-100 cursor-pointer"
                                            onClick={() => {
                                                selectedLocation(state.id);
                                                setshowArea(false);
                                            }}
                                        >
                                            {state.location_name}
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

                                {t('New Ad')}
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

                                {t('Complete Your Profile')}
                            </Button>
                        </div>
                    </>
                }

                <div className="relative w-10 h-10 flex items-center justify-center bg-[#000F5C] rounded-full cursor-pointer"
                    onClick={() => router.push('notification')}>
                    <Bell className="w-5 h-5 text-white" />
                    {unreadNotification?.length > 0 &&
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
                    }
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
                                        {t('Profile')}
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

                                        {t('Logout')}
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
            <Toaster />
        </nav>
    );
}
