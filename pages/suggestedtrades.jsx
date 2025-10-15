import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { useUser } from '@/context/UserContext';
import { ChevronLeft } from 'lucide-react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function SuggestedTrades() {
    const { suggestedTrades } = useUser();
    const [fetching, setfetching] = useState(false);
    const router = useRouter();

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
        <Layout>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#000F5C]">
                        All Suggested Trades
                    </h1>

                    <div className="flex items-center gap-1 text-gray-700">
                        <ChevronLeft className="w-5 h-5 cursor-pointer"
                            onClick={() => window.history.back()} />
                        <span
                            onClick={() => window.history.back()}
                            className="text-sm md:text-base font-medium hover:text-blue-600 cursor-pointer"
                        >
                            Back
                        </span>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-4">
                    {suggestedTrades && suggestedTrades.length > 0 ? (
                        <ul className="space-y-4">
                            {suggestedTrades.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border-b border-gray-200 last:border-b-0 p-2"
                                    onClick={() => { doingTrade(item?.id, item?.main_type) }}
                                >
                                    <img
                                        src={item?.image || item?.images[0]}
                                        alt={item?.title}
                                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-contain flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm sm:text-base font-semibold text-gray-900">
                                            {item?.title}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                            {(item?.subtitle || item?.description)?.length > 100
                                                ? (item?.subtitle || item?.description).substring(0, 100) + '...'
                                                : item?.subtitle || item?.description}
                                        </p>
                                    </div>

                                </li>
                            ))}
                        </ul>
                    ) : suggestedTrades === undefined ? (
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
                            <p className="text-sm sm:text-base">No suggested trades found</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
