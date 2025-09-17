// src/components/TrafficSourceCard.tsx
import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getOrderStats } from "@/services/dashboard/SalesService";

type Period = "daily" | "weekly" | "monthly" | "yearly";

const TrafficSourceCard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("weekly");
  const [data, setData] = useState<{
    total: number;
    unit: string;
    categories: { name: string; value: number; color: string }[];
  }>({
    total: 0,
    unit: "Units",
    categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const stats = await getOrderStats();
        const periodData = stats[selectedPeriod] || [];
        const firstItem = periodData[0] || { total_sales: 0, category_breakdown: [] };
        setData({
          total: firstItem.total_sales,
          unit: "Units",
          categories: firstItem.category_breakdown || [],
        });
      } catch (err) {
        console.error("Traffic stats fetch error:", err);
        setError("Statistikani yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [selectedPeriod]);

  if (loading) return <div>Yuklanmoqda...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 w-full h-[410px]">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Buyurtmalar statistikasi</h3>
          <p className="text-xs sm:text-sm text-gray-500">Mahsulotlar sotuv kategoriyangiz</p>
        </div>
        <div className="relative">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[120px] h-8 text-sm bg-gray-50 border border-gray-200 text-gray-700">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200">
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="relative w-full h-44 sm:h-46 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.categories}
              cx="50%"
              cy="85%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              cornerRadius={5}
              dataKey="value"
              stroke="white"
              strokeWidth={2}
            >
              {data.categories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-[65%] sm:top-[75%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-xs text-gray-500 mb-1">Total Sales</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{data.total.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{data.unit}</p>
        </div>
      </div>
      <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
        {data.categories.map((cat, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              ></div>
              <span className="text-xs sm:text-sm text-gray-700">{cat.name}</span>
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-900">
              {cat.value.toLocaleString()} {data.unit.replace(/s$/i, '')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrafficSourceCard;