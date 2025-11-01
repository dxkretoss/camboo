import React, { useEffect, useRef, useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { ChevronLeft, Pencil } from 'lucide-react';
import Button from '@/components/ui/Button';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from '@/context/UserContext';
import { useTranslation } from 'react-i18next';
import '../utils/i18n'

export default function EditProfile() {
    const { t } = useTranslation();
    const token = Cookies.get('token');
    const router = useRouter();
    const { profile, getUserProfileData } = useUser();
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isEditing, setisEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const allPlatforms = ['Facebook', 'X', 'Linkedin', 'Instagram', 'Tiktok'];
    const [socialLinks, setSocialLinks] = useState([]);
    const [getProfileData, setgetProfileData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        street: '',
        city: '',
        post_code: '',
        about_me: '',
        what_are_you_interested_in: '',
        professional_experience: '',
        profile_image: '',
    });

    const [inputValue, setInputValue] = useState("");
    const [interests, setInterests] = useState([]);

    const [userCountry, setUserCountry] = useState('in');

    useEffect(() => {
        try {
            // Detect country from browser locale
            const locale = Intl.DateTimeFormat().resolvedOptions().locale;
            const countryCode = locale.split('-')[1]?.toLowerCase();
            if (countryCode) {
                setUserCountry(countryCode);
            }
        } catch (error) {
            console.error('Failed to detect browser country:', error);
        }
    }, []);

    useEffect(() => {
        if (profile?.what_are_you_interested_in) {
            setInterests(profile.what_are_you_interested_in.split(","));
        }
    }, [profile]);

    const handleInterestKeyDown = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            e.preventDefault();
            if (!interests.includes(inputValue.trim())) {
                const updated = [...interests, inputValue.trim()];
                setInterests(updated);
                setgetProfileData({
                    ...getProfileData,
                    what_are_you_interested_in: updated.join(","),
                });
            }
            setInputValue("");
        }
    };

    const removeInterest = (item) => {
        const updated = interests.filter((i) => i !== item);
        setInterests(updated);
        setgetProfileData({
            ...getProfileData,
            what_are_you_interested_in: updated.join(","),
        });
    };
    useEffect(() => {
        if (!token) router.push('/');
        document.title = "Camboo-EditProfile"
    }, [token, router]);

    useEffect(() => {
        if (profile) {
            setgetProfileData({
                first_name: profile?.first_name || '',
                last_name: profile?.last_name || '',
                email: profile?.email || '',
                phone_number: profile?.phone_number || '',
                street: profile?.street || '',
                city: profile?.city || '',
                post_code: profile?.post_code || '',
                about_me: profile?.about_me || '',
                what_are_you_interested_in: profile?.what_are_you_interested_in || '',
                professional_experience: profile?.professional_experience || '',
                profile_image: profile?.profile_image || '',
            });
            setSocialLinks(profile?.social_links || []);
        }
    }, [profile]);

    const validateField = (field, value) => {
        let error = '';
        switch (field) {
            case 'first_name':
                if (!value.trim()) error = t('FirstNameReq');
                break;
            case 'last_name':
                if (!value.trim()) error = t('LastNameReq');
                break;
            case 'email':
                if (!value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = t('ValidEmailReq');
                }
                break;
            case 'phone_number':
                if (!value.trim()) {
                    error = t('PhoneReq');
                } else if (!/^\+\d{1,3} \d{7,14}$/.test(value)) {
                    error = t('ValidPhone');
                }
                break;
            case 'street':
                if (!value.trim()) error = t('StreetReq');
                break;
            case 'city':
                if (!value.trim()) error = t('CityReq');
                break;
            case 'post_code':
                if (!value.trim()) error = t('PostCodeReq');
                break;
            case 'about_me':
                if (!value.trim()) error = t('AboutReq');
                break;
            case 'what_are_you_interested_in':
                if (!value.trim()) error = t('InterestReq');
                break;
            // case 'professional_experience': 
            //      if (!value.trim()) error = 'Professional Experience is required'; 
            //      break;
            default:
                break;
        }
        setErrors((prev) => ({ ...prev, [field]: error }));
    };


    const validateForm = () => {
        const newErrors = {};
        const fields = [
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'street',
            'city',
            'post_code',
            'about_me',
            'what_are_you_interested_in',
            'professional_experience',
        ];
        fields.forEach((field) => validateField(field, getProfileData[field]));
        socialLinks.forEach((link, index) => {
            if (!link.link.trim()) {
                newErrors[`social_${index}`] = 'URL is required';
            } else if (!/^https?:\/\//i.test(link.link)) {
                newErrors[`social_${index}`] = 'URL must start with http:// or https://';
            }
        });
        setErrors((prev) => ({ ...prev, ...newErrors }));
        return Object.keys(newErrors).length === 0 && fields.every((field) => !errors[field]);
    };

    const handleIconClick = () => fileInputRef.current.click();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const imageURL = URL.createObjectURL(file);
            setgetProfileData({ ...getProfileData, profile_image: imageURL });
        }
    };

    const addSocialLink = () => {
        const availablePlatforms = allPlatforms.filter(
            (p) => !socialLinks.some((link) => link.platform === p)
        );
        if (availablePlatforms.length === 0) return;
        setSocialLinks([...socialLinks, { platform: availablePlatforms[0], link: '' }]);
    };

    const handlePlatformChange = (index, value) => {
        const updated = [...socialLinks];
        updated[index].platform = value;
        setSocialLinks(updated);
    };

    const handleUrlChange = (index, value) => {
        const updated = [...socialLinks];
        updated[index].link = value;
        setSocialLinks(updated);
    };

    const removeSocialLink = (index) => {
        const updated = [...socialLinks];
        updated.splice(index, 1);
        setSocialLinks(updated);
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[`social_${index}`];
            return newErrors;
        });
    };

    const updateUserProfileData = async () => {
        if (!validateForm()) return;
        setisEditing(true);
        try {
            const formData = new FormData();

            Object.entries(getProfileData).forEach(([key, value]) => {
                if (key !== "profile_image") {
                    formData.append(key, value);
                }
            });

            formData.append("social_links", JSON.stringify(socialLinks));

            if (selectedFile) {
                formData.append("profile_image", selectedFile);
            }

            const updateData = await axios.post(
                `${process.env.NEXT_PUBLIC_API_CAMBOO}/edit-profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (updateData?.data?.success) {
                toast.success(`${t('profileupdate')}!`);
                await getUserProfileData();
                router.push('/profile')
            } else {
                toast.error(`${t('Smtwntwrng')}!`);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setisEditing(false);
        }
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;
    return (
        <Layout>
            <div className="md:px-10">
                <div className="flex items-center gap-1 text-gray-700">
                    <ChevronLeft className="w-5 h-5 cursor-pointer"
                        onClick={() => window.history.back()} />
                    <span
                        onClick={() => window.history.back()}
                        className="text-sm md:text-base font-medium hover:text-blue-600 cursor-pointer"
                    >
                        {t('Bck')}
                    </span>
                </div>
                {(isEditing) &&
                    <div className="fixed inset-0 flex justify-center items-center bg-black/10 backdrop-blur-sm z-50 transition-opacity duration-300">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-[#000F5C] rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-[#000F5C] rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                            <div className="w-3 h-3 bg-[#000F5C] rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                        </div>
                    </div>
                }

                <div className="flex justify-center px-4 pt-5 min-h-[70vh]">
                    <div className="flex flex-col w-full max-w-xl bg-white rounded-md p-6 space-y-6">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800 self-start"> {t('EditPrfl')}</h2>

                        <div className="relative self-center mb-4">
                            <img
                                src={getProfileData?.profile_image}
                                alt="User"
                                loading="lazy"
                                decoding="async"
                                onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
                                className="w-24 h-24 rounded-full object-contain opacity-0 transition-opacity duration-500"
                            />
                            <div
                                className="absolute bottom-0 right-0 bg-[#000F5C] text-white p-2 rounded-full cursor-pointer"
                                onClick={handleIconClick}
                            >
                                <Pencil className="w-4 h-4" />
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>

                        <div className="space-y-4 w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium">{t('Fname')} *</label>
                                    <input
                                        type="text"
                                        value={getProfileData.first_name}
                                        onChange={(e) => setgetProfileData({ ...getProfileData, first_name: e.target.value })}
                                        onBlur={(e) => validateField('first_name', e.target.value)}
                                        className="w-full border rounded-lg px-4 py-2"
                                    />
                                    {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium">{t('Lname')} *</label>
                                    <input
                                        type="text"
                                        value={getProfileData.last_name}
                                        onChange={(e) => setgetProfileData({ ...getProfileData, last_name: e.target.value })}
                                        onBlur={(e) => validateField('last_name', e.target.value)}
                                        className="w-full border rounded-lg px-4 py-2"
                                    />
                                    {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium">{t('eml')} *</label>
                                    <input
                                        type="email"
                                        value={getProfileData.email}
                                        disabled
                                        className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium">{t('Phone')} *</label>
                                    <PhoneInput
                                        key={getProfileData?.phone_number}
                                        country={userCountry}
                                        value={getProfileData?.phone_number}
                                        onChange={(value, country) => {
                                            const dialCode = country.dialCode;
                                            const rawNumber = value.slice(dialCode.length);
                                            const formatted = `+${dialCode} ${rawNumber}`;
                                            setgetProfileData({ ...getProfileData, phone_number: formatted });
                                            validateField('phone_number', formatted);
                                        }}
                                        inputStyle={{ width: '100%', height: '40px' }}
                                    />
                                    {errors.phone_number && <p className="text-red-500 text-xs">{errors.phone_number}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium">{t('Street')} *</label>
                                    <input
                                        type="text"
                                        value={getProfileData.street}
                                        onChange={(e) => setgetProfileData({ ...getProfileData, street: e.target.value })}
                                        onBlur={(e) => validateField('street', e.target.value)}
                                        className="w-full border rounded-lg px-4 py-2"
                                    />
                                    {errors.street && <p className="text-red-500 text-xs">{errors.street}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium">{t('City')} *</label>
                                    <input
                                        type="text"
                                        value={getProfileData.city}
                                        onChange={(e) => setgetProfileData({ ...getProfileData, city: e.target.value })}
                                        onBlur={(e) => validateField('city', e.target.value)}
                                        className="w-full border rounded-lg px-4 py-2"
                                    />
                                    {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium">{t('Pcode')} *</label>
                                    <input
                                        type="text"
                                        value={getProfileData.post_code}
                                        onChange={(e) => setgetProfileData({ ...getProfileData, post_code: e.target.value })}
                                        onBlur={(e) => validateField('post_code', e.target.value)}
                                        className="w-full border rounded-lg px-4 py-2"
                                    />
                                    {errors.post_code && <p className="text-red-500 text-xs">{errors.post_code}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">{t('sclink')}</label>
                                {socialLinks.map((link, index) => {
                                    const selected = socialLinks.map((l) => l.platform);
                                    const available = allPlatforms.filter((p) => !selected.includes(p) || p === link.platform);

                                    return (
                                        <div key={index} className="flex flex-col gap-1 w-full">
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={link.platform}
                                                    onChange={(e) => handlePlatformChange(index, e.target.value)}
                                                    className="border rounded-lg px-2 py-2 w-1/3"
                                                >
                                                    {available.map((p) => (
                                                        <option key={p} value={p}>
                                                            {p.charAt(0).toUpperCase() + p.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>

                                                <input
                                                    type="url"
                                                    value={link.link}
                                                    onChange={(e) => handleUrlChange(index, e.target.value)}
                                                    onBlur={(e) => {
                                                        const val = e.target.value;
                                                        if (!val.trim()) {
                                                            setErrors((prev) => ({
                                                                ...prev,
                                                                [`social_${index}`]: `${t('urlReq')}`,
                                                            }));
                                                        } else if (!/^https?:\/\//i.test(val)) {
                                                            setErrors((prev) => ({
                                                                ...prev,
                                                                [`social_${index}`]: `${t('urlnvlid')}`,
                                                            }));
                                                        } else {
                                                            setErrors((prev) => {
                                                                const newErrors = { ...prev };
                                                                delete newErrors[`social_${index}`];
                                                                return newErrors;
                                                            });
                                                        }
                                                    }}
                                                    className="border rounded-lg px-4 py-2 w-2/3"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => removeSocialLink(index)}
                                                    className="text-red-600 cursor-pointer text-sm"
                                                >
                                                    <span className="hidden sm:inline">{t('rmv')}</span>
                                                    <span className="sm:hidden">✕</span>
                                                </button>
                                            </div>

                                            {errors[`social_${index}`] && (
                                                <p className="text-red-500 text-xs ml-[calc(33.333%+0.5rem)]">
                                                    {errors[`social_${index}`]}
                                                </p>
                                            )}
                                        </div>

                                    );
                                })}
                                {socialLinks.length < allPlatforms.length && (
                                    <button type="button" onClick={addSocialLink} className="text-blue-600 cursor-pointer text-sm">+ {t('addsclink')}</button>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium">{t('abtme')} *</label>
                                <textarea
                                    rows="3"
                                    value={getProfileData.about_me}
                                    onChange={(e) => setgetProfileData({ ...getProfileData, about_me: e.target.value })}
                                    onBlur={(e) => validateField('about_me', e.target.value)}
                                    className="w-full border rounded-lg px-4 py-2"
                                />
                                {errors.about_me && <p className="text-red-500 text-xs">{errors.about_me}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium">{t('whtinter')} *</label>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onBlur={() =>
                                            validateField("what_are_you_interested_in", getProfileData?.what_are_you_interested_in)
                                        }
                                        className="flex-1 border rounded-lg px-4 py-2"
                                        placeholder={`${t("typeint")}...`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (inputValue.trim() !== "") {
                                                handleInterestKeyDown({ key: "Enter", preventDefault: () => { } });
                                            }
                                        }}
                                        className="px-4 py-2 bg-[#000F5C] text-white rounded-lg sm:w-auto w-full"
                                    >
                                        {t('Add')}
                                    </button>
                                </div>

                                {errors?.what_are_you_interested_in && (
                                    <p className="text-red-500 text-xs">{errors.what_are_you_interested_in}</p>
                                )}

                                <div className="flex flex-wrap gap-2 mt-2">
                                    {interests.map((item, idx) => (
                                        <span
                                            key={idx}
                                            className="flex items-center gap-1 text-[#06145D] bg-[#06145D1A] px-3 py-1 rounded-md text-sm"
                                        >
                                            {item}
                                            <button
                                                type="button"
                                                onClick={() => removeInterest(item)}
                                                className="ml-1 text-red-500 hover:text-red-700"
                                            >
                                                ✕
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>


                            <div className="space-y-1">
                                <label className="block text-sm font-medium">{t('prfoexp')}</label>
                                <textarea
                                    rows="3"
                                    value={getProfileData.professional_experience}
                                    onChange={(e) => setgetProfileData({ ...getProfileData, professional_experience: e.target.value })}
                                    // onBlur={(e) => validateField('professional_experience', e.target.value)}
                                    className="w-full border rounded-lg px-4 py-2"
                                />
                                {/* {errors.professional_experience && <p className="text-red-500 text-xs">{errors.professional_experience}</p>} */}
                            </div>

                            <div className="pt-2">
                                <Button className={`w-full md:w-auto ${isEditing ? "cursor-not-allowed opacity-70" : ""}`}
                                    disabled={isEditing} onClick={() => { updateUserProfileData(); }}>
                                    {isEditing ? t("Updating") : t("SaveChanges")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </Layout>
    );
}
