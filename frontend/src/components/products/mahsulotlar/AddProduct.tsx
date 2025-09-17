import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { createProduct } from "@/services/productService";

const AddProduct = () => {
    const [image, setImage] = useState<string | null>(null);
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState(false);
    const [status, setStatus] = useState("In Stock");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        if (!productName.trim()) return "Product name is required";
        if (!category) return "Category is required";
        if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) return "Valid price is required";
        if (!status) return "Status is required";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const newProduct = await createProduct({
                name: productName,
                image: image || "",
                category,
                price: parseFloat(price),
                status,
                description,
            });
            console.log("Mahsulot muvaffaqiyatli qo‘shildi:", newProduct);
            navigate("/dashboard/products/list");
        } catch (err: any) {
            setError(err.message || "Failed to add product");
        } finally {
            setLoading(false);
        }
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
                                Add Product
                            </h2>
                            <p className="text-sm text-gray-500">
                                You can see all sales analysis results more clearly
                            </p>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        variant="outline"
                        disabled={loading}
                        className="text-black text-sm sm:text-base font-medium py-2 px-4 rounded-lg shadow-md"
                    >
                        {loading ? "Adding..." : "Add to Product"}
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <h1 className="text-md sm:text-lg md:text-xl font-medium text-gray-800">
                    Add New Product
                </h1>
                <p className="text-sm mb-6 text-[#8393A6]">Set your thumbnail product</p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Image Upload */}
                    <div className="flex flex-col items-center">
                        <div className="w-[500px] h-64 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden mb-4">
                            {image ? (
                                <img
                                    src={image}
                                    alt="Preview"
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
                                    <SelectItem value="Laptop & PC">Laptop & PC</SelectItem>
                                    <SelectItem value="Smartphone">Smartphone</SelectItem>
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
                                type="number"
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
                                    <SelectItem value="In Stock">In Stock</SelectItem>
                                    <SelectItem value="Low Stock">Low Stock</SelectItem>
                                    <SelectItem value="Sold Out">Sold Out</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default AddProduct;