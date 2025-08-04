import React from 'react';
import Layout from '@/components/Layout/Layout';
import { ChevronLeft, Pencil, MapPin, Star } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/router';

export default function Profile() {
    const router = useRouter();
    return (
        <Layout>
            <div className="px-4 py-4 md:px-10 md:pt-6 min-h-screen">
                <div className="flex items-center gap-1 text-gray-700">
                    <ChevronLeft className="w-5 h-5" />
                    <span
                        onClick={() => window.history.back()}
                        className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
                    >
                        Back
                    </span>
                </div>

                <div className="mt-6 rounded-xl p-4 md:p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <img
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                alt="User"
                                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
                            />
                            <div>
                                <h2 className="text-lg md:text-xl font-semibold text-gray-800">Billy Roys</h2>
                                <div className="flex items-center gap-1 text-sm mt-1">
                                    <div className="flex text-yellow-500">
                                        {[...Array(5)].map((_, index) => (
                                            <Star key={index} className="h-4 w-4 fill-yellow-500 stroke-yellow-500" />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-gray-700 font-medium">5.0</span>
                                    <span className="ml-1 text-gray-500">(248 Reviews)</span>
                                </div>

                                <div className="flex gap-1 text-sm text-gray-500 mt-1 items-center">
                                    <MapPin />
                                    <span>Recife, PE</span>
                                </div>
                            </div>
                        </div>

                        <Button className="flex items-center gap-2 px-4 py-2" onClick={() => router.push('editProfile')}>
                            <Pencil className="w-4 h-4" />
                            Edit Profile
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
