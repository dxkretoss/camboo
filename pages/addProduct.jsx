import React, { useState } from 'react'
import Layout from '@/components/Layout/Layout'
import { Plus, ChevronLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function addProduct() {
    const [images, setImages] = useState([null, null, null, null]);
    const [selectedTab, setSelectedTab] = useState('Product');
    const [tradeType, setTradeType] = useState('Product');

    const handleImageChange = (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const updatedImages = [...images];
            updatedImages[index] = URL.createObjectURL(file);
            setImages(updatedImages);
        }
    };

    return (
        <Layout>
            <div className="relative min-h-screen bg-[url('/addproBg.png')] bg-no-repeat sm:bg-contain bg-cover bg-center">
                <div className="flex items-center gap-1 px-3 sm:px-4 md:px-6 lg:px-10 pt-4 sm:pt-6">
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span
                        onClick={() => window.history.back()}
                        className="text-xs sm:text-sm md:text-base font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
                    >
                        Back
                    </span>
                </div>

                <div className="py-4 sm:py-6 md:py-8 lg:py-10 px-3 sm:px-4 md:px-6 lg:px-10 max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">

                        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 w-full lg:w-1/2 space-y-3 sm:space-y-4">
                            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                                {selectedTab === 'Product' ? "Product Images" : "Service Images"}
                            </h2>

                            <label className="cursor-pointer border border-dashed border-gray-300 rounded-lg sm:rounded-xl w-full aspect-square flex items-center justify-center overflow-hidden hover:border-blue-400 transition-colors">
                                {images[0] ? (
                                    <img src={images[0]} alt="Preview" className="object-cover w-full h-full rounded-lg sm:rounded-xl" />
                                ) : (
                                    <Plus className="text-gray-400 w-8 h-8 sm:w-10 sm:h-10" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageChange(e, 0)}
                                />
                            </label>

                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                {[1, 2, 3].map((index) => (
                                    <label
                                        key={index}
                                        className="aspect-square border border-dashed border-gray-300 rounded-lg sm:rounded-xl flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-400 transition-colors"
                                    >
                                        {images[index] ? (
                                            <img src={images[index]} alt="Preview" className="object-cover w-full h-full rounded-lg sm:rounded-xl" />
                                        ) : (
                                            <Plus className="text-gray-400 w-4 h-4 sm:w-6 sm:h-6" />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleImageChange(e, index)}
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 w-full lg:w-1/2 space-y-4 sm:space-y-6">
                            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                                {selectedTab === 'Product' ? "Add Product Details" : "Add Service Details"}
                            </h2>

                            <div className="flex justify-center items-center border-b border-gray-200">
                                {['Product', 'Service'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setSelectedTab(tab)}
                                        className={`py-2 sm:py-3 px-4 sm:px-6 -mb-px cursor-pointer border-b-2 transition text-sm sm:text-base ${selectedTab === tab
                                            ? 'border-blue-600 text-blue-600 font-medium'
                                            : 'border-transparent text-gray-500 hover:text-blue-600'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                {selectedTab === 'Product' ? (
                                    <>
                                        <div className="space-y-1 sm:space-y-2">
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Title</label>
                                            <input
                                                type="text"
                                                placeholder="ex: Yamaha Y12 2024 New Model"
                                                className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                            />
                                        </div>

                                        <div className="space-y-1 sm:space-y-2">
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Description</label>
                                            <textarea
                                                rows="3"
                                                placeholder="Describe your product here..."
                                                className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none"
                                            />
                                        </div>

                                        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">Category</label>
                                                <input
                                                    type="text"
                                                    placeholder="ex: Bike"
                                                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div className="flex items-end sm:items-center mt-1 sm:mt-[30px]">
                                                <label className="flex items-center space-x-2">
                                                    <input type="checkbox" className="accent-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                                                    <span className="text-xs sm:text-sm text-gray-700 font-medium">Produto Sem Marca</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">Brand</label>
                                                <div className="relative">
                                                    <select className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 pr-8 sm:pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer">
                                                        <option value="">Select Brand</option>
                                                        <option value="yamaha">Yamaha</option>
                                                        <option value="honda">Honda</option>
                                                        <option value="toyota">Toyota</option>
                                                        <option value="samsung">Samsung</option>
                                                        <option value="apple">Apple</option>
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">Model</label>
                                                <input
                                                    type="text"
                                                    placeholder="ex: Y12 2024"
                                                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3 sm:gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">Product Type</label>
                                                <div className="flex xs:flex-row gap-2 xs:gap-4">
                                                    <label className="flex items-center space-x-2">
                                                        <input type="radio" name="productType" defaultChecked className="accent-blue-600 cursor-pointer w-4 h-4" />
                                                        <span className="text-xs sm:text-sm text-gray-700">Old Product</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2">
                                                        <input type="radio" name="productType" className="accent-blue-600 cursor-pointer w-4 h-4" />
                                                        <span className="text-xs sm:text-sm text-gray-700">New Product</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">Price</label>
                                                <input
                                                    type="text"
                                                    placeholder="ex: $2000.00"
                                                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-1 sm:space-y-2">
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Title</label>
                                            <input
                                                type="text"
                                                placeholder="ex: Make the Swimming pool to my home"
                                                className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                            />
                                        </div>

                                        <div className="space-y-1 sm:space-y-2">
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Description</label>
                                            <textarea
                                                rows="3"
                                                placeholder="Describe your service here..."
                                                className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none"
                                            />
                                        </div>

                                        <div className="space-y-1 sm:space-y-2">
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Category</label>
                                            <input
                                                type="text"
                                                placeholder="ex: Civil Construction"
                                                className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3 sm:gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">Cost of service</label>
                                                <div className="flex xs:flex-row gap-2 xs:gap-4">
                                                    <label className="flex items-center space-x-2">
                                                        <input type="radio" name="costofservice" defaultChecked className="accent-blue-600 cursor-pointer w-4 h-4" />
                                                        <span className="text-xs sm:text-sm text-gray-700">R$/hr</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2">
                                                        <input type="radio" name="costofservice" className="accent-blue-600 cursor-pointer w-4 h-4" />
                                                        <span className="text-xs sm:text-sm text-gray-700">R$/Day</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">R$/hr</label>
                                                <input
                                                    type="text"
                                                    placeholder="ex: $2000.00"
                                                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="bg-[#f7f9ff] p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl space-y-3 sm:space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700">Trade for what?</label>
                                        <div className="flex xs:flex-row gap-2 xs:gap-6">
                                            {['Product', 'Service'].map((type) => (
                                                <label key={type} className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="tradeType"
                                                        checked={tradeType === type}
                                                        onChange={() => setTradeType(type)}
                                                        className="accent-blue-600 w-4 h-4 cursor-pointer"
                                                    />
                                                    <span className="text-xs sm:text-sm text-gray-700">{type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {tradeType === 'Product' ? (
                                        <>
                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">Category</label>
                                                <input
                                                    type="text"
                                                    placeholder="ex: Bike"
                                                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                <div className="space-y-1 sm:space-y-2">
                                                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Brand</label>
                                                    <div className="relative">
                                                        <select className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 pr-8 sm:pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent  appearance-none cursor-pointer">
                                                            <option value="">Select Brand</option>
                                                            <option value="yamaha">Yamaha</option>
                                                            <option value="honda">Honda</option>
                                                            <option value="toyota">Toyota</option>
                                                            <option value="samsung">Samsung</option>
                                                            <option value="apple">Apple</option>
                                                        </select>
                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-1 sm:space-y-2">
                                                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Model</label>
                                                    <input
                                                        type="text"
                                                        placeholder="ex: Y12 2024"
                                                        className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">Category</label>
                                                <input
                                                    type="text"
                                                    placeholder="ex: Civil Construction"
                                                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">Description (Optional)</label>
                                                <textarea
                                                    rows="3"
                                                    placeholder="Describe your product here..."
                                                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="pt-2">
                                        <Button className="w-full sm:w-auto">
                                            {selectedTab === 'Product' ? "Save Product" : " Save Service"}

                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
