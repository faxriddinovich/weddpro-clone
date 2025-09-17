import React, { useState, useMemo } from 'react';
import { Search, Edit2, Trash2, Plus, Package, Grid, Calendar, ToggleLeft, ToggleRight, Filter, SortAsc, Eye, MoreVertical, Download, Upload, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { Button } from '@/components/ui/button';

const CategoryList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name'); // name, date, products, status
    const [sortOrder, setSortOrder] = useState('asc');
    const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive
    const [viewMode, setViewMode] = useState('grid'); // grid, list
    const [selectedCategories, setSelectedCategories] = useState([]);
    const navigate = useNavigate();

    // Statik ma'lumotlar - kelajakda backend API dan keladi
    const [categories, setCategories] = useState([
        {
            id: 1,
            name: "Elektronika",
            icon: "📱",
            productsCount: 248,
            createdDate: "2024-01-15",
            isActive: true,
            color: "#3B82F6"
        },
        {
            id: 2,
            name: "Kiyim",
            icon: "👕",
            productsCount: 156,
            createdDate: "2024-02-03",
            isActive: true,
            color: "#10B981"
        },
        {
            id: 3,
            name: "Kitoblar",
            icon: "📚",
            productsCount: 89,
            createdDate: "2024-01-28",
            isActive: false,
            color: "#F59E0B"
        },
        {
            id: 4,
            name: "Sport va Faollik",
            icon: "⚽",
            productsCount: 127,
            createdDate: "2024-02-10",
            isActive: true,
            color: "#EF4444"
        },
        {
            id: 5,
            name: "Uy va Bog'",
            icon: "🏠",
            productsCount: 203,
            createdDate: "2024-01-20",
            isActive: true,
            color: "#8B5CF6"
        },
        {
            id: 6,
            name: "Salomatlik",
            icon: "💊",
            productsCount: 45,
            createdDate: "2024-02-15",
            isActive: false,
            color: "#06B6D4"
        }
    ]);

    // Qidiruv, filtrlash va saralash
    const filteredCategories = useMemo(() => {
        let filtered = categories.filter(category => {
            const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'all' ||
                (filterStatus === 'active' && category.isActive) ||
                (filterStatus === 'inactive' && !category.isActive);
            return matchesSearch && matchesStatus;
        });

        // Saralash
        filtered.sort((a, b) => {
            let aValue, bValue;
            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'date':
                    aValue = new Date(a.createdDate);
                    bValue = new Date(b.createdDate);
                    break;
                case 'products':
                    aValue = a.productsCount;
                    bValue = b.productsCount;
                    break;
                case 'status':
                    aValue = a.isActive ? 1 : 0;
                    bValue = b.isActive ? 1 : 0;
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [categories, searchTerm, sortBy, sortOrder, filterStatus]);

    // Tanlov funksiyalari
    const toggleSelectCategory = (id) => {
        setSelectedCategories(prev =>
            prev.includes(id)
                ? prev.filter(catId => catId !== id)
                : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedCategories.length === filteredCategories.length) {
            setSelectedCategories([]);
        } else {
            setSelectedCategories(filteredCategories.map(cat => cat.id));
        }
    };

    // Kategoriyani qo'shish
    const handleAddCategory = () => {
        // Kelajakda API chaqiruv
        navigate('/dashboard/products/categories/add-product'); // Yangi kategoriya qo'shish sahifasiga o'tish
    };

    // Bulk actions
    const handleBulkDelete = () => {
        console.log('Bulk delete:', selectedCategories);
        // Kelajakda API chaqiruv
    };

    const handleBulkStatusChange = (status) => {
        console.log('Bulk status change:', selectedCategories, status);
        // Kelajakda API chaqiruv
    };

    // Export/Import
    const handleExport = () => {
        const dataStr = JSON.stringify(categories, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'categories.json';
        link.click();
    };
    const toggleStatus = (id) => {
        setCategories(prev => prev.map(cat =>
            cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
        ));
    };

    // Sana formatlash funksiyasi
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Edit funksiyasi (hozircha console.log)
    const handleEdit = (category) => {
        console.log('Tahrirlash:', category);
        // Kelajakda modal yoki sahifa ochish uchun
        navigate(`/dashboard/products/categories/edit-product/${category.id}`);
    };

    // Delete funksiyasi (hozircha console.log)
    const handleDelete = (category) => {
        console.log('O\'chirish:', category);
        // Kelajakda tasdiqlash modal va API chaqiruv
    };

    return (
        <div className="min-h-screen bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Grid className="text-blue-600" size={32} />
                            Kategoriyalar
                            {selectedCategories.length > 0 && (
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {selectedCategories.length} tanlandi
                                </span>
                            )}
                        </h1>
                        <p className="text-gray-600 mt-2">Mahsulot kategoriyalarini boshqaring</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={handleExport}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <Download size={18} />
                            Export
                        </Button>
                        <Button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            <Upload size={18} />
                            Import
                        </Button>
                        <Button
                            onClick={handleAddCategory}
                            className="flex gap-2 items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            <Plus size={20} />
                            Yangi Kategoriya
                        </Button>
                    </div>
                </div>
            </div>

            {/* Qidiruv va Filtrlar */}
            <div className="mb-8 space-y-4">
                {/* Qidiruv va view mode */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Kategoriya qidirish..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white shadow-sm"
                        />
                    </div>

                    <div className="flex gap-3">
                        {/* View mode toggle */}
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                                    }`}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                                    }`}
                            >
                                <Package size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filtr va saralash */}
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-500" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="all">Barcha holat</option>
                            <option value="active">Aktiv</option>
                            <option value="inactive">Noaktiv</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <SortAsc size={18} className="text-gray-500" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="name">Nom bo'yicha</option>
                            <option value="date">Sana bo'yicha</option>
                            <option value="products">Mahsulot soni</option>
                            <option value="status">Holat bo'yicha</option>
                        </select>
                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                            title={sortOrder === 'asc' ? 'O\'sish tartibida' : 'Kamayish tartibida'}
                        >
                            <SortAsc size={16} className={`transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {/* Bulk actions */}
                    {selectedCategories.length > 0 && (
                        <div className="flex items-center gap-2 ml-auto">
                            <button
                                onClick={() => handleBulkStatusChange(true)}
                                className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all text-sm"
                            >
                                Aktivlashtirish
                            </button>
                            <button
                                onClick={() => handleBulkStatusChange(false)}
                                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm"
                            >
                                O'chirish
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all text-sm"
                            >
                                O'chirish
                            </button>
                        </div>
                    )}
                </div>

                {/* Select all */}
                {filteredCategories.length > 0 && (
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="selectAll"
                            checked={selectedCategories.length === filteredCategories.length}
                            onChange={toggleSelectAll}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="selectAll" className="text-sm text-gray-600">
                            Barchasini tanlash ({filteredCategories.length})
                        </label>
                    </div>
                )}
            </div>

            {/* Statistika kartochalari */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Grid className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{categories.length}</h3>
                            <p className="text-gray-600">Jami kategoriya</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <ToggleRight className="text-green-600" size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{categories.filter(cat => cat.isActive).length}</h3>
                            <p className="text-gray-600">Aktiv</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-3 rounded-lg">
                            <ToggleLeft className="text-gray-600" size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{categories.filter(cat => !cat.isActive).length}</h3>
                            <p className="text-gray-600">Noaktiv</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <Package className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{categories.reduce((sum, cat) => sum + cat.productsCount, 0)}</h3>
                            <p className="text-gray-600">Jami mahsulot</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Kategoriyalar */}
            <div className={viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }>
                {filteredCategories.map((category) => (
                    <div
                        key={category.id}
                        className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group overflow-hidden ${selectedCategories.includes(category.id) ? 'ring-2 ring-blue-500' : ''
                            } ${viewMode === 'list' ? 'flex items-center p-4' : ''}`}
                    >
                        {viewMode === 'grid' ? (
                            // Grid view
                            <>
                                {/* Kategoriya rangi va checkbox */}
                                <div className="relative">
                                    <div className="h-1" style={{ backgroundColor: category.color }}></div>
                                    <div className="absolute top-3 left-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category.id)}
                                            onChange={() => toggleSelectCategory(category.id)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="p-6 pt-8">
                                    {/* Icon va Status */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm"
                                                style={{ backgroundColor: `${category.color}15`, border: `2px solid ${category.color}30` }}
                                            >
                                                {category.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {category.name}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${category.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {category.isActive ? 'Aktiv' : 'Noaktiv'}
                                        </span>
                                    </div>

                                    {/* Ma'lumotlar */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 flex items-center gap-2">
                                                <Package size={16} />
                                                Mahsulotlar
                                            </span>
                                            <span className="font-semibold text-gray-900">{category.productsCount}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 flex items-center gap-2">
                                                <Calendar size={16} />
                                                Yaratildi
                                            </span>
                                            <span className="text-sm text-gray-700">{formatDate(category.createdDate)}</span>
                                        </div>
                                    </div>

                                    {/* Holat o'zgartirish */}
                                    <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-700">Holat</span>
                                        <button
                                            onClick={() => toggleStatus(category.id)}
                                            className="flex items-center gap-2 focus:outline-none"
                                        >
                                            {category.isActive ? (
                                                <ToggleRight className="text-green-600 hover:text-green-700 transition-colors" size={24} />
                                            ) : (
                                                <ToggleLeft className="text-gray-400 hover:text-gray-500 transition-colors" size={24} />
                                            )}
                                        </button>
                                    </div>

                                    {/* Action tugmalari */}
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1 border border-blue-200 hover:border-blue-300"
                                        >
                                            <Edit2 size={16} />
                                            Tahrirlash
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category)}
                                            className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-2 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1 border border-red-200 hover:border-red-300"
                                        >
                                            <Trash2 size={16} />
                                            O'chirish
                                        </button>
                                    </div>
                                </div>

                                {/* Kelajakda subkategoriyalar uchun joy */}
                                <div className="border-t border-gray-100 px-6 py-3 bg-gray-50">
                                    <p className="text-xs text-gray-500 text-center">
                                        Subkategoriyalar tez orada...
                                    </p>
                                </div>
                            </>
                        ) : (
                            // List view
                            <>
                                <div className="flex items-center gap-4 flex-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category.id)}
                                        onChange={() => toggleSelectCategory(category.id)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm"
                                        style={{ backgroundColor: `${category.color}15`, border: `2px solid ${category.color}30` }}
                                    >
                                        {category.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">{formatDate(category.createdDate)}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-gray-900">{category.productsCount}</p>
                                        <p className="text-xs text-gray-600">Mahsulot</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${category.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {category.isActive ? 'Aktiv' : 'Noaktiv'}
                                    </span>
                                    <button
                                        onClick={() => toggleStatus(category.id)}
                                        className="flex items-center gap-2 focus:outline-none"
                                    >
                                        {category.isActive ? (
                                            <ToggleRight className="text-green-600 hover:text-green-700 transition-colors" size={24} />
                                        ) : (
                                            <ToggleLeft className="text-gray-400 hover:text-gray-500 transition-colors" size={24} />
                                        )}
                                    </button>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all duration-200"
                                            title="Tahrirlash"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category)}
                                            className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-all duration-200"
                                            title="O'chirish"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Hech narsa topilmadi */}
            {filteredCategories.length === 0 && (
                <div className="text-center py-16">
                    <div className="text-gray-400 mb-4">
                        <Search size={64} className="mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Hech narsa topilmadi</h3>
                    <p className="text-gray-500">Qidiruv so'zingizni o'zgartiring yoki yangi kategoriya qo'shing</p>
                </div>
            )}
        </div>
    );
};

export default CategoryList;