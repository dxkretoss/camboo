import React from 'react'
import Layout from '@/components/Layout/Layout'
import { ChevronLeft } from 'lucide-react';

export default function profile() {
    return (
        <Layout>
            <div className="flex items-center gap-1 px-4 py-3 md:px-10 md:pt-6 text-gray-700">
                <ChevronLeft className="w-5 h-5" />
                <span
                    onClick={() => console.log("Back clicked")}
                    className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
                >
                    Back
                </span>
            </div>

        </Layout>
    )
}
