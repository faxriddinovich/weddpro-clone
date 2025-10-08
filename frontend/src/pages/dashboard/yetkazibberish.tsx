import React, { useState } from "react";
import {useToast} from "@/hooks/use-toast.ts";

const deliveryMethods = [
  { id: "pickup", name: "Do‘kondan olib ketish", icon: "🏪" },
  { id: "courier", name: "Kuryer orqali yetkazish", icon: "🚚" },
  { id: "postomat", name: "Postomat orqali", icon: "📦" },
];
const {toast} = useToast();

const DeliveryForm = () => {
  const [selectedMethod, setSelectedMethod] = useState("courier");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    region: "",
    city: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Yetkazib berish ma'lumotlari:", {
      ...formData,
      deliveryMethod: selectedMethod,
    });
      toast({
          title: "Amaliyot muvaffaqiyatli bajarildi",
          description: "Ma'lumotlar yuborildi",
          duration: 3000,
      })
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow space-y-6"
    >
      <h2 className="text-xl font-semibold">Yetkazib berish ma'lumotlari</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="fullName"
          placeholder="F.I.Sh"
          value={formData.fullName}
          onChange={handleChange}
          className="border rounded-lg p-3 w-full"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Telefon raqami"
          value={formData.phone}
          onChange={handleChange}
          className="border rounded-lg p-3 w-full"
          required
        />
        <input
          type="text"
          name="region"
          placeholder="Viloyat"
          value={formData.region}
          onChange={handleChange}
          className="border rounded-lg p-3 w-full"
          required
        />
        <input
          type="text"
          name="city"
          placeholder="Shahar / Tuman"
          value={formData.city}
          onChange={handleChange}
          className="border rounded-lg p-3 w-full"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Ko‘cha, uy raqami"
          value={formData.address}
          onChange={handleChange}
          className="border rounded-lg p-3 w-full md:col-span-2"
          required
        />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Yetkazib berish usuli</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {deliveryMethods.map((method) => (
            <div
              key={method.id}
              className={`border p-4 rounded-lg flex items-center gap-3 cursor-pointer transition ${
                selectedMethod === method.id
                  ? "border-green-500 ring-2 ring-green-300"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <span className="text-2xl">{method.icon}</span>
              <span>{method.name}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg"
      >
        Tasdiqlash
      </button>
    </form>
  );
};

export default DeliveryForm;