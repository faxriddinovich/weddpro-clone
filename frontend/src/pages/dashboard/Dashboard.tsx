// src/components/Dashboard.tsx
import OrderMaps from "@/components/Map/OrderMap"
import MyTradeChart from "@/components/MyTradeChart"
import OrderStats from "@/components/OrderStats"
import StatsCards from "@/components/StatsCards"
import TopCustomers from "@/components/TopCustomers"
import TopProducts from "@/components/TopProducts"
import TrafficSourceCard from "@/components/TrafficSourceCard"

function Dashboard() {
    return (
        <div className="w-full space-y-4 bg-[#f9f9fc]">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 px-4 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Dashboard</h1>
                    </div>
                </div>

                {/* Stats Cards */}
                <StatsCards />

                {/* Charts Row */}
                <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">
                    <div className="w-full xl:w-[65%]">
                        <MyTradeChart />
                    </div>
                    <div className="w-full xl:w-[35%]">
                        <OrderStats />
                    </div>
                </div>

                {/* Traffic Source va Top Products */}
                <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 mt-4">
                    <div className="w-full xl:w-[35%]">
                        <TrafficSourceCard />
                    </div>
                    <div className="w-full xl:w-[65%]">
                        <TopProducts />
                    </div>
                </div>

                {/* Map */}
                <div className="w-full mt-4">
                    <OrderMaps isPremiumUser={true} />
                </div> 
                <div className="w-full mt-4">
                    <TopCustomers />
                </div>
            </div>

        </div>
    )
}

export default Dashboard