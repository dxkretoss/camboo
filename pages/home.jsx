import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Navbar from '@/components/Navbar/Navbar';
import SectionCard from '@/components/Cards/SectionCard';
import { PhoneCall, ThumbsDown, Inbox, ChevronLeft, ChevronRight, SendHorizonal, EllipsisVertical } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useUser } from '@/context/UserContext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function HomePage() {
    const router = useRouter();
    const token = Cookies.get('token');

    useEffect(() => {
        if (!token) {
            router.push('/');
        }
    }, [token]);

    const { allProductandService, profile } = useUser();

    const [startIndexes, setStartIndexes] = useState({});

    const imagesPerPage = 2;

    const handlePrev = (id, totalImages) => {
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
    };

    const handleNext = (id, totalImages) => {
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
    };

    const suggestedTrades = [
        { title: 'Iphone 16 Pro max', subtitle: 'lorem ipsum dummy content', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { title: 'Hardly Davidson New Model', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { title: 'Vivo A1', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { title: 'Iphone 15 Pro max', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { title: 'Dell Z51902 Laptop', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
    ];

    const historyOfTrades = [
        { title: 'HP Z109 Laptop Refurbished', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { title: 'Hero Honda Czcuk Luck', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { title: 'Iphone 16 Pro Max', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { title: 'Iphone 11 Pro', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { title: 'Mercedes C-Class 1200', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
    ];

    const marketings = [
        { title: 'HP Z109 Laptop Refurbished', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { title: 'Hero Honda Czcuk Luck', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { title: 'Iphone 16 Pro Max', subtitle: 'lorem ipsum dummy', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
            <div className="hidden lg:block w-[250px]">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col">
                <Navbar />

                <div className="flex flex-col lg:flex-row p-4 gap-6">
                    <div className="flex-1 space-y-6">
                        {allProductandService?.length > 0 ? (
                            allProductandService.map((user, idx) => {
                                const startIndex = startIndexes[user.id] || 0;

                                return (
                                    <div key={idx} className="bg-white rounded-xl shadow p-4 mb-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={user?.profile_image}
                                                    alt="User"
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                                                />
                                                <div>
                                                    <h2 className="text-sm font-semibold text-gray-900">
                                                        {`${user?.first_name} ${user?.last_name}`}
                                                    </h2>
                                                    <p className="text-xs text-gray-500">{user?.created}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <EllipsisVertical className='cursor-pointer' />
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <h3 className="text-base font-semibold text-gray-800">{user?.title}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{user?.description}</p>
                                        </div>

                                        {user?.images?.length > 0 && (
                                            <div className="mt-3 relative">
                                                <div className="flex gap-3 flex-wrap">
                                                    {user.images
                                                        .slice(startIndex, startIndex + imagesPerPage)
                                                        .map((img, imgIdx) => (
                                                            <div
                                                                key={`${user.id}-img-${imgIdx}`}
                                                                className="w-[48%] h-40 rounded-md flex items-center justify-center"
                                                            >
                                                                <img
                                                                    src={img}
                                                                    alt={`product-${user.id}-${imgIdx}`}
                                                                    className="w-full h-full object-contain rounded-md"
                                                                />
                                                            </div>
                                                        ))}
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
                                                className="flex-grow border-none focus:outline-none text-sm placeholder:text-gray-500"
                                            />
                                            <button className="text-white cursor-pointer bg-[#000F5C] hover:bg-blue-700 p-2 rounded-full">
                                                <SendHorizonal size={18} />
                                            </button>
                                        </div>

                                        <hr className="text-gray-300" />

                                        <div className="flex justify-between flex-wrap items-center mt-4 gap-2">
                                            <div>
                                                <Button className="text-sm px-4 py-2 rounded-md flex items-center gap-2 font-medium">
                                                    <img src="/share.png" alt="Verified" className="w-4 h-4" />
                                                    Let’s Trade
                                                </Button>
                                            </div>

                                            <div className="flex gap-2 flex-wrap justify-end">
                                                <button className="border border-[#C7F846] text-[#7FA600] bg-transparent cursor-pointer text-sm px-4 py-2 rounded-md flex items-center gap-2 font-medium">
                                                    <PhoneCall size={16} /> Get in Touch
                                                </button>

                                                <button className="border border-[#FF5C5C] text-[#FF5C5C] bg-transparent cursor-pointer text-sm px-4 py-2 rounded-md flex items-center gap-2 font-medium">
                                                    <ThumbsDown size={16} /> Denounce Ad
                                                </button>

                                                <button className="border border-[#003EFF] text-[#003EFF] bg-transparent cursor-pointer text-sm px-4 py-2 rounded-md flex items-center gap-2 font-medium">
                                                    <span className="w-3 h-3 rounded-full bg-[#003EFF] block"></span> Dummy
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
        </div>
    );
}
