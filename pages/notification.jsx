import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout/Layout'
import { ChevronLeft } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function notification() {
    const [selectedTab, setSelectedTab] = useState('Notifications');
    const token = Cookies.get("token");

    useEffect(() => {
        document.title = 'Camboo-Notification';
        getAllNotification();
    }, [])

    const [getallNotification, setgetallNotification] = useState();
    console.log(getallNotification)
    const getAllNotification = async () => {
        try {
            const getNoti = await axios.get(
                `${process.env.NEXT_PUBLIC_API_CAMBOO}/get-notification`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (getNoti?.data?.success) {
                setgetallNotification(getNoti?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

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
                                    ? getallNotification.map((noti) => (
                                        <div
                                            key={noti?.id}
                                            className="flex flex-col border-b border-gray-200 pb-2"
                                        >
                                            <span className="text-base text-[#12111D]">{noti.message}</span>
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
