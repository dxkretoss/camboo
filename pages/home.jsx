import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Navbar from '@/components/Navbar/Navbar';
import SectionCard from '@/components/Cards/SectionCard';
import { Heart, Inbox, ChevronLeft, ChevronRight, MessageCircle, SendHorizonal, EllipsisVertical, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useUser } from '@/context/UserContext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import Image from 'next/image';

export default function HomePage() {
    const router = useRouter();
    const token = Cookies.get('token');

    useEffect(() => {
        document.title = "Camboo-Homepage"
        if (!token) {
            router.push('/');
        }
    }, [token]);

    const { loading, allProductandService, profile, clientSaveItems, getClientSaveitems } = useUser();

    const [startIndexes, setStartIndexes] = useState({});
    const [loadingIds, setLoadingIds] = useState([]);
    const [sendComments, setsendComments] = useState({});
    const [cmtsending, setcmtsending] = useState(false);
    const [imagesPerPage, setImagesPerPage] = useState(2);
    const [loadedImages, setLoadedImages] = useState({});
    const [fetching, setfetching] = useState(false);
    const [openDenounceadDialog, setopenDenounceadDialog] = useState(false);
    const [Denounceadcomment, setDenounceadComment] = useState("");
    const [sendDenouceCmt, setsendDenouceCmt] = useState(false);
    const dialogRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target)) {
                setopenDenounceadDialog(false);
                setDenounceadComment("")
            }
        };

        if (openDenounceadDialog) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openDenounceadDialog]);

    useEffect(() => {
        const updateImagesPerPage = () => {
            if (window.innerWidth < 640) {
                setImagesPerPage(1);
            } else {
                setImagesPerPage(2);
            }
        };

        updateImagesPerPage();
        window.addEventListener("resize", updateImagesPerPage);
        return () => window.removeEventListener("resize", updateImagesPerPage);
    }, []);

    const handlePrev = (id, totalImages) => {
        setStartIndexes((prev) => {
            const currentIndex = prev[id] || 0;
            const newIndex =
                currentIndex - imagesPerPage < 0
                    ? Math.max(totalImages - imagesPerPage, 0)
                    : currentIndex - imagesPerPage;

            return { ...prev, [id]: newIndex };
        });
    };

    const handleNext = (id, totalImages) => {
        setStartIndexes((prev) => {
            const currentIndex = prev[id] || 0;
            const newIndex =
                currentIndex + imagesPerPage >= totalImages
                    ? 0
                    : currentIndex + imagesPerPage;

            return { ...prev, [id]: newIndex };
        });
    };


    const suggestedTrades = [
        { title: 'Iphone 16 Pro max', subtitle: 'lorem ipsum dummy content', image: 'https://randomuser.me/api/portraits/men/5.jpg' },
        { title: 'Hardly Davidson New Model', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/6.jpg' },
        { title: 'Vivo A1', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/7.jpg' },
        { title: 'Iphone 15 Pro max', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/8.jpg' },
        { title: 'Dell Z51902 Laptop', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/9.jpg' },
    ];

    const historyOfTrades = [
        { title: 'HP Z109 Laptop Refurbished', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/10.jpg' },
        { title: 'Hero Honda Czcuk Luck', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/11.jpg' },
        { title: 'Iphone 16 Pro Max', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/12.jpg' },
        { title: 'Iphone 11 Pro', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/13.jpg' },
        { title: 'Mercedes C-Class 1200', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/14.jpg' },
    ];

    const marketings = [
        { title: 'HP Z109 Laptop Refurbished', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/15.jpg' },
        { title: 'Hero Honda Czcuk Luck', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/16.jpg' },
        { title: 'Iphone 16 Pro Max', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/18.jpg' },
    ];

    function DescriptionToggle({ text }) {
        const [expanded, setExpanded] = useState(false);

        if (!text) return null;

        return (
            <div>
                <p
                    className="text-sm text-gray-600 mt-1"
                    style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: expanded ? 'none' : 2,
                        overflow: 'hidden',
                    }}
                >
                    {text}
                </p>
                {text.length > 100 && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-blue-600 cursor-pointer hover:underline mt-1 text-xs font-medium"
                        type="button"
                    >
                        {expanded ? 'See less' : 'See more'}
                    </button>
                )}
            </div>
        );
    }

    const sendClientSaveitems = async (id) => {
        setLoadingIds((prev) => [...prev, id]);
        try {
            const token = Cookies.get("token");
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_CAMBOO}/save-and-delete-item`,
                { item_id: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res?.data?.success) {
                await getClientSaveitems();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingIds((prev) => prev.filter((itemId) => itemId !== id));
        }
    };

    const sendClientItemsComments = async (id, text) => {
        if (!text.trim()) {
            return;
        }
        setcmtsending(true);
        try {
            const token = Cookies.get("token");
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_CAMBOO}/add-comment`,
                { item_id: id, comment: text },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                toast.success(`${res?.data?.message}`);
                setsendComments((prev) => ({ ...prev, [id]: "" }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setcmtsending(false);
        }
    };

    const doingTrade = async (id, type) => {
        setfetching(true);
        try {
            const token = Cookies.get("token");
            const letsCamboo = await axios.get(`${process.env.NEXT_PUBLIC_API_CAMBOO}/lets-trade?item_id=${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (letsCamboo?.data?.success) {
                router.push({
                    pathname: "./trade",
                    query: {
                        Type: type,
                        Trade: letsCamboo?.data?.other_item?.id
                    },
                })
            }
        } catch (err) {
            console.log(err)
        } finally {
            setfetching(false)
        }
    }

    const sendDenounceadComment = async (id) => {
        if (!Denounceadcomment) return;
        setsendDenouceCmt(true);
        try {
            const token = Cookies.get("token");
            const sendCmt = await axios.post(`${process.env.NEXT_PUBLIC_API_CAMBOO}/denounce-item`,
                {
                    item_id: id,
                    comment: Denounceadcomment,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (sendCmt?.data?.success) {
                toast.success(`${sendCmt?.data?.message}`)
                setopenDenounceadDialog(false);
                setDenounceadComment("");
            }
        } catch (error) {
            console.log(error)
        } finally {
            setsendDenouceCmt(false);
        }
    }
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
            <div className="hidden lg:block w-[250px]">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col">
                <Navbar />
                {(loading || fetching) && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black/10 backdrop-blur-sm z-50 transition-opacity duration-300">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-[#000F5C] rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-[#000F5C] rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                            <div className="w-3 h-3 bg-[#000F5C] rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                        </div>
                    </div>
                )}
                <div className="flex flex-col lg:flex-row p-2 gap-2">
                    <div className="flex-1 space-y-2">
                        {allProductandService?.length > 0 ? (
                            allProductandService?.sort((a, b) => b.id - a.id)?.map((user, idx) => {
                                return (
                                    <div key={idx} className="bg-white rounded-xl shadow p-3 sm:p-4">
                                        <div className="flex items-start justify-between flex-wrap gap-3">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={user?.profile_image}
                                                    alt="User"
                                                    className="w-10 h-10 rounded-full object-contain border-2 border-white"
                                                />
                                                <div>
                                                    <h2 className="text-sm font-semibold text-gray-900">
                                                        {`${user?.first_name} ${user?.last_name}` || ""}
                                                    </h2>
                                                    <p className="text-xs text-gray-500">{user?.created}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Heart
                                                    onClick={() => {
                                                        if (!loadingIds.includes(user?.id)) {
                                                            sendClientSaveitems(user?.id);
                                                        }
                                                    }}
                                                    className={`transition-transform duration-200 
                                                                ${loadingIds.includes(user?.id)
                                                            ? "animate-pulse text-gray-400 cursor-not-allowed"
                                                            : clientSaveItems?.some(item => item.item_id === user?.id)
                                                                ? "text-[#000F5C] scale-110 fill-[#000F5C] cursor-pointer"
                                                                : "text-black cursor-pointer"
                                                        }`
                                                    }
                                                />

                                                <EllipsisVertical className='cursor-pointer' />
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <h3 className="text-base font-semibold text-gray-800 flex items-center gap-3">
                                                {user?.title}
                                                {(user?.price || user?.day_price || user?.hr_price) !== undefined && (
                                                    <span className="text-sm font-medium text-gray-500">
                                                        ${user.price || user?.day_price || user?.hr_price}
                                                    </span>
                                                )}
                                            </h3>
                                            <DescriptionToggle text={user?.description} />
                                        </div>

                                        {user?.images?.length > 0 && (
                                            <div className="mt-3 relative">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {user?.images
                                                        ?.slice(startIndexes[user.id] || 0, (startIndexes[user.id] || 0) + imagesPerPage)
                                                        ?.map((img, imgIdx) => {
                                                            return (
                                                                <div
                                                                    key={imgIdx}
                                                                    className="h-40 sm:h-48 md:h-56 rounded-md overflow-hidden flex items-center justify-center bg-gray-100 relative"
                                                                >
                                                                    {!loadedImages[img] && (
                                                                        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                                                                    )}
                                                                    <Image
                                                                        src={img}
                                                                        alt={`product-${user?.id}-${imgIdx}`}
                                                                        fill
                                                                        priority={imgIdx < 2}
                                                                        className={`object-contain transition-opacity duration-500 ${loadedImages[img] ? "opacity-100" : "opacity-0"}`}
                                                                        onLoadingComplete={() =>
                                                                            setLoadedImages((prev) => ({ ...prev, [img]: true }))
                                                                        }
                                                                    />
                                                                </div>
                                                            );
                                                        })}
                                                </div>

                                                {user.images.length > imagesPerPage && (
                                                    <>
                                                        <button
                                                            onClick={() => handlePrev(user.id, user.images.length, user)}
                                                            className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                                                        >
                                                            <ChevronLeft size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleNext(user.id, user.images.length, user)}
                                                            className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                                                        >
                                                            <ChevronRight size={20} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 mt-3 rounded-full py-2">
                                            <img
                                                src={profile?.profile_image}
                                                alt="User"
                                                className="w-8 h-8 rounded-full object-contain"
                                            />
                                            <input
                                                type="text"
                                                placeholder="comment here..."
                                                value={sendComments[user.id] || ""}
                                                onChange={(e) =>
                                                    setsendComments((prev) => ({ ...prev, [user.id]: e.target.value }))
                                                }
                                                className="flex-grow border-none focus:outline-none text-sm placeholder:text-gray-500"
                                            />
                                            <button
                                                disabled={cmtsending}
                                                className="text-white cursor-pointer disabled:cursor-not-allowed bg-[#000F5C] hover:bg-blue-700 p-2 rounded-full flex items-center justify-center"
                                                onClick={() => sendClientItemsComments(user?.id, sendComments[user?.id] || "")}
                                            >
                                                {cmtsending ? (
                                                    <div className="flex items-center justify-center w-5 h-5 space-x-1">
                                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce animation-delay-0"></span>
                                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce animation-delay-150"></span>
                                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce animation-delay-300"></span>
                                                    </div>
                                                ) : (
                                                    <SendHorizonal size={20} />
                                                )}
                                            </button>

                                        </div>

                                        <hr className="text-gray-300" />

                                        <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center mt-4 gap-3">
                                            <div className="hidden xl:block w-full xl:w-auto">
                                                <Button className="w-full xl:w-auto text-sm px-4 py-2 rounded-md flex items-center justify-center gap-2 font-medium"
                                                    onClick={() => {
                                                        doingTrade(user?.id, user?.main_type)
                                                    }}>
                                                    <img src="/share.png" alt="Verified" className="w-4 h-4" />
                                                    <span className="hidden xl:inline">Camboo!!</span>
                                                </Button>
                                            </div>

                                            <div className="flex flex-row gap-2 w-full xl:w-auto justify-end">
                                                <Button className="flex-1 xl:hidden text-sm px-4 py-2 rounded-md flex items-center justify-center gap-2 font-medium"
                                                    onClick={() => {
                                                        doingTrade(user?.id)
                                                    }}>
                                                    <img src="/share.png" alt="Verified" className="w-4 h-4" />
                                                </Button>

                                                <button className="flex-1 xl:flex-none border border-[#C7F846] text-[#7FA600] bg-transparent cursor-pointer text-sm px-4 py-2 rounded-md flex items-center justify-center gap-2 font-medium">
                                                    {/* <img src="/getintouch.png" alt="Verified" className="w-4 h-4" /> */}
                                                    <MessageCircle className="w-4 h-4" />
                                                    <span className="hidden xl:inline">Chat</span>
                                                </button>

                                                <button className="flex-1 xl:flex-none border border-[#FF5C5C] text-[#FF5C5C] bg-transparent cursor-pointer text-sm px-4 py-2 rounded-md flex items-center justify-center gap-2 font-medium"
                                                    onClick={() => {
                                                        setopenDenounceadDialog(true);
                                                    }}>
                                                    <img src="/denouce.png" alt="Verified" className="w-4 h-4" />
                                                    <span className="hidden xl:inline">Denounce Ad</span>
                                                </button>

                                                {openDenounceadDialog && (
                                                    <div className="fixed inset-0 flex justify-center items-center bg-black/15 z-50 p-4 sm:p-6">
                                                        <div
                                                            ref={dialogRef}
                                                            className="bg-white rounded-lg p-6 w-full max-w-md sm:max-w-lg md:max-w-xl relative"
                                                        >
                                                            <button
                                                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-lg"
                                                                onClick={() => setopenDenounceadDialog(false)}
                                                            >
                                                                <X />
                                                            </button>

                                                            <div className="flex items-center gap-2 mb-4">
                                                                <img src="/denouce.png" alt="Verified" className="w-4 h-4" />
                                                                <span className="text-lg font-semibold">Denounce Ad</span>
                                                            </div>

                                                            <p className="mb-2 text-sm text-gray-600">
                                                                Write your comment below:
                                                            </p>

                                                            <textarea
                                                                value={Denounceadcomment}
                                                                onChange={(e) => setDenounceadComment(e.target.value)}
                                                                className="w-full border border-gray-300 rounded-md p-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                                                                rows={4}
                                                                placeholder="Your comment..."
                                                            />

                                                            <div className="flex justify-end">
                                                                <Button
                                                                    disabled={sendDenouceCmt}
                                                                    className={`flex gap-2 items-center px-4 py-2 rounded-md text-sm font-medium transition-all
                                                                            ${sendDenouceCmt
                                                                            ? "bg-gray-400 cursor-not-allowed opacity-70"
                                                                            : "bg-[#000F5C] hover:bg-[#00136e] text-white shadow-md"}`}
                                                                    onClick={() => sendDenounceadComment(user?.id)}
                                                                >
                                                                    {sendDenouceCmt ? (
                                                                        <>
                                                                            <svg
                                                                                className="animate-spin h-4 w-4 text-white"
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
                                                                            <span>Sending...</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <SendHorizonal size={20} />
                                                                            <span>Send Comment</span>
                                                                        </>
                                                                    )}
                                                                </Button>

                                                            </div>
                                                        </div>
                                                    </div>
                                                )}


                                                <button className="flex-1 xl:flex-none border border-[#003EFF] text-[#003EFF] bg-transparent cursor-pointer text-sm px-4 py-2 rounded-md flex items-center justify-center gap-2 font-medium"
                                                    onClick={() => {
                                                        router.push({
                                                            pathname: './addProduct',
                                                            query: { Copyad: user?.id }
                                                        })
                                                    }}>
                                                    <img src="/dummy.png" alt="Verified" className="w-4 h-4" />
                                                    <span className="hidden xl:inline">Copy ad</span>
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow">
                                <Inbox className="w-20 h-20 mb-3 text-gray-400" />
                                <p className="text-gray-500 text-sm">No products or services found</p>
                            </div>
                        )}
                    </div>

                    <div className="w-full lg:w-[300px] xl:w-[340px] space-y-2">
                        <SectionCard title="Suggested Trades" items={suggestedTrades} />
                        <SectionCard title="History of Trades" items={historyOfTrades} />
                        <SectionCard title="Marketings" items={marketings} />
                    </div>
                </div>
            </div>
            <Toaster />
        </div >
    );
}
