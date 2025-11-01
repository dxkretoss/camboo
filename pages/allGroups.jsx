import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import { ChevronLeft, Search, X, Upload } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import '../utils/i18n';

export default function AllGroups() {
    const token = Cookies.get("token");
    const router = useRouter();

    const [gettingallGroups, setgettingallGroups] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            router.push('/');
        }
        document.title = "Camboo-GroupList"
        getallGroups();
    }, []);

    const [openDialog, setOpenDialog] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupImage, setGroupImage] = useState(null);
    const [groupImagePreview, setGroupImagePreview] = useState(null);
    const [isCreating, setisCreating] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setGroupImage(file);
            setGroupImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCreateGroup = async () => {
        setisCreating(true);
        try {
            const formData = new FormData();
            formData.append("group_name", groupName);
            if (groupImage) {
                formData.append("group_profile", groupImage);
            }
            const create = await axios.post(`${process.env.NEXT_PUBLIC_API_CAMBOO}/add-group`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    "Content-Type": "multipart/form-data",
                })
            if (create?.data?.success) {
                toast.success(`${t('grpcrtsuccess')}!`);
                setGroupName("");
                setGroupImage(null);
                setGroupImagePreview(null);
                setOpenDialog(false);

                getallGroups();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setisCreating(false);
        }
    };

    const getallGroups = async () => {
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_CAMBOO}/get-group`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (res?.data?.success) {
                setgettingallGroups(res?.data?.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Filter groups by search input
    const filteredGroups = gettingallGroups?.filter((group) =>
        group.group_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <Layout>
            <div className="px-4 sm:px-6 md:px-10 py-6 max-w-6xl mx-auto">
                {/* Back button */}
                <div className="flex items-center gap-2 text-gray-700 mb-5">
                    <ChevronLeft
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => window.history.back()}
                    />
                    <span
                        onClick={() => window.history.back()}
                        className="text-sm md:text-base font-medium hover:text-blue-600 cursor-pointer"
                    >
                        {t('Bck')}
                    </span>
                </div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#000F5C]">
                        {t('AllGrps')}
                    </h2>

                    {/* Top right section: search + create button */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                        {/* Search bar */}
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder={`${t("SrchGrps")}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000F5C]"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                        </div>

                        {/* Create button */}
                        <button
                            onClick={() => setOpenDialog(true)}
                            className="text-sm bg-[#000F5C] text-white px-4 py-2 rounded-md hover:bg-[#00126e] transition-colors whitespace-nowrap"
                        >
                            + {t('Crt')}
                        </button>
                    </div>
                </div>

                {/* Dialog Modal */}
                {openDialog && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">
                            {/* Close button */}
                            <button
                                onClick={() => {
                                    setOpenDialog(false);
                                    setGroupName("");
                                    setGroupImage(null);
                                    setGroupImagePreview(null);
                                }}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-lg font-semibold mb-4 text-[#000F5C]">
                                {t('CrtNewGrp')}
                            </h2>

                            {/* Group Name */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('GrpNm')}
                                </label>
                                <input
                                    type="text"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    placeholder={`${t("EntGrpNm")}`}
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#000F5C]"
                                />
                            </div>

                            {/* Group Image */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('GrpImg')}
                                </label>
                                <div className="flex items-center gap-3 flex-wrap">
                                    {groupImagePreview ? (
                                        <img
                                            src={groupImagePreview}
                                            alt="Preview"
                                            className="w-12 h-12 rounded-full object-cover border"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                            <Upload size={18} className="text-gray-500" />
                                        </div>
                                    )}

                                    <label className="cursor-pointer text-sm text-[#000F5C] font-medium hover:underline">
                                        {t('ChsFile')}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 mt-6 flex-wrap">
                                <button
                                    onClick={() => {
                                        setOpenDialog(false);
                                        setGroupName("");
                                        setGroupImage(null);
                                        setGroupImagePreview(null);
                                    }}
                                    className="text-sm px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
                                >
                                    {t('Cls')}
                                </button>
                                <button
                                    onClick={handleCreateGroup}
                                    disabled={!groupName || isCreating}
                                    className={`text-sm px-4 py-2 rounded-md text-white transition-colors ${!groupName || isCreating
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-[#000F5C] hover:bg-[#00126e]"
                                        }`}
                                >
                                    {isCreating ? `${t('Crting')}...` : `${t('Crt')}`}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Groups List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                    {loading
                        ? Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="p-4 border border-gray-200 rounded-xl shadow-sm animate-pulse space-y-3"
                            >
                                <div className="w-16 h-16 rounded-full bg-gray-300 mx-auto"></div>
                                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                            </div>
                        ))
                        : filteredGroups && filteredGroups.length > 0
                            ? filteredGroups.map((group) => (
                                <div
                                    key={group.id}
                                    onClick={() => router.push(`/group/${group.id}`)}
                                    className="group p-4 rounded-xl shadow-md bg-white hover:shadow-lg transition-all cursor-pointer flex flex-col items-center text-center"
                                >
                                    <img
                                        src={group.group_profile || "/defualtgrp.png"}
                                        alt={group.group_name}
                                        className="w-20 h-20 rounded-full object-cover mb-3"
                                    />
                                    <h3 className="text-base font-semibold text-[#000F5C] mb-1 group-hover:text-blue-600 transition">
                                        {group.group_name}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {group.total_member}  {t('Mmbrs')}
                                    </p>
                                </div>
                            ))
                            : !loading && (
                                <div className="col-span-full text-center text-gray-500 py-10">
                                    {t('NoGrpYet')}.
                                </div>
                            )}
                </div>
            </div>
            <Toaster />
        </Layout>

    );
}
