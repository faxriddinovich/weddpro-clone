  import { useEffect, useState } from "react";
  import { Input } from "@/components/ui/input";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { Edit2, Plus } from "lucide-react";
  import { cn } from "@/lib/utils";
  import { Switch } from "@radix-ui/react-switch";
  import { Button } from "@/components/ui/button";
  import { useNavigate } from "react-router-dom";
  import { DeleteOutlined } from "@ant-design/icons";

  import { getProducts, deleteProduct, type Product } from "@/services/productService";

  export default function ProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [productStatuses, setProductStatuses] = useState<{ [key: number]: boolean }>({});

    // ✅ API dan mahsulotlarni olish
    useEffect(() => {
      getProducts()
        .then((data) => {
          console.log("API dan kelgan data:", data);
          setProducts(data);

          // statusni tayyorlash
          const statuses = data.reduce((acc, product) => {
            console.log("Status nima keldi?", product.status);
            acc[product.id] = product.status === "active";
            return acc;
          }, {} as { [key: number]: boolean });
          console.log("Statuslar:", statuses);
          setProductStatuses(statuses);
        })
        .catch((err) => console.error("Mahsulotlarni olishda xatolik:", err))
        .finally(() => setLoading(false));
    }, []);

    // ✅ Statusni almashtirish (faqat frontend tarafida)
    const handleToggleStatus = (id: number) => {
      setProductStatuses((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    };

    // ✅ Mahsulotni o‘chirish
    const handleDelete = async (id: number) => {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
      } catch (err) {
        console.error("O‘chirishda xatolik:", err);
      }
    };

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <p className="p-6">Yuklanmoqda...</p>;

    return (
      <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-200 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 rounded-2xl bg-white shadow-sm p-4 sm:p-6 gap-4">
          <div className="flex flex-col w-full sm:w-auto gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Mahsulotlar</h2>
            <Input
              type="text"
              placeholder="Search by product name..."
              className="w-full sm:w-80 text-sm sm:text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="w-full sm:w-auto mt-2 sm:mt-0 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            onClick={() => navigate("/dashboard/products/list/add_product")}
          >
            <Plus className="w-4 h-4" />
            Mahsulot qo'shish
          </Button>
        </div>

        {/* Categories */}
        <div className="hidden lg:flex justify-between items-center mb-4 bg-gray-100 p-4 rounded-lg shadow-sm">
          <h3 className="w-1/4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Mahsulot nomi</h3>
          <h3 className="w-1/6 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">Narx</h3>
          <h3 className="w-1/6 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">Kategoriya</h3>
          <h3 className="w-1/4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">Holat</h3>
          <h3 className="w-1/6 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">Vaqt</h3>
          <h3 className="w-1/6 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Amallar</h3>
        </div>

        {/* Product Cards */}
        <div className="space-y-4">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
            >
              {/* Product Image and Name */}
              <div className="flex items-center gap-3 w-full lg:w-1/4">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage src={product.image} alt={product.name} />
                  <AvatarFallback>{product.name[0]}</AvatarFallback>
                </Avatar>
                <p className="font-medium text-gray-900 truncate text-sm sm:text-base">{product.name}</p>
              </div>

              {/* Price */}
              <div className="w-full lg:w-1/6 text-left lg:text-center">
                <p className="text-sm font-medium text-gray-900">{product.price}</p>
              </div>

              {/* Category */}
              <div className="w-full lg:w-1/6 text-left lg:text-center">
                <p className="text-sm text-gray-700">{product.category}</p>
              </div>

              {/* Status */}
              <div className="w-full lg:w-1/4 flex items-center justify-start lg:justify-center gap-2">
                <Switch
                  checked={productStatuses[product.id]}
                  onCheckedChange={() => handleToggleStatus(product.id)}
                  className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    productStatuses[product.id] ? "text-green-600" : "text-gray-500"
                  )}
                >
                  {productStatuses[product.id] ? "Faol" : "Faol emas"}
                </span>
              </div>

              {/* Date */}
              {/* <div className="w-full lg:w-1/6 text-left lg:text-center">
                <p className="text-sm text-gray-700">{product.date}</p>
              </div> */}

              {/* Actions */}
              <div className="w-full lg:w-1/6 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  className="p-0 w-6 h-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard/products/list/edit/${product.id}`);
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  className="p-0 w-6 h-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(product.id);
                  }}
                >
                  <DeleteOutlined className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
