import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom"; // Commented for demo
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Package, Percent, DollarSign, Calendar, Tag, CheckCircle, Eye } from "lucide-react";

export default function AddDiscount() {
    const [discountType, setDiscountType] = useState("percentage");
    const [xValue, setXValue] = useState("");
    const [yValue, setYValue] = useState("");
    const [percentage, setPercentage] = useState("");
    const [oldPrice, setOldPrice] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [productId, setProductId] = useState("");
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // const navigate = useNavigate(); // Commented for demo
    // const navigate = { navigate: (path: string) => console.log(`Navigating to: ${path}`) };
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log({
            type: discountType,
            xValue,
            yValue,
            percentage,
            oldPrice,
            newPrice,
            expiryDate,
            image,
            productId,
            productName,
            category,
            description,
            isActive,
        });
        
        setIsSubmitting(false);
        navigate("/dashboard/products/discounts");
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleback = () => {
        navigate("/dashboard/products/discounts");
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    const getDiscountIcon = () => {
        switch(discountType) {
            case "percentage": return <Percent className="w-5 h-5" />;
            case "buyXgetY": return <Package className="w-5 h-5" />;
            case "priceChange": return <DollarSign className="w-5 h-5" />;
            default: return <Tag className="w-5 h-5" />;
        }
    };

    const calculateSavings = () => {
        if (discountType === "percentage" && percentage && oldPrice) {
            const savings = (parseFloat(oldPrice) * parseFloat(percentage)) / 100;
            return savings.toFixed(2);
        }
        if (discountType === "priceChange" && oldPrice && newPrice) {
            const savings = parseFloat(oldPrice) - parseFloat(newPrice);
            return savings > 0 ? savings.toFixed(2) : "0";
        }
        return "0";
    };

    return (
        <motion.div 
            className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div 
                    className="mb-6 flex items-center justify-between"
                    variants={itemVariants}    
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 items-center justify-center hidden md:flex">
                            <Tag className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Yangi Chegirma Qo'shish</h1>
                            <p className="text-slate-600">Mahsulotlar uchun yangi chegirma yarating</p>
                        </div>
                    </div>

                    <div>
                        <Button
                            variant="outline"
                            className="text-slate-600 bg-white border-slate-200 hover:bg-slate-50 transition-colors"
                            onClick={handleback}  
                        >
                            <X className="w-4 h-4 mr-2" />
                            Bekor qilish
                        </Button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Side - Image Preview */}
                    <motion.div 
                        className="lg:col-span-5"
                        variants={itemVariants}
                    >
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100">
                                <h3 className="text-lg font-semibold text-slate-900 mb-1">Mahsulot Rasmi</h3>
                                <p className="text-sm text-slate-600">Chegirma uchun rasm yuklang</p>
                            </div>
                            
                            <div className="p-6">
                                <AnimatePresence mode="wait">
                                    {imagePreview ? (
                                        <motion.div
                                            key="preview"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="relative group"
                                        >
                                            <div className="aspect-square rounded-xl overflow-hidden bg-slate-100">
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Preview" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                onClick={removeImage}
                                                className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            
                                            {/* Preview Badge */}
                                            <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                                <Eye className="w-4 h-4" />
                                                Preview
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.label
                                            key="upload"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            htmlFor="image"
                                            className="aspect-square border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 group"
                                        >
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors duration-200">
                                                <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500" />
                                            </div>
                                            <p className="text-slate-600 font-medium mb-1">Rasm yuklash</p>
                                            <p className="text-slate-400 text-sm">PNG, JPG, WEBP (max 10MB)</p>
                                            <input
                                                id="image"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </motion.label>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Discount Preview */}
                            {(percentage || (oldPrice && newPrice)) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-6 border-t border-slate-100 bg-gradient-to-r from-green-50 to-emerald-50"
                                >
                                    <h4 className="font-semibold text-slate-900 mb-3">Chegirma Tahlili</h4>
                                    <div className="space-y-2">
                                        {discountType === "percentage" && percentage && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600">Chegirma:</span>
                                                <span className="font-bold text-green-600">{percentage}%</span>
                                            </div>
                                        )}
                                        {oldPrice && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600">Tejash:</span>
                                                <span className="font-bold text-green-600">${calculateSavings()}</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Right Side - Form */}
                    <motion.div 
                        className="lg:col-span-7"
                        variants={itemVariants}
                    >
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                            <div className="p-6 border-b border-slate-100">
                                <h3 className="text-lg font-semibold text-slate-900 mb-1">Chegirma Ma'lumotlari</h3>
                                <p className="text-sm text-slate-600">Barcha kerakli maydonlarni to'ldiring</p>
                            </div>

                            <div onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Discount Type */}
                                <motion.div variants={itemVariants}>
                                    <Label htmlFor="discountType" className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                        {getDiscountIcon()}
                                        Chegirma Turi
                                    </Label>
                                    <Select value={discountType} onValueChange={setDiscountType}>
                                        <SelectTrigger className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                                            <SelectValue placeholder="Chegirma turini tanlang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="percentage">📊 Foizli Chegirma (%)</SelectItem>
                                            <SelectItem value="buyXgetY">🎁 X oling, Y yuting</SelectItem>
                                            <SelectItem value="priceChange">💰 Narx O'zgartirish</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </motion.div>

                                {/* Dynamic Fields */}
                                <AnimatePresence mode="wait">
                                    {discountType === "buyXgetY" && (
                                        <motion.div
                                            key="buyXgetY"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                        >
                                            <div>
                                                <Label htmlFor="xValue" className="text-sm font-medium text-slate-700 mb-2 block">X Qiymati</Label>
                                                <Input
                                                    id="xValue"
                                                    placeholder="Miqdorni kiriting"
                                                    value={xValue}
                                                    onChange={(e) => setXValue(e.target.value)}
                                                    className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="yValue" className="text-sm font-medium text-slate-700 mb-2 block">Y Qiymati</Label>
                                                <Input
                                                    id="yValue"
                                                    placeholder="Bepul miqdorni kiriting"
                                                    value={yValue}
                                                    onChange={(e) => setYValue(e.target.value)}
                                                    className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    {discountType === "percentage" && (
                                        <motion.div
                                            key="percentage"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <Label htmlFor="percentage" className="text-sm font-medium text-slate-700 mb-2 block">Chegirma Foizi</Label>
                                            <div className="relative">
                                                <Input
                                                    id="percentage"
                                                    type="number"
                                                    placeholder="Foizni kiriting"
                                                    value={percentage}
                                                    onChange={(e) => setPercentage(e.target.value)}
                                                    min={0}
                                                    max={100}
                                                    className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 pr-12"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {discountType === "priceChange" && (
                                        <motion.div
                                            key="priceChange"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                        >
                                            <div>
                                                <Label htmlFor="oldPrice" className="text-sm font-medium text-slate-700 mb-2 block">Oldingi Narx</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="oldPrice"
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={oldPrice}
                                                        onChange={(e) => setOldPrice(e.target.value)}
                                                        className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 pl-8"
                                                    />
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</div>
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="newPrice" className="text-sm font-medium text-slate-700 mb-2 block">Yangi Narx</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="newPrice"
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={newPrice}
                                                        onChange={(e) => setNewPrice(e.target.value)}
                                                        className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 pl-8"
                                                    />
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Product Details */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="productId" className="text-sm font-medium text-slate-700 mb-2 block">Mahsulot ID</Label>
                                        <Input
                                            id="productId"
                                            placeholder="#280107"
                                            value={productId}
                                            onChange={(e) => setProductId(e.target.value)}
                                            className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="productName" className="text-sm font-medium text-slate-700 mb-2 block">Mahsulot Nomi</Label>
                                        <Input
                                            id="productName"
                                            placeholder="Apple iMac 2023"
                                            value={productName}
                                            onChange={(e) => setProductName(e.target.value)}
                                            className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <Label htmlFor="category" className="text-sm font-medium text-slate-700 mb-2 block">Kategoriya</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                                            <SelectValue placeholder="Kategoriyani tanlang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Elektronika">📱 Elektronika</SelectItem>
                                            <SelectItem value="Oziq-ovqat">🍕 Oziq-ovqat</SelectItem>
                                            <SelectItem value="Ichimlik">🥤 Ichimlik</SelectItem>
                                            <SelectItem value="Kiyim">👕 Kiyim</SelectItem>
                                            <SelectItem value="Aksessuarlar">💍 Aksessuarlar</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Description */}
                                <div>
                                    <Label htmlFor="description" className="text-sm font-medium text-slate-700 mb-2 block">Tavsif</Label>
                                    <textarea
                                        id="description"
                                        placeholder="Chegirma haqida qisqacha ma'lumot..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                                    />
                                </div>

                                {/* Expiry Date */}
                                <div>
                                    <Label htmlFor="expiryDate" className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Amal Qilish Muddati
                                    </Label>
                                    <Input
                                        id="expiryDate"
                                        type="date"
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(e.target.value)}
                                        className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                    />
                                </div>

                                {/* Status Toggle */}
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <Label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer">Chegirma Holati</Label>
                                        <p className="text-xs text-slate-500 mt-1">Chegirmani darhol faollashtirish</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-slate-400'}`}>
                                            {isActive ? 'Faol' : 'Nofaol'}
                                        </span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                id="isActive"
                                                type="checkbox"
                                                checked={isActive}
                                                onChange={(e) => setIsActive(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                        </label>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Saqlanmoqda...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5" />
                                                Chegirmani Saqlash
                                            </div>
                                        )}
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}