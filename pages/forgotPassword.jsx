import React, { useState, useEffect } from 'react'
import TextField from '@/components/ui/TextField'
import { Eye, EyeOff, } from "lucide-react";
import Button from '@/components/ui/Button';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

export default function forgotPassword() {
    const router = useRouter();
    const getMail = router.query.email;
    const [forgotData, setforgotData] = useState({
        email: '',
        new_password: '',
        confirmPassword: '',
    })

    useEffect(() => {
        if (router.query.email) {
            setforgotData(prev => ({
                ...prev,
                email: router.query.email
            }));
        }
    }, [router.query.email]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isForgotting, setisForgotting] = useState(false)

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(forgotData.new_password))
            newErrors.new_password = "Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 symbol";

        if (forgotData.new_password !== forgotData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleForgotPass = async () => {
        if (!validateForm()) return;
        setisForgotting(true);

        console.log(forgotData)
        try {
            const forgotPassword = await axios.post(`${process.env.NEXT_PUBLIC_API_CAMBOO}/create-new_password`, forgotData);

            if (forgotPassword?.data?.success) {
                toast.success("Password Change successfully.");
                setTimeout(() => router.push('/'), 2000);
            } else {
                toast.error("Something went wrong.");
            }
        } catch (error) {
            console.log(error);

            if (error.response?.status === 422 && error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const messages = [];

                for (const field in errors) {
                    if (Array.isArray(errors[field])) {
                        messages.push(...errors[field]);
                    }
                }

                messages.forEach(msg => toast.error(msg));
            } else {
                toast.error("Something went wrong.");
            }

        } finally {
            setisForgotting(false);
        }
    };


    return (
        <div className="flex md:flex-row h-screen bg-gray-100">
            <div className="hidden md:block md:w-1/2">
                <img src="/loginbg.png" alt="Login Visual" className="w-full h-full object-cover" />
            </div>

            <div className="w-full flex flex-col justify-center items-center md:w-1/2 overflow-y-auto">
                <img src="/logo_camboo.png" alt="Logo" className="mx-auto mt-6 w-32 h-auto" />
                <div className="flex justify-center items-center w-full px-4 py-8">
                    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl">
                        <h2 className="text-2xl text-[#000F5C] font-semibold mb-2 text-center">Forget Password</h2>

                        {/* Email */}
                        <div>
                            <TextField
                                label="Email"
                                type="email"
                                value={getMail}
                                readOnly
                                placeholder="john.doe@gmail.com"
                            />
                        </div>

                        <div className="relative mt-3">
                            <TextField
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={forgotData.new_password}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setforgotData({ ...forgotData, new_password: value });
                                    if (/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value)) {
                                        setErrors(prev => ({ ...prev, new_password: '' }));
                                    }
                                }}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[15px] text-gray-500"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            {errors.new_password && <p className="text-red-500 text-xs mt-1">{errors.new_password}</p>}
                        </div>

                        <div className="relative mt-3">
                            <TextField
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={forgotData.confirmPassword}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setforgotData({ ...forgotData, confirmPassword: value });
                                    if (value === forgotData.password) {
                                        setErrors(prev => ({ ...prev, confirmPassword: '' }));
                                    }
                                }}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-[15px] text-gray-500"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 mb-4">{errors.confirmPassword}</p>}
                        </div>

                        <Button className="w-full disabled:cursor-not-allowed" disabled={isForgotting} onClick={() => {
                            handleForgotPass();
                        }}>
                            {isForgotting ? 'Processing...' : 'Forgot Password'}
                        </Button>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    )
}
