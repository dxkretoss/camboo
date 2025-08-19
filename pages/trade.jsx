import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";
import Layout from "@/components/Layout/Layout";
import { ChevronLeft, ChevronRight, XCircle } from "lucide-react";

export default function Trade() {
    const router = useRouter();
    const token = Cookies.get("token");
    const getTradeid = router?.query?.Trade;
    const [fetching, setFetching] = useState(false);
    const [matchData, setMatchData] = useState(null);
    const [imageIndexes, setImageIndexes] = useState({});

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
            setMatchData(letsCamboo?.data);
        } catch (err) {
            console.log(err);
        } finally {
            setFetching(false);
        }
    };

    const levels = matchData?.matches || {};
    const yourItemsData = matchData?.other_item || {};
    let highestLevel = 0;

    Object.entries(levels).forEach(([key, arr]) => {
        if (Array.isArray(arr) && arr.length > 0) {
            const levelNum = parseInt(key.split("_")[1]);
            if (levelNum > highestLevel) {
                highestLevel = levelNum;
            }
        }
    });

    const progress = highestLevel * 25;
    const highestLevelItems = levels[`level_${highestLevel}`] || [];

    const handlePrev = (itemId, total) => {
        setImageIndexes((prev) => ({
            ...prev,
            [itemId]:
                prev[itemId] === 0 || prev[itemId] === undefined
                    ? total - 1
                    : prev[itemId] - 1,
        }));
    };

    const handleNext = (itemId, total) => {
        setImageIndexes((prev) => ({
            ...prev,
            [itemId]:
                prev[itemId] === total - 1 || prev[itemId] === undefined
                    ? 0
                    : prev[itemId] + 1,
        }));
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


    return (
        <Layout>
            <div className="md:px-10">
                <div className="flex items-center gap-1 text-gray-700 mb-6">
                    <ChevronLeft className="w-5 h-5" />
                    <span
                        onClick={() => window.history.back()}
                        className="text-sm md:text-base font-medium hover:text-blue-600 cursor-pointer transition duration-200"
                    >
                        Back
                    </span>
                </div>

                {highestLevel > 0 ? (
                    <>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-extrabold text-gray-600">
                                Match Level:{" "}
                                <span className="font-semibold">{highestLevel} / 4</span>
                            </span>
                            <span className="text-sm font-extrabold text-gray-600">
                                {progress}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-6">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-blue-700 h-4 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                            <div>
                                <span className="text-sm font-extrabold text-gray-600">
                                    Match {yourItemsData?.main_type}:
                                </span>
                                <div className="rounded-2xl shadow-md p-4 flex flex-col items-center bg-white hover:shadow-lg transition mt-4">
                                    <div className="relative h-40 sm:h-48 md:h-56 rounded-md overflow-hidden w-full">
                                        <img
                                            src={yourItemsData?.images?.[imageIndexes["yourProduct"] || 0]}
                                            alt={yourItemsData?.title}
                                            loading="lazy"
                                            onLoad={(e) => e.currentTarget.classList.remove("opacity-0", "blur-md")}
                                            className="w-full h-full object-contain opacity-0 blur-md transition-all duration-500"
                                        />

                                        {yourItemsData?.images?.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        handlePrev("yourProduct", yourItemsData.images.length)
                                                    }
                                                    className="absolute  cursor-pointer left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow hover:bg-white"
                                                >
                                                    <ChevronLeft size={20} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleNext("yourProduct", yourItemsData.images.length)
                                                    }
                                                    className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow hover:bg-white"
                                                >
                                                    <ChevronRight size={20} />
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {yourItemsData?.images?.length > 1 && (
                                        <div className="flex gap-1 mt-2">
                                            {yourItemsData.images.map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-2 h-2 rounded-full ${i === (imageIndexes["yourProduct"] || 0)
                                                        ? "bg-blue-600"
                                                        : "bg-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <h3 className="text-gray-800 font-semibold text-base text-center mt-3">
                                        {yourItemsData?.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm text-center line-clamp-2 mt-1">
                                        <DescriptionToggle text={yourItemsData?.description} />
                                    </p>
                                    <span className="mt-3 text-blue-600 font-bold text-lg">
                                        ₹{yourItemsData?.price || "0.00"}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <span className="text-sm font-extrabold text-gray-600">
                                    Your {highestLevelItems?.map((item) => item?.main_type)}:
                                </span>
                                {highestLevelItems?.map((item, idx) => {
                                    const currentIndex = imageIndexes[item.id] || 0;
                                    return (
                                        <div
                                            key={idx}
                                            className="relative rounded-2xl shadow-md p-4 flex flex-col items-center bg-white hover:shadow-lg transition mt-4"
                                        >
                                            <div className="relative h-40 sm:h-48 md:h-56 w-full rounded-md overflow-hidden">
                                                <img
                                                    src={
                                                        item?.images?.[currentIndex] || "/placeholder.png"
                                                    }
                                                    alt={item?.title || "Matched item"}
                                                    loading="lazy"
                                                    onLoad={(e) => e.currentTarget.classList.remove("opacity-0", "blur-md")}
                                                    className="w-full h-full object-contain opacity-0 blur-md transition-all duration-500"
                                                />

                                                {item.images?.length > 1 && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handlePrev(item.id, item.images.length)
                                                            }
                                                            className="absolute  cursor-pointer left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow hover:bg-white"
                                                        >
                                                            <ChevronLeft size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleNext(item.id, item.images.length)
                                                            }
                                                            className="absolute  cursor-pointer right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow hover:bg-white"
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
                                            <p className="text-gray-500 text-sm text-center line-clamp-2 mt-1">
                                                <DescriptionToggle text={item?.description} />
                                            </p>
                                            <span className="mt-3 text-blue-600 font-bold text-lg">
                                                ₹{item?.price || "0.00"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center min-h-[50vh]">
                        <XCircle className="w-16 h-16 text-red-500 mb-4" />
                        <p className="text-gray-600 text-lg font-medium">
                            No match with items
                        </p>
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
