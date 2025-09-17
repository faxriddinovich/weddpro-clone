import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Package, Apple, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Product {
    id: string;
    image: string;
    name: string;
    price: string;
    ikpu: string;
    qadoqlashKodi: string;
    birlikKodi: string;
    category: 'food' | 'electronics' | 'other';
    status?: 'Faol' | 'Faol emas';
}

const mockProducts: Product[] = [
    {
        id: '1',
        name: "Bug'doy uni Makfa, oliy nav, 1 kg",
        price: '10,000 UZS',
        ikpu: '01902001005000000',
        qadoqlashKodi: '',
        birlikKodi: '',
        image: '🌾',
        category: 'food',
        status: 'Faol emas'
    },
    {
        id: '2',
        name: 'Smartfon Apple iPhone 14 Pro Max',
        price: '25,000,000 UZS',
        ikpu: '08518003003000000',
        qadoqlashKodi: '',
        birlikKodi: '',
        image: '📱',
        category: 'electronics',
        status: 'Faol'
    },
    {
        id: '3',
        name: 'Smartfon Samsung Galaxy S24 Ultra',
        price: '22,000,000 UZS',
        ikpu: 'Qidirish',
        qadoqlashKodi: '',
        birlikKodi: '',
        image: '📱',
        category: 'electronics',
        status: 'Faol emas'
    }
];

const Ikpu: React.FC = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<{ qadoqlashKodi: string; birlikKodi: string }>({
        qadoqlashKodi: '',
        birlikKodi: ''
    });

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.ikpu.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddProduct = () => {
        navigate('/dashboard/products/ikpu/add_ikpu'); // AddIkpu.tsx sahifasiga o'tish
    };

    const handleEdit = (product: Product) => {
        setEditingId(product.id);
        setEditValues({
            qadoqlashKodi: product.qadoqlashKodi,
            birlikKodi: product.birlikKodi
        });
    };

    const handleSave = (productId: string) => {
        setProducts(prev => prev.map(product =>
            product.id === productId
                ? { ...product, ...editValues }
                : product
        ));
        setEditingId(null);
        setEditValues({ qadoqlashKodi: '', birlikKodi: '' });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditValues({ qadoqlashKodi: '', birlikKodi: '' });
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'food':
                return <Package className="w-8 h-8 text-green-600" />;
            case 'electronics':
                return <Smartphone className="w-8 h-8 text-blue-600" />;
            default:
                return <Package className="w-8 h-8 text-gray-600" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8"
        >
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-2">
                            IKPU <span className="text-blue-600 font-normal">{products.length} Mahsulot</span>
                        </h1>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleAddProduct}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <Plus className="w-5 h-5" />
                        Mahsulot qo'shish
                    </Button>
                </div>

                {/* Search */}
                <div className="relative mt-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Mahsulot nomi bo'yicha qidirish"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="hidden lg:grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b border-gray-200">
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Mahsulot nomi</div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">Narxi</div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">IKPU</div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">Qadoqlash kodi</div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">Birlik kodi</div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide text-right">Holat</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col lg:grid lg:grid-cols-6 gap-4 p-4 hover:bg-gray-50 transition-colors items-center"
                        >
                            {/* Product Name */}
                            <div className="flex items-center gap-3 w-full">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                                    {product.image}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-center w-full">
                                <p className="font-medium text-gray-900">{product.price}</p>
                            </div>

                            {/* IKPU */}
                            <div className="flex items-center justify-center w-full">
                                <Input
                                    type="text"
                                    className="max-w-[150px] text-center"
                                    defaultValue={product.ikpu}
                                />
                            </div>

                            {/* Qadoqlash Kodi */}
                            <div className="flex items-center justify-center w-full">
                                <Input
                                    type="text"
                                    className="max-w-[150px] text-center"
                                />
                            </div>

                            {/* Birlik Kodi */}
                            <div className="flex items-center justify-center w-full">
                                <Input
                                    type="text"
                                    className="max-w-[150px] text-center"
                                />
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-end w-full">
                                <Badge
                                    variant="outline"
                                    className={`text-sm px-3 py-1 rounded-full font-medium 
                                                 ${product.status === 'Faol' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}
                                             `}
                                >
                                    {product.status}
                                </Badge>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Mahsulot topilmadi</h3>
                        <p className="text-gray-500 mb-4">Qidiruv so'rovingizga mos mahsulot mavjud emas</p>
                        <button
                            onClick={handleAddProduct}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Birinchi mahsulotni qo'shing
                        </button>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{products.length}</div>
                        <div className="text-sm text-gray-500">Jami mahsulotlar</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {products.filter(p => p.ikpu !== 'Qidirish').length}
                        </div>
                        <div className="text-sm text-gray-500">IKPU bilan</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                            {products.filter(p => p.ikpu === 'Qidirish').length}
                        </div>
                        <div className="text-sm text-gray-500">IKPU kerak</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Ikpu;