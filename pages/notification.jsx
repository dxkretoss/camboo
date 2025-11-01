import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout/Layout'
import { ChevronLeft } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useUser } from '@/context/UserContext';
import { useTranslation } from 'react-i18next';
import '../utils/i18n';
import toast, { Toaster } from 'react-hot-toast';

export default function notification() {
    const { t, } = useTranslation();
    const [selectedTab, setSelectedTab] = useState('Notifications');
    const token = Cookies.get("token");
    const { getallNotification, getAllNotification } = useUser();

    useEffect(() => {
        if (!token) router.push('/');
        document.title = 'Camboo-Notification';
    }, [])

    useEffect(() => {
        if (getallNotification?.length > 0) {
            markAllUnreadAsRead();
        }
    }, [getallNotification])

    const markAllUnreadAsRead = async () => {
        const unread = getallNotification?.filter((n) => n.is_read == 0) || [];
        for (const noti of unread) {
            await markNotificationAsRead(noti.id);
        }
    };

    const markNotificationAsRead = async (notificationId) => {
        try {
            const token = Cookies.get("token");

            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_CAMBOO}/notification/read/${notificationId}`,
                { is_read: 1 },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            getAllNotification();
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };
    // const [getallNotification, setgetallNotification] = useState();

    // const getAllNotification = async () => {
    //     try {
    //         const getNoti = await axios.get(
    //             `${process.env.NEXT_PUBLIC_API_CAMBOO}/get-notification`,
    //             {
    //                 headers: { Authorization: `Bearer ${token}` },
    //             }
    //         );
    //         if (getNoti?.data?.success) {
    //             setgetallNotification(getNoti?.data?.data)
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const [processingId, setProcessingId] = useState(null);
    const [processingAction, setProcessingAction] = useState(null);

    const handleFriendAction = async (notificationId, action) => {
        setProcessingId(notificationId);
        setProcessingAction(action);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_CAMBOO}/group/invite/action`,
                {
                    group_id: notificationId,
                    status: action
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res?.data?.success) {
                if (action === "accepted") {
                    toast.success(`${t('reqAccept')}`);
                } else if (action === "rejected") {
                    toast.success(`${t('reqReject')}`);
                }
                getAllNotification();
            }
        } catch (error) {
            console.error("❌ Error fetching messages:", error);
        } finally {
            setProcessingId(null);
            setProcessingAction(null);
        }
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;
    return (
        <Layout>
            <div className="px-4 sm:px-6 md:px-10 py-4 md:py-6">
                {/*  Back Button */}
                <div className="flex items-center gap-1 text-gray-700 mb-4 md:mb-6">
                    <ChevronLeft
                        className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
                        onClick={() => window.history.back()}
                    />
                    <span
                        onClick={() => window.history.back()}
                        className="text-sm sm:text-base font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition"
                    >
                        {t('Bck')}
                    </span>
                </div>

                {/* 📱 Main Container */}
                <div className="flex justify-center">
                    <div className="flex flex-col w-full max-w-2xl bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6">

                        {/* 🔔 Title */}
                        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                            {t('Noti')}
                        </h2>

                        {/* 🔘 Tabs */}
                        <div className="flex justify-center items-center border-b border-gray-300">
                            {["Notifications", "New Potential Trades"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedTab(tab)}
                                    className={`flex-1 text-xs sm:text-sm md:text-base py-2 sm:py-3 -mb-px border-b-2 cursor-pointer transition font-medium text-center ${selectedTab === tab
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-blue-600"
                                        }`}
                                >
                                    {tab === 'Notifications' ? `${t('Noti')}` : `${t('Notinwpt')}`}
                                </button>
                            ))}
                        </div>

                        {/* 🔔 Notifications List */}
                        {selectedTab === "Notifications" && (
                            <div className="divide-y divide-gray-200">
                                {getallNotification?.length > 0 ? (
                                    getallNotification.map((noti) => (
                                        <div
                                            key={noti?.id}
                                            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-2 sm:p-3 ${noti.is_read === 0 ? "bg-gray-100" : "bg-white"
                                                }`}
                                        >
                                            {/* 📨 Message */}
                                            <div className="flex-1">
                                                {(() => {
                                                    const [before, after] = noti.message.split(":");
                                                    return (
                                                        <span className="text-sm sm:text-base text-[#12111D]">
                                                            {before}:
                                                            {after && (
                                                                <strong className="font-semibold text-black">{after}</strong>
                                                            )}
                                                        </span>
                                                    );
                                                })()}
                                                <div className="text-xs sm:text-sm text-[#464E5F] mt-1">
                                                    {noti?.time_display}
                                                </div>
                                            </div>

                                            {/* ✅ Friend Request Actions */}
                                            {noti?.type === "friend_request" && (
                                                <div className="flex gap-2 sm:gap-3">
                                                    {/* Accept */}
                                                    <button
                                                        onClick={() => handleFriendAction(noti?.group_id, "accepted")}
                                                        disabled={processingId === noti?.group_id}
                                                        className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg transition border font-semibold ${processingId === noti?.group_id && processingAction === "accepted"
                                                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                            : "bg-[#4370C21F] border-[#4370C266] text-[#4370C2]"
                                                            }`}
                                                    >
                                                        {processingId === noti?.group_id && processingAction === "accepted"
                                                            ? t('Accepting')
                                                            : t('Accept')}
                                                    </button>

                                                    {/* Refuse */}
                                                    <button
                                                        onClick={() => handleFriendAction(noti?.group_id, "rejected")}
                                                        disabled={processingId === noti?.group_id}
                                                        className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg transition border font-semibold ${processingId === noti?.group_id && processingAction === "rejected"
                                                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                            : "bg-[#E73E391F] border-[#E73E3966] text-[#E73E39]"
                                                            }`}
                                                    >
                                                        {processingId === noti?.group_id && processingAction === "rejected"
                                                            ? t('Refusing')
                                                            : t('Refuse')}
                                                    </button>
                                                </div>
                                            )}

                                        </div>
                                    ))
                                ) : (getallNotification?.length === 0 || getallNotification === null) ? (
                                    <div className="flex justify-center items-center w-full py-10">
                                        <span className="text-center text-gray-500 text-sm sm:text-base">
                                            {t('Notintfound')}
                                        </span>
                                    </div>
                                ) : (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-col border-b border-gray-200 pb-2 animate-pulse"
                                        >
                                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}


                        {/* 📈 Other Tab */}
                        {selectedTab === "New Potential Trades" && (
                            <div className="text-center text-gray-500 py-10">
                                {t('cmgsoon')} 🚀
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Toaster />
        </Layout>
    )
}
