import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import '../../utils/i18n';
import {
    UserRoundPlus,
    Star,
    X,
    Upload,
    Copy
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
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
import Pusher from "pusher-js";

export default function Sidebar() {
    const { t } = useTranslation();
    const { profile, gettingallGroups, getallGroups } = useUser();
    const token = Cookies.get("token");
    const router = useRouter();

    const [openDialog, setOpenDialog] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupImage, setGroupImage] = useState(null);
    const [groupImagePreview, setGroupImagePreview] = useState(null);
    const [isCreating, setisCreating] = useState(false);
    // const [gettingallGroups, setgettingallGroups] = useState();
    const [open, setOpen] = useState(false);
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
                toast.success(`${t('Grpcrtsucess')}`);
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

    // const getallGroups = async () => {
    //     try {
    //         const getGroups = await axios.get(`${process.env.NEXT_PUBLIC_API_CAMBOO}/get-group`,
    //             {
    //                 headers: { Authorization: `Bearer ${token}` },
    //             })
    //         if (getGroups?.data?.success) {
    //             setgettingallGroups(getGroups?.data?.data)
    //         }
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }

    const [unreadCounts, setUnreadCounts] = useState({});

    useEffect(() => {
        if (gettingallGroups?.length) {
            const initialUnread = {};

            gettingallGroups.forEach((group) => {
                initialUnread[group.id] = group.unread_count || 0;
            });

            setUnreadCounts(initialUnread);
        }
    }, [gettingallGroups]);

    useEffect(() => {
        if (!profile?.id || !token || !gettingallGroups?.length) return;

        const myId = profile.id;
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
            forceTLS: true,
        });

        const channels = [];

        gettingallGroups.forEach((group) => {
            const groupId = group.id;
            const channel = pusher.subscribe(`group.${groupId}`);
            channels.push(channel);

            // 🔵 Listen for new messages in that group
            channel.bind("MessageSent", (data) => {
                // ✅ Increment unread count for that group when a new message arrives
                if (data?.sender_id !== myId) {
                    setUnreadCounts((prev) => ({
                        ...prev,
                        [groupId]: (prev[groupId] || 0) + 1,
                    }));
                }
            });
        });

        return () => {
            channels.forEach((ch) => {
                ch.unbind_all();
                ch.unsubscribe();
            });
            pusher.disconnect();
        };
    }, [profile?.id, token, gettingallGroups]);


    const [url] = useState("https://camboo-woad.vercel.app");
    const [title] = useState(`${t('Plsjnawsplt')}!`);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        toast.success(`${t('Ivtlinkcpsuccess')}!`);
        setOpen(false);
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div className="bg-white p-4 space-y-6 w-full min-h-screen rounded-br-xl rounded-bl-xl">
            <button className="w-full bg-[#4370C2] text-white cursor-pointer py-2 rounded-md font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                onClick={() => setOpen(true)}>
                <UserRoundPlus className="w-4 h-4" />
                {t('SndInvite')}
            </button>

            {open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 h-screen">
                    <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md relative animate-fadeIn">
                        <h2 className="text-xl font-semibold mb-5 text-gray-800 text-center">
                            {t('SndInviteLnk')}
                        </h2>

                        {/* Copy section */}
                        <div className="flex items-center justify-between border rounded-full px-4 py-2 mb-5">
                            <span className="text-gray-700 text-sm truncate">{url}</span>
                            <button
                                onClick={handleCopy}
                                className="ml-2 bg-[#000F5C] hover:bg-[#00136e] text-white rounded-full px-3 py-1 text-sm transition"
                            >
                                {t('Cpy')}
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
                                {t('Cls')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                                {/* <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, index) => (
                                        <Star key={index} className="h-4 w-4 fill-yellow-500 stroke-yellow-500" />
                                    ))}
                                </div> */}
                                {/* <span className="ml-2 text-gray-700 font-medium">5.0</span> */}
                            </div>
                            {/* <p className="text-green-600 text-xs flex items-center gap-1">
                                <img src="/verified.png" alt="Verified" className="w-4 h-4" />
                                <span className='text-[#464E5F] font-poppins'> Verified Profile </span>
                            </p> */}
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

            {profile?.what_are_you_interested_in ? (
                <>
                    <div>
                        <h3 className="text-md font-semibold text-[#13121F] mb-2">{t('Intrst')}</h3>
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
                </>
            ) : null}

            <div>
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-md">{t('Grps')}</h3>
                    <button
                        onClick={() => setOpenDialog(true)}
                        className="text-sm bg-[#000F5C] text-white px-3 py-2 rounded-md hover:bg-[#00126e]"
                    >
                        + {t('Crt')}
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

                            <h2 className="text-lg font-semibold mb-4 text-[#000F5C]">{t('CrtNewGrp')}</h2>

                            {/* Group Name Field */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('GrpNm')}
                                </label>
                                <input
                                    type="text"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    placeholder={`${t("EntGrpNm")}`}
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#000F5C]"
                                />
                            </div>

                            {/* Group Image Field */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('GrpImg')}
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
                                        {t('ChsFile')}
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

                                    {t('Cncl')}
                                </button>
                                <button
                                    onClick={handleCreateGroup}
                                    disabled={!groupName || isCreating}
                                    className={`text-sm px-4 py-2 rounded-md text-white transition-colors ${!groupName || isCreating
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-[#000F5C] hover:bg-[#00126e]"
                                        }`}
                                >
                                    {isCreating ? `${t('Crting')}...` : `${t('Crt')}`}
                                </button>

                            </div>
                        </div>
                    </div>
                )}
            </div>


            <ul className="space-y-3">
                {gettingallGroups
                    ? gettingallGroups.slice(0, 5)?.map((group, i) => (
                        <li
                            key={i}
                            className="flex items-center justify-between pb-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors rounded-md px-2"
                            onClick={() => {
                                // Reset unread count on open
                                setUnreadCounts((prev) => ({ ...prev, [group.id]: 0 }));
                                router.push(`/group/${group?.id}`);
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={group.group_profile || '/defualtgrp.png'}
                                    alt={group.group_name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <p className="text-base font-semibold">{group.group_name}</p>
                                    <p className="text-xs text-gray-500">
                                        {group.total_member} {t('Mmbrs')}
                                    </p>
                                </div>
                            </div>

                            {/* 🔵 Unread badge */}
                            {unreadCounts[group.id] > 0 && (
                                <div className="bg-[#000F5C] text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {unreadCounts[group.id]}
                                </div>
                            )}
                        </li>
                    ))
                    : Array.from({ length: 5 }).map((_, index) => (
                        <li
                            key={index}
                            className="flex items-center gap-3 pb-3 border-b border-gray-200 animate-pulse"
                        >
                            <div className="w-12 h-12 rounded-full bg-gray-300"></div>
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
                    onClick={() => router.push("/allGroups")}
                >
                    {t('VwAll')}
                </span>
            )}

            {gettingallGroups?.length === 0 && (
                <div className="flex justify-center items-center w-full py-10">
                    <span className="text-center text-gray-500">
                        {t('NoGrpYet')}.
                    </span>
                </div>
            )}
            <Toaster />
        </div>
    )
}
