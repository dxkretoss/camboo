import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout/Layout'
import { Plus, ChevronLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from '@/context/UserContext';
export default function addProduct() {
    const token = Cookies.get('token');

    useEffect(() => {
        document.title = "Camboo-AddPoduct"
        if (!token) {
            router.push('/');
        }
    }, [token]);

    const priceRegex = /^\d*\.?\d*$/;
    const { getallProdandSer, getClientsProdandSer } = useUser();
    const [images, setImages] = useState([null, null, null, null]);
    const [selectedTab, setSelectedTab] = useState('Product');
    const [tradeType, setTradeType] = useState('1');
    const [adding, setadding] = useState(false);
    const [errors, setErrors] = useState({});
    const [productData, setproductData] = useState({
        title: '',
        description: '',
        category: '',
        brand: '',
        model: '',
        product_type: '1',
        price: '',
        images: []
    });

    const [serviceData, setserviceData] = useState({
        title: '',
        description: '',
        category: '',
        cost_of_service: '1',
        hr_price: '',
        day_price: '',
        service_images: []
    });

    const [tradeforWhat, settradeforWhat] = useState({
        trade_for_what: '1',
        product_category: '',
        product_brand: '',
        product_model: '',
        service_category: '',
        service_description: '',
    });

    const handleImageChange = (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const updatedImages = [...images];
            updatedImages[index] = {
                file: file,
                preview: URL.createObjectURL(file)
            };
            setImages(updatedImages);
        }
    };

    const validateProductForm = () => {
        let newErrors = {};

        if (!productData.title.trim()) newErrors.title = "Title is required";
        if (!productData.description.trim()) newErrors.description = "Description is required";
        if (!productData.category.trim()) newErrors.category = "Category is required";
        if (!productData.brand.trim()) newErrors.brand = "Brand is required";
        if (!productData.model.trim()) newErrors.model = "Model is required";
        if (!productData.price.trim()) {
            newErrors.price = "Price is required";
        } else if (!priceRegex.test(productData.price)) {
            newErrors.price = "Enter a valid price (e.g. 1199 or 115.90)";
        }

        if (images.length !== 4 || images.some(img => !img?.file)) newErrors.images = "All images are required";

        if (tradeType === '1') {
            if (!tradeforWhat.product_category.trim()) newErrors.product_category = "Trade product category is required";
            if (!tradeforWhat.product_brand.trim()) newErrors.product_brand = "Trade product brand is required";
            if (!tradeforWhat.product_model.trim()) newErrors.product_model = "Trade product model is required";
        } else {
            if (!tradeforWhat.service_category.trim()) newErrors.service_category = "Trade service category is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateServiceForm = () => {
        let newErrors = {};

        if (!serviceData.title.trim()) newErrors.title = "Title is required";
        if (!serviceData.description.trim()) newErrors.description = "Description is required";
        if (!serviceData.category.trim()) newErrors.category = "Category is required";

        if (serviceData.cost_of_service === '1') {
            if (!serviceData.hr_price.trim()) {
                newErrors.hr_price = "Hourly price is required";
            } else if (!priceRegex.test(serviceData.hr_price)) {
                newErrors.hr_price = "Enter a valid hourly price";
            }
        } else {
            if (!serviceData.day_price.trim()) {
                newErrors.day_price = "Daily price is required";
            } else if (!priceRegex.test(serviceData.day_price)) {
                newErrors.day_price = "Enter a valid daily price";
            }
        }

        if (images.length !== 4 || images.some(img => !img?.file)) newErrors.images = "All images are required";

        if (tradeType === '1') {
            if (!tradeforWhat.product_category.trim()) newErrors.product_category = "Trade product category is required";
            if (!tradeforWhat.product_brand.trim()) newErrors.product_brand = "Trade product brand is required";
            if (!tradeforWhat.product_model.trim()) newErrors.product_model = "Trade product model is required";
        } else {
            if (!tradeforWhat.service_category.trim()) newErrors.service_category = "Trade service category is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const clearState = () => {
        setproductData({
            title: '',
            description: '',
            category: '',
            brand: '',
            model: '',
            product_type: '1',
            price: '',
            images: []
        });
        settradeforWhat({
            trade_for_what: '1',
            product_category: '',
            product_brand: '',
            product_model: '',
            service_category: '',
            service_description: '',
        });
        setserviceData({
            title: '',
            description: '',
            category: '',
            cost_of_service: '1',
            hr_price: '',
            day_price: '',
            service_images: []
        })
        setImages([null, null, null, null]);
        setErrors({});
    }
    const addProducts = async () => {
        if (!validateProductForm()) return;
        setadding(true);
        try {
            const formData = new FormData();

            Object.keys(productData).forEach((key) => {
                formData.append(key, productData[key]);
            });

            Object.keys(tradeforWhat).forEach((key) => {
                formData.append(key, tradeforWhat[key]);
            });

            images.forEach((img, index) => {
                if (img?.file) {
                    formData.append(`images[${index}]`, img.file);
                }
            });

            const addProd = await axios.post(
                `${process.env.NEXT_PUBLIC_API_CAMBOO}/add-product`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (addProd?.data?.success) {
                toast.success("Product created successfully");
                await getallProdandSer();
                await getClientsProdandSer();
                clearState();
            } else {
                toast.error("Something went wrong.");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong.");
        } finally {
            setadding(false);
        }
    };

    const addServices = async () => {
        if (!validateServiceForm()) return;
        setadding(true);
        try {
            const formData = new FormData();

            Object.keys(serviceData).forEach((key) => {
                formData.append(key, serviceData[key]);
            });

            Object.keys(tradeforWhat).forEach((key) => {
                formData.append(key, tradeforWhat[key]);
            });

            images.forEach((img, index) => {
                if (img?.file) {
                    formData.append(`images[${index}]`, img.file);
                }
            });
            const addSer = await axios.post(
                `${process.env.NEXT_PUBLIC_API_CAMBOO}/add-service`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (addSer?.data?.success) {
                toast.success("Service created successfully");
                await getallProdandSer();
                clearState();
            } else {
                toast.error("Something went wrong.");
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong.");
        } finally {
            setadding(false);
        }
    }


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
                                    <img src={images[0].preview} alt="Preview" className="object-cover w-full h-full rounded-lg sm:rounded-xl" />
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
                                            <img src={images[index].preview} alt="Preview" className="object-cover w-full h-full rounded-lg sm:rounded-xl" />
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
                            {errors.images && (
                                <p className="text-red-500 text-xs sm:text-sm">{errors.images}</p>
                            )}
                        </div>

                        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 w-full lg:w-1/2 space-y-4 sm:space-y-6">
                            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                                {selectedTab === 'Product' ? "Add Product Details" : "Add Service Details"}
                            </h2>

                            <div className="flex justify-center items-center border-b border-gray-200">
                                {['Product', 'Service'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => {
                                            setSelectedTab(tab);
                                            clearState();
                                        }}
                                        className={`flex-1 text-center py-2 sm:py-3 px-4 sm:px-6 -mb-px cursor-pointer border-b-2 transition text-sm sm:text-base ${selectedTab === tab
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
                                                value={productData?.title}
                                                onChange={(e) => {
                                                    setproductData({
                                                        ...productData,
                                                        title: e.target.value
                                                    })
                                                }}
                                                className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                            />
                                            {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                                        </div>

                                        <div className="space-y-1 sm:space-y-2">
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Description</label>
                                            <textarea
                                                rows="3"
                                                placeholder="Describe your product here..."
                                                value={productData?.description}
                                                onChange={(e) => {
                                                    setproductData({
                                                        ...productData,
                                                        description: e.target.value
                                                    })
                                                }}
                                                className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none"
                                            />
                                            {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}

                                        </div>

                                        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">Category</label>
                                                <input
                                                    type="text"
                                                    placeholder="ex: Bike"
                                                    value={productData?.category}
                                                    onChange={(e) => {
                                                        setproductData({
                                                            ...productData,
                                                            category: e.target.value
                                                        })
                                                    }}
                                                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}

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
                                                <input
                                                    type="text"
                                                    placeholder="ex: YAMAHA"
                                                    value={productData?.brand}
                                                    onChange={(e) => {
                                                        setproductData({
                                                            ...productData,
                                                            brand: e.target.value
                                                        })
                                                    }}
                                                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                {errors.brand && <p className="text-red-500 text-xs">{errors.brand}</p>}

                                            </div>
                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">Model</label>
                                                <input
                                                    type="text"
                                                    placeholder="ex: Y12 2024"
                                                    value={productData?.model}
                                                    onChange={(e) => {
                                                        setproductData({
                                                            ...productData,
                                                            model: e.target.value
                                                        })
                                                    }}
                                                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                {errors.model && <p className="text-red-500 text-xs">{errors.model}</p>}

                                            </div>
                                        </div>

                                        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3 sm:gap-4">
                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                                                    Product Type
                                                </label>
                                                <div className="flex items-center h-[42px] gap-4">
                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="productType"
                                                            value="1"
                                                            checked={productData?.product_type === "1"}
                                                            onChange={(e) => {
                                                                setproductData({
                                                                    ...productData,
                                                                    product_type: e.target.value
                                                                })
                                                            }}
                                                            className="accent-blue-600 cursor-pointer w-4 h-4"
                                                        />
                                                        <span className="text-xs sm:text-sm text-gray-700">Old Product</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="productType"
                                                            value="2"
                                                            checked={productData?.product_type === "2"}
                                                            onChange={(e) => {
                                                                setproductData({
                                                                    ...productData,
                                                                    product_type: e.target.value
                                                                })
                                                            }}
                                                            className="accent-blue-600 cursor-pointer w-4 h-4"
                                                        />
                                                        <span className="text-xs sm:text-sm text-gray-700">New Product</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                                                    Price
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="ex: $2000.00"
                                                    value={productData?.price}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        if (value === "" || regex.test(value)) {
                                                            setproductData({
                                                                ...productData,
                                                                price: e.target.value
                                                            });
                                                        }
                                                    }}
                                                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
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
                                                value={serviceData?.title}
                                                onChange={(e) => {
                                                    setserviceData({
                                                        ...serviceData,
                                                        title: e.target.value
                                                    })
                                                }}
                                                className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                            />
                                            {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}

                                        </div>

                                        <div className="space-y-1 sm:space-y-2">
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Description</label>
                                            <textarea
                                                rows="3"
                                                placeholder="Describe your service here..."
                                                value={serviceData?.description}
                                                onChange={(e) => {
                                                    setserviceData({
                                                        ...serviceData,
                                                        description: e.target.value
                                                    })
                                                }}
                                                className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none"
                                            />
                                            {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}

                                        </div>

                                        <div className="space-y-1 sm:space-y-2">
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Category</label>
                                            <input
                                                type="text"
                                                placeholder="ex: Civil Construction"
                                                value={serviceData?.category}
                                                onChange={(e) => {
                                                    setserviceData({
                                                        ...serviceData,
                                                        category: e.target.value
                                                    })
                                                }}
                                                className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}

                                        </div>

                                        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3 sm:gap-4">
                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                                                    Cost of service
                                                </label>
                                                <div className="flex items-center h-[42px] gap-4">
                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="costofservice"
                                                            value='1'
                                                            checked={serviceData?.cost_of_service === '1'}
                                                            onChange={(e) => {
                                                                setserviceData({
                                                                    ...serviceData,
                                                                    cost_of_service: e.target.value,
                                                                    hr_price: '',
                                                                    day_price: ''
                                                                })
                                                            }}
                                                            className="accent-blue-600 cursor-pointer w-4 h-4"
                                                        />
                                                        <span className="text-xs sm:text-sm text-gray-700">R$/hr</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="costofservice"
                                                            value='2'
                                                            checked={serviceData?.cost_of_service === '2'}
                                                            onChange={(e) => {
                                                                setserviceData({
                                                                    ...serviceData,
                                                                    cost_of_service: e.target.value,
                                                                    hr_price: '',
                                                                    day_price: ''
                                                                })
                                                            }}
                                                            className="accent-blue-600 cursor-pointer w-4 h-4"
                                                        />
                                                        <span className="text-xs sm:text-sm text-gray-700">R$/Day</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                                                    {serviceData?.cost_of_service === '1' ? 'R$/hr' : 'R$/Day'}
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="ex: $2000.00"
                                                    value={
                                                        serviceData?.cost_of_service === '1'
                                                            ? serviceData?.hr_price
                                                            : serviceData?.day_price
                                                    }
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        const regex = /^\d*\.?\d{0,2}$/;

                                                        if (value === "" || regex.test(value)) {
                                                            if (serviceData?.cost_of_service === '1') {
                                                                setserviceData({
                                                                    ...serviceData,
                                                                    hr_price: value
                                                                });
                                                            } else {
                                                                setserviceData({
                                                                    ...serviceData,
                                                                    day_price: value
                                                                });
                                                            }
                                                        }
                                                    }}
                                                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />

                                                {serviceData?.cost_of_service === '1' ?
                                                    errors.hr_price && <p className="text-red-500 text-xs">{errors.hr_price}</p> :
                                                    errors.day_price && <p className="text-red-500 text-xs">{errors.day_price}</p>
                                                }
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="bg-[#f7f9ff] p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl space-y-3 sm:space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700">Trade for what?</label>
                                        <div className="flex xs:flex-row gap-2 xs:gap-6">
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="tradeType"
                                                    value="1"
                                                    checked={tradeforWhat?.trade_for_what === "1"}
                                                    onChange={(e) => {
                                                        setTradeType(e.target.value)
                                                        settradeforWhat({
                                                            ...tradeforWhat,
                                                            trade_for_what: e.target.value,
                                                            product_category: '',
                                                            product_brand: '',
                                                            product_model: '',
                                                            service_category: '',
                                                            service_description: '',
                                                        })
                                                    }}
                                                    className="accent-blue-600 cursor-pointer w-4 h-4"
                                                />
                                                <span className="text-xs sm:text-sm text-gray-700">Product</span>
                                            </label>
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="tradeType"
                                                    value="2"
                                                    checked={tradeforWhat?.trade_for_what === "2"}
                                                    onChange={(e) => {
                                                        setTradeType(e.target.value)
                                                        settradeforWhat({
                                                            ...tradeforWhat,
                                                            trade_for_what: e.target.value,
                                                            product_category: '',
                                                            product_brand: '',
                                                            product_model: '',
                                                            service_category: '',
                                                            service_description: '',
                                                        })
                                                    }}
                                                    className="accent-blue-600 cursor-pointer w-4 h-4"
                                                />
                                                <span className="text-xs sm:text-sm text-gray-700">Service</span>
                                            </label>
                                        </div>
                                    </div>

                                    {tradeType === '1' ? (
                                        <>
                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">Category</label>
                                                <input
                                                    type="text"
                                                    placeholder="ex: Bike"
                                                    value={tradeforWhat?.product_category}
                                                    onChange={(e) => {
                                                        settradeforWhat({
                                                            ...tradeforWhat,
                                                            product_category: e.target.value
                                                        })
                                                    }}
                                                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                {errors.product_category && <p className="text-red-500 text-xs">{errors.product_category}</p>}
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                <div className="space-y-1 sm:space-y-2">
                                                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Brand</label>
                                                    <input
                                                        type="text"
                                                        placeholder="ex: YAMAHA"
                                                        value={tradeforWhat?.product_brand}
                                                        onChange={(e) => {
                                                            settradeforWhat({
                                                                ...tradeforWhat,
                                                                product_brand: e.target.value
                                                            })
                                                        }}
                                                        className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                    {errors.product_brand && <p className="text-red-500 text-xs">{errors.product_brand}</p>}

                                                </div>
                                                <div className="space-y-1 sm:space-y-2">
                                                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Model</label>
                                                    <input
                                                        type="text"
                                                        placeholder="ex: Y12 2024"
                                                        value={tradeforWhat?.product_model}
                                                        onChange={(e) => {
                                                            settradeforWhat({
                                                                ...tradeforWhat,
                                                                product_model: e.target.value
                                                            })
                                                        }}
                                                        className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                    {errors.product_model && <p className="text-red-500 text-xs">{errors.product_model}</p>}

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
                                                    value={tradeforWhat?.service_category}
                                                    onChange={(e) => {
                                                        settradeforWhat({
                                                            ...tradeforWhat,
                                                            service_category: e.target.value
                                                        })
                                                    }}
                                                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                {errors.service_category && <p className="text-red-500 text-xs">{errors.service_category}</p>}

                                            </div>
                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">Description (Optional)</label>
                                                <textarea
                                                    rows="3"
                                                    placeholder="Describe your product here..."
                                                    value={tradeforWhat?.service_description}
                                                    onChange={(e) => {
                                                        settradeforWhat({
                                                            ...tradeforWhat,
                                                            service_description: e.target.value
                                                        })
                                                    }}
                                                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="pt-2">
                                        <Button
                                            className={`w-full sm:w-auto ${adding ? "cursor-not-allowed opacity-70" : ""}`}
                                            disabled={adding}
                                            onClick={() => {
                                                if (selectedTab === 'Product') {
                                                    addProducts();
                                                } else {
                                                    addServices();
                                                }
                                            }}
                                        >
                                            {adding
                                                ? "Saving..."
                                                : selectedTab === 'Product'
                                                    ? "Save Product"
                                                    : "Save Service"}
                                        </Button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </Layout>
    );
}
