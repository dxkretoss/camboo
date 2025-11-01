import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import { useUser } from '@/context/UserContext';
import { ChevronLeft } from 'lucide-react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import '../utils/i18n';
import Pusher from "pusher-js";

export default function recentChats() {
    const { t, } = useTranslation();
    const { profile, recentchatUsers } = useUser();
    const [fetching, setfetching] = useState(false);
    const router = useRouter();
    const token = Cookies.get("token");

    useEffect(() => {
        if (!token) router.push('/');
        document.title = "Camboo-Recent Chats";
    }, [token]);

    const [unreadCounts, setUnreadCounts] = useState({});
    const [lastMessages, setLastMessages] = useState({});

    useEffect(() => {
        if (recentchatUsers?.length) {
            const initialUnread = {};
            const initialLastMsg = {};

            recentchatUsers.forEach((user) => {
                initialUnread[user.user_id] = user.unread_count || 0;
                initialLastMsg[user.user_id] = user.last_message || "";
            });

            setUnreadCounts(initialUnread);
            setLastMessages(initialLastMsg);
        }
    }, [recentchatUsers]);

    useEffect(() => {
        if (!profile?.id || !token || !recentchatUsers?.length) return;

        const myId = profile.id;
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
            forceTLS: true,
        });

        const channels = [];

        recentchatUsers.forEach((user) => {
            const otherId = user.user_id;
            const chatChannelId =
                myId < otherId ? `${myId}.${otherId}` : `${otherId}.${myId}`;

            const channel = pusher.subscribe(`chat.${chatChannelId}`);
            channels.push(channel);

            channel.bind("MessageSent", (data) => {
                // 📨 Update unread count when message is for me
                if (data?.receiver_id === myId) {
                    setUnreadCounts((prev) => ({
                        ...prev,
                        [data.sender_id]: (prev[data.sender_id] || 0) + 1,
                    }));

                    // 🆕 Update last message
                    setLastMessages((prev) => ({
                        ...prev,
                        [data.sender_id]: data.message || "",
                    }));
                }

                // 💬 Update last message also for sent messages
                if (data?.sender_id === myId) {
                    setLastMessages((prev) => ({
                        ...prev,
                        [data.receiver_id]: data.message || "",
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
    }, [profile?.id, token, recentchatUsers]);

    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;
    return (
        <Layout>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#000F5C]">
                        {t('recentChts')}
                    </h1>

                    <div className="flex items-center gap-1 text-gray-700">
                        <ChevronLeft className="w-5 h-5 cursor-pointer"
                            onClick={() => window.history.back()} />
                        <span
                            onClick={() => window.history.back()}
                            className="text-sm md:text-base font-medium hover:text-blue-600 cursor-pointer"
                        >
                            {t('Bck')}
                        </span>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-4">
                    {recentchatUsers && recentchatUsers.length > 0 ? (
                        <ul className="space-y-4">
                            {recentchatUsers.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border-b border-gray-200 last:border-b-0 p-2"
                                    onClick={() => router.push(`/chat/${item?.user_id}`)}
                                >
                                    <img
                                        src={item?.profile_image}
                                        alt={item?.name}
                                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-contain flex-shrink-0"
                                    />

                                    <div className="flex-1 flex justify-between items-center">
                                        <div className="flex-1 pr-2">
                                            <p className="text-sm sm:text-base font-semibold text-gray-900">
                                                {item?.name}
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                                {(lastMessages[item.user_id] || item?.last_message || "")
                                                    .slice(0, 100)
                                                    .concat(
                                                        (lastMessages[item.user_id] || item?.last_message || "")
                                                            .length > 100
                                                            ? "..."
                                                            : ""
                                                    )}
                                            </p>
                                        </div>

                                        {/* 🔵 Unread badge */}
                                        {unreadCounts[item.user_id] > 0 && (
                                            <div className="bg-[#000F5C] text-white text-xs font-bold px-2 py-1 rounded-full">
                                                {unreadCounts[item.user_id]}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>

                    ) : recentchatUsers === undefined ? (
                        // Skeleton Placeholder (5 rows)
                        <ul className="space-y-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-3 sm:gap-4 animate-pulse"
                                >
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-300 flex-shrink-0"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
                                        <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        // No data found
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                            <img src='/notfound.svg' className='w-100 h-100' />
                            <p className="text-sm sm:text-base"> {t('norecentChts')}</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
