import React, { useState } from 'react'
import Layout from '@/components/Layout/Layout'
import { ChevronLeft } from 'lucide-react';

export default function notification() {
    const [selectedTab, setSelectedTab] = useState('Notifications');

    return (
        <Layout>
            <div className="px-4 md:px-10 min-h-screen">
                <div className="flex items-center gap-1 text-gray-700">
                    <ChevronLeft className="w-5 h-5" />
                    <span
                        onClick={() => window.history.back()}
                        className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
                    >
                        Back
                    </span>
                </div>

                <div className="flex justify-center px-4 pt-5 min-h-[70vh]">
                    <div className="flex flex-col w-full max-w-xl bg-white rounded-md p-6 space-y-6">

                        <h2 className="text-lg md:text-xl font-semibold text-gray-800 self-start">
                            Notifications
                        </h2>

                        <div className="flex justify-center items-center border-b border-gray-200">
                            {['Notifications', 'New Potential Trades'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedTab(tab)}
                                    className={`py-2 px-4 -mb-px cursor-pointer border-b-2 transition ${selectedTab === tab
                                        ? 'border-blue-600 text-blue-600 font-medium'
                                        : 'border-transparent text-gray-500 hover:text-blue-600'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
