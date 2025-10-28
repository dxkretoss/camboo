import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout/Layout'
import { ChevronLeft } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useUser } from '@/context/UserContext';

export default function notification() {
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

    const handleFriendAction = async (notificationId, action) => {
        setProcessingId(notificationId);
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
                getAllNotification();
            }
        } catch (error) {
            console.error("❌ Error fetching messages:", error);
        } finally {
            setProcessingId(null);
        }
    };
    return (
        <Layout>
            <div className="md:px-10">
                <div className="flex items-center gap-1 text-gray-700">
                    <ChevronLeft className="w-5 h-5 cursor-pointer "
                        onClick={() => window.history.back()} />
                    <span
                        onClick={() => window.history.back()}
                        className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
                    >
                        Back
                    </span>
                </div>

                <div className="flex justify-center px-4 pt-5 min-h-[100vh]">
                    <div className="flex flex-col w-full max-w-2xl bg-white rounded-md p-6 space-y-6">

                        <h2 className="text-lg md:text-xl font-semibold text-gray-800 self-start">
                            Notifications
                        </h2>

                        <div className="flex justify-center items-center border-b border-gray-300">
                            {['Notifications', 'New Potential Trades'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedTab(tab)}
                                    className={`flex-1 text-xs sm:text-sm md:text-base py-2 px-2 -mb-px border-b-2 cursor-pointer transition font-medium text-center ${selectedTab === tab
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-blue-600'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {selectedTab === 'Notifications' && (
                            <div>
                                {getallNotification
                                    ? getallNotification?.map((noti) => (
                                        <div
                                            key={noti?.id}
                                            className={`flex flex-col border-b border-gray-200 p-2 mb-1 ${noti.is_read === 0 ? "bg-gray-100" : "bg-white"}`}

                                        >
                                            <div className='flex justify-between'>
                                                {/* <span className="text-base text-[#12111D]">{noti.message}</span> */}
                                                {(() => {
                                                    const [before, after] = noti.message.split(':');
                                                    return (
                                                        <span className="text-base text-[#12111D]">
                                                            {before}:
                                                            {after && <strong className="font-semibold text-black">{after}</strong>}
                                                        </span>
                                                    );
                                                })()}
                                                {noti?.type === 'friend_request' && (
                                                    <div className="flex gap-3">
                                                        {/* Accept Button */}
                                                        <button
                                                            onClick={() => handleFriendAction(noti?.group_id, 'accepted')}
                                                            disabled={processingId === noti?.group_id}
                                                            className={`px-3 py-1.5 text-sm rounded-[8px] transition border
                                                            ${processingId === noti?.group_id
                                                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                                    : 'bg-[#4370C21F] border-[#4370C266] text-[#4370C2]'
                                                                }`}
                                                        >
                                                            <span className="text-[16px] font-semibold">
                                                                {processingId === noti?.group_id ? 'Accepting...' : 'Accept'}
                                                            </span>
                                                        </button>

                                                        {/* Refuse Button */}
                                                        <button
                                                            onClick={() => handleFriendAction(noti?.group_id, 'rejected')}
                                                            disabled={processingId === noti?.group_id}
                                                            className={`px-3 py-1.5 text-sm rounded-[8px] transition border
                                                            ${processingId === noti?.group_id
                                                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                                    : 'bg-[#E73E391F] border-[#E73E3966] text-[#E73E39]'
                                                                }`}
                                                        >
                                                            <span className="text-[16px] font-semibold">
                                                                {processingId === noti?.group_id ? 'Refusing...' : 'Refuse'}
                                                            </span>
                                                        </button>
                                                    </div>
                                                )}

                                            </div>
                                            <span className="text-sm text-[#464E5F]">{noti.time_display}</span>
                                        </div>
                                    ))
                                    :
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-col border-b border-gray-200 pb-2 animate-pulse"
                                        >
                                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                        </div>
                                    ))}
                            </div>
                        )}


                        {selectedTab === 'New Potential Trades' && (
                            <div>
                                Coming soon
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </Layout>
    )
}
