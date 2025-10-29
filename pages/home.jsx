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
import { useSearch } from '@/context/SearchContext';

export default function HomePage() {
    const router = useRouter();
    const token = Cookies.get('token');
    useEffect(() => {
        document.title = "Camboo-Homepage"
        if (!token) {
            router.push('/');
        }
    }, [token]);

    const { page } = router.query;
    const [currentPage, setCurrentPage] = useState(Number(page) || 1);
    const itemsPerPage = 10;
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        router.push(
            {
                pathname: router.pathname,
                query: { ...router.query, page: newPage },
            },
            undefined,
            { shallow: true }
        );

        window.scrollTo({ top: 0, behavior: "auto" });
    };

    const { loading, allProductandService, profile, clientSaveItems, getClientSaveitems, suggestedTrades, recentchatUsers, getallProdandSer } = useUser();
    const { searchItems } = useSearch();

    const filteredProducts = allProductandService?.filter((user) => {
        if (!searchItems) return true;
        const text = searchItems.toLowerCase();
        return (
            user?.title?.toLowerCase().includes(text)
        );
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts
        ?.sort((a, b) => b.id - a.id)
        ?.slice(startIndex, endIndex);

    const [startIndexes, setStartIndexes] = useState({});
    const [loadingIds, setLoadingIds] = useState([]);
    const [sendComments, setsendComments] = useState({});
    const [cmtsending, setcmtsending] = useState(false);
    const [imagesPerPage, setImagesPerPage] = useState(2);
    const [loadedImages, setLoadedImages] = useState({});
    const [fetching, setfetching] = useState(false);
    const [openDenounceadDialog, setopenDenounceadDialog] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [Denounceadcomment, setDenounceadComment] = useState("");
    const [sendDenouceCmt, setsendDenouceCmt] = useState(false);
    const dialogRef = useRef(null);
    const [openCmtDialogId, setOpenCmtDialogId] = useState(null); // track which item is open
    const cmtdialogRef = useRef(null);

    const handleOpenDialog = (id) => setOpenCmtDialogId(id);
    const handleCloseDialog = () => setOpenCmtDialogId(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target)) {
                setopenDenounceadDialog(false);
                setDenounceadComment("")
                setSelectedItemId(null);
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

                await getallProdandSer();
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
                setSelectedItemId(null);
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
                        {paginatedProducts?.length > 0 ? (
                            paginatedProducts?.sort((a, b) => b.id - a.id)?.map((user, idx) => {
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
                                                            : clientSaveItems?.some(item => item?.item_id === user?.id)
                                                                ? "text-[#000F5C] scale-110 fill-[#000F5C] cursor-pointer"
                                                                : "text-black cursor-pointer"
                                                        }`
                                                    }
                                                />

                                                {/* <EllipsisVertical className='cursor-pointer' /> */}
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
                                                    <img src='/sendCmt.svg' />
                                                )}
                                            </button>
                                        </div>

                                        <hr className="text-gray-300" />

                                        {user?.comments.length > 0 ?
                                            <div>
                                                <span className='text-sm text-gray-400'>comments</span>
                                            </div>
                                            : null}


                                        {user?.comments?.length > 0 && (
                                            <>
                                                <div className="mb-1 mt-2">
                                                    <div className="flex gap-2">
                                                        <div>
                                                            <img
                                                                src={`${user?.comments[0]?.user.profile_image}`}
                                                                className="w-10 h-10 rounded-full"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <p className="text-base">
                                                                {user?.comments[0]?.user.name}{" "}
                                                                <span className="text-sm text-gray-500">
                                                                    {user?.comments[0]?.created_at}
                                                                </span>
                                                            </p>
                                                            <span className="text-sm text-gray-500">
                                                                {user?.comments[0]?.comment}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {user?.comments?.length > 1 && (
                                                    <button
                                                        onClick={() => handleOpenDialog(user?.id)}
                                                        className="text-xs text-blue-600 hover:underline"
                                                    >
                                                        View all comments ({user.comments.length})
                                                    </button>
                                                )}

                                                {openCmtDialogId === user?.id && (
                                                    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
                                                        <div
                                                            ref={cmtdialogRef}
                                                            className="bg-white rounded-lg p-4 w-full max-w-md relative"
                                                        >
                                                            <button
                                                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                                                                onClick={handleCloseDialog}
                                                            >
                                                                <X />
                                                            </button>

                                                            <h3 className="text-lg font-semibold mb-3 text-[#000F5C]">All Comments</h3>

                                                            {/* Scrollable content */}
                                                            <div className="max-h-[400px] overflow-y-auto">
                                                                {user.comments?.map((cmt) => (
                                                                    <div key={cmt.id} className="mb-1 py-2">
                                                                        <div className="flex gap-2 p-2 border-b border-gray-200">
                                                                            <div>
                                                                                <img
                                                                                    src={`${cmt?.user?.profile_image}`}
                                                                                    className="w-10 h-10 rounded-full"
                                                                                />
                                                                            </div>
                                                                            <div className="flex flex-col">
                                                                                <p className="text-base">
                                                                                    {cmt?.user.name}{" "}
                                                                                    <span className="text-sm text-gray-500">
                                                                                        {cmt?.created_at}
                                                                                    </span>
                                                                                </p>
                                                                                <span className="text-sm text-gray-500">{cmt?.comment}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                            </>
                                        )}

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

                                                <button className="flex-1 xl:flex-none border border-[#C7F846] text-[#7FA600] bg-transparent cursor-pointer text-sm px-4 py-2 rounded-md flex items-center justify-center gap-2 font-medium"
                                                    onClick={() => router.push(`/chat/${user?.user_id}`)}>
                                                    {/* <img src="/getintouch.png" alt="Verified" className="w-4 h-4" /> */}
                                                    <MessageCircle className="w-4 h-4" />
                                                    <span className="hidden xl:inline">Chat</span>
                                                </button>

                                                <button className="flex-1 xl:flex-none border border-[#FF5C5C] text-[#FF5C5C] bg-transparent cursor-pointer text-sm px-4 py-2 rounded-md flex items-center justify-center gap-2 font-medium"
                                                    onClick={() => {
                                                        setSelectedItemId(user?.id);
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
                                                                onClick={() => {
                                                                    setopenDenounceadDialog(false);
                                                                    setSelectedItemId(null);
                                                                }}
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
                                                                    onClick={() => sendDenounceadComment(selectedItemId)}
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
                            <div className="flex flex-col items-center justify-center  bg-white rounded-xl shadow">
                                <img src='/notfound.svg' className='w-100 h-100' />
                                <p className="text-gray-500 text-xl font-extrabold mb-6">No products or services found</p>
                            </div>
                        )}

                        {
                            filteredProducts?.length > itemsPerPage && (
                                <div className="flex justify-center items-center mt-6 gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 rounded-md text-sm font-medium ${currentPage === 1
                                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                            : "bg-[#000F5C] text-white hover:bg-[#00136e]"
                                            }`}
                                    >
                                        Previous
                                    </button>

                                    <span className="text-sm font-medium text-gray-600">
                                        Page {currentPage} of {Math.ceil(filteredProducts.length / itemsPerPage)}
                                    </span>

                                    <button
                                        onClick={() =>
                                            handlePageChange(
                                                Math.min(
                                                    currentPage + 1,
                                                    Math.ceil(filteredProducts.length / itemsPerPage)
                                                )
                                            )
                                        }
                                        disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium ${currentPage === Math.ceil(filteredProducts.length / itemsPerPage)
                                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                            : "bg-[#000F5C] text-white hover:bg-[#00136e]"
                                            }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            )
                        }
                    </div>

                    <div className="hidden lg:block w-full lg:w-[300px] xl:w-[340px] space-y-2">
                        <div className="bg-white shadow rounded-lg p-2 mb-2">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-sm">Suggested Trades</h3>
                                {suggestedTrades?.length > 0 &&
                                    <button className="text-xs cursor-pointer text-blue-600 hover:underline" onClick={() => { router.push('/suggestedtrades') }}>View All</button>
                                }
                            </div>

                            <ul className="space-y-3">
                                {suggestedTrades
                                    ? suggestedTrades?.slice(0, 5)?.map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                                            onClick={() => { doingTrade(item?.id, item?.main_type) }}
                                        >
                                            <img
                                                src={item?.image || item?.images[0]}
                                                alt={item?.title}
                                                className="w-10 h-10 rounded-full object-contain"
                                            />
                                            <div>
                                                <p className="text-sm font-semibold">{item?.title}</p>
                                                <p className="text-xs text-gray-500">
                                                    {(item?.subtitle || item?.description)?.length > 100
                                                        ? (item?.subtitle || item?.description).substring(0, 45) + "..."
                                                        : (item?.subtitle || item?.description)}
                                                </p>
                                            </div>
                                        </li>

                                    ))
                                    :
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <li key={index} className="flex items-start gap-3 animate-pulse">
                                            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
                                                <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                                            </div>
                                        </li>
                                    ))}
                            </ul>

                            {suggestedTrades?.length === 0 && (
                                <div className="flex justify-center items-center w-full py-10">
                                    <span className="text-center text-gray-500">
                                        No suggested trades found.
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="bg-white shadow rounded-lg p-2 mb-2">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-sm">Recent Chats</h3>
                                {recentchatUsers?.length > 0 &&
                                    <button className="text-xs cursor-pointer text-blue-600 hover:underline" onClick={() => { router.push('/recentChats') }}>View All</button>
                                }
                            </div>

                            <ul className="space-y-3">
                                {recentchatUsers
                                    ? recentchatUsers?.slice(0, 5)?.map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                                            onClick={() => router.push(`/chat/${item?.user_id}`)}
                                        >
                                            <img
                                                src={item?.profile_image}
                                                alt={item?.first_name}
                                                className="w-10 h-10 rounded-full object-contain"
                                            />
                                            <div>
                                                <p className="text-sm font-semibold">{item?.name}</p>
                                                <p className="text-xs text-gray-500 flex justify-between w-full">
                                                    <span>
                                                        {(item?.last_message)?.length > 100
                                                            ? (item?.last_message).substring(0, 45) + "..."
                                                            : (item?.last_message)}
                                                    </span>
                                                    {/* <span>
                                                        {item?.last_message_time}
                                                    </span> */}
                                                </p>
                                            </div>
                                        </li>

                                    ))
                                    :
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <li key={index} className="flex items-start gap-3 animate-pulse">
                                            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
                                                <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                                            </div>
                                        </li>
                                    ))}
                            </ul>

                            {suggestedTrades?.length === 0 && (
                                <div className="flex justify-center items-center w-full py-10">
                                    <span className="text-center text-gray-500">
                                        No suggested trades found.
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>


                </div>
            </div >
            <Toaster />
        </div >
    );
}



{/* <div className="w-full lg:w-[300px] xl:w-[340px] space-y-2">
                            <div className="bg-white shadow rounded-lg p-2 mb-2">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-semibold text-sm">History of Trades</h3> */}
{/* <button className="text-xs cursor-pointer text-blue-600 hover:underline" onClick={() => { router.push('/suggestedtrades') }}>View All</button> */ }
{/* </div>
                                <div className='flex justify-center'> */}
{/* <img src='/no-document.png' className='' /> */ }
{/* <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="54"
                                        height="54"
                                        viewBox="0 0 64 64"
                                        className="w-18 h-18"
                                    >
                                        <g>
                                            <path
                                                d="M38.793 27.793 32 34.586l-6.793-6.793a1 1 0 0 0-1.414 1.414L30.586 36l-6.793 6.793A1.007 1.007 0 0 0 24.5 44.5a.997.997 0 0 0 .707-.293L32 37.414l6.793 6.793a1 1 0 1 0 1.414-1.414L33.414 36l6.793-6.793a1 1 0 0 0-1.414-1.414Z"
                                                fill="#000f5c"
                                            />
                                            <path
                                                d="m51.071 16.657-9.728-9.728A9.934 9.934 0 0 0 34.273 4H20a10.011 10.011 0 0 0-10 10v36a10.011 10.011 0 0 0 10 10h24a10.011 10.011 0 0 0 10-10V23.728a9.936 9.936 0 0 0-2.929-7.071ZM39 7.557c-.143-.42 10.46 10.367 10.657 10.514a8.084 8.084 0 0 1 .787.929H42.5a3.504 3.504 0 0 1-3.5-3.5ZM52 50a8.01 8.01 0 0 1-8 8H20a8.01 8.01 0 0 1-8-8V14a8.01 8.01 0 0 1 8-8h14.272A7.991 7.991 0 0 1 37 6.485V15.5a5.507 5.507 0 0 0 5.5 5.5h9.015c.925-.282.328 28.008.485 29Z"
                                                fill="#000f5c"
                                            />
                                        </g>
                                    </svg>

                                </div>
                            </div>
                        </div> */}

{/* <div className="w-full lg:w-[300px] xl:w-[340px] space-y-2">
                            <div className="bg-white shadow rounded-lg p-2 mb-2">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-semibold text-sm">Marketings</h3> */}
{/* <button className="text-xs cursor-pointer text-blue-600 hover:underline" onClick={() => { router.push('/suggestedtrades') }}>View All</button> */ }
{/* </div>

                                <div className='flex justify-center'> */}
{/* <img src='/no-document.png' className='' /> */ }
{/* <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="54"
                                        height="54"
                                        viewBox="0 0 64 64"
                                        className="w-18 h-18"
                                    >
                                        <g>
                                            <path
                                                d="M38.793 27.793 32 34.586l-6.793-6.793a1 1 0 0 0-1.414 1.414L30.586 36l-6.793 6.793A1.007 1.007 0 0 0 24.5 44.5a.997.997 0 0 0 .707-.293L32 37.414l6.793 6.793a1 1 0 1 0 1.414-1.414L33.414 36l6.793-6.793a1 1 0 0 0-1.414-1.414Z"
                                                fill="#000f5c"
                                            />
                                            <path
                                                d="m51.071 16.657-9.728-9.728A9.934 9.934 0 0 0 34.273 4H20a10.011 10.011 0 0 0-10 10v36a10.011 10.011 0 0 0 10 10h24a10.011 10.011 0 0 0 10-10V23.728a9.936 9.936 0 0 0-2.929-7.071ZM39 7.557c-.143-.42 10.46 10.367 10.657 10.514a8.084 8.084 0 0 1 .787.929H42.5a3.504 3.504 0 0 1-3.5-3.5ZM52 50a8.01 8.01 0 0 1-8 8H20a8.01 8.01 0 0 1-8-8V14a8.01 8.01 0 0 1 8-8h14.272A7.991 7.991 0 0 1 37 6.485V15.5a5.507 5.507 0 0 0 5.5 5.5h9.015c.925-.282.328 28.008.485 29Z"
                                                fill="#000f5c"
                                            />
                                        </g>
                                    </svg>

                                </div> 
                                </div> 
                            </div> */}
