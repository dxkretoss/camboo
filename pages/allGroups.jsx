import React from 'react'
import Layout from '@/components/Layout/Layout'
import { ChevronLeft } from 'lucide-react'
export default function allGroups() {
    return (
        <Layout>
            <div className="md:px-10">
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
                <div className='flex justify-center'>
                    <img src='/notfound.svg' className='w-100 h-100' />
                </div>
            </div>
        </Layout>
    )
}
