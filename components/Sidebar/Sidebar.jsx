import React from 'react'
import {
    MapPin,
    UserRoundPlus,
    Star
} from 'lucide-react';

export default function Sidebar() {
    const interests = [
        "iPhone 15", "Audi A500", "Vivo All", "Yamaha 1800", "Mercedes Benz",
        "iPhone 15 Pro", "Samsung A14", "AC", "Huawei AC", "OPPO M1",
    ];

    const groups = [
        { name: "Old New iPhones Sell", members: 481, image: "https://randomuser.me/api/portraits/men/1.jpg" },
        { name: "Car Bike Zone", members: 58, image: "https://randomuser.me/api/portraits/men/2.jpg" },
        { name: "Mobiles For Sell", members: 104, image: "https://randomuser.me/api/portraits/men/3.jpg" },
        { name: "Tech Product", members: 12, image: "https://randomuser.me/api/portraits/men/4.jpg" },
        { name: "Wholesale Zone", members: 0, image: "https://randomuser.me/api/portraits/men/5.jpg" },
    ];
    return (
        <div className="bg-white p-4 space-y-6 w-full">
            <button className="w-full bg-[#4370C2] text-white py-2 rounded-md font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2">
                <UserRoundPlus className="w-4 h-4" />
                Send Invite
            </button>


            <div className="flex items-center gap-4">
                <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="User"
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
                />

                <div>
                    <h2 className="text-md md:text-md font-semibold text-gray-800">Billy Roys</h2>
                    <div className="flex items-center gap-1 text-sm mt-1 flex-wrap">
                        <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, index) => (
                                <Star key={index} className="h-4 w-4 fill-yellow-500 stroke-yellow-500" />
                            ))}
                        </div>
                        <span className="ml-2 text-gray-700 font-medium">5.0</span>
                    </div>
                    <p className="text-green-600 text-xs flex items-center gap-1">
                        <img src="/verified.png" alt="Verified" className="w-4 h-4" />
                        <span className='text-[#464E5F] font-poppins'> Verified Profile </span>
                    </p>
                </div>
            </div>
            <hr />

            <div>
                <h3 className="text-md font-semibold text-[#13121F] mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                    {interests.map((interest, index) => (
                        <span key={index} className="px-3 py-1 text-xs font-semibold bg-[#06145D1A] text-[#000F5C] rounded-md">
                            {interest}
                        </span>
                    ))}
                </div>
            </div>
            <hr />

            <div>
                <h3 className="font-semibold text-sm mb-2">Groups</h3>
                <ul className="space-y-3">
                    {groups.map((group, i) => (
                        <li key={i} className="flex items-center gap-3 pb-3 border-b border-gray-200"
                        >
                            <img
                                src={group.image}
                                alt={group.name}
                                className="w-16 h-16 md:w-15 md:h-15 rounded-full object-cover"
                            />
                            <div>
                                <p className="text-sm font-medium">{group.name}</p>
                                <p className="text-xs text-gray-500">{group.members} Members</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
