import { NetRevenueChart } from "./_components/net-revenue-chart";
import { DashboardStats } from "./_components/stats";
import { ChannelSalesChart } from "./_components/channel-sales-chart";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 gap-px bg-border p-px md:grid-cols-2 lg:grid-cols-4">
      <DashboardStats />
      <NetRevenueChart />
      <ChannelSalesChart />
      {/* <DashboardInvoices />
          <BillingHealth />
          <DashboardActivity /> */}
    </div>
  );
}
