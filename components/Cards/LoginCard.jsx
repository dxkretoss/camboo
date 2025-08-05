import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginCard({ setIsLogin }) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        toast.success('Successfully Login!')

        setTimeout(() => {
            router.push('homePage')
        }, 2000)
    }

    return (
        <div className="flex justify-center items-center w-full px-4 py-8">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl">
                <h2 className="text-2xl text-[#000F5C] font-semibold mb-2 text-center">Login</h2>
                <p className="text-gray-500 text-sm mb-6 text-center">Login to access your Camboo Account</p>

                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@gmail.com"
                />

                <div className="relative">
                    <TextField
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-[15px] text-gray-500 cursor-pointer"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mt-4 mb-6">
                    <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Remember me
                    </label>
                    <a href="#" className="text-red-600 hover:underline">
                        Forgot Password
                    </a>
                </div>

                <Button className="w-full" onClick={() => { handleLogin(); }}>Login</Button>

                <p className="mt-4 text-sm text-black text-center">
                    Don’t have an account?{" "}
                    <button
                        onClick={() => setIsLogin(false)}
                        className="text-blue-600 hover:underline cursor-pointer"
                    >
                        Sign up
                    </button>
                </p>

                <div className="my-6 border-t relative">
                    <span className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 bg-white px-2 text-sm text-gray-400">
                        Or login with
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-4 w-full">
                    <button className="border border-gray-300 cursor-pointer rounded-md h-12 flex items-center justify-center hover:shadow-sm transition">
                        <img src="/facebook.png" alt="Facebook" className="w-5 h-5" />
                    </button>
                    <button className="border border-gray-300 cursor-pointer rounded-md h-12 flex items-center justify-center hover:shadow-sm transition">
                        <img src="/google.png" alt="Google" className="w-5 h-5" />
                    </button>
                    <button className="border border-gray-300 cursor-pointer rounded-md h-12 flex items-center justify-center hover:shadow-sm transition">
                        <img src="/apple.png" alt="Apple" className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <Toaster />
        </div >
    );
}
