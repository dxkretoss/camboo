import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import { Eye, EyeOff, X } from "lucide-react";
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Index() {
  const router = useRouter();

  const [loginData, setloginData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setisLogin] = useState(false);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(loginData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!loginData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const now = new Date();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const handleLogin = async () => {
    if (!validateForm()) return;
    setisLogin(true);
    try {
      const login = await axios.post(`${process.env.NEXT_PUBLIC_API_CAMBOO}/login`, loginData);
      if (login?.data?.success) {
        toast.success('User logged in successfully.');
        Cookies.set("token", login?.data?.data?.token, { expires: endOfDay });
        setTimeout(() => router.push('/home'), 2000);
        setloginData({
          email: '', password: ''
        })
      } else {
        toast.error(login?.data?.message || 'Login failed.');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed.');
    } finally {
      setisLogin(false);
    }
  };

  const handleChange = (field, value) => {
    setloginData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleForgotSubmit = async () => {
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(forgotEmail)) {
      toast.error("Please enter a valid email.");
      return;
    }

    setIsOtpSending(true);
    try {
      const forgot = await axios.post(`${process.env.NEXT_PUBLIC_API_CAMBOO}/forget-Password`, { email: forgotEmail });
      if (forgot?.data?.success) {
        toast.success("OTP sent to your email.");
        setShowOtpField(true);
      } else {
        toast.error(forgot?.data?.message || "Failed to send OTP.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error sending OTP.");
    } finally {
      setIsOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }

    setIsOtpVerifying(true);
    try {
      const verifyOtp = await axios.post(`${process.env.NEXT_PUBLIC_API_CAMBOO}/email-verification`, {
        email: forgotEmail,
        otp: otp
      });

      if (verifyOtp?.data?.success) {
        toast.success("OTP verified");
        setTimeout(() => {
          router.push(`/forgotPassword?email=${forgotEmail}`);
        }, 2000);
      } else {
        toast.error(verifyOtp.data.message || "OTP verification failed.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "OTP verification error.");
    } finally {
      setIsOtpVerifying(false);
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
            <h2 className="text-2xl text-[#000F5C] font-semibold mb-2 text-center">Login</h2>
            <p className="text-gray-500 text-sm mb-6 text-center">Login to access your Camboo Account</p>

            <div>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={loginData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="john.doe@gmail.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="relative mt-4">
              <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[15px] text-gray-500 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mt-4 mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <button onClick={() => setForgotOpen(true)} className="text-red-600 cursor-pointer hover:underline">
                Forgot Password
              </button>
            </div>

            <Button className="w-full disabled:cursor-not-allowed" disabled={isLogin} onClick={() => { handleLogin() }}>
              {isLogin ? 'Processing...' : 'Login'}
            </Button>

            <p className="mt-4 text-sm text-black text-center">
              Don’t have an account?{" "}
              <button onClick={() => router.push('signup')} className="text-blue-600 hover:underline cursor-pointer">
                Sign up
              </button>
            </p>

            <div className="my-6 border-t relative">
              <span className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 bg-white px-2 text-sm text-gray-400">
                Or login with
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full">
              {['facebook', 'google', 'apple'].map((icon) => (
                <button key={icon} className="border border-gray-300 cursor-pointer rounded-md h-12 flex items-center justify-center hover:shadow-sm transition">
                  <img src={`/${icon}.png`} alt={icon} className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
          <Toaster />
        </div>
      </div>

      {forgotOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm relative">
            <button className="absolute cursor-pointer top-2 right-2 text-gray-400 hover:text-black" onClick={() => {
              setForgotOpen(false);
              setForgotEmail('');
              setOtp('');
              setShowOtpField(false);
            }}>
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-4">Forgot Password</h3>

            <TextField
              label="Email"
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="Enter your email"
            />

            {!showOtpField ? (
              <Button
                onClick={() => { handleForgotSubmit() }}
                className="w-full mt-4"
                disabled={isOtpSending}
              >
                {isOtpSending ? "Sending OTP..." : "Send OTP"}
              </Button>
            ) : (
              <>
                <TextField
                  label="OTP"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="mt-4"
                />
                <Button
                  onClick={() => { handleVerifyOtp() }}
                  className="w-full mt-4"
                  disabled={isOtpVerifying}
                >
                  {isOtpVerifying ? "Verifying..." : "Verify OTP"}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
