import React, { useState, useEffect } from 'react'
import {
    UserRoundPlus,
    Star,
    X,
    Upload
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
export default function Sidebar() {
    const { profile } = useUser();
    const token = Cookies.get("token");
    const router = useRouter();

    useEffect(() => {
        getallGroups();
    }, [])
    // const interests = [
    //     "iPhone 15", "Audi A500", "Vivo All", "Yamaha 1800", "Mercedes Benz",
    //     "iPhone 15 Pro", "Samsung A14", "AC", "Huawei AC", "OPPO M1",
    // ];

    // const groups = [
    //     { name: "Old New iPhones Sell", members: 481, image: "https://randomuser.me/api/portraits/men/1.jpg" },
    //     { name: "Car Bike Zone", members: 58, image: "https://randomuser.me/api/portraits/men/2.jpg" },
    //     { name: "Mobiles For Sell", members: 104, image: "https://randomuser.me/api/portraits/men/3.jpg" },
    //     { name: "Tech Product", members: 12, image: "https://randomuser.me/api/portraits/men/4.jpg" },
    //     { name: "Wholesale Zone", members: 0, image: "https://randomuser.me/api/portraits/men/5.jpg" },
    // ];
    const [openDialog, setOpenDialog] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupImage, setGroupImage] = useState(null);
    const [groupImagePreview, setGroupImagePreview] = useState(null);
    const [isCreating, setisCreating] = useState(false);
    const [gettingallGroups, setgettingallGroups] = useState();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setGroupImage(file);
            setGroupImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCreateGroup = async () => {
        setisCreating(true);
        try {
            const formData = new FormData();
            formData.append("group_name", groupName);
            if (groupImage) {
                formData.append("group_profile", groupImage);
            }
            const create = await axios.post(`${process.env.NEXT_PUBLIC_API_CAMBOO}/add-group`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    "Content-Type": "multipart/form-data",
                })
            if (create?.data?.success) {
                toast.success("Service created successfully");
                setGroupName("");
                setGroupImage(null);
                setGroupImagePreview(null);
                setOpenDialog(false);

                getallGroups();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setisCreating(false);
        }
    };

    const getallGroups = async () => {
        try {
            const getGroups = await axios.get(`${process.env.NEXT_PUBLIC_API_CAMBOO}/get-group`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                })
            if (getGroups?.data?.success) {
                setgettingallGroups(getGroups?.data?.data)
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="bg-white p-4 space-y-6 w-full">
            <button className="w-full bg-[#4370C2] text-white cursor-pointer py-2 rounded-md font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2">
                <UserRoundPlus className="w-4 h-4" />
                Send Invite
            </button>


            <div className="flex items-center gap-4">
                {profile?.profile_image ? (
                    <img
                        src={profile?.profile_image}
                        alt="User"
                        loading="lazy"
                        onLoad={(e) => e.currentTarget.classList.remove("opacity-0", "blur-md")}
                        className="w-16 h-16 md:w-20 md:h-20  rounded-full cursor-pointer object-contain opacity-0 blur-md transition-all duration-500"
                        onClick={() => router.push('./profile')}
                    />
                ) : (
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200 animate-pulse" />
                )}

                <div>
                    {profile?.first_name ? (
                        <>
                            <h2 className="text-md md:text-md font-semibold text-gray-800">{profile?.first_name}</h2>
                            <div className="flex items-center gap-1 text-sm mt-1 flex-wrap">
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, index) => (
                                        <Star key={index} className="h-4 w-4 fill-yellow-500 stroke-yellow-500" />
                                    ))}
                                </div>
                                <span className="ml-2 text-gray-700 font-medium">5.0</span>
                            </div>
                            <p className="text-green-600 text-xs flex items-center gap-1">
                                <img src="/verified.png" alt="Verified" className="w-4 h-4" />
                                <span className='text-[#464E5F] font-poppins'> Verified Profile </span>
                            </p>
                        </>
                    ) : (
                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    )}
                </div>
            </div>
            <hr />

            <div>
                <h3 className="text-md font-semibold text-[#13121F] mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                    {profile?.what_are_you_interested_in ? (
                        <div className="flex flex-wrap gap-2">
                            {profile?.what_are_you_interested_in?.split(',').map((item, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 rounded-md text-[#06145D] bg-[#06145D1A] text-sm font-semibold"
                                >
                                    {item.trim()}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    )}
                    {/* {interests.map((interest, index) => (
                        <span key={index} className="px-3 py-1 text-xs font-semibold bg-[#06145D1A] text-[#000F5C] rounded-md">
                            {interest}
                        </span>
                    ))} */}
                </div>
            </div>
            <hr />

            <div>
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-md">Groups</h3>
                    <button
                        onClick={() => setOpenDialog(true)}
                        className="text-sm bg-[#000F5C] text-white px-3 py-2 rounded-md hover:bg-[#00126e]"
                    >
                        + Create
                    </button>
                </div>

                {/* Dialog Modal */}
                {openDialog && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">
                            {/* Close button */}
                            <button
                                onClick={() => {
                                    setOpenDialog(false)
                                    setGroupName("");
                                    setGroupImage(null);
                                    setGroupImagePreview(null);
                                }}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-lg font-semibold mb-4 text-[#000F5C]">Create New Group</h2>

                            {/* Group Name Field */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Group Name
                                </label>
                                <input
                                    type="text"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    placeholder="Enter group name"
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#000F5C]"
                                />
                            </div>

                            {/* Group Image Field */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Group Profile Image
                                </label>
                                <div className="flex items-center gap-3">
                                    {groupImagePreview ? (
                                        <img
                                            src={groupImagePreview}
                                            alt="Preview"
                                            className="w-12 h-12 rounded-full object-cover border"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                            <Upload size={18} className="text-gray-500" />
                                        </div>
                                    )}

                                    <label className="cursor-pointer text-sm text-[#000F5C] font-medium hover:underline">
                                        Choose File
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    onClick={() => {
                                        setOpenDialog(false)
                                        setGroupName("");
                                        setGroupImage(null);
                                        setGroupImagePreview(null);
                                    }}
                                    className="text-sm px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateGroup}
                                    disabled={!groupName || isCreating}
                                    className={`text-sm px-4 py-2 rounded-md text-white transition-colors ${!groupName || isCreating
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-[#000F5C] hover:bg-[#00126e]"
                                        }`}
                                >
                                    {isCreating ? "Creating..." : "Create"}
                                </button>

                            </div>
                        </div>
                    </div>
                )}
            </div>


            <ul className="space-y-3">
                {gettingallGroups
                    ? gettingallGroups.slice(0, 5).map((group, i) => (
                        <li
                            key={i}
                            className="flex items-center gap-3 pb-3 border-b border-gray-200"
                        >
                            <img
                                src={group.group_profile}
                                alt={group.group_name}
                                className="w-16 h-16 md:w-12 md:h-12 rounded-full object-cover"
                            />
                            <div>
                                <p className="text-base font-semibold">{group.group_name}</p>
                                <p className="text-xs text-gray-500">
                                    {group.total_member} Members
                                </p>
                            </div>
                        </li>
                    ))
                    :
                    Array.from({ length: 5 }).map((_, index) => (
                        <li
                            key={index}
                            className="flex items-center gap-3 pb-3 border-b border-gray-200 animate-pulse"
                        >
                            <div className="w-16 h-16 md:w-12 md:h-12 rounded-full bg-gray-300"></div>
                            <div className="flex-1 space-y-2">
                                <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
                                <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                            </div>
                        </li>
                    ))}
            </ul>


            {gettingallGroups?.length > 5 && (
                <span
                    className="flex justify-center text-blue-600 cursor-pointer mt-2 hover:underline"
                    onClick={() => router.push("/all-groups")}
                >
                    View all
                </span>
            )}

            <Toaster />
        </div>
    )
}
