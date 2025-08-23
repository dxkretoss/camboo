import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";
import Layout from "@/components/Layout/Layout";
import Image from "next/image";
import { ChevronLeft, Send } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";
import { initEcho, getEcho } from "@/utils/echo";

export default function ChatPage() {
    const router = useRouter();
    const { id } = router.query;
    const token = Cookies.get("token");
    const { profile } = useUser();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");

    const listRef = useRef();

    // Redirect if no token
    useEffect(() => {
        if (!token) router.push("/");
    }, [token]);

    // Fetch messages and subscribe to real-time updates
    useEffect(() => {
        if (!id || !token || !profile?.id) return;

        // Fetch existing messages
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_CAMBOO}/get-message/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setMessages(res.data?.messages || []);
            } catch (err) {
                console.error("Error fetching messages:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();

        // Initialize Echo
        const echo = initEcho(token);
        const channel = echo.private(`chat.${profile.id}`);

        // Real-time listener
        const listener = (e) => {
            const msg = e.message || e.data;
            if (msg) setMessages((prev) => [...prev, msg]);
        };

        channel.listen("MessageSent", listener);

        // Cleanup on unmount
        return () => {
            channel.stopListening("MessageSent", listener);
            getEcho()?.leave(`chat.${profile.id}`);
        };
    }, [id, token, profile?.id]);

    // Auto-scroll to bottom when new message arrives
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages]);

    // Send message
    const sendMessage = async () => {
        if (!input.trim()) return;

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_CAMBOO}/send-message`,
                {
                    message: input,
                    receiver_id: id,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res?.data?.data) {
                setMessages((prev) => [...prev, res.data.data]);
            }
            setInput("");
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    return (
        <Layout>
            <div className="md:px-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <ChevronLeft
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => window.history.back()}
                    />
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 relative rounded-full overflow-hidden">
                            <img
                                src="https://randomuser.me/api/portraits/men/5.jpg"
                                alt="avatar"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <div className="font-semibold">User Name</div>
                            <div className="text-xs text-gray-500">User Name</div>
                        </div>
                    </div>
                </div>

                {/* Chat Box */}
                <div className="border border-gray-200 rounded-2xl h-[60vh] md:h-[70vh] flex flex-col overflow-hidden shadow-md">
                    {/* Messages */}
                    <div
                        ref={listRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4 bg-white custom-scrollbar"
                    >
                        {loading ? (
                            <div className="text-center text-sm text-gray-500">
                                Loading messages...
                            </div>
                        ) : messages.length > 0 ? (
                            messages.map((m) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex items-end gap-2 ${m.sender_id === profile?.id ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-md ${m.sender_id === profile?.id
                                            ? "bg-[#000F5C] text-white rounded-br-none"
                                            : "bg-white text-gray-900 border rounded-bl-none"
                                            }`}
                                    >
                                        <div className="text-sm">{m.message}</div>
                                        <div
                                            className={`text-[10px] mt-1 text-right ${m.sender_id === profile?.id ? "text-gray-200" : "text-gray-500"
                                                }`}
                                        >
                                            {new Date(m.created_at).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center text-sm text-gray-500">No messages yet</div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t bg-white">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2 shadow-inner">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                className="flex-1 px-3 py-2 bg-transparent focus:outline-none text-sm"
                                placeholder="Type a message..."
                            />
                            <button
                                onClick={sendMessage}
                                className="px-4 py-2 rounded-full bg-[#000F5C] text-white flex items-center gap-1 shadow-md hover:scale-105 transition-transform"
                            >
                                <Send size={16} /> Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
