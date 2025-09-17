import DashboardLayout from "@/components/DashboardLayout";
import StatsCards from "@/components/StatsCards";
import VisitorInsights from "@/components/MyTradeChart";
import OrderStats from "@/components/OrderStats";
import TopProducts from "@/components/TopProducts";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="w-full px-2 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          </div>
        </div>
        <StatsCards />
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Chap tomonda: LineChart */}
          <div className="w-full lg:w-[62%]">
            <VisitorInsights />
          </div>

          {/* O‘ng tomonda: Statistika */}
          <div className="w-full lg:w-[38%]">
            <OrderStats />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-[35%]">
            <OrderStats />
          </div>
          <div className="w-full lg:w-[65%]">
            <TopProducts />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Index;
