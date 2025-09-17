// src/components/Stats/TotalSalesCard.tsx
import { TrendingUp } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { getOrderStats } from "@/services/SalesService";

type Period = "daily" | "weekly" | "monthly" | "yearly";

const TotalSalesCard = () => {
  const [period, setPeriod] = useState<Period>("daily");
  const [value, setValue] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getOrderStats();
        const periodData = data[period] || [];
        const firstItem = periodData[0] || { total_sales: 0 };
        setValue(firstItem.total_sales);
      } catch (err) {
        console.error("Total Sales fetch error:", err);
        setError("Statistikani yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [period]);

  if (loading) return <div>Yuklanmoqda...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white shadow-sm rounded-lg p-3 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Sales</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-base font-medium text-gray-900">
                ${value.toLocaleString()}
              </h3>
              <p className="text-xs font-medium text-green-600">+5%</p> {/* Dummy percent */}
            </div>
          </div>
        </div>
        <div className="w-20">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full h-8 text-xs bg-gray-50 border-none focus:ring-0">
              <SelectValue placeholder={period} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default TotalSalesCard;