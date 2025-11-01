import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";
import Layout from "@/components/Layout/Layout";
import { ChevronLeft, Send, Paperclip, X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";
import Pusher from "pusher-js";
import { useTranslation } from 'react-i18next';
import '../../utils/i18n'
export default function ChatPage() {
    const { t } = useTranslation();

    const router = useRouter();
    const { id } = router?.query;
    const token = Cookies.get("token");
    const { profile, allProductandService, getrecentchatUsers } = useUser();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sending, setsending] = useState(false);
    const [input, setInput] = useState("");
    const [matchUser, setmatchUser] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const listRef = useRef();

    useEffect(() => {
        if (!id || !allProductandService?.length) return;

        const findUser = allProductandService.filter(
            (item) => Number(item.user_id) === Number(id)
        );

        if (findUser.length > 0) {
            setmatchUser(findUser[0]);
        }
    }, [id, allProductandService]);

    useEffect(() => {
        if (!token) {
            router.push("/");
            return;
        }
    }, [token]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);

        // Preview
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
            setFilePreview(URL.createObjectURL(file));
        } else {
            setFilePreview(file.name);
        }
    };

    useEffect(() => {
        if (!id || !token || !profile?.id) return;

        const fetchMessages = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_CAMBOO}/get-message/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res?.data) {
                    setMessages(res?.data?.messages || []);
                    getrecentchatUsers();
                    scrollToBottom();
                }
            } catch (error) {
                console.error("❌ Error fetching messages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();

    }, [id, token, profile?.id]);

    useEffect(() => {
        if (!profile?.id || !id || !token) return;

        const myId = profile?.id;
        const otherId = parseInt(id);

        const chatChannelId =
            myId < otherId ? `${myId}.${otherId}` : `${otherId}.${myId}`;

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
            forceTLS: true,
        });

        const channel = pusher.subscribe(`chat.${chatChannelId}`);

        channel.bind("MessageSent", (data) => {
            // console.log("📩 New message payload:", data);

            if (data?.receiver_id == id || data?.sender_id == id) {
                setMessages((prev) => [...prev, data]);
                scrollToBottom();
            }
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, [id, profile?.id]);

    const scrollToBottom = () => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!input.trim() && !selectedFile) return;

        setsending(true);

        try {
            let messageType = 1;
            if (selectedFile) {
                if (selectedFile.type.startsWith("image/")) messageType = 2;
                else if (selectedFile.type.startsWith("video/")) messageType = 3;
                else messageType = 4;

                const formData = new FormData();
                formData.append("file", selectedFile);
                formData.append("receiver_id", id);
                formData.append("message_type", messageType);
                formData.append("message", "");

                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_CAMBOO}/send-message`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (res?.data?.data) {
                    // setMessages((prev) => [...prev, res.data.data]);
                    scrollToBottom();
                }
            } else {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_CAMBOO}/send-message`,
                    {
                        message: input,
                        receiver_id: id,
                        message_type: 1,
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (res?.data?.data) {
                    // setMessages((prev) => [...prev, res.data.data]);
                    scrollToBottom();
                }
            }

            setInput("");
            setSelectedFile(null);
            setFilePreview(null);
        } catch (err) {
            console.error("❌ Error sending message:", err);
        } finally {
            setsending(false);
        }
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;
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
                        <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 relative rounded-full overflow-hidden">
                                {matchUser?.profile_image ? (
                                    <img
                                        src={matchUser?.profile_image}
                                        alt="avatar"
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-300 animate-pulse" />
                                )}
                            </div>

                            {/* Name */}
                            <div>
                                {matchUser?.first_name ? (
                                    <div className="font-semibold">
                                        {`${matchUser.first_name} ${matchUser.last_name}`}
                                    </div>
                                ) : (
                                    <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Chat Box */}
                <div className="border border-gray-200 rounded-2xl h-[calc(100vh-200px)] flex flex-col overflow-hidden shadow-md">
                    {/* Messages */}
                    <div
                        ref={listRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('/pattern.svg')] bg-gray-50 bg-repeat custom-scrollbar"
                    >
                        {loading ? (
                            <div className="flex justify-center items-center h-full text-sm text-[#000F5C]">
                                {t('LoadMess')}
                            </div>
                        ) : Array.isArray(messages) &&
                            messages.length > 0 ? (
                            messages
                                ?.sort((a, b) => a.id - b.id)
                                ?.map((m) => (
                                    <motion.div
                                        key={m.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex items-end gap-2 ${m.sender_id === profile?.id
                                            ? "justify-end"
                                            : "justify-start"
                                            }`}
                                    >
                                        <div
                                            className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-md ${m.sender_id === profile?.id
                                                ? "bg-[#000F5C] text-white rounded-br-none"
                                                : "bg-white text-[#000F5C] rounded-bl-none"
                                                }`}
                                        >
                                            {/* Render based on message type */}
                                            {m.message_type === 1 && (
                                                <div className="text-sm">
                                                    {m.message}
                                                </div>
                                            )}

                                            {m.message_type === 2 && (
                                                <img
                                                    src={m?.file_url || m?.file || m?.message}
                                                    alt="chat-img"
                                                    className="rounded-lg max-h-60 object-cover"
                                                />
                                            )}

                                            {m.message_type === 3 && (
                                                <video
                                                    controls
                                                    className="rounded-lg max-h-60"
                                                >
                                                    <source
                                                        src={
                                                            m?.file ||
                                                            m?.file_url ||
                                                            m?.message
                                                        }
                                                        type="video/mp4"
                                                    />
                                                    {t('vdenotsup')}
                                                </video>
                                            )}

                                            {m.message_type === 4 && (
                                                <a
                                                    href={
                                                        m?.file_url ||
                                                        m?.file_url ||
                                                        m?.message
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="underline text-sm flex items-center gap-1"
                                                >
                                                    {t('Dwndoc')}
                                                </a>
                                            )}

                                            <div
                                                className={`text-[10px] mt-1 text-right ${m.sender_id === profile?.id
                                                    ? "text-gray-200"
                                                    : "text-gray-500"
                                                    }`}
                                            >
                                                {new Date(
                                                    m.created_at
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                        ) : (
                            <div className="flex justify-center items-center h-full text-sm text-gray-500">
                                {t('nomess')}
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t bg-white">
                        {/* File Preview */}
                        {filePreview && (
                            <div className="mb-2 flex items-center gap-3 bg-gray-100 p-2 rounded-lg">
                                {selectedFile?.type.startsWith("image/") && (
                                    <img
                                        src={filePreview}
                                        alt="preview"
                                        className="h-16 rounded"
                                    />
                                )}
                                {selectedFile?.type.startsWith("video/") && (
                                    <video
                                        src={filePreview}
                                        className="h-16 rounded"
                                    />
                                )}
                                {selectedFile &&
                                    !selectedFile.type.startsWith("image/") &&
                                    !selectedFile.type.startsWith("video/") && (
                                        <span className="text-sm">
                                            {filePreview}
                                        </span>
                                    )}
                                <button
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setFilePreview(null);
                                    }}
                                    className="text-gray-500 hover:text-red-500"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2 shadow-inner">
                            {/* File upload button */}
                            <label className="cursor-pointer text-gray-500 hover:text-[#000F5C]">
                                <Paperclip size={18} />
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                            </label>

                            {/* Text input */}
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault(); // prevent new line
                                        sendMessage();
                                    }
                                }}
                                className="flex-1 px-3 py-2 bg-transparent focus:outline-none text-sm"
                                placeholder={`${t("typemess")}...`}
                            />

                            {/* Send button */}
                            <button
                                onClick={sendMessage}
                                disabled={sending}
                                className={`px-2 md:px-4 py-2 rounded-full flex items-center gap-1 shadow-md transition-transform 
                                    ${sending ? "bg-gray-400 cursor-not-allowed" : "bg-[#000F5C] text-white hover:scale-105"}`}
                            >
                                {sending ? (
                                    <span className="flex items-center">
                                        <svg
                                            className="animate-spin h-4 w-4 text-white mr-0 sm:mr-2"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            ></path>
                                        </svg>
                                        <span className="hidden sm:inline">{t('Sndng')}...</span>
                                    </span>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        <span className="hidden sm:inline">{t('Snd')}</span>
                                    </>
                                )}
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
