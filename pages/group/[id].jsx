import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";
import Layout from "@/components/Layout/Layout";
import { ChevronLeft, Send, Paperclip, X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";
import Pusher from "pusher-js";
import Button from "@/components/ui/Button";
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import '../../utils/i18n'
export default function GroupPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { id } = router?.query;
    const token = Cookies.get("token");
    const { profile, getallGroups } = useUser();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sending, setsending] = useState(false);
    const [input, setInput] = useState("");
    const [matchUser, setmatchUser] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const listRef = useRef();

    const [gettingGroup, setgettingGroup] = useState();
    const [gettingAllusers, setgettingAllusers] = useState();
    const [userGetting, setuserGetting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [inviteSending, setinviteSending] = useState(false);
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [sendingFor, setSendingFor] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        if (!token) {
            router.push("/");
            return;
        }
        getallGroups();
    }, [token]);

    useEffect(() => {
        if (!id) return;

        const getsallGroups = async () => {
            try {
                const getGroups = await axios.get(`${process.env.NEXT_PUBLIC_API_CAMBOO}/get-group`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                if (getGroups?.data?.success) {
                    setgettingGroup(getGroups?.data?.data?.find((get) => parseInt(get?.id) === parseInt(id)))
                }
            } catch (err) {
                console.error(err);
            }
        }
        getsallGroups();

    }, [id]);

    const getAlluser = async () => {
        setuserGetting(true)
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_CAMBOO}/get-allUsers`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res?.data?.success) {
                setgettingAllusers(res?.data?.data)
            }
        } catch (error) {
            console.error("❌ Error fetching messages:", error);
        } finally {
            setuserGetting(false);
        }
    };


    const sendInvite = async (grpID, userID) => {
        setSendingFor(userID);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_CAMBOO}/invite-users`,
                {
                    group_id: grpID,
                    user_id: userID,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res?.data?.success) {
                setInvitedUsers((prev) => [...prev, userID]);
            }
        } catch (error) {
            if (error.response?.data?.message === "User already invited or in group.") {
                toast.error(`${t('alreadygrp')}!`);
            } else {
                console.error("❌ Unexpected error sending invite:", error);
            }
        } finally {
            setSendingFor(null);
        }
    };


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
                    `${process.env.NEXT_PUBLIC_API_CAMBOO}/get-message/${profile?.id}?group_id=${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res?.data) {
                    setMessages(res?.data?.messages || []);
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

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
            forceTLS: true,
        });

        const channel = pusher.subscribe(`group.${id}`);

        channel.bind("MessageSent", (data) => {
            // console.log("📩 New message payload:", data);
            if (data?.group_id && parseInt(data.group_id) === parseInt(id)) {
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
                formData.append("group_id", id);
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
                        group_id: id,
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

    const filteredUsers = gettingAllusers?.filter((user) => {
        const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

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
                    <div className="flex justify-between items-center w-full">
                        <div className="flex  items-center gap-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 relative rounded-full overflow-hidden">
                                {gettingGroup ? (
                                    <img
                                        src={gettingGroup?.group_profile || '/defualtgrp.png'}
                                        alt="avatar"
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-300 animate-pulse" />
                                )}
                            </div>

                            <div>
                                {gettingGroup?.group_name ? (
                                    <div className="font-semibold">
                                        {`${gettingGroup?.group_name}`}
                                    </div>
                                ) : (
                                    <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                                )}

                                {gettingGroup?.total_member ? (
                                    <div>
                                        <span className="text-xs text-gray-500">
                                            {`${gettingGroup?.total_member}`} {t('Mmbrs')}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                                )}
                            </div>
                        </div>
                        {parseInt(gettingGroup?.user_id) === parseInt(profile?.id) &&
                            <div>
                                <Button onClick={() => {
                                    getAlluser();
                                    setIsDialogOpen(true);
                                }}>
                                    {t('AddMmbrs')}
                                </Button>
                            </div>
                        }
                    </div>
                </div>

                {isDialogOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                        <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
                            >
                                &times;
                            </button>

                            <h2 className="text-lg font-semibold mb-4">{t('AddMmbrs')}</h2>

                            <input
                                type="text"
                                placeholder={`${t("serchbyname")}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />

                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                {userGetting ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="flex justify-between items-center border-b border-gray-200 pb-2 animate-pulse"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                                            <div className="flex-1 mx-3">
                                                <div className="h-3 w-24 bg-gray-300 rounded mb-1"></div>
                                            </div>
                                            <div className="h-8 w-20 bg-gray-300 rounded"></div>
                                        </div>
                                    ))
                                ) : filteredUsers?.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex justify-between items-center border-b border-gray-200 pb-2"
                                        >
                                            <div className="flex gap-2 items-center">
                                                <img
                                                    src={user?.profile_image || "/defaultuser.png"}
                                                    alt="avatar"
                                                    className="object-cover w-8 h-8 rounded-full"
                                                />
                                                <span>{user?.first_name} {user?.last_name}</span>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={invitedUsers.includes(user.id) || sendingFor === user.id}
                                                onClick={() => sendInvite(id, user.id)}
                                            >
                                                {invitedUsers.includes(user.id)
                                                    ? t("Sent")
                                                    : sendingFor === user.id
                                                        ? t("Sending")
                                                        : t("SendInvite")}
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                        {t("Nouser")}
                                    </p>
                                )}
                            </div>

                            <div className="mt-4 text-right">
                                <Button onClick={() => setIsDialogOpen(false)}>{t("Cls")}</Button>
                            </div>
                        </div>
                    </div>
                )}



                {/* Chat Box */}
                <div className="border border-gray-200 rounded-2xl h-[calc(100vh-200px)] flex flex-col overflow-hidden shadow-md">
                    {/* Messages */}
                    <div
                        ref={listRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('/pattern.svg')] bg-gray-50 bg-repeat custom-scrollbar"
                    >
                        {loading ? (
                            <div className="flex justify-center items-center h-full text-sm text-[#000F5C]">
                                {t("LoadMess")}
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
                                        {m.sender_id !== profile?.id && (
                                            <img
                                                src={m?.sender_image || './defualtuser.png'}
                                                alt="sender"
                                                className="w-8 h-8 rounded-full object-cover border"
                                            />
                                        )}
                                        <div
                                            className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-md ${m.sender_id === profile?.id
                                                ? "bg-[#000F5C] text-white rounded-br-none"
                                                : "bg-white text-[#000F5C] rounded-bl-none"
                                                }`}
                                        >
                                            {/* Render based on message type */}

                                            {m.sender_id !== profile?.id && (
                                                <span className="text-xs text-gray-600 mb-1 font-bold">
                                                    {m.sender_name || m.sender_first_name || "Unknown"}
                                                </span>
                                            )}

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
                                                    {t("vdenotsup")}
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
                                                    {t("Dwndoc")}
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
                                {t("nomess")}
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
                                        e.preventDefault();
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
            <Toaster />
        </Layout >
    );
}
