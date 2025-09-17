import { TrendingUp, ShoppingCart, Users } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { getDashboardStats } from "@/services/dashboard/DashboardService";

type Period = "daily" | "weekly" | "monthly";

const StatsCards = () => {
  const [stats, setStats] = useState<{
    total_sales: number;
    total_orders: number;
    total_customers: number;
    daily_sales: number;
    weekly_sales: number;
    monthly_sales: number;
  } | null>(null);
  const [periods, setPeriods] = useState<Record<number, Period>>({
    0: "daily",
    1: "daily",
    2: "daily",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Dashboard stats fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleChange = (index: number, value: Period) => {
    setPeriods({ ...periods, [index]: value });
  };

  if (loading) return <div>Yuklanmoqda...</div>;
  if (!stats) return <div>Xatolik yuz berdi</div>;

  const statData = [
    {
      title: "Total Sales",
      icon: TrendingUp,
      value: stats.total_sales || 0,
      periodValue: stats[`${periods[0]}_sales`] || 0,
      percent: 5, // Dummy
    },
    {
      title: "Total Orders",
      icon: ShoppingCart,
      value: stats.total_orders || 0,
      periodValue: stats.total_orders || 0, // Umumiy qiymat
      percent: 2, // Dummy
    },
    {
      title: "Customers",
      icon: Users,
      value: stats.total_customers || 0,
      periodValue: stats.total_customers || 0, // Umumiy qiymat
      percent: -1, // Dummy
    },
  ].map((stat, index) => ({
    ...stat,
    selectedPeriod: periods[index],
    isPositive: stat.percent >= 0,
  }));

  return (
    <div className="max-w-screen-xl mx-auto py-4">
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4">
        {statData.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-3 flex flex-col gap-3"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <stat.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <div className="flex items-baseline gap-1">
                    <h3 className="text-base font-medium text-gray-900">
                      ${stat.periodValue.toLocaleString()}
                    </h3>
                    <p
                      className={`text-xs font-medium ${stat.isPositive ? "text-green-600" : "text-red-600"}`}
                    >
                      {stat.isPositive ? "+" : ""}
                      {stat.percent}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-20">
                <Select
                  value={stat.selectedPeriod}
                  onValueChange={(val) => handleChange(index, val as Period)}
                >
                  <SelectTrigger className="w-full h-8 text-xs bg-gray-50 border-none focus:ring-0">
                    <SelectValue placeholder={stat.selectedPeriod} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCards;