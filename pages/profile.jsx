import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import {
    ChevronLeft,
    Pencil,
    MapPin,
    Star,
    BriefcaseBusiness,
    Linkedin,
    Twitter,
    Facebook
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/router';

export default function Profile() {
    const router = useRouter();

    const professionalExperience = [
        {
            title: 'Sr. Marketing Manager',
            duration: 'Mar 2022 – Current',
        },
        {
            title: 'Marketing Manager',
            duration: 'Feb 2018 – Feb 2022',
        },
        {
            title: 'Jr. Marketing Manager',
            duration: 'April 2014 – Feb 2016',
        },
    ];

    const socialLinks = [
        {
            name: 'LinkedIn',
            icon: Linkedin,
            url: 'https://linkedin.com',
        },
        {
            name: 'Twitter',
            icon: Twitter,
            url: 'https://twitter.com',
        },
        {
            name: 'Facebook',
            icon: Facebook,
            url: 'https://facebook.com',
        },
    ];


    const user_interests = [
        'IPhone 16', 'Audi A600', 'Vivo A1', 'Yamaha 1900',
        'Mercedez Benz', 'IPhone 15 Pro', 'Samsung A36', 'AC',
        'Mitsubishi AC', 'OPPO M1'
    ];

    const tabs = ['My Ads', 'My History of Trades', 'Saved Items'];
    const [activeTab, setActiveTab] = useState('My Ads');

    return (
        <Layout>
            <div className="px-4 md:px-10 min-h-screen">
                <div className="flex items-center gap-1 text-gray-700 mb-4">
                    <ChevronLeft className="w-5 h-5" />
                    <span
                        onClick={() => window.history.back()}
                        className="text-sm md:text-base font-medium hover:text-blue-600 cursor-pointer transition duration-200"
                    >
                        Back
                    </span>
                </div>

                <div className="p-4 md:p-6 w-full mx-aut">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <img
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                alt="User"
                                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
                            />
                            <div>
                                <h2 className="text-lg md:text-xl font-semibold text-gray-800">Billy Roys</h2>
                                <div className="flex items-center gap-1 text-sm mt-1 flex-wrap">
                                    <div className="flex text-yellow-500">
                                        {[...Array(5)].map((_, index) => (
                                            <Star key={index} className="h-4 w-4 fill-yellow-500 stroke-yellow-500" />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-gray-700 font-medium">5.0</span>
                                    <span className="ml-1 text-gray-500">(248 Reviews)</span>
                                </div>
                                <div className="flex gap-1 text-sm text-gray-500 mt-1 items-center">
                                    <MapPin className="w-4 h-4" />
                                    <span>Recife, PE</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2"
                            onClick={() => router.push('/editProfile')}
                        >
                            <Pencil className="w-4 h-4" />
                            Edit Profile
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 mt-6">
                    <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-sm p-6 space-y-6">
                        <div>
                            <h3 className="text-md font-semibold text-[#13121F] mb-1">About Me</h3>
                            <p className="text-sm text-gray-600">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                            </p>
                        </div>
                        <hr />

                        <div>
                            <h3 className="text-md font-semibold text-[#13121F] mb-2">Professional Experience</h3>
                            <ul className="space-y-4 text-sm">
                                {professionalExperience.map((exp, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <div className="bg-blue-100 p-2 rounded-full">
                                            <BriefcaseBusiness className="w-4 h-4 text-[#000F5C]" />
                                        </div>
                                        <div>
                                            <span className="font-semibold text-[#13121F]">{exp.title}</span><br />
                                            <span className="text-[#464E5F]">{exp.duration}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <hr />

                        <div>
                            <h3 className="text-md font-semibold text-[#13121F] mb-2">Social Links</h3>
                            <div className="flex gap-3">
                                {socialLinks.map(({ name, icon: Icon, url }, index) => (
                                    <a
                                        key={index}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-[#000F5C] text-white rounded-full hover:bg-blue-200 transition"
                                        aria-label={name}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <hr />

                        <div>
                            <h3 className="text-md font-semibold text-[#13121F] mb-2">Interests</h3>
                            <div className="flex flex-wrap gap-2">
                                {user_interests.map((interest, index) => (
                                    <span key={index} className="px-3 py-1 text-xs font-semibold bg-[#06145D1A] text-[#000F5C] rounded-md">
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-3/4">
                        <div className="bg-white shadow-sm rounded-xl p-4">
                            <div className="flex flex-wrap gap-4 border-b mb-4">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`py-2 px-4 -mb-px border-b-2 cursor-pointer transition font-medium ${activeTab === tab
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-blue-600'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="text-sm text-gray-600">
                                {/* {activeTab === 'My Ads' && <p>📦 My Ads content here (grid of cards)...</p>}
                                {activeTab === 'My History of Trades' && <p>📜 Trade history content...</p>}
                                {activeTab === 'Saved Items' && <p>💾 Saved items content...</p>} */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
