import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import { ChevronLeft, Search } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function AllGroups() {
    const token = Cookies.get("token");
    const router = useRouter();

    const [gettingallGroups, setgettingallGroups] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getallGroups();
    }, []);

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

    return (
        <Layout>
            <div className="md:px-10 px-4 py-6 max-w-5xl mx-auto">
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
                        Back
                    </span>
                </div>

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#000F5C]">All Groups</h2>

                    {/* Search bar */}
                    <div className="relative w-full max-w-xs">
                        <input
                            type="text"
                            placeholder="Search groups..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000F5C]"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    </div>
                </div>

                {/* Groups list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {loading
                        ? Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="p-4 border rounded-xl shadow-sm animate-pulse space-y-3"
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
                                        {group.total_member} Members
                                    </p>
                                </div>
                            ))
                            : !loading && (
                                <div className="col-span-full text-center text-gray-500 py-10">
                                    No groups found
                                </div>
                            )}
                </div>
            </div>
        </Layout>
    );
}
