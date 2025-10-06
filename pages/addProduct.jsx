import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout/Layout'
import { ChevronLeft, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/router';
const productcategoriesData = {
    "Cars, Motorcycles, Mopeds, and Boats": [
        "Cars & Trucks",
        "Classics",
        "Motorcycles",
        "Automotive Tools & Supplies",
        "Trailers & Other Vehicles",
        "Boats",
        "Car & Truck Parts",
        "Wheels, Tires & Parts",
        "All Parts & Accessories",
        "Other"
    ],
    "Electronics": [
        "Computers, Tablets & Network Hardware",
        "Cameras & Photo",
        "Cell Phones & Smartphones",
        "Cell Phone Cases, Covers & Skins",
        "TV, Video & Home Audio Electronics",
        "Vehicle Electronics & GPS",
        "Headphones",
        "Surveillance & Smart Home Electronics",
        "Video Games & Consoles",
        "PC Desktops & All-In-One Computers",
        "Computer Graphics Cards",
        "Tablets & eReaders",
        "Laptops & Netbooks",
        "Other"
    ],
    "Clothing, Shoes & Accesssories": [
        "Women's Clothing",
        "Women's Shoes",
        "Women’s Accessories",
        "Men's Clothing",
        "Men's Shoes",
        "Men's Accessories",
        "Girls' Clothing",
        "Boys' Clothing",
        "Designer Handbags",
        "Collectible Sneakers",
        "Streetwear",
        "Women's Dresses",
        "Women's Coats, Jackets & Vests",
        "Men's Shirts",
        "Men's Coats & Jackets",
        "Other"
    ],
    "Collectibles": [
        "Sports Trading Cards",
        "Collectible Card Games",
        "Coins & Paper Money",
        "Sports Memorabilia, Fan Shop & Sports Cards",
        "Toys & Comic Books",
        "Art",
        "Antiques",
        "Stamps",
        "Other"
    ],
    "Home&Garden": [
        "Home Improvement",
        "Yard, Garden & Outdoor Living Items",
        "Kitchen Dining Bar",
        "Lamps, Lighting & Ceiling Fans",
        "Home Décor",
        "Power Tools",
        "Furniture",
        "Rugs & Carpets",
        "Surveillance & Smart Home",
        "Vacuum Cleaners",
        "Small Kitchen Appliances",
        "Large Kitchen Appliances",
        "Outdoor Entertaining",
        "Bedding",
        "Mattresses",
        "HVAC & Refrigeration",
        "Other"
    ],
    "Toys": [
        "Toy Vehicles",
        "Model Railroads & Trains",
        "Action Figures",
        "Collectible Card Games",
        "Models & Kits",
        "Radio Control Toys",
        "Board Games",
        "Stuffed Animals",
        "Other"
    ],
    "Sporting Goods": [
        "Popular Sports",
        "Cycling Equipment",
        "Fishing Equipment & Supplies",
        "Team Sports",
        "Fitness, Running & Yoga Equipment",
        "Camping & Hiking Equipment",
        "Water Sports",
        "Electric Bikes",
        "GPS & Running Watches",
        "Other"
    ],
    "Office & Business": [
        "Heavy Equipment",
        "Heavy Equipment Parts & Accessories",
        "Healthcare",
        "Restaurant & Food Service",
        "Test, Measurement & Inspection Equipment",
        "CNC, Metalworking & Manufacturing",
        "Office",
        "Industrial Automation & Motion Control",
        "Shipping & Packaging",
        "Electrical Equipment & Supplies",
        "Personal Protective Equipment",
        "Light Industrial Equipment & Tools",
        "Other"
    ],
    "Jewelry & Watches": [
        "Luxury Watches",
        "All Watches, Parts, Accessories",
        "Fine Jewelry",
        "Fashion Jewelry",
        "Loose Diamonds & Gemstones",
        "All Jewelry"
    ]
};

const servicecategoriesData = {
    "Technical Assistance": [
        "Electronics",
        "Home Appliances",
        "PC, Laptop & Cell Phones",
        "Other Tech Assistance"
    ],
    "Training & Development": [
        "Academic",
        "Arts",
        "Sports",
        "Technology",
        "Other Training"
    ],
    "Cars & Motor Cycles": [
        "Electric",
        "Paint",
        "Glass",
        "Mechanics",
        "Other Services"
    ],
    "Consulting": [
        "Social Media",
        "Business",
        "Legal",
        "Pesonal",
        "Other Consulting Services"
    ],
    "Design & Tech": [
        "App Development",
        "Graphic Design",
        "Audio & Visuals",
        "Other Services"
    ],
    "Events": [
        "Support Teams",
        "Catering",
        "Music & Entertainment",
        "Other Services"
    ],
    "Beauty & Style": [
        "Beauty Treatments",
        "Hair Stylist",
        "Tailor/Designer",
        "Other Services"
    ],
    "Home Improvement": [
        "Rental Equipment",
        "Civil Construction",
        "Installation",
        "Repair",
        "Other Services"
    ],
    "Health": [
        "Therapy",
        "Nutrition",
        "Coaching",
        "Nurse",
        "Other Health Services"
    ],
    "Domestic Services": [
        "Cleaning",
        "Cooking & Shopping",
        "Driving & Delivery",
        "Dog Walking",
        "Other Domestic Services"
    ]
}

export default function addProduct() {
    const token = Cookies.get('token');
    const router = useRouter();
    useEffect(() => {
        document.title = "Camboo-AddPoduct"
        if (!token) {
            router.push('/');
        }
    }, [token]);

    useEffect(() => {
        const editItemId = router?.query?.Editid;
        const copyItemId = router?.query?.Copyad;
        if (editItemId) {
            getEditItemsData(editItemId);
        } else if (copyItemId) {
            getCopyItemsData(copyItemId);
        } else {
            clearState();
        }
    }, [(router?.query?.Editid || router?.query?.Copyad)])

    const priceRegex = /^\d*\.?\d*$/;
    const { getallProdandSer, getClientsProdandSer } = useUser();
    const [images, setImages] = useState([null, null, null, null]);
    const [removedImages, setRemovedImages] = useState([]);
    const [selectedTab, setSelectedTab] = useState('Product');
    const [tradeType, setTradeType] = useState('1');
    const [adding, setadding] = useState(false);
    const [errors, setErrors] = useState({});
    const [fetchEditData, setfetchEditData] = useState(false);
    const [productData, setproductData] = useState({
        title: '',
        description: '',
        category: '',
        sub_category: '',
        unbranded_product: '',
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
        sub_category: '',
        cost_of_service: '1',
        range_of_service_delivery: '',
        hr_price: '',
        day_price: '',
        service_images: []
    });
    const [tradeforWhat, settradeforWhat] = useState({
        trade_for_what: '1',
        product_category: '',
        product_sub_category: '',
        product_brand: '',
        product_model: '',
        service_category: '',
        service_description: '',
        service_sub_category: ''
    });

    const handleImageChange = (event, index) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        setImages((prev) => {
            const updated = [...prev];

            // Find the first available slots starting from the clicked index
            let insertIndex = index;
            files.forEach((file) => {
                // If current slot is filled, find next empty one
                while (insertIndex < 4 && updated[insertIndex]) {
                    insertIndex++;
                }

                if (insertIndex < 4) {
                    updated[insertIndex] = {
                        file,
                        preview: URL.createObjectURL(file),
                    };
                }
            });

            return updated;
        });
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files).filter(file =>
            file.type.startsWith('image/')
        );
        if (files.length === 0) return;

        setImages((prev) => {
            const updated = [...prev];

            let insertIndex = updated.findIndex((img) => !img);
            if (insertIndex === -1) insertIndex = 0; // overwrite if all full

            files.forEach((file) => {
                // find next empty slot
                while (insertIndex < 4 && updated[insertIndex]) {
                    insertIndex++;
                }

                if (insertIndex < 4) {
                    updated[insertIndex] = {
                        file,
                        preview: URL.createObjectURL(file),
                    };
                }
            });

            return updated;
        });
    };

    const handleRemoveImage = (index) => {
        setImages((prev) => {
            const updated = [...prev];
            updated[index] = null;
            return updated;
        });
    };

    // Validate Product Field
    const validateProductForm = () => {
        let newErrors = {};

        if (!productData.title.trim()) newErrors.title = "Title is required";
        if (!productData.description.trim()) newErrors.description = "Description is required";
        if (!productData.category.trim()) newErrors.category = "Category is required";
        if (!productData.sub_category.trim()) newErrors.sub_category = "Sub-Category is required";
        if (!productData.brand.trim() && productData?.unbranded_product !== 'check') newErrors.brand = "Brand is required";
        if (!productData.model.trim()) newErrors.model = "Model is required";
        if (!productData.price.trim()) {
            newErrors.price = "Price is required";
        } else if (!priceRegex.test(productData.price)) {
            newErrors.price = "Enter a valid price (e.g. 1199 or 115.90)";
        }

        if (images.length !== 4 || images.some(img => !(img?.file || img?.preview))) newErrors.images = "All images are required";

        if (tradeType === '1') {
            if (!tradeforWhat.product_category.trim()) newErrors.product_category = "Trade product category is required";
            if (!tradeforWhat.product_sub_category.trim()) newErrors.product_sub_category = "Trade product sub-category is required";
            if (!tradeforWhat.product_brand.trim()) newErrors.product_brand = "Trade product brand is required";
            // if (!tradeforWhat.product_model.trim()) newErrors.product_model = "Trade product model is required";
        } else {
            if (!tradeforWhat.service_category.trim()) newErrors.service_category = "Trade service category is required";
            if (!tradeforWhat.service_sub_category.trim()) newErrors.service_sub_category = "Trade service sub-category is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validate Service Field
    const validateServiceForm = () => {
        let newErrors = {};

        if (!serviceData.title.trim()) newErrors.title = "Title is required";
        if (!serviceData.description.trim()) newErrors.description = "Description is required";
        if (!serviceData.category.trim()) newErrors.category = "Category is required";
        if (!serviceData.sub_category.trim()) newErrors.sub_category = "Sub-Category is required";
        if (!serviceData.range_of_service_delivery.trim()) newErrors.range_of_service_delivery = "Range of service Delivery is required";

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

        if (images.length !== 4 || images.some(img => !(img?.file || img?.preview))) newErrors.images = "All images are required";

        if (tradeType === '1') {
            if (!tradeforWhat.product_category.trim()) newErrors.product_category = "Trade product category is required";
            if (!tradeforWhat.product_sub_category.trim()) newErrors.product_sub_category = "Trade product sub-category is required";
            if (!tradeforWhat.product_brand.trim()) newErrors.product_brand = "Trade product brand is required";
            // if (!tradeforWhat.product_model.trim()) newErrors.product_model = "Trade product model is required";
        } else {
            if (!tradeforWhat.service_category.trim()) newErrors.service_category = "Trade service category is required";
            if (!tradeforWhat.service_sub_category.trim()) newErrors.service_sub_category = "Trade service sub-category is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Clear State
    const clearState = () => {
        setproductData({
            title: '',
            description: '',
            category: '',
            sub_category: '',
            unbranded_product: '',
            brand: '',
            model: '',
            product_type: '1',
            price: '',
            images: []
        });
        settradeforWhat({
            trade_for_what: '1',
            product_category: '',
            product_sub_category: '',
            product_brand: '',
            product_model: '',
            service_category: '',
            service_sub_category: '',
            service_description: '',
        });
        setserviceData({
            title: '',
            description: '',
            category: '',
            sub_category: '',
            cost_of_service: '1',
            range_of_service_delivery: '',
            hr_price: '',
            day_price: '',
            service_images: []
        })
        setImages([null, null, null, null]);
        setErrors({});
    }

    // Add Product
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
                router.push('/home')
            } else {
                toast.error(`${addProd?.data?.message}`);
            }
        } catch (error) {
            console.log(error);
            toast.error(`${error?.response?.data?.message}`);
        } finally {
            setadding(false);
        }
    };

    // Add Service
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
                await getClientsProdandSer();
                clearState();
                router.push('/home')
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

    // Get Edit Data
    const getEditItemsData = async (itemId) => {
        setfetchEditData(true);
        try {
            const getData = await axios.get(`${process.env.NEXT_PUBLIC_API_CAMBOO}/get-product_and_service_detail?item_id=${itemId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (getData?.data?.data) {
                const ProductData = getData?.data?.data;
                if (ProductData?.main_type === 'Product') {
                    if (ProductData?.images?.length) {
                        const formattedImages = ProductData.images.map(imgUrl => ({
                            file: null,
                            preview: imgUrl
                        }));
                        while (formattedImages.length < 4) {
                            formattedImages.push(null);
                        }

                        setImages(formattedImages);
                    }
                    setSelectedTab('Product')
                    const tradeForWhat = ProductData?.trade_for_what === 'Product' ? '1' : '2'
                    setTradeType(tradeForWhat)
                    setproductData({
                        title: ProductData?.title || '',
                        description: ProductData?.description || '',
                        category: ProductData?.category || '',
                        sub_category: ProductData?.sub_category || '',
                        unbranded_product: ProductData?.unbranded_product || '',
                        brand: ProductData?.brand || '',
                        model: ProductData?.model || '',
                        product_type: ProductData?.product_type === 'New product' ? '2' : '1' || '1',
                        price: ProductData?.price || '',
                    });
                    settradeforWhat({
                        trade_for_what: ProductData?.trade_for_what === 'Product' ? '1' : '2' || '1',
                        product_category: ProductData?.product_category || '',
                        product_sub_category: ProductData?.product_sub_category || '',
                        product_brand: ProductData?.product_brand || '',
                        product_model: ProductData?.product_model || '',
                        service_category: ProductData?.service_category || '',
                        service_sub_category: ProductData?.service_sub_category || '',
                        service_description: ProductData?.service_description || '',
                    });
                }

                if (ProductData?.main_type === 'Service') {
                    if (ProductData?.images?.length) {
                        const formattedImages = ProductData.images.map(imgUrl => ({
                            file: null,
                            preview: imgUrl
                        }));
                        while (formattedImages.length < 4) {
                            formattedImages.push(null);
                        }

                        setImages(formattedImages);
                    }
                    setSelectedTab('Service')
                    const tradeForWhat = ProductData?.trade_for_what === 'Product' ? '1' : '2'
                    setTradeType(tradeForWhat)
                    setserviceData({
                        title: ProductData?.title || '',
                        description: ProductData?.description || '',
                        category: ProductData?.category || '',
                        sub_category: ProductData?.sub_category || '',
                        range_of_service_delivery: ProductData?.range_of_service_delivery || '',
                        cost_of_service: ProductData?.cost_of_service === 'R$/Hr' ? '1' : '2' || '1',
                        hr_price: ProductData?.hr_price || '',
                        day_price: ProductData?.day_price || '',
                    })
                    settradeforWhat({
                        trade_for_what: ProductData?.trade_for_what === 'Product' ? '1' : '2' || '1',
                        product_category: ProductData?.product_category || '',
                        product_sub_category: ProductData?.product_sub_category || '',
                        product_brand: ProductData?.product_brand || '',
                        product_model: ProductData?.product_model || '',
                        service_category: ProductData?.service_category || '',
                        service_sub_category: ProductData?.service_sub_category || '',
                        service_description: ProductData?.service_description || '',
                    });
                }

            }
        } catch (error) {
            console.log(error)
        } finally {
            setfetchEditData(false)
        }
    }

    // Get Copy ad Data
    const getCopyItemsData = async (itemId) => {
        setfetchEditData(true);
        try {
            const getData = await axios.get(`${process.env.NEXT_PUBLIC_API_CAMBOO}/get-product_and_service_detail?item_id=${itemId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (getData?.data?.data) {
                const ProductData = getData?.data?.data;
                if (ProductData?.main_type === 'Product') {
                    setSelectedTab('Product')
                    const tradeForWhat = ProductData?.trade_for_what === 'Product' ? '1' : '2'
                    setTradeType(tradeForWhat)
                    setproductData({
                        title: ProductData?.title || '',
                        description: ProductData?.description || '',
                        category: ProductData?.category || '',
                        sub_category: ProductData?.sub_category || '',
                        unbranded_product: ProductData?.unbranded_product || '',
                        brand: ProductData?.brand || '',
                        model: ProductData?.model || '',
                        product_type: ProductData?.product_type === 'New product' ? '2' : '1' || '1',
                        price: ProductData?.price || '',
                    });
                    settradeforWhat({
                        trade_for_what: ProductData?.trade_for_what === 'Product' ? '1' : '2' || '1',
                        product_category: ProductData?.product_category || '',
                        product_sub_category: ProductData?.product_sub_category || '',
                        product_brand: ProductData?.product_brand || '',
                        product_model: ProductData?.product_model || '',
                        service_category: ProductData?.service_category || '',
                        service_sub_category: ProductData?.service_sub_category || '',
                        service_description: ProductData?.service_description || '',
                    });
                }

                if (ProductData?.main_type === 'Service') {
                    setSelectedTab('Service')
                    const tradeForWhat = ProductData?.trade_for_what === 'Product' ? '1' : '2'
                    setTradeType(tradeForWhat)
                    setserviceData({
                        title: ProductData?.title || '',
                        description: ProductData?.description || '',
                        category: ProductData?.category || '',
                        sub_category: ProductData?.sub_category || '',
                        range_of_service_delivery: ProductData?.range_of_service_delivery || '',
                        cost_of_service: ProductData?.cost_of_service === 'R$/Hr' ? '1' : '2' || '1',
                        hr_price: ProductData?.hr_price || '',
                        day_price: ProductData?.day_price || '',
                    })
                    settradeforWhat({
                        trade_for_what: ProductData?.trade_for_what === 'Product' ? '1' : '2' || '1',
                        product_category: ProductData?.product_category || '',
                        product_sub_category: ProductData?.product_sub_category || '',
                        product_brand: ProductData?.product_brand || '',
                        product_model: ProductData?.product_model || '',
                        service_category: ProductData?.service_category || '',
                        service_sub_category: ProductData?.service_sub_category || '',
                        service_description: ProductData?.service_description || '',
                    });
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setfetchEditData(false)
        }
    }

    // Edit Product
    const editProducts = async () => {
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

            removedImages.forEach(img => {
                formData.append('remove_images[]', img);
            });

            images.forEach((img, index) => {
                if (img?.file) {
                    formData.append(`images[${index}]`, img.file);
                }
            });

            const addProd = await axios.post(
                `${process.env.NEXT_PUBLIC_API_CAMBOO}/edit-product?product_id=${router?.query?.Editid}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (addProd?.data?.success) {
                toast.success("Product Edit successfully");
                await getallProdandSer();
                await getClientsProdandSer();
                router.push('/profile')
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

    // Edit Service
    const editServices = async () => {
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
                `${process.env.NEXT_PUBLIC_API_CAMBOO}/edit-service?service_id=${router?.query?.Editid}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (addSer?.data?.success) {
                toast.success("Service Edit successfully");
                await getallProdandSer();
                await getClientsProdandSer();
                router.push('/profile')
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
                <div className="flex items-center gap-1 px-3 sm:px-4 md:px-6 lg:px-10">
                    <ChevronLeft className="w-5 h-5 cursor-pointer "
                        onClick={() => window.history.back()} />
                    <span
                        onClick={() => window.history.back()}
                        className="text-xs sm:text-sm md:text-base font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition duration-200"
                    >
                        Back
                    </span>
                </div>
                {(adding || fetchEditData) &&
                    <div className="fixed inset-0 flex justify-center items-center bg-black/10 backdrop-blur-sm z-50 transition-opacity duration-300">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-[#000F5C] rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-[#000F5C] rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                            <div className="w-3 h-3 bg-[#000F5C] rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                        </div>
                    </div>
                }
                <div className="py-4 sm:py-6 md:py-8 lg:py-10 px-3 sm:px-4 md:px-6 lg:px-10 max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">

                        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 w-full lg:w-1/2 space-y-3 sm:space-y-4"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop} >
                            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                                {selectedTab === 'Product' ? "Product Images" : "Service Images"}
                            </h2>

                            <label className="relative cursor-pointer border border-dashed border-gray-300 rounded-lg sm:rounded-xl w-full aspect-square flex items-center justify-center overflow-hidden hover:border-blue-400 transition-colors">
                                {images[0] ? (
                                    <>
                                        <img
                                            src={images[0]?.preview}
                                            alt="Preview"
                                            className="object-contain w-full h-full  opacity-0 transition-opacity duration-500 rounded-lg sm:rounded-xl"
                                            onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
                                        />
                                        {router?.query?.Editid && (
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleRemoveImage(0); }}
                                                className="absolute top-2 right-2 bg-black text-white rounded-full p-1 hover:bg-opacity-75"
                                                aria-label="Remove image"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <img src='./addimage.png' alt="add-Image" className="text-gray-400 w-8 h-8 sm:w-10 sm:h-10" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => handleImageChange(e, 0)}
                                />
                            </label>

                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                {[1, 2, 3].map((index) => (
                                    <label
                                        key={index}
                                        className="relative aspect-square border border-dashed border-gray-300 rounded-lg sm:rounded-xl flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-400 transition-colors"
                                    >
                                        {images[index] ? (
                                            <>
                                                <img
                                                    src={images[index]?.preview}
                                                    alt="Preview"
                                                    className="object-contain w-full h-full  opacity-0 transition-opacity duration-500 rounded-lg sm:rounded-xl"
                                                    onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
                                                />
                                                {router?.query?.Editid && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }}
                                                        className="absolute top-2 right-2 bg-black text-white rounded-full p-1 hover:bg-opacity-75"
                                                        aria-label="Remove image"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <img src='./addimage.png' className="text-gray-400 w-4 h-4 sm:w-6 sm:h-6" />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
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
                                {selectedTab === 'Product' ? router?.query?.Editid ? "Edit Product Details" : "Add Product Details" :
                                    router?.query?.Editid ? "Edit Service Details" : "Add Service Details"}
                            </h2>

                            <div className="flex justify-center items-center border-b border-gray-200">
                                {['Product', 'Service'].map((tab) => (
                                    <button
                                        key={tab}
                                        hidden={router?.query?.Editid}
                                        onClick={() => {
                                            setSelectedTab(tab);
                                            clearState();
                                        }}
                                        className={`flex-1 disabled:cursor-not-allowed text-center py-2 sm:py-3 px-4 sm:px-6 -mb-px cursor-pointer border-b-2 transition text-sm sm:text-base ${selectedTab === tab
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
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Title *</label>
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
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Description *</label>
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
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                                                    Category *
                                                </label>
                                                <select
                                                    value={productData.category}
                                                    onChange={(e) =>
                                                        setproductData({
                                                            ...productData,
                                                            category: e.target.value,
                                                            sub_category: "",
                                                        })
                                                    }
                                                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="">-- Select Category --</option>
                                                    {Object.keys(productcategoriesData)?.map((cat) => (
                                                        <option key={cat} value={cat}>
                                                            {cat}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
                                            </div>

                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                                                    Sub-Category *
                                                </label>
                                                <select
                                                    value={productData.sub_category}
                                                    onChange={(e) =>
                                                        setproductData({ ...productData, sub_category: e.target.value })
                                                    }
                                                    disabled={!productData.category}
                                                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="">-- Select Sub-Category --</option>
                                                    {productData?.category &&
                                                        productcategoriesData[productData?.category]?.map((sub) => (
                                                            <option key={sub} value={sub}>
                                                                {sub}
                                                            </option>
                                                        ))}
                                                </select>
                                                {errors.sub_category && <p className="text-red-500 text-xs">{errors.sub_category}</p>}
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div className="flex items-center sm:items-center">
                                                <label className="flex items-center space-x-2">
                                                    <input type="checkbox" className="accent-blue-600 w-4 h-4"
                                                        checked={productData?.unbranded_product === 'check'}
                                                        onChange={(e) =>
                                                            setproductData({
                                                                ...productData,
                                                                unbranded_product: e.target.checked ? "check" : "uncheck",
                                                                brand: ''
                                                            })}
                                                    />
                                                    <span className="text-xs sm:text-sm text-gray-700 font-medium">Unbranded Product</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">Brand *</label>
                                                <input
                                                    type="text"
                                                    placeholder="ex: YAMAHA"
                                                    value={productData?.brand}
                                                    disabled={productData?.unbranded_product === 'check'}
                                                    onChange={(e) => {
                                                        setproductData({
                                                            ...productData,
                                                            brand: e.target.value
                                                        })
                                                    }}
                                                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base 
                                                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                                                disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"                                                />
                                                {errors.brand && <p className="text-red-500 text-xs">{errors.brand}</p>}

                                            </div>
                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">Model *</label>
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
                                                    Product Type *
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
                                                        <span className="text-xs sm:text-sm text-gray-700">Used Product</span>
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
                                                    Price *
                                                </label>
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    placeholder="ex: $2000.00"
                                                    value={productData?.price}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        const regex = /^\d*\.?\d{0,2}$/;
                                                        if (value === "" || regex.test(value)) {
                                                            setproductData({
                                                                ...productData,
                                                                price: value
                                                            });
                                                        }
                                                    }}
                                                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
                                            </div>
                                        </div>

                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-1 sm:space-y-2">
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Title *</label>
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
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Description *</label>
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

                                        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                                                    Category *
                                                </label>
                                                <select
                                                    value={serviceData.category}
                                                    onChange={(e) =>
                                                        setserviceData({
                                                            ...serviceData,
                                                            category: e.target.value,
                                                            sub_category: "",
                                                        })
                                                    }
                                                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="">-- Select Category --</option>
                                                    {Object.keys(servicecategoriesData)?.map((cat) => (
                                                        <option key={cat} value={cat}>
                                                            {cat}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
                                            </div>

                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                                                    Sub-Category *
                                                </label>
                                                <select
                                                    value={serviceData.sub_category}
                                                    onChange={(e) =>
                                                        setserviceData({ ...serviceData, sub_category: e.target.value })
                                                    }
                                                    disabled={!serviceData.category}
                                                    className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="">-- Select Sub-Category --</option>
                                                    {serviceData?.category &&
                                                        servicecategoriesData[serviceData?.category]?.map((sub) => (
                                                            <option key={sub} value={sub}>
                                                                {sub}
                                                            </option>
                                                        ))}
                                                </select>
                                                {errors.sub_category && <p className="text-red-500 text-xs">{errors.sub_category}</p>}
                                            </div>
                                        </div>

                                        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3 sm:gap-4">
                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                                                    Cost of service *
                                                </label>
                                                <div className="flex items-start h-[42px] gap-4">
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
                                                        <span className="text-xs sm:text-sm text-gray-700">R$/Hr</span>
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

                                                <div className="space-y-1 sm:space-y-2">
                                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                                        Range of Service Delivery *
                                                    </label>
                                                    <select
                                                        value={serviceData?.range_of_service_delivery || ""}
                                                        onChange={(e) =>
                                                            setserviceData({
                                                                ...serviceData,
                                                                range_of_service_delivery: e.target.value,
                                                            })
                                                        }
                                                        className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        <option value="">-- Select Range --</option>
                                                        <option value="<25km">&lt;25km</option>
                                                        <option value="<50km">&lt;50km</option>
                                                        <option value="100km">100km</option>
                                                        <option value="remote">Remote</option>
                                                    </select>
                                                    {errors.range_of_service_delivery && <p className="text-red-500 text-xs">{errors.range_of_service_delivery}</p>}
                                                </div>
                                            </div>

                                            <div className="space-y-1 sm:space-y-2">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                                                    {serviceData?.cost_of_service === '1' ? 'R$/Hr' : 'R$/Day'} *
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
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700">Trade for what? *</label>
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
                                                            product_sub_category: '',
                                                            product_brand: '',
                                                            product_model: '',
                                                            service_category: '',
                                                            service_sub_category: '',
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
                                                            product_sub_category: '',
                                                            product_brand: '',
                                                            product_model: '',
                                                            service_category: '',
                                                            service_sub_category: '',
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
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                <div className="space-y-1 sm:space-y-2">
                                                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                                                        Category *
                                                    </label>
                                                    <select
                                                        value={tradeforWhat.product_category}
                                                        onChange={(e) =>
                                                            settradeforWhat({
                                                                ...tradeforWhat,
                                                                product_category: e.target.value,
                                                                product_sub_category: "",
                                                            })
                                                        }
                                                        className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        <option value="">-- Select Category --</option>
                                                        {Object.keys(productcategoriesData)?.map((cat) => (
                                                            <option key={cat} value={cat}>
                                                                {cat}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.product_category && <p className="text-red-500 text-xs">{errors.product_category}</p>}
                                                </div>

                                                <div className="space-y-1 sm:space-y-2">
                                                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                                                        Sub-Category *
                                                    </label>
                                                    <select
                                                        value={tradeforWhat.product_sub_category}
                                                        onChange={(e) =>
                                                            settradeforWhat({ ...tradeforWhat, product_sub_category: e.target.value })
                                                        }
                                                        disabled={!tradeforWhat.product_category}
                                                        className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        <option value="">-- Select Sub-Category --</option>
                                                        {tradeforWhat?.product_category &&
                                                            productcategoriesData[tradeforWhat?.product_category]?.map((sub) => (
                                                                <option key={sub} value={sub}>
                                                                    {sub}
                                                                </option>
                                                            ))}
                                                    </select>
                                                    {errors.product_sub_category && <p className="text-red-500 text-xs">{errors.product_sub_category}</p>}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                <div className="space-y-1 sm:space-y-2">
                                                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Brand *</label>
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
                                                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Model (Optional)</label>
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
                                                    {/* {errors.product_model && <p className="text-red-500 text-xs">{errors.product_model}</p>} */}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                <div className="space-y-1 sm:space-y-2">
                                                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                                                        Category *
                                                    </label>
                                                    <select
                                                        value={tradeforWhat.service_category}
                                                        onChange={(e) =>
                                                            settradeforWhat({
                                                                ...tradeforWhat,
                                                                service_category: e.target.value,
                                                                service_sub_category: "",
                                                            })
                                                        }
                                                        className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        <option value="">-- Select Category --</option>
                                                        {Object.keys(servicecategoriesData)?.map((cat) => (
                                                            <option key={cat} value={cat}>
                                                                {cat}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.service_category && <p className="text-red-500 text-xs">{errors.service_category}</p>}
                                                </div>

                                                <div className="space-y-1 sm:space-y-2">
                                                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                                                        Sub-Category *
                                                    </label>
                                                    <select
                                                        value={tradeforWhat.service_sub_category}
                                                        onChange={(e) =>
                                                            settradeforWhat({ ...tradeforWhat, service_sub_category: e.target.value })
                                                        }
                                                        disabled={!tradeforWhat.service_category}
                                                        className="w-full border border-gray-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        <option value="">-- Select Sub-Category --</option>
                                                        {tradeforWhat?.service_category &&
                                                            servicecategoriesData[tradeforWhat?.service_category]?.map((sub) => (
                                                                <option key={sub} value={sub}>
                                                                    {sub}
                                                                </option>
                                                            ))}
                                                    </select>
                                                    {errors.service_sub_category && <p className="text-red-500 text-xs">{errors.service_sub_category}</p>}
                                                </div>
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
                                                    if (router?.query?.Editid) {
                                                        editProducts();
                                                    } else if (router?.query?.Copyad) {
                                                        addProducts();
                                                    } else {
                                                        addProducts();
                                                    }
                                                } else {
                                                    if (router?.query?.Editid) {
                                                        editServices();
                                                    } else if (router?.query?.Copyad) {
                                                        addServices();
                                                    } else {
                                                        addServices();
                                                    }
                                                }
                                            }}
                                        >
                                            {adding
                                                ? "Saving..."
                                                : selectedTab === 'Product'
                                                    ? router?.query?.Editid ? "Edit Product" : "Save Product"
                                                    : router?.query?.Editid ? "Edit Service" : "Save Service"}
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
