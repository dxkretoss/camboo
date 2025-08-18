import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout/Layout';
import {
    ChevronLeft,
    Pencil,
    MapPin,
    Star,
    BriefcaseBusiness,
    Linkedin,
    Twitter,
    Facebook,
    Instagram, Github, Globe,
    Package, Heart, EllipsisVertical
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';
import Cookies from 'js-cookie';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function Profile() {
    const token = Cookies.get('token');
    const router = useRouter();
    const { profile, clientsProductandService, getClientsProdandSer, getallProdandSer } = useUser();
    const [socialLinks, setSocialLinks] = useState([]);
    const [clientSaveItems, setclientSaveItems] = useState(null);
    const [savedItems, setSavedItems] = useState({});
    const [isFav, setisFav] = useState(false);
    const [isDelete, setisDelete] = useState(false);
    const [getProfileData, setgetProfileData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        about_me: '',
        what_are_you_interested_in: '',
        professional_experience: '',
        profile_image: '',
    });
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRefs = useRef({});

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                openMenuId &&
                menuRefs.current[openMenuId] &&
                !menuRefs.current[openMenuId].contains(event.target)
            ) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openMenuId]);

    useEffect(() => {
        if (!token) router.push('/');
        document.title = "Camboo-Profile";
        getClientSaveitems();
    }, [token, router]);

    useEffect(() => {
        if (profile) {
            setgetProfileData({
                first_name: profile?.first_name || '',
                last_name: profile?.last_name || '',
                email: profile?.email || '',
                phone_number: profile?.phone_number || '',
                about_me: profile?.about_me || '',
                what_are_you_interested_in: profile?.what_are_you_interested_in || '',
                professional_experience: profile?.professional_experience || '',
                profile_image: profile?.profile_image || '',
            });
            setSocialLinks(profile?.social_links || []);
        }
    }, [profile]);


    const platformMap = {
        linkedin: { name: "LinkedIn", icon: Linkedin },
        twitter: { name: "Twitter", icon: Twitter },
        facebook: { name: "Facebook", icon: Facebook },
        instagram: { name: "Instagram", icon: Instagram },
        github: { name: "GitHub", icon: Github },
    };

    const tabs = ['My Ads', 'My History of Trades', 'My Saved Items'];
    const [activeTab, setActiveTab] = useState('My Ads');

    const toggleSave = (id) => {
        setSavedItems((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
        sendClientSaveitems(id);
    };

    const sendClientSaveitems = async (id) => {
        setisFav(true);
        try {
            const token = Cookies.get("token");
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_CAMBOO}/save-and-delete-item`,
                { item_id: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res?.data?.success) {
                toast.success(`${res?.data?.message}`)
                getClientSaveitems();
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong.");
        } finally {
            setisFav(false);
        }
    };

    const getClientSaveitems = async () => {
        try {
            const token = Cookies.get("token");
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_CAMBOO}/get-save-item`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res?.data?.success) {
                if (res?.data?.data?.length > 0) {
                    setclientSaveItems(res?.data?.data);
                    const mapped = {};
                    res?.data?.data?.forEach(item => {
                        mapped[item?.item_id] = item?.item_id;
                    });
                    setSavedItems(mapped);
                }
            } else {
                setclientSaveItems(null)
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteItem = async (id) => {
        setisDelete(true);
        try {
            const delItems = await axios.delete(`${process.env.NEXT_PUBLIC_API_CAMBOO}/delete-item?item_id=${id}`,
                { headers: { Authorization: `Bearer ${token}` } })
            if (delItems?.data?.success) {
                toast.success(`${delItems?.data?.message}`)
                await getClientsProdandSer();
                await getallProdandSer();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setisDelete(false);
        }
    }
    return (
        <Layout>
            <div className="md:px-10 min-h-screen">
                <div className="flex items-center gap-1 text-gray-700 mb-4">
                    <ChevronLeft className="w-5 h-5" />
                    <span
                        onClick={() => window.history.back()}
                        className="text-sm md:text-base font-medium hover:text-blue-600 cursor-pointer transition duration-200"
                    >
                        Back
                    </span>
                </div>

                {(isFav || isDelete) && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black/10 backdrop-blur-sm z-50 transition-opacity duration-300">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-[#000F5C] rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-[#000F5C] rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                            <div className="w-3 h-3 bg-[#000F5C] rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                        </div>
                    </div>
                )}

                <div className="p-4 md:p-6 w-full mx-aut">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <img
                                src={getProfileData?.profile_image}
                                alt="User"
                                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
                            />
                            <div>
                                <h2 className="text-lg md:text-xl font-semibold text-gray-800">{`${getProfileData?.first_name} ${getProfileData?.last_name}`}</h2>
                                <div className="flex items-center gap-1 text-sm mt-1 flex-wrap">
                                    <div className="flex text-yellow-500">
                                        {[...Array(5)].map((_, index) => (
                                            <Star key={index} className="h-4 w-4 fill-yellow-500 stroke-yellow-500" />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-gray-700 font-medium">5.0</span>
                                    <span className="ml-1 text-gray-500">(248 Reviews)</span>
                                </div>
                                <div className="flex gap-1 text-sm text-gray-500 mt-1 items-center">
                                    <MapPin className="w-4 h-4" />
                                    <span>Recife, PE</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2"
                            onClick={() => router.push('/editProfile')}
                        >
                            <Pencil className="w-4 h-4" />
                            Edit Profile
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 mt-6">
                    <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-sm p-6 space-y-6">
                        <div>
                            <h3 className="text-md font-semibold text-[#13121F] mb-1">About Me</h3>
                            <p className="text-sm text-gray-600">
                                {getProfileData?.about_me}
                            </p>
                        </div>
                        <hr />

                        <div>
                            <h3 className="text-md font-semibold text-[#13121F] mb-2">Professional Experience</h3>
                            <ul className="space-y-4 text-sm">
                                {getProfileData?.professional_experience}
                            </ul>
                        </div>
                        <hr />

                        <div>
                            <h3 className="text-md font-semibold text-[#13121F] mb-2">Social Links</h3>
                            <div className="flex gap-3">
                                {socialLinks?.map(({ platform, link }, index) => {
                                    const data = platformMap[platform?.toLowerCase()] || { name: platform, icon: Globe };
                                    const Icon = data?.icon;

                                    return (
                                        <a
                                            key={index}
                                            href={link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-[#000F5C] text-white rounded-full hover:bg-[#00136e] transition"
                                            aria-label={data.name}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                        <hr />

                        <div>
                            <h3 className="text-md font-semibold text-[#13121F] mb-2">Interests</h3>
                            <div className="flex flex-wrap gap-2">
                                {getProfileData?.what_are_you_interested_in}
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-3/4">
                        <div className="flex flex-nowrap gap-4 border-b border-gray-300 mb-4">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex text-xs sm:text-sm md:text-base py-2 px-2 -mb-px border-b-2 cursor-pointer transition font-medium text-center ${activeTab === tab
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-blue-600'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="text-sm text-gray-600">
                            {activeTab === 'My Ads' && (
                                clientsProductandService?.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {clientsProductandService
                                            ?.sort((a, b) => b.id - a.id)
                                            ?.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 group relative"
                                                >
                                                    <div className="relative bg-gray-100 flex items-center justify-center h-48 overflow-hidden">
                                                        <img
                                                            src={item.images[0]}
                                                            alt={item.title}
                                                            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                        {item?.model && (
                                                            <span className="absolute top-2 left-2 bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded">
                                                                {item?.model}
                                                            </span>
                                                        )}

                                                        <div
                                                            className="absolute top-2 right-2"
                                                            ref={(el) => (menuRefs.current[item.id] = el)}
                                                        >
                                                            <EllipsisVertical
                                                                className="cursor-pointer"
                                                                onClick={() =>
                                                                    setOpenMenuId(openMenuId === item.id ? null : item.id)
                                                                }
                                                            />
                                                            {openMenuId === item?.id && (
                                                                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg z-10">
                                                                    <button
                                                                        className="w-full px-4 py-2 text-left text-sm cursor-pointer rounded hover:bg-blue-200"
                                                                        onClick={() =>
                                                                            router.push({
                                                                                pathname: "./addProduct",
                                                                                query: { Editid: item?.id },
                                                                            })
                                                                        }
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        className="w-full px-4 py-2 text-left text-sm cursor-pointer rounded hover:bg-red-200"
                                                                        onClick={() => handleDeleteItem(item.id)}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="p-3">
                                                        <h3 className="flex items-center gap-2 truncate font-semibold text-gray-800 text-sm sm:text-base md:text-lg">
                                                            <span className="truncate">{item.title}</span>
                                                            {item?.price !== undefined && (
                                                                <span className="font-medium text-gray-500 text-sm sm:text-sm md:text-sm">
                                                                    ₹{item?.price}
                                                                </span>
                                                            )}
                                                        </h3>
                                                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mt-1">
                                                            {item?.time_display}
                                                        </p>
                                                    </div>

                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                        <Package size={48} className="mb-3 text-gray-400" />
                                        <p className="text-sm font-medium">No product or service added yet</p>
                                    </div>
                                )
                            )}

                            {activeTab === 'My History of Trades' &&
                                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                    <Package size={48} className="mb-3 text-gray-400" />
                                    <p className="text-sm font-medium">No trades yet</p>
                                </div>
                            }

                            {activeTab === 'My Saved Items' && (
                                (clientSaveItems?.length > 0) ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {clientSaveItems?.sort((a, b) => b.id - a.id)?.map((item) => (
                                            <div
                                                key={item.id}
                                                className="bg-white rounded-xl cursor-pointer shadow-md overflow-hidden border border-gray-200 group relative"
                                            >
                                                <div className="relative bg-gray-100 flex items-center justify-center h-48 overflow-hidden">
                                                    <img
                                                        src={item.images[0]}
                                                        alt={item.title}
                                                        className="max-h-full max-w-full object-contain transition-transform duration-300"
                                                    />
                                                    <>
                                                        {item.model &&
                                                            <span className="absolute top-2 left-2 bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded shadow-sm">
                                                                {item?.model}
                                                            </span>
                                                        }
                                                        <Heart
                                                            onClick={() => toggleSave(item?.item_id)}
                                                            className={`absolute top-2 right-2 bg-blue-100 ${savedItems[item?.item_id]
                                                                ? "text-[#000F5C] scale-110 fill-[#000F5C]"
                                                                : "text-black"
                                                                } p-1 rounded-md shadow-sm cursor-pointer hover:bg-blue-200 transition`}
                                                            size={30}
                                                        />
                                                    </>
                                                </div>

                                                <div className="p-3">
                                                    <h3 className="flex items-center gap-2 truncate font-semibold text-gray-800 text-sm sm:text-base md:text-lg">
                                                        <span className="truncate">{item.title}</span>
                                                        {item?.price !== undefined && (
                                                            <span className="font-medium text-gray-500 text-xs sm:text-sm md:text-base">
                                                                ₹{item.price}
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mt-1">
                                                        {item.time_display}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                        <Package size={48} className="mb-3 text-gray-400" />
                                        <p className="text-sm font-medium">No product or service saved yet</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </Layout>
    );
}
