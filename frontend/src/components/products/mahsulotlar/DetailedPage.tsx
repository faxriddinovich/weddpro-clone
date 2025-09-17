import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";

interface Product {
    id: number;
    name: string;
    image: string;
    category: string;
    price: string;
    status: "Faol" | "Faol emas";
    date: string | number;
}

const demoProducts: Product[] = [
    {
        id: 1,
        name: "AirPods Max",
        image: "https://www.apple.com/v/airpods-max/a/images/overview/spacegray__e3q9f5xwvea6_large_2x.jpg",
        category: "Headphones",
        price: "$549",
        status: "Faol",
        date: "24.07.2025, 13:03",
    },
    {
        id: 2,
        name: "Galaxy Buds",
        image: "https://images.samsung.com/is/image/samsung/p6pim/levant/galaxy-buds2-pro/gallery/levant-galaxy-buds2-pro-r510-534908-sm-r510nzbamea-533019646?$650_519_PNG$",
        category: "Earbuds",
        price: "$199",
        status: "Faol emas",
        date: "24.07.2025, 13:03",
    },
];

const DetailedPage = () => {
    const [image, setImage] = useState<string | null>(null);
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState(""); // Placeholder, as description is not in demoProducts
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState(false);
    const [status, setStatus] = useState<string>("Faol");
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            const productId = parseInt(id, 10); // Convert string id to number
            const product = demoProducts.find((p) => p.id === productId);
            if (product) {
                setImage(product.image);
                setProductName(product.name);
                setDescription(""); // Placeholder, add description if needed in demoProducts
                setCategory(product.category);
                setPrice(product.price);
                setDiscount(false); // Placeholder, as discount is not in demo data
                setStatus(product.status);
            } else {
                console.error(`Product with ID ${id} not found in demo data`);
                navigate("/dashboard/products/list"); // Redirect if not found
            }
        }
    }, [id, navigate]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Updated product:", { id: id ? parseInt(id, 10) : undefined, image, productName, description, category, price, discount, status });
        // Placeholder for API update
        navigate("/dashboard/products/list");
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 rounded-xl"
        >
            <div className="rounded-2xl bg-white shadow-md px-6 py-3 mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/dashboard/products/list")}
                            className="text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-lg"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="space-y-1">
                            <h2 className="text-md sm:text-xl md:text-2xl font-medium text-gray-800">
                                Edit Product
                            </h2>
                            <p className="text-sm text-gray-500">
                                You can edit product details and save changes
                            </p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        onClick={handleSave}
                        variant="outline"
                        className="text-black text-sm sm:text-base font-medium py-2 px-4 rounded-lg shadow-md"
                    >
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
                <h1 className="text-md sm:text-lg md:text-xl font-medium text-gray-800">
                    Edit Product Details
                </h1>
                <p className="text-sm mb-6 text-[#8393A6]">Update your product information</p>

                <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Image Upload */}
                    <div className="flex flex-col items-center">
                        <div className="w-[500px] h-64 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden mb-4">
                            {image ? (
                                <img
                                    src={image}
                                    alt="Product Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-400">Upload Image</span>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="text-xs text-gray-500 mt-2">Click to change product image</p>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="productName" className="block text-sm mb-2 font-medium text-gray-700">
                                Product Name
                            </Label>
                            <Input
                                id="productName"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="Enter product name"
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <Label htmlFor="description" className="block text-sm mb-2 font-medium text-gray-700">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter product description"
                            />
                        </div>

                        <div>
                            <Label htmlFor="category" className="block text-sm mb-2 font-medium text-gray-700">
                                Category
                            </Label>
                            <Select onValueChange={setCategory} value={category}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Headphones">Headphones</SelectItem>
                                    <SelectItem value="Earbuds">Earbuds</SelectItem>
                                    <SelectItem value="Accessories">Accessories</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="price" className="block text-sm mb-2 font-medium text-gray-700">
                                Price
                            </Label>
                            <Input
                                id="price"
                                type="text"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Enter price"
                            />
                        </div>

                        <div>
                            <Label htmlFor="status" className="block text-sm mb-2 font-medium text-gray-700">
                                Status
                            </Label>
                            <Select onValueChange={setStatus} value={status}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Faol">Faol</SelectItem>
                                    <SelectItem value="Faol emas">Faol emas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="discount"
                                checked={discount}
                                onCheckedChange={(checked) => setDiscount(checked as boolean)}
                            />
                            <Label htmlFor="discount" className="text-sm font-medium text-gray-700">
                                Apply Discount
                            </Label>
                        </div>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default DetailedPage;