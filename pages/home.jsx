import React from 'react'
import Sidebar from '@/components/Sidebar/Sidebar'
import Navbar from '@/components/Navbar/Navbar'
import SectionCard from '@/components/Cards/SectionCard'
import PostCard from '@/components/Cards/PostCard'

export default function HomePage() {
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
                        <PostCard />
                        <PostCard />
                        <PostCard />
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
