import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";
import Layout from "@/components/Layout/Layout";
import { ChevronLeft, ChevronRight, MessageCircle, Search } from "lucide-react";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
export default function Trade() {
    const router = useRouter();
    const token = Cookies.get("token");
    const getTradeid = router?.query?.Trade;
    const getTradeType = router?.query?.Type;
    const [fetching, setFetching] = useState(false);
    const [youritemsData, setYouritemsData] = useState(null);
    const [imageIndexes, setImageIndexes] = useState({});
    const { profile } = useUser();
    const [loadedImages, setLoadedImages] = useState({});

    useEffect(() => {
        if (!token) {
            router.push("/");
        }
        if (getTradeid) {
            doingTrade(getTradeid);
        }
    }, [getTradeid]);

    const doingTrade = async (id) => {
        setFetching(true);
        try {
            const token = Cookies.get("token");
            const letsCamboo = await axios.get(
                `${process.env.NEXT_PUBLIC_API_CAMBOO}/lets-trade?item_id=${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setYouritemsData(letsCamboo?.data);
        } catch (err) {
            console.log(err);
        } finally {
            setFetching(false);
        }
    };

    const levels = youritemsData?.matches || {};
    const matchedData = youritemsData?.other_item || {};

    const availableLevels = Object.entries(levels)
        .filter(([_, arr]) => Array.isArray(arr) && arr.length > 0)
        .map(([key, arr]) => {
            const levelNum = parseInt(key.split("_")[1]);
            const progress = levelNum * 25;
            return {
                levelKey: key,
                levelNum,
                progress,
                items: arr,
            };
        });

    const preloadImage = (src) => {
        if (!src) return;
        const img = new Image();
        img.src = src;
    };

    const handlePrev = (itemId, total, images) => {
        setImageIndexes((prev) => {
            const current = prev[itemId] ?? 0;
            const newIndex = current === 0 ? total - 1 : current - 1;

            preloadImage(images[newIndex === 0 ? total - 1 : newIndex - 1]);

            return { ...prev, [itemId]: newIndex };
        });
    };

    const handleNext = (itemId, total, images) => {
        setImageIndexes((prev) => {
            const current = prev[itemId] ?? 0;
            const newIndex = current === total - 1 ? 0 : current + 1;

            preloadImage(images[(newIndex + 1) % total]);

            return { ...prev, [itemId]: newIndex };
        });
    };


    return (
        <Layout>
            <div className="md:px-10">
                <div className="flex items-center gap-1 text-gray-700 mb-6">
                    <ChevronLeft className="w-5 h-5 cursor-pointer "
                        onClick={() => window.history.back()} />
                    <span
                        onClick={() => window.history.back()}
                        className="text-sm md:text-base font-medium hover:text-blue-600 cursor-pointer transition duration-200"
                    >
                        Back
                    </span>
                </div>

                {availableLevels?.length > 0 ? (
                    availableLevels?.map((level, index) => (
                        <div key={level.levelKey} className="mb-10">
                            <h3 className="text-[#000F5C] font-semibold text-base mb-3">
                                Match Item {index + 1}
                            </h3>
                            <div className="flex items-center justify-between w-full mb-6">
                                {(getTradeType === "Product" ? [1, 2, 3, 4] : [1, 2]).map((step, idx, arr) => (
                                    <React.Fragment key={step}>
                                        <div className="relative flex flex-col items-center">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-extrabold
                                                            ${(getTradeType === "Product" ? step <= level.levelNum : step <= level.levelNum)
                                                        ? "bg-[#000F5C] text-white"
                                                        : "bg-gray-200 text-gray-500"
                                                    }`}
                                            >
                                                {getTradeType === "Product" ? step * 25 + "%" : step === 1 ? "50%" : "100%"}
                                            </div>
                                        </div>

                                        {idx !== arr.length - 1 && (
                                            <div
                                                className={`flex-1 h-1 mx-2 rounded ${(getTradeType === "Product" ? step < level.levelNum : step < level.levelNum)
                                                    ? "bg-[#000F5C]"
                                                    : "bg-gray-300"
                                                    }`}
                                            ></div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                                <div>
                                    <span className="text-sm font-extrabold text-gray-600">
                                        Match {matchedData?.main_type}:
                                    </span>
                                    <div className="rounded-2xl shadow-md p-4 flex flex-col items-center bg-white hover:shadow-lg transition mt-4">
                                        <div className="flex items-center space-x-3 w-full mb-2">
                                            <img
                                                src={matchedData?.profile_image}
                                                alt="User"
                                                className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                                            />
                                            <h2 className="text-sm font-semibold text-gray-900">
                                                {`${matchedData?.first_name} ${matchedData?.last_name}` || ""}
                                            </h2>
                                        </div>
                                        <hr className="w-full border-gray-200 mb-3" />
                                        <div className="relative h-40 sm:h-48 md:h-56 rounded-md overflow-hidden w-full">
                                            {!loadedImages[matchedData.id] && (
                                                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                                            )}
                                            <Image
                                                src={matchedData?.images?.[imageIndexes[matchedData.id] || 0]}
                                                alt={matchedData?.title}
                                                fill
                                                priority={(imageIndexes[matchedData.id] || 0) === 0}
                                                className={`object-contain transition-opacity duration-500 ${loadedImages[matchedData.id] ? "opacity-100" : "opacity-0"}`}
                                                onLoadingComplete={() =>
                                                    setLoadedImages((prev) => ({ ...prev, [matchedData.id]: true }))
                                                }
                                            />
                                            {matchedData?.images?.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handlePrev(matchedData?.id, matchedData?.images?.length, matchedData)
                                                        }
                                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow hover:bg-white"
                                                    >
                                                        <ChevronLeft size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleNext(matchedData?.id, matchedData?.images?.length, matchedData)
                                                        }
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow hover:bg-white"
                                                    >
                                                        <ChevronRight size={20} />
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                        {matchedData?.images?.length > 1 && (
                                            <div className="flex gap-1 mt-2">
                                                {matchedData?.images.map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-2 h-2 rounded-full ${i === (imageIndexes[matchedData?.id] || 0)
                                                            ? "bg-blue-600"
                                                            : "bg-gray-300"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        <h3 className="text-gray-800 font-semibold text-base text-center mt-3">
                                            {matchedData?.title}
                                        </h3>
                                        <span className="text-sm font-medium text-gray-500">
                                            ₹
                                            {(matchedData?.price ||
                                                matchedData?.day_price ||
                                                matchedData?.hr_price) || "0.00"}
                                        </span>
                                        <span className="text-gray-500 text-sm text-left line-clamp-2">
                                            <DescriptionToggle text={matchedData?.description} />
                                        </span>

                                        <button
                                            onClick={() => router.push(`/chat/${matchedData?.user_id}`)}
                                            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#000F5C] text-white rounded-lg hover:bg-[#00136e] transition-all shadow-md"
                                        >
                                            <MessageCircle size={18} />
                                            <span className="text-sm font-extrabold">Chat with {matchedData?.first_name}</span>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-sm font-extrabold text-gray-600">
                                        Your {level.items?.length > 1 ? `Products (${level.items.length})` : "Product"} :
                                    </span>

                                    {level?.items?.map((item, idx) => {
                                        const currentIndex = imageIndexes[item.id] || 0;
                                        return (
                                            <div
                                                key={idx}
                                                className="relative rounded-2xl shadow-md p-4 flex flex-col items-center bg-white hover:shadow-lg transition mt-4"
                                            >
                                                <div className="flex items-center space-x-3 w-full mb-2">
                                                    <img
                                                        src={profile?.profile_image}
                                                        alt="User"
                                                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                                                    />
                                                    <h2 className="text-sm font-semibold text-gray-900">
                                                        {`${profile?.first_name} ${profile?.last_name}` || ""}
                                                    </h2>
                                                </div>
                                                <hr className="w-full border-gray-200 mb-3" />
                                                <div className="relative h-40 sm:h-48 md:h-56 w-full rounded-md overflow-hidden">
                                                    {!loadedImages[item?.images?.[currentIndex]] && (
                                                        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                                                    )}
                                                    <Image
                                                        src={item?.images?.[currentIndex]}
                                                        alt={item?.title}
                                                        fill
                                                        priority={currentIndex === 0}
                                                        className={`object-contain transition-opacity duration-500 ${loadedImages[item?.images?.[currentIndex]] ? "opacity-100" : "opacity-0"}`}
                                                        onLoadingComplete={() =>
                                                            setLoadedImages((prev) => ({ ...prev, [item?.images?.[currentIndex]]: true }))
                                                        }
                                                    />
                                                    {item.images?.length > 1 && (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    handlePrev(item.id, item.images.length, item)
                                                                }
                                                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow hover:bg-white"
                                                            >
                                                                <ChevronLeft size={20} />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleNext(item.id, item.images.length, item)
                                                                }
                                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow hover:bg-white"
                                                            >
                                                                <ChevronRight size={20} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>

                                                {item.images?.length > 1 && (
                                                    <div className="flex gap-1 mt-2">
                                                        {item.images.map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className={`w-2 h-2 rounded-full ${i === currentIndex
                                                                    ? "bg-blue-600"
                                                                    : "bg-gray-300"
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                )}

                                                <h3 className="text-gray-800 font-semibold text-base text-center mt-3">
                                                    {item?.title}
                                                </h3>

                                                <span className="text-sm font-medium text-gray-500">
                                                    ₹
                                                    {(item?.price ||
                                                        item?.day_price ||
                                                        item?.hr_price) || "0.00"}
                                                </span>
                                                <p className="text-gray-500 text-sm text-left line-clamp-2">
                                                    <DescriptionToggle text={item?.description} />
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            {index !== availableLevels.length - 1 && (
                                <hr className="mt-6 border-gray-300" />
                            )}
                        </div>
                    ))
                ) : (

                    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 sm:px-6 py-6 text-center">
                        <div className="relative">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-200 flex items-center justify-center shadow-md">
                                <Search className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-[#000F5C]" />
                            </div>
                        </div>

                        <h2 className="mt-6 text-lg sm:text-xl md:text-2xl font-extrabold text-[#000F5C]">
                            No Ad Match!!
                        </h2>

                        <p className="mt-2 text-gray-500 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-sm md:max-w-md">
                            We couldn’t find anything that matches your Ad.
                        </p>

                        <button
                            onClick={() => router.push("./home")}
                            className="mt-4 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 bg-[#000F5C] hover:bg-[#00136e] text-white text-sm sm:text-base font-medium rounded-lg shadow transition-all"
                        >
                            Browse All Ads
                        </button>
                    </div>

                )}
            </div>

            {fetching && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/10 backdrop-blur-sm z-50 transition-opacity duration-300">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-[#000F5C] rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-[#000F5C] rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                        <div className="w-3 h-3 bg-[#000F5C] rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

function DescriptionToggle({ text }) {
    const [expanded, setExpanded] = useState(false);

    if (!text) return null;

    return (
        <div>
            <p
                className="text-sm text-gray-600 mt-1"
                style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: expanded ? "none" : 2,
                    overflow: "hidden",
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
                    {expanded ? "See less" : "See more"}
                </button>
            )}
        </div>
    );
}
