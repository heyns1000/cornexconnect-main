import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, PieChart, Activity, Download, Filter, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/currency";
import { SOUTH_AFRICAN_PROVINCES } from "@/lib/constants";

export default function BusinessIntelligence() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  const { data: salesMetrics } = useQuery({
    queryKey: ["/api/sales-metrics", selectedTimeframe, selectedRegion],
  });

  const { data: topProducts } = useQuery({
    queryKey: ["/api/sales-metrics/top-products"],
  });

  const { data: regionalMetrics } = useQuery({
    queryKey: ["/api/sales-metrics/by-region"],
  });

  const { data: distributors } = useQuery({
    queryKey: ["/api/distributors"],
  });

  const { data: inventory } = useQuery({
    queryKey: ["/api/inventory"],
  });

  // Calculate key performance indicators
  const kpis = {
    totalRevenue: regionalMetrics?.reduce((sum: number, region: any) => sum + parseFloat(region.revenue), 0) || 0,
    totalUnits: regionalMetrics?.reduce((sum: number, region: any) => sum + region.units, 0) || 0,
    averageOrderValue: 0,
    customerSatisfaction: 94.2,
    inventoryTurnover: 8.3,
    profitMargin: 24.7
  };

  if (kpis.totalUnits > 0) {
    kpis.averageOrderValue = kpis.totalRevenue / kpis.totalUnits;
  }

  return (
    <div className="space-y-8 p-8">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 -mx-8 -mt-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Business Intelligence & Analytics</h2>
            <p className="text-gray-600 mt-1">Advanced analytics and performance insights for data-driven decisions</p>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-cornex-blue hover:bg-cornex-dark">
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(kpis.totalRevenue, "ZAR")}
                </p>
                <p className="text-sm text-green-600 mt-1">↗ +23.5%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Units Sold</p>
                <p className="text-2xl font-bold text-gray-900">
                  {kpis.totalUnits.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 mt-1">↗ +18.2%</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(kpis.averageOrderValue, "ZAR")}
                </p>
                <p className="text-sm text-green-600 mt-1">↗ +4.8%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900">{kpis.customerSatisfaction}%</p>
                <p className="text-sm text-green-600 mt-1">↗ +2.1%</p>
              </div>
              <Activity className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inventory Turn</p>
                <p className="text-2xl font-bold text-gray-900">{kpis.inventoryTurnover}x</p>
                <p className="text-sm text-green-600 mt-1">↗ +15%</p>
              </div>
              <PieChart className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                <p className="text-2xl font-bold text-gray-900">{kpis.profitMargin}%</p>
                <p className="text-sm text-green-600 mt-1">↗ +3.2%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Revenue Analytics Chart</p>
                    <p className="text-sm">Monthly revenue tracking and trends</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts?.slice(0, 5).map((item: any, index: number) => (
                    <div key={item.product.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.product.name}</p>
                          <p className="text-sm text-gray-500">{item.product.sku}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(parseFloat(item.revenue), "ZAR")}
                        </p>
                        <p className="text-sm text-gray-500">{item.units.toLocaleString()} units</p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <PieChart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No product data available</p>
                    </div> 
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Sales Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Sales Performance Chart</p>
                    <p className="text-sm">Detailed sales analytics and trends</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Conversion Rate</span>
                      <span className="font-medium">67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Customer Retention</span>
                      <span className="font-medium">84%</span>
                    </div>
                    <Progress value={84} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Market Share</span>
                      <span className="font-medium">34%</span>
                    </div>
                    <Progress value={34} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Growth Rate</span>
                      <span className="font-medium">23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: "EPS Premium Range", revenue: 4200000, units: 28400, margin: 26.4, growth: 18.2 },
                    { category: "BR XPS Budget Range", revenue: 3800000, units: 31200, margin: 22.1, growth: 24.6 },
                    { category: "LED Ready Series", revenue: 2400000, units: 8900, margin: 34.7, growth: 42.3 }
                  ].map((item) => (
                    <div key={item.category} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{item.category}</h4>
                        <Badge variant="outline" className="text-green-600">
                          +{item.growth}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Revenue</p>
                          <p className="font-medium">{formatCurrency(item.revenue, "ZAR")}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Units</p>
                          <p className="font-medium">{item.units.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Margin</p>
                          <p className="font-medium">{item.margin}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Velocity Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Product Velocity Chart</p>
                    <p className="text-sm">Inventory turn rates and product movement</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regional">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Provincial Performance Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Interactive Regional Map</p>
                    <p className="text-sm">Provincial sales and distributor performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {regionalMetrics?.slice(0, 9).map((metric: any, index: number) => (
                    <div key={metric.region} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{metric.region}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(parseFloat(metric.revenue), "ZAR")}
                        </p>
                        <p className="text-xs text-gray-500">{metric.units.toLocaleString()} units</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecasting">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Demand Forecasting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>AI Forecasting Model</p>
                    <p className="text-sm">Predictive analytics for demand planning</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Forecast Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">95.7%</div>
                    <p className="text-sm text-gray-500">Overall Forecast Accuracy</p>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { period: "Next 30 days", accuracy: 97.2, confidence: "High" },
                      { period: "Next 60 days", accuracy: 94.8, confidence: "High" },
                      { period: "Next 90 days", accuracy: 91.3, confidence: "Medium" },
                      { period: "Next 6 months", accuracy: 85.6, confidence: "Medium" }
                    ].map((forecast) => (
                      <div key={forecast.period} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{forecast.period}</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{forecast.accuracy}%</span>
                            <Badge variant={forecast.confidence === "High" ? "default" : "secondary"} className="text-xs">
                              {forecast.confidence}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={forecast.accuracy} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Insights */}
      <Card className="cornex-gradient text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">🧠 Business Intelligence Insights</h3>
              <div className="space-y-2 text-blue-100">
                <p>• EPS Premium range showing 18.2% growth - consider expanding production capacity</p>
                <p>• Gauteng market has 23% higher profit margins - optimize pricing strategy for other provinces</p>
                <p>• LED Ready series has 42% growth potential - invest in marketing and distributor training</p>
                <p>• Inventory turnover improved 15% - AI optimization saving R2.4M annually</p>
              </div>
            </div>
            <Button variant="secondary" className="bg-white/20 backdrop-blur hover:bg-white/30 text-white border-0">
              View Full Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
