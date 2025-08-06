import { MessageCircle, PhoneCall, ThumbsDown, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export default function PostCard() {
    return (
        <div className="bg-white rounded-xl shadow p-4 mb-6">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                    <img
                        src="https://randomuser.me/api/portraits/men/1.jpg"
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900">Dan Jockes</h2>
                        <p className="text-xs text-gray-500">2 hrs ago</p>
                    </div>
                </div>
                <div>
                    <button className="text-gray-500 hover:text-gray-700 text-xl font-bold">⋯</button>
                </div>
            </div>

            <div className="mt-3">
                <h3 className="text-base font-semibold text-gray-800">Iphone 16 Pro max</h3>
                <p className="text-sm text-gray-600 mt-1">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard...
                </p>
            </div>

            <div className="flex gap-3 mt-3">
                <img
                    src="apple.png"
                    alt="product1"
                    className="w-1/2 h-40 object-cover rounded-md"
                />
                <img
                    src="apple.png"
                    alt="product2"
                    className="w-1/2 h-40 object-cover rounded-md"
                />
            </div>

            <div className="flex items-center gap-2 mt-3  rounded-full py-2">
                <img
                    src="https://randomuser.me/api/portraits/men/1.jpg"
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                />
                <input
                    type="text"
                    placeholder="comment here..."
                    className="flex-grow border-none focus:outline-none text-sm placeholder:text-gray-500"
                />
                <button className="text-white cursor-pointer bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full">
                    <ArrowRight size={18} />
                </button>
            </div>

            <hr className='text-gray-300' />

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

                    <button className="border border-[#003EFF] text-[#003EFF] bg-transparent  cursor-pointer text-sm px-4 py-2 rounded-md flex items-center gap-2 font-medium">
                        <span className="w-3 h-3 rounded-full bg-[#003EFF] block"></span> Dummy
                    </button>
                </div>
            </div>

        </div>
    );
}
