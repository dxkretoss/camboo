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

export default function EditProfile() {
    const token = Cookies.get('token');
    const router = useRouter();
    const { profile, getUserProfileData } = useUser();
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isEditing, setisEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const allPlatforms = ['facebook', 'twitter', 'linkedin', 'github', 'instagram', 'website'];
    const [socialLinks, setSocialLinks] = useState([]);

    const [getProfileData, setgetProfileData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        about_me: '',
        what_are_you_interested_in: '',
        professional_experience: '',
        profile_image: '',
    });

    useEffect(() => {
        if (!token) router.push('/');
    }, [token, router]);

    useEffect(() => {
        if (profile) {
            setgetProfileData({
                first_name: profile?.first_name || '',
                last_name: profile?.last_name || '',
                email: profile?.email || '',
                phone_number: profile?.phone_number || '',
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
                if (!value.trim()) error = 'First name is required';
                break;
            case 'last_name':
                if (!value.trim()) error = 'Last name is required';
                break;
            case 'email':
                if (!value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = 'Valid email is required';
                }
                break;
            case 'phone_number':
                if (!value.trim()) {
                    error = 'Phone number is required';
                } else if (!/^\+\d{1,3} \d{7,14}$/.test(value)) {
                    error = 'Enter valid phone number';
                }
                break;
            case 'about_me':
                if (!value.trim()) error = 'About Me is required';
                break;
            case 'what_are_you_interested_in':
                if (!value.trim()) error = 'This field is required';
                break;
            case 'professional_experience':
                if (!value.trim()) error = 'Professional Experience is required';
                break;
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
                toast.success("User profile updated successfully.");
                await getUserProfileData();
            } else {
                toast.error("Something went wrong.");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong.");
        } finally {
            setisEditing(false);
        }
    };

    return (
        <Layout>
            <div className="px-4 md:px-10 min-h-screen">
                <div className="flex items-center gap-1 text-gray-700">
                    <ChevronLeft className="w-5 h-5" />
                    <span
                        onClick={() => window.history.back()}
                        className="text-sm md:text-base font-medium hover:text-blue-600 cursor-pointer"
                    >
                        Back
                    </span>
                </div>

                <div className="flex justify-center px-4 pt-5 min-h-[70vh]">
                    <div className="flex flex-col w-full max-w-xl bg-white rounded-md p-6 space-y-6">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800 self-start">Edit Profile</h2>

                        <div className="relative self-center mb-4">
                            <img
                                src={getProfileData?.profile_image}
                                alt="User"
                                className="w-24 h-24 rounded-full object-cover"
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
                                    <label className="block text-sm font-medium">First Name</label>
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
                                    <label className="block text-sm font-medium">Last Name</label>
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
                                    <label className="block text-sm font-medium">Email</label>
                                    <input
                                        type="email"
                                        value={getProfileData.email}
                                        disabled
                                        className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium">Phone Number</label>
                                    <PhoneInput
                                        country={'in'}
                                        value={getProfileData.phone_number}
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

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Social Links</label>
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
                                                                [`social_${index}`]: 'URL is required',
                                                            }));
                                                        } else if (!/^https?:\/\//i.test(val)) {
                                                            setErrors((prev) => ({
                                                                ...prev,
                                                                [`social_${index}`]: 'URL must start with http:// or https://',
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
                                                    Remove
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
                                    <button type="button" onClick={addSocialLink} className="text-blue-600 cursor-pointer text-sm">+ Add Social Link</button>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium">About Me</label>
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
                                <label className="block text-sm font-medium">What are you interested in?</label>
                                <input
                                    type="text"
                                    value={getProfileData.what_are_you_interested_in}
                                    onChange={(e) => setgetProfileData({ ...getProfileData, what_are_you_interested_in: e.target.value })}
                                    onBlur={(e) => validateField('what_are_you_interested_in', e.target.value)}
                                    className="w-full border rounded-lg px-4 py-2"
                                />
                                {errors.what_are_you_interested_in && <p className="text-red-500 text-xs">{errors.what_are_you_interested_in}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium">Professional Experience</label>
                                <textarea
                                    rows="3"
                                    value={getProfileData.professional_experience}
                                    onChange={(e) => setgetProfileData({ ...getProfileData, professional_experience: e.target.value })}
                                    onBlur={(e) => validateField('professional_experience', e.target.value)}
                                    className="w-full border rounded-lg px-4 py-2"
                                />
                                {errors.professional_experience && <p className="text-red-500 text-xs">{errors.professional_experience}</p>}
                            </div>

                            <div className="pt-2">
                                <Button className={`w-full md:w-auto ${isEditing ? "cursor-not-allowed opacity-70" : ""}`}
                                    disabled={isEditing} onClick={() => { updateUserProfileData(); }}>
                                    {isEditing ? "Updating" : 'Save Changes'}
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
