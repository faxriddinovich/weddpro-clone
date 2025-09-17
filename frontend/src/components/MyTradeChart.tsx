import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Brush,
} from "recharts";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { getMonthlyRevenue } from "@/services/dashboard/RevenueService";

const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
] as const;

type Month = typeof months[number] | "Full Year";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-md px-4 py-2 text-sm">
        <p className="text-gray-700 dark:text-gray-200 font-semibold">
          Kun: {label}
        </p>
        <p className="text-blue-600 dark:text-blue-400">
          Daromad: ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function MyTradeChart() {
  const [selected, setSelected] = useState<Month>("August"); // Backenddan kelgan misolga asoslanib
  const [data, setData] = useState<{ day: string; income: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getMonthlyRevenue();
        const chartData = response.daily_revenue.map(item => ({
          day: item.day.toString(),
          income: item.total,
        }));
        setData(chartData);
      } catch (err) {
        console.error("Monthly revenue fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Yuklanmoqda...</div>;

  return (
    <div className="bg-white dark:bg-gray-900 p-2 xs:p-3 sm:p-4 md:p-6 rounded-xl shadow-md border max-w-full sm:max-w-xl md:max-w-[101%] mx-auto h-full min-h-[220px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-[20px] font-sans text-gray-900 dark:text-white">
            {selected === "Full Year" ? "1-Yillik Daromad" : `${selected} Oy`}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Kunlik daromad o‘zgarishi
          </p>
        </div>
        <Select onValueChange={(val) => setSelected(val as Month)} value={selected}>
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Oy tanlang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Full Year">📊 Full Year</SelectItem>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ResponsiveContainer width="101%" height={300}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            dataKey="day"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            label={{ value: "Kun", position: "insideBottomRight", offset: -5 }}
          />
          <YAxis
            tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            label={{
              value: "Daromad (USD)",
              angle: -90,
              position: "insideLeft",
              fill: "#6b7280",
              fontSize: 12,
            }}
            domain={["auto", "auto"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="linear"
            dataKey="income"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
            animationDuration={500}
            animationEasing="ease-out"
            fillOpacity={1}
            fill="url(#colorIncome)"
          />
          {data.length > 30 && (
            <Brush
              dataKey="day"
              height={25}
              stroke="#2563eb"
              travellerWidth={8}
              fill="#f3f4f6"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}