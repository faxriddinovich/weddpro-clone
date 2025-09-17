import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Filter,
  Download,
  Calendar,
  X,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  Printer,
  Trash2,
  RefreshCw,
  Eye,
  MapPin,
  CreditCard,
  Package,
  Truck,
  Clock,
  User,
  Smartphone,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import { getOrders, deleteOrder, getCustomerName, getProductName, getPlatformName, Order } from "@/services/orderService";

const tabItems = [
  { key: "all", label: "Barchasi", count: 0 },
  { key: "new", label: "Yangi", count: 0 },
  { key: "processing", label: "Jarayonda", count: 0 },
  { key: "expired", label: "Muddati o'tgan", count: 0 },
  { key: "ready", label: "Tayyor", count: 0 },
  { key: "onway", label: "Yo'lda", count: 0 },
  { key: "history", label: "Buyurtmalar tarixi", count: 0 },
];

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState("all");
  const [selectedDelivery, setSelectedDelivery] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    staleTime: 5 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });

  // Enrichment ni soddalashtirish
  const enrichedOrders = useMemo(() => {
    return orders.map((order) => ({
      ...order,
      customer: order.mijoz, // Enrichment faqat kerak bo‘lsa backenddan so‘rash
      product: order.mahsulot,
      platform: order.platforma,
    }));
  }, [orders]);

  // Filtrlash logikasi
  const filteredData = useMemo(() => {
    let filtered = enrichedOrders;

    if (activeTab !== "all") {
      const statusMap = {
        new: "yangi",
        processing: "Jarayonda",
        expired: "bekor",
        ready: "yetkazilgan",
        onway: "yuborilgan",
        history: "bekor",
      };
      filtered = filtered.filter((order) => order.holat === statusMap[activeTab]);
    }

    if (searchText) {
      filtered = filtered.filter((order) =>
        order.id.toString().toLowerCase().includes(searchText.toLowerCase()) ||
        order.mijoz.toLowerCase().includes(searchText.toLowerCase()) ||
        order.holat.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => order.holat === selectedStatus);
    }

    if (selectedPayment !== "all") {
      filtered = filtered.filter((order) => order.tolov === selectedPayment);
    }

    if (selectedDelivery !== "all") {
      filtered = filtered.filter((order) => order.yetkazish === selectedDelivery);
    }

    if (dateFrom && dateTo) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.vaqt.split(",")[0]); // Sana faqat sana qismini oladi
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        return orderDate >= fromDate && orderDate <= toDate;
      });
    }

    return filtered;
  }, [enrichedOrders, activeTab, searchText, selectedStatus, selectedPayment, selectedDelivery, dateFrom, dateTo]);

  // Tab countlari
  const tabCounts = useMemo(() => {
    const counts = {};
    tabItems.forEach((tab) => {
      if (tab.key === "all") {
        counts[tab.key] = enrichedOrders.length;
      } else {
        const statusMap = {
          new: "yangi",
          processing: "Jarayonda",
          expired: "bekor",
          ready: "yetkazilgan",
          onway: "yuborilgan",
          history: "bekor",
        };
        counts[tab.key] = enrichedOrders.filter((order) => order.holat === statusMap[tab.key]).length;
      }
    });
    return counts;
  }, [enrichedOrders]);

  const updatedTabItems = tabItems.map((tab) => ({ ...tab, count: tabCounts[tab.key] }));

  const clearAllFilters = () => {
    setSearchText("");
    setSelectedStatus("all");
    setSelectedPayment("all");
    setSelectedDelivery("all");
    setDateFrom("");
    setDateTo("");
    setActiveTab("all");
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  const handleDeleteOrder = (id: number) => {
    if (window.confirm("Buyurtmani o'chirishni xohlaysizmi?")) {
      deleteMutation.mutate(id);
    }
  };

  const getProductImage = (productName: string = "") => {
    const parts = productName.split(" ");
    const key = parts.length > 1 ? parts[1] : parts[0];
    const images = {
      "Smartfon": "📱",
      "Naushnik": "🎧",
      "Planshet": "📱",
      "Smart": "⌚",
      "Laptop": "💻",
    };
    return images[key] || "📦";
  };

  const exportToCSV = () => {
    const headers = ["ID", "Mijoz", "Sana", "Narx", "To'lov", "Mahsulot", "Yetkazish", "Holat", "Platforma"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map((order) => [
        order.id,
        order.mijoz,
        order.vaqt,
        order.narx,
        order.tolov,
        order.mahsulot,
        order.yetkazish,
        order.holat,
        order.platforma,
      ].join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `buyurtmalar-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    setShowExportMenu(false);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData.map((order) => ({
      ID: order.id,
      Mijoz: order.mijoz,
      Sana: order.vaqt,
      Narx: order.narx,
      Tolov: order.tolov,
      Mahsulot: order.mahsulot,
      Yetkazish: order.yetkazish,
      Holat: order.holat,
      Platforma: order.platforma,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Buyurtmalar");
    XLSX.writeFile(wb, `buyurtmalar-${new Date().toISOString().split("T")[0]}.xlsx`);
    setShowExportMenu(false);
  };

  const printData = () => {
    window.print();
    setShowExportMenu(false);
  };

  const getStatusStyle = (status: string) => {
    const styles = {
      "yangi": "bg-blue-100 text-blue-800 border-blue-200",
      "Jarayonda": "bg-orange-100 text-orange-800 border-orange-200",
      "yetkazilgan": "bg-green-100 text-green-800 border-green-200",
      "bekor": "bg-red-100 text-red-800 border-red-200",
      "yuborilgan": "bg-purple-100 text-purple-800 border-purple-200",
    };
    return styles[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPaymentStyle = (payment: string) => {
    const styles = {
      "naqd": "bg-green-50 text-green-700 border-green-200",
      "karta": "bg-purple-50 text-purple-700 border-purple-200",
      "click": "bg-blue-50 text-blue-700 border-blue-200",
      "payme": "bg-cyan-50 text-cyan-700 border-cyan-200",
    };
    return styles[payment] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  if (isLoading) return <div className="text-center py-10">Yuklanmoqda...</div>;
  if (error) {
    const errorMessage = (error as any)?.message || "Noma'lum xatolik";
    return <div className="text-center py-10 text-red-600">Xatolik: {errorMessage}. Backend ulanishini tekshiring.</div>;
  }

  return (
    <div className="min-h-screen bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            📦 Buyurtmalar boshqaruvi
          </h1>
          <p className="text-gray-600">Buyurtmalarni kuzatib boring va boshqaring</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className="flex overflow-x-auto scrollbar-hide">
            {updatedTabItems.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${activeTab === tab.key
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <span>{tab.label}</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${activeTab === tab.key ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                  }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buyurtma ID, mijoz nomi yoki holat bo'yicha qidiring..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {searchText && (
                <button
                  onClick={() => setSearchText("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${showFilters
                  ? "bg-[#12dde5] text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filtrlar</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-2 px-4 py-3 bg-[#2b52f0] text-white rounded-xl hover:bg-[#0b00e1] transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span className="hidden sm:inline">Eksport</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showExportMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 min-w-48">
                    <button onClick={exportToCSV} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
                      <FileText className="w-4 h-4 text-green-500" />
                      CSV fayl
                    </button>
                    <button onClick={exportToExcel} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
                      <FileSpreadsheet className="w-4 h-4 text-blue-500" />
                      Excel fayl
                    </button>
                    <button onClick={printData} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
                      <Printer className="w-4 h-4 text-gray-500" />
                      Chop etish
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="border-t border-gray-200 pt-6 animate-in slide-in-from-top duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mb-4">
                <div className="w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Holat</label>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue placeholder="Barcha holatlar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Barcha holatlar</SelectItem>
                      <SelectItem value="yangi">Yangi</SelectItem>
                      <SelectItem value="Jarayonda">Jarayonda</SelectItem>
                      <SelectItem value="yuborilgan">Yuborilgan</SelectItem>
                      <SelectItem value="yetkazilgan">Yetkazilgan</SelectItem>
                      <SelectItem value="bekor">Bekor qilingan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">To'lov usuli</label>
                  <Select
                    value={selectedPayment}
                    onValueChange={setSelectedPayment}
                  >
                    <SelectTrigger className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue placeholder="Barcha to'lovlar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Barcha to'lovlar</SelectItem>
                      <SelectItem value="naqd">Naqd</SelectItem>
                      <SelectItem value="karta">Karta</SelectItem>
                      <SelectItem value="click">Click</SelectItem>
                      <SelectItem value="payme">Payme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yetkazib berish</label>
                  <Select
                    value={selectedDelivery}
                    onValueChange={setSelectedDelivery}
                  >
                    <SelectTrigger className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue placeholder="Barcha usullar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Barcha usullar</SelectItem>
                      <SelectItem value="kuryer">Kuryer</SelectItem>
                      <SelectItem value="dokondan">Do'kondan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sana oralig'i</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="flex-1 p-3 border border-gray-200 h-11 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="flex-1 p-3 border border-gray-200 h-11 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Filtrlarni tozalash
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Jami <span className="font-semibold text-gray-900">{filteredData.length}</span> ta buyurtma topildi</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredData.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-64 h-48 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-6xl">📦</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Hech qanday buyurtma topilmadi</h3>
              <p className="text-gray-500 mb-4">Qidiruv kriteriyangizni o'zgartiring yoki filtrlarni tozalang</p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                Filtrlarni tozalash
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Mijoz</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">To'lov</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Mahsulot</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Yetkazish</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Holat</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Platforma</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Narx</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Vaqt</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Harakat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.mijoz}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStyle(order.tolov)}`}>
                          {order.tolov}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.mahsulot}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.yetkazish}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(order.holat)}`}>
                          {order.holat}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.platforma}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{order.narx} UZS</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.vaqt}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="p-2 hover:bg-gray-100 rounded"
                          title="Ko'rish"
                        >
                          <Eye className="w-5 h-5 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-2 hover:bg-gray-100 rounded"
                          title="O'chirish"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                <Package className="w-6 h-6 text-blue-600" />
                Buyurtma tafsilotlari
              </DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedOrder.id}</h3>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {selectedOrder.vaqt}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900 mb-1">{selectedOrder.narx} UZS</div>
                      <span className={`inline-flex px-4 py-2 rounded-full text-sm font-medium border ${getStatusStyle(selectedOrder.holat)}`}>
                        {selectedOrder.holat}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border border-gray-200 rounded-xl p-6"
                  >
                    <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                      <User className="w-5 h-5 text-blue-600" />
                      Mijoz ma'lumotlari
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Ismi:</span>
                        <span className="font-medium text-gray-900">{selectedOrder.mijoz}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Platforma:</span>
                        <span className="font-medium text-gray-900 flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          {selectedOrder.platforma}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white border border-gray-200 rounded-xl p-6"
                  >
                    <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                      <Package className="w-5 h-5 text-green-600" />
                      Mahsulot ma'lumotlari
                    </h4>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">
                        {getProductImage(selectedOrder.mahsulot)}
                      </div>
                      <div>
                        <h5 className="text-xl font-bold text-gray-900">{selectedOrder.mahsulot}</h5>
                        <p className="text-gray-600">Buyurtma ID: {selectedOrder.id}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white border border-gray-200 rounded-xl p-6"
                  >
                    <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                      <CreditCard className="w-5 h-5 text-purple-600" />
                      To'lov ma'lumotlari
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">To'lov usuli:</span>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStyle(selectedOrder.tolov)}`}>
                          {selectedOrder.tolov}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Jami summa:</span>
                        <span className="font-bold text-xl text-gray-900">{selectedOrder.narx} UZS</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white border border-gray-200 rounded-xl p-6"
                  >
                    <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                      <Truck className="w-5 h-5 text-orange-600" />
                      Yetkazib berish
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Usul:</span>
                        <span className="font-medium text-gray-900">{selectedOrder.yetkazish}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Holat:</span>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(selectedOrder.holat)}`}>
                          {selectedOrder.holat}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-6"
                >
                  <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Buyurtma holati
                  </h4>
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-4 overflow-x-auto pb-2">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          ✓
                        </div>
                        <span className="text-sm text-gray-700">Qabul qilindi</span>
                      </div>
                      <div className="w-8 h-0.5 bg-gray-300"></div>
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${selectedOrder.holat === "Jarayonda" || selectedOrder.holat === "yuborilgan" || selectedOrder.holat === "yetkazilgan"
                          ? "bg-blue-500" : "bg-gray-300"
                          }`}>
                          {selectedOrder.holat === "Jarayonda" || selectedOrder.holat === "yuborilgan" || selectedOrder.holat === "yetkazilgan" ? "2" : "2"}
                        </div>
                        <span className="text-sm text-gray-700">Tayyorlanmoqda</span>
                      </div>
                      <div className="w-8 h-0.5 bg-gray-300"></div>
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${selectedOrder.holat === "yuborilgan" || selectedOrder.holat === "yetkazilgan" ? "bg-orange-500" : "bg-gray-300"
                          }`}>
                          {selectedOrder.holat === "yuborilgan" || selectedOrder.holat === "yetkazilgan" ? "🚚" : "3"}
                        </div>
                        <span className="text-sm text-gray-700">Yo'lda</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OrdersPage;