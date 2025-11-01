import React, { useState, useEffect } from 'react'
import TextField from '@/components/ui/TextField'
import { Eye, EyeOff, } from "lucide-react";
import Button from '@/components/ui/Button';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '../utils/i18n'
export default function forgotPassword() {
    const { t, i18n } = useTranslation();

    const router = useRouter();
    const getMail = router.query.email;
    const [forgotData, setforgotData] = useState({
        email: '',
        new_password: '',
        confirmPassword: '',
    })

    useEffect(() => {
        document.title = "Camboo-Forgot-Password"

        if (router?.query?.email) {
            setforgotData(prev => ({
                ...prev,
                email: router?.query?.email
            }));
        }
    }, [router?.query?.email]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isForgotting, setisForgotting] = useState(false)
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(forgotData.new_password))
            newErrors.new_password = t('PasswordInvalid');

        if (forgotData.new_password !== forgotData.confirmPassword)
            newErrors.confirmPassword = t('ConfirmPasswordMismatch');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleForgotPass = async () => {
        if (!validateForm()) return;
        setisForgotting(true);
        try {
            const forgotPassword = await axios.post(`${process.env.NEXT_PUBLIC_API_CAMBOO}/create-new_password`, forgotData);

            if (forgotPassword?.data?.success) {
                toast.success(`${t('Passchngsuccess')}`);
                router.push('/');
            } else {
                toast.error(`${t('Smtwntwrng')}!`);
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
                toast.error(`${t('Smtwntwrng')}!`);
            }

        } finally {
            setisForgotting(false);
        }
    };

    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const languages = [
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'br', label: 'Português', flag: '🇧🇷' },
    ];

    const currentLang = languages.find((lang) => lang.code === i18n.language) || languages[0];

    const handleLanguageChange = (langCode) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className="flex md:flex-row h-screen bg-gray-100">
            <div className="hidden md:block md:w-1/2">
                <img src="/loginbg.png" alt="Login Visual" className="w-full h-full object-cover" />
            </div>

            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 50 }}>
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    style={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '16px',
                    }}
                >
                    <span>{currentLang.flag}</span> {currentLang.label}
                    <span style={{ marginLeft: '6px' }}>{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '4px',
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            boxShadow: '0px 2px 6px rgba(0,0,0,0.1)',
                            zIndex: 10,
                            minWidth: '160px',
                        }}
                    >
                        {languages.map((lang) => (
                            <div
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                style={{
                                    padding: '10px 14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    cursor: 'pointer',
                                    backgroundColor: i18n.language === lang.code ? '#f5f5f5' : 'transparent',
                                    fontWeight: i18n.language === lang.code ? '600' : 'normal',
                                }}
                            >
                                <span>{lang.flag}</span> {lang.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-full flex flex-col justify-center items-center md:w-1/2 overflow-y-auto">
                <img src="/logo1.jpeg" alt="Logo" className="mx-auto mt-6 w-36 h-auto" />
                <div className="flex justify-center items-center w-full px-4 py-8">
                    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl">
                        <h2 className="text-2xl text-[#000F5C] font-semibold mb-2 text-center"> {t('ForPass')}</h2>
                        <div>
                            <TextField
                                label={t('Email')}
                                type="email"
                                value={getMail}
                                readOnly
                                placeholder="john.doe@gmail.com"
                            />
                        </div>

                        <div className="relative mt-3">
                            <TextField
                                label={t('Password')}
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
                                label={t('CPassword')}
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
                            {isForgotting ? `${t('Processing')}` : `${t('ForPass')}`}
                        </Button>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    )
}
