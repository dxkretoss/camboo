import React from 'react';
import { Search, Bell, MapPin, ChevronDown, Plus } from 'lucide-react';
import Button from '../ui/Button';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full h-16 bg-white z-50 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <img src="/logo_camboo.png" alt="Logo" className="h-8 w-auto" />
            </div>

            <div className="flex-1 mx-6 max-w-lg">
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
                    <Search className="w-5 h-5 text-[#00136e]" />
                    <input
                        type="text"
                        placeholder="Search here..."
                        className="bg-transparent outline-none px-3 w-full"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center text-gray-700 gap-1">
                    <MapPin className="w-5 h-5" />
                    <span>Recife, PE</span>
                    <ChevronDown className="w-4 h-4" />
                </div>

                <Button className="flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    <Plus className="w-4 h-4" />
                    Add Product
                </Button>

                <div className="relative bg-[#00136e] p-2 rounded-full">
                    <Bell className="w-5 h-5 text-white" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                </div>

                <div className="flex items-center gap-2">
                    <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="User"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-gray-700 text-sm">Billy Roys</span>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                </div>
            </div>
        </nav>
    );
}
