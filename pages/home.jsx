import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Navbar from '@/components/Navbar/Navbar';
import SectionCard from '@/components/Cards/SectionCard';
import { Heart, Inbox, ChevronLeft, ChevronRight, SendHorizonal, EllipsisVertical } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useUser } from '@/context/UserContext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

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
    const [savedItems, setSavedItems] = useState({});
    const [sendComments, setsendComments] = useState({});
    const [cmtsending, setcmtsending] = useState(false);
    const [imagesPerPage, setImagesPerPage] = useState(2);
    const [loadingImages, setLoadingImages] = useState({});
    const [fetching, setfetching] = useState(false);

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
        setLoadingImages(prev => ({ ...prev, [id]: true }));

        setTimeout(() => {
            setStartIndexes(prev => {
                const currentIndex = prev[id] || 0;
                return {
                    ...prev,
                    [id]:
                        currentIndex - imagesPerPage < 0
                            ? Math.max(totalImages - imagesPerPage, 0)
                            : currentIndex - imagesPerPage
                };
            });

            setLoadingImages(prev => ({ ...prev, [id]: false }));
        }, 300);
    };

    const handleNext = (id, totalImages) => {
        setLoadingImages(prev => ({ ...prev, [id]: true }));

        setTimeout(() => {
            setStartIndexes(prev => {
                const currentIndex = prev[id] || 0;
                return {
                    ...prev,
                    [id]:
                        currentIndex + imagesPerPage >= totalImages
                            ? 0
                            : currentIndex + imagesPerPage
                };
            });

            setLoadingImages(prev => ({ ...prev, [id]: false }));
        }, 300);
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

    const toggleSave = (id) => {
        setSavedItems((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
        sendClientSaveitems(id);
    };

    const sendClientSaveitems = async (id) => {
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
        }
    };

    useEffect(() => {
        const mapped = {};
        clientSaveItems?.forEach(item => {
            mapped[item.item_id] = item.id;
        });
        setSavedItems(mapped);
    }, [clientSaveItems])

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
                <div className="flex flex-col lg:flex-row p-2 sm:p-3 md:p-4 gap-4">
                    <div className="flex-1 space-y-4 sm:space-y-6">
                        {allProductandService?.length > 0 ? (
                            allProductandService?.sort((a, b) => b.id - a.id)?.map((user, idx) => {
                                return (
                                    <div key={idx} className="bg-white rounded-xl shadow p-3 sm:p-4">
                                        <div className="flex items-start justify-between flex-wrap gap-3">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={user?.profile_image}
                                                    alt="User"
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                                                    loading="lazy"
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
                                                    onClick={() => toggleSave(user?.id)}
                                                    className={`cursor-pointer transition-transform duration-200
                                                    ${savedItems[user.id] ? "text-[#000F5C] scale-110 fill-[#000F5C]" : "text-black"}`}
                                                />
                                                <EllipsisVertical className='cursor-pointer' />
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <h3 className="text-base font-semibold text-gray-800 flex items-center gap-3">
                                                {user?.title}
                                                {(user?.price || user?.day_price || user?.hr_price) !== undefined && (
                                                    <span className="text-sm font-medium text-gray-500">
                                                        ₹{user.price || user?.day_price || user?.hr_price}
                                                    </span>
                                                )}
                                            </h3>
                                            <DescriptionToggle text={user?.description} />
                                        </div>

                                        {user?.images?.length > 0 && (
                                            <div className="mt-3 relative">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {loadingImages[user.id] ? (
                                                        Array.from({ length: imagesPerPage }).map((_, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="h-40 sm:h-48 md:h-56 rounded-md overflow-hidden flex items-center justify-center bg-gray-100 animate-pulse"
                                                            >
                                                                <div className="w-full h-full animate-pulse bg-gray-300" />
                                                            </div>
                                                        ))
                                                    ) : (
                                                        user.images
                                                            .slice(startIndexes[user.id] || 0, (startIndexes[user.id] || 0) + imagesPerPage)
                                                            .map((img, imgIdx) => (
                                                                <div
                                                                    key={imgIdx}
                                                                    className="h-40 sm:h-48 md:h-56 rounded-md overflow-hidden flex items-center justify-center"
                                                                >
                                                                    <img
                                                                        src={img}
                                                                        alt={`product-${user.id}-${imgIdx}`}
                                                                        loading="lazy"
                                                                        onLoad={(e) => e.currentTarget.classList.remove("opacity-0", "blur-md")}
                                                                        className="w-full h-full object-contain opacity-0 blur-md transition-all duration-500"
                                                                    />
                                                                </div>
                                                            ))
                                                    )}
                                                </div>

                                                {user.images.length > imagesPerPage && (
                                                    <>
                                                        <button
                                                            onClick={() => handlePrev(user.id, user.images.length)}
                                                            className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                                                        >
                                                            <ChevronLeft size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleNext(user.id, user.images.length)}
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
                                                className="w-8 h-8 rounded-full object-cover"
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
                                            <button disabled={cmtsending} className="text-white cursor-pointer disabled:cursor-not-allowed bg-[#000F5C] hover:bg-blue-700 p-2 rounded-full"
                                                onClick={() => sendClientItemsComments(user.id, sendComments[user.id] || "")}>
                                                <SendHorizonal size={18} />
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
                                                    <span className="hidden xl:inline">Let's Camboo!!</span>
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
                                                    <img src="/getintouch.png" alt="Verified" className="w-4 h-4" />
                                                    <span className="hidden xl:inline">Get in Touch</span>
                                                </button>

                                                <button className="flex-1 xl:flex-none border border-[#FF5C5C] text-[#FF5C5C] bg-transparent cursor-pointer text-sm px-4 py-2 rounded-md flex items-center justify-center gap-2 font-medium">
                                                    <img src="/denouce.png" alt="Verified" className="w-4 h-4" />
                                                    <span className="hidden xl:inline">Denounce Ad</span>
                                                </button>

                                                <button className="flex-1 xl:flex-none border border-[#003EFF] text-[#003EFF] bg-transparent cursor-pointer text-sm px-4 py-2 rounded-md flex items-center justify-center gap-2 font-medium">
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

                    <div className="w-full lg:w-[300px] xl:w-[340px] space-y-4">
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
