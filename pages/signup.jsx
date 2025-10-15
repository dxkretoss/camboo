import React, { useState, useEffect } from 'react';
import TextField from '@/components/ui/TextField';
import Button from '@/components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/router';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import toast, { Toaster } from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '@/context/UserContext';
import Cookies from 'js-cookie';

export default function signup() {
    const router = useRouter();

    useEffect(() => {
        document.title = "Camboo-Signup"
    }, []);

    const [userData, setuserData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        confirmPassword: '',
    });
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSignup, setisSignup] = useState(false)

    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const { getUserProfileData, getallProdandSer, getClientsProdandSer, getsuggestedTrades } = useUser();

    const validateForm = () => {
        const newErrors = {};

        if (userData.first_name.length < 3 || userData.first_name.length > 20)
            newErrors.first_name = "First name must be between 3 and 20 characters";

        if (userData.last_name.length < 3 || userData.last_name.length > 20)
            newErrors.last_name = "Last name must be between 3 and 20 characters";

        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userData.email))
            newErrors.email = "Enter a valid email";

        if (!/^\+\d{1,3} \d{7,14}$/.test(userData.phone_number))
            newErrors.phone_number = "Enter a valid phone number";

        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(userData.password))
            newErrors.password = "Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 symbol";

        if (userData.password !== userData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";

        if (!agreeTerms)
            newErrors.terms = "You must agree to terms";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async () => {
        if (!validateForm()) return;
        setisSignup(true);
        try {
            const signup = await axios.post(`${process.env.NEXT_PUBLIC_API_CAMBOO}/register`, userData);

            if (signup?.data?.success) {
                toast.success("User registered successfully.");
                router.push('/');
                setuserData({
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone_number: '',
                    password: '',
                    confirmPassword: '',
                })
            } else {
                toast.error("Registration failed.");
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
            }

        } finally {
            setisSignup(false);
        }
    };

    const getDeviceType = () => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return 2;
        if (/android/i.test(userAgent)) return 1;
        return 1;
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setisSignup(true);
        try {
            let email;
            let first_name;
            let last_name;
            let deviceToken;

            if (credentialResponse.credential) {
                const decoded = jwtDecode(credentialResponse.credential);
                email = decoded.email;
                first_name = decoded.given_name;
                last_name = decoded.family_name;
                deviceToken = credentialResponse.credential;
            } else if (credentialResponse.access_token) {
                const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: {
                        Authorization: `Bearer ${credentialResponse.access_token}`,
                    },
                });
                const profile = await res.json();
                email = profile.email;
                first_name = profile.given_name;
                last_name = profile.family_name;
                deviceToken = credentialResponse.access_token;
            } else {
                toast.error("No Google credential or token returned!");
                return;
            }

            const payload = {
                device_token: deviceToken,
                device_type: getDeviceType(),
                email: email,
                first_name: first_name,
                last_name: last_name,
                provider_type: 2
            };

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_CAMBOO}/social-login`, payload);

            if (res?.data?.success) {
                toast.success("User registered successfully.");
                Cookies.set("token", res?.data?.data?.token, { expires: endOfDay });
                await getallProdandSer();
                await getUserProfileData();
                await getClientsProdandSer();
                await getsuggestedTrades();
                router.push('/');
            } else {
                toast.error("Google login failed");
            }

        } catch (err) {
            console.error(err);
        } finally {
            setisSignup(false);
        }
    };

    const loginGoogle = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => toast.error("Google login failed!")
    });

    return (
        <div className="flex xl:flex-row min-h-screen bg-gray-100">
            <div className="hidden xl:block xl:w-1/2">
                <img
                    src="/loginbg.png"
                    alt="Login Visual"
                    className="w-full h-full object-cover"
                    onContextMenu={(event) => {
                        event.preventDefault();
                    }}
                />
            </div>
            {isSignup && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/10 backdrop-blur-sm z-50 transition-opacity duration-300">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-[#000F5C] rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-[#000F5C] rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                        <div className="w-3 h-3 bg-[#000F5C] rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                    </div>
                </div>
            )}
            <div className="w-full xl:w-1/2 flex flex-col items-center overflow-y-auto py-6">
                <img
                    src="/logo1.jpeg"
                    alt="Logo"
                    className="mx-auto mt-6 w-36 h-auto"
                    onContextMenu={(event) => {
                        event.preventDefault();
                    }}
                />
                <div className="flex justify-center items-center w-full px-4 py-8">
                    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 md:p-8 w-full max-w-xl">
                        <h2 className="text-xl sm:text-2xl text-[#000F5C] font-semibold mb-1 sm:mb-2 text-center">
                            Register
                        </h2>
                        <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6 text-center">
                            Let’s get you all set up so you can access your account
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <TextField
                                    label="First Name"
                                    value={userData.first_name}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setuserData({ ...userData, first_name: value });
                                        if (value.length >= 3 && value.length <= 20) {
                                            setErrors(prev => ({ ...prev, first_name: '' }));
                                        }
                                    }}
                                    placeholder="John"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleSignup();
                                        }
                                    }}
                                />
                                {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name}</p>}
                            </div>

                            <div>
                                <TextField
                                    label="Last Name"
                                    value={userData.last_name}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setuserData({ ...userData, last_name: value });
                                        if (value.length >= 3 && value.length <= 20) {
                                            setErrors(prev => ({ ...prev, last_name: '' }));
                                        }
                                    }}
                                    placeholder="Doe"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleSignup();
                                        }
                                    }}
                                />
                                {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                            <div>
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={userData.email}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setuserData({ ...userData, email: value });
                                        if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
                                            setErrors(prev => ({ ...prev, email: '' }));
                                        }
                                    }}
                                    placeholder="john.doe@gmail.com"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleSignup();
                                        }
                                    }}
                                />
                                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                            </div>

                            <div>
                                <PhoneInput
                                    country={'in'}
                                    value={userData.phone_number}
                                    onChange={(value, country) => {
                                        const dialCode = country.dialCode;
                                        const rawNumber = value.slice(dialCode.length);
                                        const formatted = `+${dialCode} ${rawNumber}`;
                                        setuserData({ ...userData, phone_number: formatted });
                                        if (/^\+\d{1,3} \d{7,14}$/.test(formatted)) {
                                            setErrors(prev => ({ ...prev, phone_number: '' }));
                                        }
                                    }}
                                    inputStyle={{
                                        width: '100%',
                                        height: '45px',
                                        fontSize: '14px',
                                    }}
                                    containerStyle={{ width: '100%' }}
                                />
                                {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
                            </div>
                        </div>

                        <div className="relative mt-4 md:mt-2">
                            <TextField
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={userData.password}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setuserData({ ...userData, password: value });
                                    if (/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value)) {
                                        setErrors(prev => ({ ...prev, password: '' }));
                                    }
                                }}
                                placeholder="••••••••"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSignup();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[15px] text-gray-500"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div className="relative mt-4">
                            <TextField
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={userData.confirmPassword}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setuserData({ ...userData, confirmPassword: value });
                                    if (value === userData.password) {
                                        setErrors(prev => ({ ...prev, confirmPassword: '' }));
                                    }
                                }}
                                placeholder="••••••••"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSignup();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-[15px] text-gray-500"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                        </div>

                        <div className="flex items-start mt-5 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={() => {
                                    setAgreeTerms(!agreeTerms);
                                    if (!agreeTerms) setErrors(prev => ({ ...prev, terms: '' }));
                                }}
                                className="mt-1 mr-2"
                            />
                            <span>
                                I agree to all the{' '}
                                <a href="#" className="text-blue-600 hover:underline">Terms</a> and{' '}
                                <a href="#" className="text-blue-600 hover:underline">Privacy Policies</a>
                            </span>
                        </div>
                        {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}

                        <Button className="w-full mt-6 disabled:cursor-not-allowed" disabled={isSignup} onClick={() => { handleSignup() }}>
                            {isSignup ? 'Processing...' : 'Sign up'}
                        </Button>


                        <p className="mt-4 text-sm text-black text-center">
                            Already have an account?{' '}
                            <button onClick={() => router.push('/')} className="text-blue-600 cursor-pointer hover:underline">Login</button>
                        </p>

                        <div className="my-6 border-t relative">
                            <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white px-2 text-sm text-gray-400">
                                Or Sign up with
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 w-full">
                            <button className="border border-gray-300 cursor-pointer  rounded-md h-12 flex items-center justify-center hover:shadow-sm transition">
                                <img src={`/facebook.png`} alt={"facebook"} className="w-5 h-5" />
                            </button>
                            <button className="border border-gray-300 cursor-pointer rounded-md h-12 flex items-center justify-center hover:shadow-sm transition"
                                onClick={() => {
                                    setErrors({})
                                    loginGoogle()
                                }}>
                                <img src={`/google.png`} alt={"google"} className="w-5 h-5" />
                            </button>
                            <button className="border border-gray-300 cursor-pointer  rounded-md h-12 flex items-center justify-center hover:shadow-sm transition">
                                <img src={`/apple.png`} alt={"apple"} className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    )
}
