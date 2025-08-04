import React, { useState } from 'react'
import Layout from '@/components/Layout/Layout'
import { Plus } from 'lucide-react';

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
            <div className="relative min-h-screen bg-[url('/addproBg.png')] bg-no-repeat bg-contain bg-top">
                <div className="py-10 px-4 md:px-10 max-w-6xl mx-auto flex flex-col md:flex-row gap-6 items-start">
                    <div className="bg-white rounded-xl shadow-md p-6 w-full md:w-1/2 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800">Product Images</h2>

                        <label className="cursor-pointer border border-dashed border-gray-300 h-100 rounded-xl w-full aspect-square flex items-center justify-center overflow-hidden">
                            {images[0] ? (
                                <img src={images[0]} alt="Preview" className="object-cover w-full h-full" />
                            ) : (
                                <Plus className="text-gray-400 w-10 h-10" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageChange(e, 0)}
                            />
                        </label>

                        <div className="grid grid-cols-3 gap-3">
                            {[1, 2, 3].map((index) => (
                                <label
                                    key={index}
                                    className="aspect-square border border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden"
                                >
                                    {images[index] ? (
                                        <img src={images[index]} alt="Preview" className="object-cover w-full h-full" />
                                    ) : (
                                        <Plus className="text-gray-400 w-6 h-6" />
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

                    <div className="bg-white rounded-xl shadow-md p-6 w-full md:w-1/2 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800">Add Product Details</h2>

                        <div className="flex justify-center items-center border-b border-gray-200">
                            {['Product', 'Service'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedTab(tab)}
                                    className={`py-2 px-4 -mb-px border-b-2 transition ${selectedTab === tab
                                        ? 'border-blue-600 text-blue-600 font-medium'
                                        : 'border-transparent text-gray-500 hover:text-blue-600'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    placeholder="ex: Yamaha Y12 2024 New Model"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    rows="3"
                                    placeholder="Describe your product here..."
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <input
                                        type="text"
                                        placeholder="ex: Bike"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    />
                                </div>
                                <label className="flex items-center mt-1 space-x-2">
                                    <input type="checkbox" className="accent-blue-600" />
                                    <span className="text-sm text-gray-700">Produto Sem Marca</span>
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Brand</label>
                                    <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                                        <option>ex: Yamaha</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Model</label>
                                    <input
                                        type="text"
                                        placeholder="ex: Y12 2024"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex gap-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="productType"
                                            defaultChecked
                                            className="accent-blue-600"
                                        />
                                        <span className="text-sm text-gray-700">Old Product</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="productType"
                                            className="accent-blue-600"
                                        />
                                        <span className="text-sm text-gray-700">New Product</span>
                                    </label>
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Price</label>
                                    <input
                                        type="text"
                                        placeholder="ex: $2000.00"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    />
                                </div>
                            </div>

                            <div className="bg-[#f7f9ff] p-6 rounded-xl space-y-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Trade for what?</label>
                                    <div className="flex gap-6">
                                        {['Product', 'Service'].map((type) => (
                                            <label key={type} className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="tradeType"
                                                    checked={tradeType === type}
                                                    onChange={() => setTradeType(type)}
                                                    className="accent-blue-600"
                                                />
                                                <span className="text-sm text-gray-700">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {tradeType === 'Product' ? (
                                    <>
                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">Category</label>
                                            <input
                                                type="text"
                                                placeholder="ex: Civil Construction"
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="block text-sm font-medium text-gray-700">Brand</label>
                                                <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                                                    <option>ex: Yamaha</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="block text-sm font-medium text-gray-700">Model</label>
                                                <input
                                                    type="text"
                                                    placeholder="ex: Y12 2024"
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">Category</label>
                                            <input
                                                type="text"
                                                placeholder="ex: Civil Construction"
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                                            <textarea
                                                rows="3"
                                                placeholder="Describe your product here..."
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                            />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold w-full md:w-auto">
                                        Save Product
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Layout>
    );
}
