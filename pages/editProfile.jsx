import React, { useRef, useState } from 'react'
import Layout from '@/components/Layout/Layout'
import { ChevronLeft, Pencil } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function editProfile() {
    const fileInputRef = useRef(null);
    const [imageSrc, setImageSrc] = useState('https://randomuser.me/api/portraits/men/32.jpg');

    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setImageSrc(imageURL);
        }
    };
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
                            Edit Profile
                        </h2>

                        <div className="relative self-center mb-4">
                            <img
                                src={imageSrc}
                                alt="User"
                                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover"
                            />
                            <div className="absolute bottom-0 right-0 bg-[#000F5C] text-white p-2 rounded-full cursor-pointer"
                                onClick={handleIconClick}>
                                <Pencil className="w-4 h-4" />
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>

                        <div className="space-y-4 w-full">
                            <div className="space-y-1">
                                <label className="block text-sm md:text-base font-medium text-gray-700">Your Name</label>
                                <input
                                    type="text"
                                    placeholder="Carlos Muvoka"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm md:text-base font-medium text-gray-700">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="carlosmuvoka@gmail.com"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm md:text-base font-medium text-gray-700">Telephone</label>
                                    <input
                                        type="tel"
                                        placeholder="+101 6465 572 800"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm md:text-base font-medium text-gray-700">Profile Type</label>
                                <div className="flex flex-wrap gap-4">
                                    <label className="flex items-center space-x-2">
                                        <input type="radio" name="profileType" defaultChecked className="accent-blue-600" />
                                        <span className="text-sm text-gray-700">Personal profile</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="radio" name="profileType" className="accent-blue-600" />
                                        <span className="text-sm text-gray-700">Company profile</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm md:text-base font-medium text-gray-700">About Me</label>
                                <textarea
                                    rows="3"
                                    placeholder="Describe your self here..."
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm md:text-base font-medium text-gray-700">What are you interested in?</label>
                                <div className="flex flex-wrap gap-4">
                                    <label className="flex items-center space-x-2">
                                        <input type="radio" name="interested" defaultChecked className="accent-blue-600" />
                                        <span className="text-sm text-gray-700">Computer</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="radio" name="interested" className="accent-blue-600" />
                                        <span className="text-sm text-gray-700">Household Appliance</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm md:text-base font-medium text-gray-700">Household Appliance</label>
                                <input
                                    type="text"
                                    placeholder="ex. Juicer"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm md:text-base font-medium text-gray-700">Professional Experience</label>
                                <textarea
                                    rows="3"
                                    placeholder="Describe your experiences here..."
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring"
                                />
                            </div>

                            <div className="pt-2">
                                <Button className="w-full md:w-auto">
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
