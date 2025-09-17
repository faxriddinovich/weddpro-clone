import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { getCustomerSource } from "@/services/dashboard/CustomerService";

interface Stat {
  name: string;
  amount: number;
  shortName: string;
  color: string;
}

const OrderStats = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [period, setPeriod] = useState("weekly");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await getCustomerSource();
        setStats(data[period] || []);
      } catch (err) {
        console.error("Customer source fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [period]);

  if (loading) return <div>Yuklanmoqda...</div>;

  // Filter out zero values for the pie chart
  const chartData = stats.filter(stat => stat.amount > 0);
  const totalAmount = chartData.reduce((sum, stat) => sum + stat.amount, 0);

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const CustomLabel = ({ cx, cy }: { cx: number; cy: number }) => (
    <text
      x={cx}
      y={cy - 5}
      textAnchor="middle"
      dominantBaseline="middle"
      className="fill-gray-800 text-xl font-bold"
    >
      {formatAmount(totalAmount)}
    </text>
  );

  const CustomSubLabel = ({ cx, cy }: { cx: number; cy: number }) => (
    <text
      x={cx}
      y={cy + 12}
      textAnchor="middle"
      dominantBaseline="middle"
      className="fill-gray-500 text-xs"
    >
      Total Amount
    </text>
  );

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-lg mx-auto h-[420px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Trafik manbai</h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[120px] h-8 text-sm bg-gray-50 border border-gray-200 text-gray-700">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200">
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {open ? (
        <div className="relative">
          <motion.div
            className="relative w-full h-48"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="75%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="amount"
                  startAngle={180}
                  cornerRadius={8}
                  endAngle={0}
                  strokeWidth={1}
                  stroke="#ffffff"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="58%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-gray-800 text-2xl font-bold"
                  fontSize="24"
                >
                  {formatAmount(totalAmount)}
                </text>
                <text
                  x="50%"
                  y="68%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-gray-500 text-sm mt-1"
                  fontSize="12"
                >
                  Total Amount
                </text>
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="flex flex-col gap-2 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.shortName}
                className="flex items-center justify-between group cursor-pointer py-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full transition-transform group-hover:scale-110"
                    style={{ backgroundColor: stat.color }}
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                    {stat.shortName}
                  </span>
                  <div className="flex-1 border-b border-dotted border-gray-300 mx-2"></div>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {formatAmount(stat.amount)}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ) : (
        <div className="h-[320px]">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-[#4c1f9a] text-[20px] font-medium text-center mt-16">Mijozlaringiz qayerdan kelayotganini bilib oling</h1>
            <p className="text-gray-600 text-base text-center leading-relaxed mt-3">Basic yoki Pro tariflariga oʻtib, trafik manbalarini kuzatib boring va biznesingizni samarali rivojlantiring.</p>
            <Button
              variant="link"
              size="lg"
              className="mt-4"
              onClick={() => setOpen(true)}
            >
              Batafsil
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStats;