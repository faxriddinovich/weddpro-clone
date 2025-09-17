import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Eye, Edit2, Trash2, MapPin, Clock, Star, Phone, User, Calendar, MoreHorizontal, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Mock data
const mockCouriers = [
  {
    id: 1,
    fullName: "Abdullayev Sardor Olimjon o'g'li",
    phone: "+998901234567",
    status: "Online",
    lastActivity: "2 daqiqa oldin",
    totalOrders: 245,
    zone: "Tashkent shahar",
    rating: 4.8,
    averageDeliveryTime: "25 daq",
    avatar: null,
    joinedDate: "2023-05-15",
    completedToday: 8
  },
  {
    id: 2,
    fullName: "Karimov Javohir Shavkat o'g'li",
    phone: "+998907654321",
    status: "Offline",
    lastActivity: "1 soat oldin",
    totalOrders: 189,
    zone: "Yunusobod tumani",
    rating: 4.5,
    averageDeliveryTime: "30 daq",
    avatar: null,
    joinedDate: "2023-07-22",
    completedToday: 0
  },
  {
    id: 3,
    fullName: "Toshmatov Bekzod Rustam o'g'li",
    phone: "+998931112233",
    status: "Band",
    lastActivity: "Hozir",
    totalOrders: 312,
    zone: "Mirzo Ulug'bek tumani",
    rating: 4.9,
    averageDeliveryTime: "22 daq",
    avatar: null,
    joinedDate: "2023-03-10",
    completedToday: 12
  },
  {
    id: 4,
    fullName: "Ibragimov Aziz Nodir o'g'li",
    phone: "+998945556677",
    status: "Bo'sh",
    lastActivity: "5 daqiqa oldin",
    totalOrders: 156,
    zone: "Yashnobod tumani",
    rating: 4.3,
    averageDeliveryTime: "28 daq",
    avatar: null,
    joinedDate: "2023-09-05",
    completedToday: 5
  },
  {
    id: 5,
    fullName: "Narzullayev Otabek Aziz o'g'li",
    phone: "+998931234567",
    status: "Online",
    lastActivity: "1 daqiqa oldin",
    totalOrders: 298,
    zone: "Chilonzor tumani",
    rating: 4.7,
    averageDeliveryTime: "23 daq",
    avatar: null,
    joinedDate: "2023-04-12",
    completedToday: 15
  },
  {
    id: 6,
    fullName: "Rahimov Shohrux Davron o'g'li",
    phone: "+998987654321",
    status: "Band",
    lastActivity: "Hozir",
    totalOrders: 167,
    zone: "Sergeli tumani",
    rating: 4.4,
    averageDeliveryTime: "27 daq",
    avatar: null,
    joinedDate: "2023-08-20",
    completedToday: 6
  }
];

// Status badge komponenti
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Online':
        return { 
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-600/20', 
          dot: 'bg-emerald-500' 
        };
      case 'Offline':
        return { 
          color: 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-600/20', 
          dot: 'bg-rose-500' 
        };
      case 'Band':
        return { 
          color: 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-600/20', 
          dot: 'bg-amber-500' 
        };
      case "Bo'sh":
        return { 
          color: 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-600/20', 
          dot: 'bg-blue-500' 
        };
      default:
        return { 
          color: 'bg-gray-50 text-gray-700 border-gray-200 ring-1 ring-gray-600/20', 
          dot: 'bg-gray-500' 
        };
    }
  };

  const config = getStatusConfig(status);
  return (
    <Badge className={`${config.color} font-medium px-3 py-1.5 text-xs flex items-center gap-2`}>
      <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`}></span>
      {status}
    </Badge>
  );
};

// Star rating komponenti
const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />);
  }

  if (hasHalfStar) {
    stars.push(<Star key="half" className="h-4 w-4 fill-amber-400/50 text-amber-400" />);
  }

  const remainingStars = 5 - Math.ceil(rating);
  for (let i = 0; i < remainingStars; i++) {
    stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
  }

  return (
    <div className="flex items-center gap-1">
      {stars}
      <span className="text-sm text-gray-600 ml-1 font-medium">({rating})</span>
    </div>
  );
};

export default function Couriers() {
  const [couriers, setCouriers] = useState(mockCouriers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    zone: ''
  });

  // Filterlangan kuryer ma'lumotlari - faqat ism bo'yicha qidirish
  const filteredCouriers = couriers.filter(courier => {
    const matchesSearch = courier.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || courier.status === statusFilter;
    const matchesZone = zoneFilter === 'all' || courier.zone === zoneFilter;
    
    return matchesSearch && matchesStatus && matchesZone;
  });

  // Zonalarni olish
  const zones = [...new Set(couriers.map(courier => courier.zone))];

  // Form reset
  const resetForm = () => {
    setFormData({ fullName: '', phone: '', zone: '' });
  };

  // Kuryer qo'shish
  const handleAddCourier = () => {
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      alert("Ism va telefon raqami kiritilishi shart!");
      return;
    }

    const newCourier = {
      id: Math.max(...couriers.map(c => c.id)) + 1,
      fullName: formData.fullName,
      phone: formData.phone,
      status: "Offline",
      lastActivity: "Hozir qo'shildi",
      totalOrders: 0,
      zone: formData.zone || "Belgilanmagan",
      rating: 5.0,
      averageDeliveryTime: "0 daq",
      avatar: null,
      joinedDate: new Date().toISOString().split('T')[0],
      completedToday: 0
    };

    setCouriers([...couriers, newCourier]);
    resetForm();
    setIsAddSheetOpen(false);
  };

  // Kuryer ko'rish
  const handleViewCourier = (courier) => {
    setSelectedCourier(courier);
    setIsViewSheetOpen(true);
  };

  // Kuryer tahrirlash
  const handleEditCourier = (courier) => {
    setSelectedCourier(courier);
    setFormData({
      fullName: courier.fullName,
      phone: courier.phone,
      zone: courier.zone
    });
    setIsEditSheetOpen(true);
  };

  // Kuryer yangilash
  const handleUpdateCourier = () => {
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      alert("Ism va telefon raqami kiritilishi shart!");
      return;
    }

    const updatedCouriers = couriers.map(courier => 
      courier.id === selectedCourier.id 
        ? { ...courier, ...formData }
        : courier
    );

    setCouriers(updatedCouriers);
    resetForm();
    setIsEditSheetOpen(false);
  };

  // Kuryer o'chirish
  const handleDeleteCourier = (courierId) => {
    if (confirm("Kuryerni o'chirishga ishonchingiz komilmi?")) {
      setCouriers(couriers.filter(courier => courier.id !== courierId));
    }
  };

  return (
    <div className="min-h-screen bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Kuryer boshqaruvi
            </h1>
            <p className="text-gray-600 text-lg">Kuryer xodimlarini boshqaring va kuzating</p>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Kuryer ismini qidiring..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 sm:w-72 h-12 outline-none border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white shadow-sm"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 h-11 bg-white shadow-sm outline-none border-gray-200">
                <Filter className="h-5 w-5 mr-3 text-gray-500" />
                <SelectValue placeholder="Holat bo'yicha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha holatlar</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Offline">Offline</SelectItem>
                <SelectItem value="Band">Band</SelectItem>
                <SelectItem value="Bo'sh">Bo'sh</SelectItem>
              </SelectContent>
            </Select>

            <Select value={zoneFilter} onValueChange={setZoneFilter}>
              <SelectTrigger className="w-full sm:w-48 h-11 bg-white shadow-sm border-gray-200">
                <MapPin className="h-5 w-5 mr-3 text-gray-500" />
                <SelectValue placeholder="Hudud bo'yicha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha hududlar</SelectItem>
                {zones.map(zone => (
                  <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
              <SheetTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <Plus className="h-5 w-5 mr-2" />
                  Kuryer qo'shish
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle className="text-xl">Yangi kuryer qo'shish</SheetTitle>
                  <SheetDescription>
                    Kuryer ma'lumotlarini to'ldiring. Ism va telefon raqami majburiy.
                  </SheetDescription>
                </SheetHeader>
                
                <div className="grid gap-6 py-6">
                  <div className="grid gap-3">
                    <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
                      To'liq ismi *
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      placeholder="Familiya Ism Sharif"
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                      Telefon raqami *
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+998901234567"
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="zone" className="text-sm font-semibold text-gray-700">
                      Ish hududi
                    </Label>
                    <Input
                      id="zone"
                      value={formData.zone}
                      onChange={(e) => setFormData({...formData, zone: e.target.value})}
                      placeholder="Tuman yoki hudud nomi"
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <SheetFooter>
                  <Button 
                    variant="outline"
                    onClick={handleAddCourier} 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Kuryer qo'shish
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 ring-1 ring-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-emerald-600 mb-1">
                    {couriers.filter(c => c.status === 'Online').length}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Online</p>
                </div>
                <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 ring-1 ring-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {couriers.filter(c => c.status === "Bo'sh").length}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Bo'sh</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 ring-1 ring-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-amber-600 mb-1">
                    {couriers.filter(c => c.status === 'Band').length}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Band</p>
                </div>
                <div className="h-12 w-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Package className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 ring-1 ring-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-700 mb-1">
                    {couriers.length}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Jami kuryer</p>
                </div>
                <div className="h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card className="bg-white shadow-xl border-0 ring-1 ring-gray-200">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-xl font-bold text-gray-800">Kuryerlar ro'yxati</CardTitle>
            <CardDescription>
              Jami {filteredCouriers.length} ta kuryer topildi
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 border-gray-100 hover:bg-gray-50/70">
                    <TableHead className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide py-4 px-6">To'liq ism</TableHead>
                    <TableHead className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide py-4 px-6">Telefon raqam</TableHead>
                    <TableHead className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide py-4 px-6">Oxirgi faoliyat vaqti</TableHead>
                    <TableHead className="ftext-left text-xs font-semibold text-gray-600 uppercase tracking-wide py-4 px-6 text-center">Yetkazilgan buyurtmalar</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wide py-4 px-6 text-center">Holati</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wide py-4 px-6 text-center">Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCouriers.map((courier, index) => (
                    <TableRow 
                      key={courier.id}
                      className="hover:bg-gray-50/50 transition-all duration-200 border-gray-100"
                    >
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-gray-200">
                            <AvatarImage src={courier.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                              {courier.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-gray-900">{courier.fullName}</div>
                            <div className="text-sm text-gray-500">{courier.zone}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="font-mono text-gray-700 font-medium">
                          {courier.phone}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{courier.lastActivity}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold text-gray-700">{courier.totalOrders}</span>
                          <span className="text-sm text-gray-500">ta</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex justify-center">
                          <StatusBadge status={courier.status} />
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-gray-100">
                                <MoreHorizontal className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem 
                                onClick={() => handleViewCourier(courier)}
                                className="text-gray-700 focus:bg-blue-50 focus:text-blue-700"
                              >
                                <Eye className="mr-3 h-4 w-4" />
                                Ko'rish
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleEditCourier(courier)}
                                className="text-gray-700 focus:bg-blue-50 focus:text-blue-700"
                              >
                                <Edit2 className="mr-3 h-4 w-4" />
                                Tahrirlash
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteCourier(courier.id)}
                                className="text-red-600 focus:bg-red-50 focus:text-red-700"
                              >
                                <Trash2 className="mr-3 h-4 w-4" />
                                O'chirish
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredCouriers.length === 0 && (
              <div className="text-center py-16">
                <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Kuryer topilmadi</h3>
                <p className="text-gray-500 mb-6">Qidiruv so'zini o'zgartiring yoki filterlarni qaytadan sozlang.</p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setZoneFilter('all');
                  }}
                  variant="outline"
                  className="h-10 px-6"
                >
                  Filterlarni tozalash
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Courier Sheet */}
        <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-xl">Kuryer ma'lumotlari</SheetTitle>
              <SheetDescription>
                {selectedCourier?.fullName}ning batafsil ma'lumotlari
              </SheetDescription>
            </SheetHeader>
            
            {selectedCourier && (
              <div className="grid gap-8 py-6">
                {/* Profile */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20 ring-2 ring-gray-200">
                    <AvatarImage src={selectedCourier.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                      {selectedCourier.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-gray-900">{selectedCourier.fullName}</h3>
                    <StatusBadge status={selectedCourier.status} />
                  </div>
                </div>

                <Separator />

                {/* Contact Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center text-gray-800">
                    <Phone className="h-5 w-5 mr-3 text-gray-600" />
                    Aloqa ma'lumotlari
                  </h4>
                  <div className="pl-8 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Telefon:</span>
                      <span className="font-mono font-semibold text-gray-900">{selectedCourier.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hudud:</span>
                      <span className="font-semibold text-gray-900">{selectedCourier.zone}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Statistics */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center text-gray-800">
                    <Calendar className="h-5 w-5 mr-3 text-gray-600" />
                    Statistika
                  </h4>
                  <div className="pl-8 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jami buyurtmalar:</span>
                      <span className="font-bold text-gray-900">{selectedCourier.totalOrders} ta</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bugun bajarilgan:</span>
                      <span className="font-bold text-emerald-600">{selectedCourier.completedToday} ta</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">O'rtacha yetkazish vaqti:</span>
                      <span className="font-semibold text-gray-900">{selectedCourier.averageDeliveryTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Reyting:</span>
                      <StarRating rating={selectedCourier.rating} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ishga qabul qilingan:</span>
                      <span className="font-semibold text-gray-900">{new Date(selectedCourier.joinedDate).toLocaleDateString('uz-UZ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Oxirgi faoliyat:</span>
                      <span className="font-semibold text-gray-900">{selectedCourier.lastActivity}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Edit Courier Sheet */}
        <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="text-xl">Kuryer ma'lumotlarini tahrirlash</SheetTitle>
              <SheetDescription>
                {selectedCourier?.fullName}ning ma'lumotlarini yangilang
              </SheetDescription>
            </SheetHeader>
            
            <div className="grid gap-6 py-6">
              <div className="grid gap-3">
                <Label htmlFor="editFullName" className="text-sm font-semibold text-gray-700">
                  To'liq ismi *
                </Label>
                <Input
                  id="editFullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  placeholder="Familiya Ism Sharif"
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="editPhone" className="text-sm font-semibold text-gray-700">
                  Telefon raqami *
                </Label>
                <Input
                  id="editPhone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+998901234567"
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="editZone" className="text-sm font-semibold text-gray-700">
                  Ish hududi
                </Label>
                <Input
                  id="editZone"
                  value={formData.zone}
                  onChange={(e) => setFormData({...formData, zone: e.target.value})}
                  placeholder="Tuman yoki hudud nomi"
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <SheetFooter>
              <Button 
                onClick={handleUpdateCourier} 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-semibold"
              >
                Ma'lumotlarni yangilash
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}