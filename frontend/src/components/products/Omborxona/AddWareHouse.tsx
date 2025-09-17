import React, { useState } from "react";
import { X, Upload, Check, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AddWareHouseProps = {
  onSubmit: (data: any) => void;
};

type FormData = {
  productName: string;
  quantity: string;
  price: string;
  category: string;
  skuCode: string;
  supplier: string;
  image: File | null;
};

type Errors = {
  [key: string]: string;
};

const categories = ["Food", "Beverage", "Cleaning", "Electronics", "Office Supplies"];

const initialFormData: FormData = {
  productName: "",
  quantity: "",
  price: "",
  category: "",
  skuCode: "",
  supplier: "",
  image: null,
};

const AddWareHouse: React.FC<AddWareHouseProps> = ({ onSubmit }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const navigate = useNavigate();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.skuCode.trim()) {
      newErrors.skuCode = "SKU code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      setToastType("success");
      setShowToast(true);

      // Call parent onSubmit
      onSubmit(formData);

      setTimeout(() => {
        navigate("/dashboard/products/warehouse");
      }, 2000);

      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    } else {
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setImagePreview(null);
    setErrors({});
    // Placeholder for navigation back (e.g., to dashboard or refresh)
    navigate("/dashboard/products/warehouse"); // Can be replaced with navigate if specific route needed
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all ${
            toastType === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {toastType === "success" ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">
            {toastType === "success"
              ? "Product added successfully!"
              : "Please fix the errors below"}
          </span>
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            ➕ Add New Product
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div className="md:col-span-2">
            <Label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={(e) => handleInputChange("productName", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.productName ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter product name"
            />
            {errors.productName && (
              <p className="mt-1 text-sm text-red-600">{errors.productName}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <Label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Product Image (Optional)
            </Label>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <label
                className="flex flex-col items-center justify-center w-full sm:w-1/2 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Click to upload image</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
              {imagePreview && (
                <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <Label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Quantity *
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.quantity ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="0"
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.price ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.category ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* SKU Code */}
          <div>
            <Label htmlFor="skuCode" className="block text-sm font-medium text-gray-700 mb-2">
              SKU Code *
            </Label>
            <Input
              id="skuCode"
              type="text"
              value={formData.skuCode}
              onChange={(e) => handleInputChange("skuCode", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.skuCode ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="SKU123"
            />
            {errors.skuCode && (
              <p className="mt-1 text-sm text-red-600">{errors.skuCode}</p>
            )}
          </div>

          {/* Supplier */}
          <div className="md:col-span-2">
            <Label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-2">
              Supplier (Optional)
            </Label>
            <Input
              id="supplier"
              type="text"
              value={formData.supplier}
              onChange={(e) => handleInputChange("supplier", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter supplier name"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="flex-1 sm:flex-none px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 sm:flex-none px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Save Product
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddWareHouse;