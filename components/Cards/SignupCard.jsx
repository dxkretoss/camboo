import React, { useState } from 'react';
import TextField from '../ui/TextField';
import Button from '../ui/Button';
import { Eye, EyeOff } from 'lucide-react';

export default function SignupCard({ setIsLogin }) {
    const [userData, setuserData] = useState({
        firstName: '',
        lastaName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm_Password, setshowConfirm_Password] = useState(false);

    return (
        <div className="flex flex-col justify-center items-center w-full px-4 py-8">
            <img
                src="/logo_camboo.png"
                alt="Logo"
                className="mx-auto mb-6 w-32 h-auto"
            />
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl">
                <h2 className="text-2xl text-[#000F5C] font-semibold mb-2 text-center">Register</h2>
                <p className="text-gray-500 text-sm mb-6 text-center">Let's get you all set up so you can access your account</p>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    <TextField
                        label="First Name"
                        name="fname"
                        type="text"
                        value={userData?.firstName}
                        onChange={(e) => setuserData({ ...userData, firstName: e.target.value })}
                        placeholder="John"
                    />
                    <TextField
                        label="Last Name"
                        name="lname"
                        type="text"
                        value={userData?.lastaName}
                        onChange={(e) => setuserData({ ...userData, lastaName: e.target.value })}
                        placeholder="Doe"
                    />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={userData?.email}
                        onChange={(e) => setuserData({ ...userData, email: e.target.value })}
                        placeholder="john.doe@gmail.com"
                    />
                    <TextField
                        label="Phone Number"
                        name="phone"
                        type="number"
                        value={userData?.phone}
                        onChange={(e) => setuserData({ ...userData, phone: e.target.value })}
                        placeholder="1234567890"
                    />
                </div>

                <div className="relative">
                    <TextField
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={userData?.password}
                        onChange={(e) => setuserData({ ...userData, password: e.target.value })}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-[15px] text-gray-500 cursor-pointer"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <div className="relative">
                    <TextField
                        label="Confirm Password"
                        name="confirmpassword"
                        type={showConfirm_Password ? 'text' : 'password'}
                        value={userData?.confirmPassword}
                        onChange={(e) => setuserData({ ...userData, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setshowConfirm_Password(!showConfirm_Password)}
                        className="absolute right-3 top-[15px] text-gray-500 cursor-pointer"
                    >
                        {showConfirm_Password ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <div className="flex items-center text-sm text-gray-600 mt-4 mb-6">
                    <input type="checkbox" className="mr-2" />
                    <span>I agree to all the
                        <a href='#' className="text-blue-600 hover:underline cursor-pointer">
                            Terms
                        </a>
                        {" "}and{" "}
                        <a href='#' className="text-blue-600 hover:underline cursor-pointer">
                            Privacy Policies
                        </a>
                    </span>
                </div>

                <Button className="w-full">Sign up</Button>

                <p className="mt-4 text-sm text-black text-center">
                    Already have an account?{" "}
                    <button onClick={() => setIsLogin(true)} className="text-blue-600 hover:underline cursor-pointer">
                        Login
                    </button>
                </p>

                <div className="my-6 border-t relative">
                    <span className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 bg-white px-2 text-sm text-gray-400">
                        Or Sign up with
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
        </div>
    );
}
