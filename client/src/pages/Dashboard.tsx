import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Cpu, Globe, RotateCw, RefreshCw } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import DemandChart from "@/components/DemandChart";
import ProductionSchedule from "@/components/ProductionSchedule";
import DistributorMap from "@/components/DistributorMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSimulatedMetrics } from "@/hooks/useRealTimeData";
import { formatCurrency } from "@/lib/currency";

export default function Dashboard() {
  const metrics = useSimulatedMetrics();
  
  const { data: summary } = useQuery({
    queryKey: ["/api/dashboard/summary"],
  });

  const { data: topProducts } = useQuery({
    queryKey: ["/api/sales-metrics/top-products"],
  });

  return (
    <div className="space-y-8 p-8">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 -mx-8 -mt-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI-Powered Operations Dashboard</h2>
            <p className="text-gray-600 mt-1">Real-time insights across global manufacturing and distribution network</p>
          </div>
          <Button className="bg-cornex-blue hover:bg-cornex-dark">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Global Revenue"
          value={formatCurrency(metrics.revenue * 1000000, "ZAR")}
          change="+23.5% vs last month"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-green-600"
        />
        
        <MetricCard
          title="Production Efficiency"
          value={`${metrics.efficiency.toFixed(1)}%`}
          change="AI Optimized"
          changeType="positive"
          icon={Cpu}
          iconColor="text-blue-600"
        />
        
        <MetricCard
          title="Active Distributors"
          value={metrics.distributors.toLocaleString()}
          change="Across 16 countries"
          changeType="neutral"
          icon={Globe}
          iconColor="text-purple-600"
        />
        
        <MetricCard
          title="Inventory Turnover"
          value={`${metrics.turnover.toFixed(1)}x`}
          change="+15% improvement"
          changeType="positive"
          icon={RotateCw}
          iconColor="text-orange-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Demand Forecast */}
        <Card className="dashboard-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>AI Demand Forecasting</CardTitle>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>95.3% Accuracy</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DemandChart />
          </CardContent>
        </Card>

        {/* Production Schedule */}
        <Card className="dashboard-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Production Schedule</CardTitle>
              <Button variant="link" className="text-cornex-blue p-0">
                View Details →
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ProductionSchedule />
          </CardContent>
        </Card>
      </div>

      {/* Product Performance & Global Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Performing SKUs */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Top Performing SKUs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts?.slice(0, 5).map((item: any) => (
                <div key={item.product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      item.product.category === 'EPS' ? 'bg-blue-100' :
                      item.product.category === 'BR' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      <span className={`text-xs font-bold ${
                        item.product.category === 'EPS' ? 'text-blue-600' :
                        item.product.category === 'BR' ? 'text-green-600' : 'text-purple-600'
                      }`}>
                        {item.product.sku}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-sm text-gray-600">{item.units.toLocaleString()} units</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{formatCurrency(parseFloat(item.revenue), "ZAR")}</p>
                    <p className="text-xs text-gray-500">+{Math.floor(Math.random() * 20 + 5)}%</p>
                  </div>
                </div>
              )) || (
                // Fallback data
                [
                  { sku: "EPS04", name: "SANTE EPS 85mm", units: 2340, revenue: "25100" },
                  { sku: "BR9", name: "BR9 XPS 140mm", units: 1890, revenue: "28700" },
                  { sku: "EPS07", name: "ALINA EPS 140mm", units: 1756, revenue: "21100" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">{item.sku}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.units.toLocaleString()} units</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{formatCurrency(parseFloat(item.revenue), "ZAR")}</p>
                      <p className="text-xs text-gray-500">+{Math.floor(Math.random() * 20 + 5)}%</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Global Distribution Map */}
        <div className="lg:col-span-2">
          <Card className="dashboard-card h-full">
            <CardContent className="p-6">
              <DistributorMap />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Insights Panel */}
      <Card className="cornex-gradient text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">🤖 AI Recommendations</h3>
              <div className="space-y-2 text-blue-100">
                <p>• Increase EPS04 production by 15% based on demand forecast</p>
                <p>• Optimize BR9 inventory levels for Q2 seasonal demand</p>
                <p>• Consider new distribution partnerships in East Africa</p>
              </div>
            </div>
            <Button variant="secondary" className="bg-white/20 backdrop-blur hover:bg-white/30 text-white border-0">
              View Full Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
