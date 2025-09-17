import React, { useState, useEffect } from "react";
import { ChevronDown, Trash2, MapPin, Phone, TrendingUp, Filter } from "lucide-react";
import { DeleteOutlined } from "@ant-design/icons";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";

interface Customer {
    id: number;
    name: string;
    location: string;
    phone: string;
    profit: number;
    platform: "Telegram" | "Web" | "Mobile App";
    image: string;
}

const customersData: Record<"daily" | "weekly" | "monthly" | "yearly", Customer[]> = {
    daily: [
        { id: 1, name: "Ali Valiyev", location: "Toshkent", phone: "+998 90 123 45 67", profit: 1500, platform: "Telegram", image: "https://via.placeholder.com/40" },
        { id: 2, name: "Sara Ahmedova", location: "Samarqand", phone: "+998 91 234 56 78", profit: 1200, platform: "Web", image: "https://via.placeholder.com/40" },
        { id: 3, name: "John Smith", location: "Andijon", phone: "+998 93 345 67 89", profit: 900, platform: "Mobile App", image: "https://via.placeholder.com/40" },
        { id: 4, name: "Maria Ivanova", location: "Farg'ona", phone: "+998 94 456 78 90", profit: 750, platform: "Web", image: "https://via.placeholder.com/40" },
        { id: 5, name: "Husan Abdullayev", location: "Namangan", phone: "+998 95 567 89 01", profit: 600, platform: "Telegram", image: "https://via.placeholder.com/40" },
    ],
    weekly: [
        { id: 1, name: "Ali Valiyev", location: "Toshkent", phone: "+998 90 123 45 67", profit: 15000, platform: "Telegram", image: "https://via.placeholder.com/40" },
        { id: 2, name: "Sara Ahmedova", location: "Samarqand", phone: "+998 91 234 56 78", profit: 12000, platform: "Web", image: "https://via.placeholder.com/40" },
        { id: 3, name: "John Smith", location: "Andijon", phone: "+998 93 345 67 89", profit: 9000, platform: "Mobile App", image: "https://via.placeholder.com/40" },
        { id: 4, name: "Maria Ivanova", location: "Farg'ona", phone: "+998 94 456 78 90", profit: 7500, platform: "Web", image: "https://via.placeholder.com/40" },
        { id: 5, name: "Husan Abdullayev", location: "Namangan", phone: "+998 95 567 89 01", profit: 6000, platform: "Telegram", image: "https://via.placeholder.com/40" },
        { id: 6, name: "Aziza Karimova", location: "Buxoro", phone: "+998 96 678 90 12", profit: 5500, platform: "Mobile App", image: "https://via.placeholder.com/40" },
        { id: 7, name: "Bobur Toshmatov", location: "Qarshi", phone: "+998 97 789 01 23", profit: 4800, platform: "Web", image: "https://via.placeholder.com/40" },
        { id: 8, name: "Dilfuza Rahimova", location: "Termiz", phone: "+998 98 890 12 34", profit: 4200, platform: "Telegram", image: "https://via.placeholder.com/40" },
        { id: 9, name: "Eldor Umarov", location: "Urganch", phone: "+998 99 901 23 45", profit: 3800, platform: "Mobile App", image: "https://via.placeholder.com/40" },
        { id: 10, name: "Fotima Yusupova", location: "Nukus", phone: "+998 88 012 34 56", profit: 3200, platform: "Web", image: "https://via.placeholder.com/40" },
    ],
    monthly: [
        { id: 1, name: "Ali Valiyev", location: "Toshkent", phone: "+998 90 123 45 67", profit: 65000, platform: "Telegram", image: "https://via.placeholder.com/40" },
        { id: 2, name: "Sara Ahmedova", location: "Samarqand", phone: "+998 91 234 56 78", profit: 52000, platform: "Web", image: "https://via.placeholder.com/40" },
        { id: 3, name: "John Smith", location: "Andijon", phone: "+998 93 345 67 89", profit: 39000, platform: "Mobile App", image: "https://via.placeholder.com/40" },
        { id: 4, name: "Maria Ivanova", location: "Farg'ona", phone: "+998 94 456 78 90", profit: 32500, platform: "Web", image: "https://via.placeholder.com/40" },
        { id: 5, name: "Husan Abdullayev", location: "Namangan", phone: "+998 95 567 89 01", profit: 26000, platform: "Telegram", image: "https://via.placeholder.com/40" },
        { id: 6, name: "Aziza Karimova", location: "Buxoro", phone: "+998 96 678 90 12", profit: 23500, platform: "Mobile App", image: "https://via.placeholder.com/40" },
        { id: 7, name: "Bobur Toshmatov", location: "Qarshi", phone: "+998 97 789 01 23", profit: 20800, platform: "Web", image: "https://via.placeholder.com/40" },
        { id: 8, name: "Dilfuza Rahimova", location: "Termiz", phone: "+998 98 890 12 34", profit: 18200, platform: "Telegram", image: "https://via.placeholder.com/40" },
        { id: 9, name: "Eldor Umarov", location: "Urganch", phone: "+998 99 901 23 45", profit: 16800, platform: "Mobile App", image: "https://via.placeholder.com/40" },
        { id: 10, name: "Fotima Yusupova", location: "Nukus", phone: "+998 88 012 34 56", profit: 14200, platform: "Web", image: "https://via.placeholder.com/40" },
    ],
    yearly: [
        { id: 1, name: "Ali Valiyev", location: "Toshkent", phone: "+998 90 123 45 67", profit: 780000, platform: "Telegram", image: "https://via.placeholder.com/40" },
        { id: 2, name: "Sara Ahmedova", location: "Samarqand", phone: "+998 91 234 56 78", profit: 624000, platform: "Web", image: "https://via.placeholder.com/40" },
        { id: 3, name: "John Smith", location: "Andijon", phone: "+998 93 345 67 89", profit: 468000, platform: "Mobile App", image: "https://via.placeholder.com/40" },
        { id: 4, name: "Maria Ivanova", location: "Farg'ona", phone: "+998 94 456 78 90", profit: 390000, platform: "Web", image: "https://via.placeholder.com/40" },
        { id: 5, name: "Husan Abdullayev", location: "Namangan", phone: "+998 95 567 89 01", profit: 312000, platform: "Telegram", image: "https://via.placeholder.com/40" },
        { id: 6, name: "Aziza Karimova", location: "Buxoro", phone: "+998 96 678 90 12", profit: 282000, platform: "Mobile App", image: "https://via.placeholder.com/40" },
        { id: 7, name: "Bobur Toshmatov", location: "Qarshi", phone: "+998 97 789 01 23", profit: 249600, platform: "Web", image: "https://via.placeholder.com/40" },
        { id: 8, name: "Dilfuza Rahimova", location: "Termiz", phone: "+998 98 890 12 34", profit: 218400, platform: "Telegram", image: "https://via.placeholder.com/40" },
        { id: 9, name: "Eldor Umarov", location: "Urganch", phone: "+998 99 901 23 45", profit: 201600, platform: "Mobile App", image: "https://via.placeholder.com/40" },
        { id: 10, name: "Fotima Yusupova", location: "Nukus", phone: "+998 88 012 34 56", profit: 170400, platform: "Web", image: "https://via.placeholder.com/40" },
    ],
};

const TopCustomers = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("weekly");
    const [customers, setCustomers] = useState<Customer[]>(customersData[selectedPeriod]);
    const [platformFilter, setPlatformFilter] = useState<string>("all");
    const [locationFilter, setLocationFilter] = useState<string>("all");

    // Filter customers based on selected filters
    const filteredCustomers = customers.filter(customer => {
        const platformMatch = platformFilter === "all" || customer.platform === platformFilter;
        const locationMatch = locationFilter === "all" || customer.location === locationFilter;
        return platformMatch && locationMatch;
    });

    // Get unique locations and platforms for filters
    const uniqueLocations = [...new Set(customers.map(c => c.location))];
    const uniquePlatforms = [...new Set(customers.map(c => c.platform))];

    useEffect(() => {
        setCustomers(customersData[selectedPeriod]);
        setPlatformFilter("all");
        setLocationFilter("all");
    }, [selectedPeriod]);

    const handleDeleteCustomer = (customerId: number) => {
        setCustomers(prev => prev.filter(customer => customer.id !== customerId));
    };

    const getPlatformColor = (platform: string) => {
        switch (platform) {
            case "Telegram": return "bg-blue-100 text-blue-800";
            case "Web": return "bg-purple-100 text-purple-800";
            case "Mobile App": return "bg-green-100 text-green-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getPeriodText = () => {
        switch (selectedPeriod) {
            case "daily": return "Kunlik";
            case "weekly": return "Haftalik";
            case "monthly": return "Oylik";
            case "yearly": return "Yillik";
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Eng yaxshi mijozlar</h2>
                        <p className="text-sm text-gray-500">{getPeriodText()} daromad bo'yicha</p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Filters */}
                        <div className="flex gap-2">
                            <div className="relative">
                                <Select
                                    value={platformFilter}
                                    onValueChange={(value) => setPlatformFilter(value)}
                                >
                                    <SelectTrigger className="w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        {platformFilter === "all" ? "Barcha platformalar" : platformFilter}
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Barcha platformalar</SelectItem>
                                        {uniquePlatforms.map(platform => (
                                            <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {/* <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" /> */}
                            </div>

                            <div className="relative">
                                <Select
                                    value={locationFilter}
                                    onValueChange={(value) => setLocationFilter(value)}
                                >
                                    <SelectTrigger className="w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        {locationFilter === "all" ? "Barcha joylashuvlar" : locationFilter}
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Barcha joylashuvlar</SelectItem>
                                        {uniqueLocations.map(location => (
                                            <SelectItem key={location} value={location}>{location}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {/* <MapPin className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" /> */}
                            </div>
                        </div>

                        {/* Period Selector */}
                        <div className="relative">
                            <Select
                                value={selectedPeriod}
                                onValueChange={(value) => setSelectedPeriod(value as "daily" | "weekly" | "monthly" | "yearly")}
                                >
                                    <SelectTrigger className="w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        {getPeriodText()}
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">Kunlik</SelectItem>
                                        <SelectItem value="weekly">Haftalik</SelectItem>
                                        <SelectItem value="monthly">Oylik</SelectItem>    
                                        <SelectItem value="yearly">Yillik</SelectItem>
                                    </SelectContent>
                                </Select>
                            {/* <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" /> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Header - Hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide border-b border-gray-100">
                <div className="col-span-4">Mijoz</div>
                <div className="col-span-2">Joylashuv</div>
                <div className="col-span-2">Telefon</div>
                <div className="col-span-2">Daromad</div>
                <div className="col-span-1">Platforma</div>
                <div className="col-span-1">Amallar</div>
            </div>

            {/* Customers List */}
            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                {filteredCustomers.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <div className="text-gray-400 mb-2">
                            <TrendingUp className="w-12 h-12 mx-auto" />
                        </div>
                        <p className="text-gray-500">Hech qanday mijoz topilmadi</p>
                        <p className="text-sm text-gray-400">Filtrlarni o'zgartiring yoki boshqa davr tanlang</p>
                    </div>
                ) : (
                    filteredCustomers.map((customer, index) => (
                        <div key={customer.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                            {/* Mobile Layout */}
                            <div className="md:hidden space-y-3">
                                {/* Customer Info */}
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-semibold text-sm">
                                            {customer.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 truncate">{customer.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <MapPin className="w-4 h-4" />
                                            <span>{customer.location}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteCustomer(customer.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Additional Info */}
                                <div className="grid grid-cols-2 gap-4 ml-15">
                                    <div>
                                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                                            <Phone className="w-4 h-4" />
                                            <span>Telefon</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">{customer.phone}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                                            <TrendingUp className="w-4 h-4" />
                                            <span>Daromad</span>
                                        </div>
                                        <p className="text-sm font-semibold text-green-600">
                                            {customer.profit.toLocaleString()} UZS
                                        </p>
                                    </div>
                                </div>

                                {/* Platform */}
                                <div className="ml-15">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPlatformColor(customer.platform)}`}>
                                        {customer.platform}
                                    </span>
                                </div>
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                                {/* Customer */}
                                <div className="col-span-4 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-semibold text-xs">
                                            {customer.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900 truncate">{customer.name}</p>
                                        <p className="text-sm text-gray-500">#{index + 1} reyting</p>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="col-span-2">
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span>{customer.location}</span>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="col-span-2">
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span>{customer.phone}</span>
                                    </div>
                                </div>

                                {/* Profit */}
                                <div className="col-span-2">
                                    <p className="font-semibold text-green-600">
                                        {customer.profit.toLocaleString()} UZS
                                    </p>
                                </div>

                                {/* Platform */}
                                <div className="col-span-1">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(customer.platform)}`}>
                                        {customer.platform}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 flex justify-center">
                                    <button
                                        onClick={() => handleDeleteCustomer(customer.id)}
                                        className="p-2 text-red-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            {filteredCustomers.length > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Jami: {filteredCustomers.length} mijoz</span>
                        <span>
                            Umumiy daromad: {filteredCustomers.reduce((sum, customer) => sum + customer.profit, 0).toLocaleString()} UZS
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopCustomers;