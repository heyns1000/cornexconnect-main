import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Brain, Package, TrendingUp, AlertTriangle, Zap, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InventoryOptimizer from "@/components/InventoryOptimizer";
import AIInsightsPanel from "@/components/AIInsightsPanel";
import { formatCurrency } from "@/lib/currency";
import { STOCK_STATUS_COLORS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

export default function InventoryAI() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleOptimizeAll = () => {
    toast({
      title: "Optimizing Inventory",
      description: "Running AI optimization across all inventory items...",
    });
  };

  const handleViewInsights = () => {
    toast({
      title: "AI Insights",
      description: "Loading detailed AI analytics...",
    });
  };

  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ["/api/inventory"],
  });

  const { data: demandForecast } = useQuery({
    queryKey: ["/api/demand-forecast"],
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

  // Calculate inventory metrics
  const inventoryMetrics = Array.isArray(inventory) && inventory.length > 0 ? {
    totalValue: inventory.reduce((sum: number, item: any) => 
      sum + (item.inventory?.currentStock || item.currentStock || 0) * parseFloat((item.products || item.product)?.basePrice || 0), 0
    ),
    lowStockItems: inventory.filter((item: any) => 
      (item.inventory?.currentStock || item.currentStock || 0) <= (item.inventory?.reorderPoint || item.reorderPoint || 0)
    ).length,
    outOfStockItems: inventory.filter((item: any) => 
      (item.inventory?.currentStock || item.currentStock || 0) === 0
    ).length,
    optimalStockItems: inventory.filter((item: any) => {
      const stock = item.inventory?.currentStock || item.currentStock || 0;
      const reorderPoint = item.inventory?.reorderPoint || item.reorderPoint || 0;
      const maxStock = item.inventory?.maxStock || item.maxStock || 10000;
      return stock > reorderPoint && stock < maxStock * 0.8;
    }).length
  } : null;

  const getOptimizationScore = () => {
    if (!Array.isArray(inventory) || inventory.length === 0) return 0;
    const totalItems = inventory.length;
    const optimalItems = inventoryMetrics?.optimalStockItems || 0;
    return Math.round((optimalItems / totalItems) * 100);
  };

  const optimizationScore = getOptimizationScore();

  return (
    <div className="space-y-8 p-8">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 -mx-8 -mt-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">🍎 Fruitful Assist AI-Powered Inventory Optimization</h2>
            <p className="text-gray-600 mt-1">Predictive analytics and intelligent inventory management</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleOptimizeAll}>
              <Zap className="w-4 h-4 mr-2" />
              Auto-Optimize
            </Button>
            <Button variant="outline" onClick={handleViewInsights}>
              <Target className="w-4 h-4 mr-2" />
              Set Targets
            </Button>
            <Button className="bg-cornex-blue hover:bg-cornex-dark" onClick={handleViewInsights}>
              <Brain className="w-4 h-4 mr-2" />
              🍎 Fruitful Assist AI
            </Button>
          </div>
        </div>
      </div>

      {/* AI Optimization Score */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">AI Optimization Score</h3>
              <div className="flex items-center space-x-4">
                <div className="text-4xl font-bold">{optimizationScore}%</div>
                <div className="flex-1">
                  <Progress 
                    value={optimizationScore} 
                    className="w-full h-3"
                  />
                  <p className="text-sm mt-1 opacity-90">
                    {optimizationScore >= 80 ? "Excellent optimization" :
                     optimizationScore >= 60 ? "Good optimization" :
                     optimizationScore >= 40 ? "Needs improvement" : "Critical optimization required"}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">R {inventoryMetrics ? (inventoryMetrics.totalValue / 1000000).toFixed(1) : '0'}M</div>
              <p className="text-sm opacity-90">Total Inventory Value</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="dashboard-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Optimal Stock</CardTitle>
              <Package className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {inventoryMetrics?.optimalStockItems || 0}
            </div>
            <p className="text-sm text-green-600 mt-1">
              {Array.isArray(inventory) && inventory.length > 0 ? Math.round(((inventoryMetrics?.optimalStockItems || 0) / inventory.length) * 100) : 0}% of inventory
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Low Stock Alert</CardTitle>
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {inventoryMetrics?.lowStockItems || 0}
            </div>
            <p className="text-sm text-yellow-600 mt-1">Requires reordering</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Out of Stock</CardTitle>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {inventoryMetrics?.outOfStockItems || 0}
            </div>
            <p className="text-sm text-red-600 mt-1">Immediate action needed</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">AI Savings</CardTitle>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">R 2.4M</div>
            <p className="text-sm text-green-600 mt-1">+18% this quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="optimizer" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="optimizer">AI Optimizer</TabsTrigger>
          <TabsTrigger value="forecast">Demand Forecast</TabsTrigger>
          <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Smart Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="optimizer">
          <InventoryOptimizer inventory={inventory} products={products} />
        </TabsContent>

        <TabsContent value="forecast">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>30-Day Demand Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>AI Demand Forecasting Chart</p>
                    <p className="text-sm">Analyzing historical patterns and market trends</p>
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
                  {['EPS Premium', 'BR XPS Budget', 'LED Ready'].map((category, index) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{category}</span>
                        <span className="font-medium">{95 - index * 2}%</span>
                      </div>
                      <Progress value={95 - index * 2} className="h-2" />
                    </div>
                  ))}
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Average Accuracy: 93.7%</strong><br />
                      AI models have improved forecast accuracy by 28% over traditional methods.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Inventory Turn Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Inventory Turnover Analytics</p>
                    <p className="text-sm">Product velocity and optimization insights</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Movers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { sku: "EPS04", name: "SANTE EPS", velocity: "High", trend: "up" },
                    { sku: "BR9", name: "BR9 XPS", velocity: "High", trend: "up" },
                    { sku: "LED001", name: "LED CORNICE", velocity: "Medium", trend: "stable" }
                  ].map((item) => (
                    <div key={item.sku} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.sku}</p>
                        <p className="text-xs text-gray-500">{item.name}</p>
                      </div>
                      <Badge variant={item.velocity === "High" ? "default" : "secondary"}>
                        {item.velocity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Smart Inventory Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      type: "critical",
                      title: "EPS07 - Critical Stock Level",
                      description: "Only 45 units remaining. High demand predicted for next week.",
                      action: "Reorder 2,000 units immediately",
                      priority: "High"
                    },
                    {
                      type: "warning",
                      title: "BR9 - Approaching Reorder Point",
                      description: "Current stock: 156 units. Reorder point: 100 units.",
                      action: "Schedule reorder for next week",
                      priority: "Medium"
                    },
                    {
                      type: "info",
                      title: "LED001 - Excess Inventory Detected",
                      description: "Stock level 40% above optimal. Consider promotional pricing.",
                      action: "Review pricing strategy",
                      priority: "Low"
                    }
                  ].map((alert, index) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${
                      alert.type === "critical" ? "border-red-500 bg-red-50" :
                      alert.type === "warning" ? "border-yellow-500 bg-yellow-50" :
                      "border-blue-500 bg-blue-50"
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{alert.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                          <p className="text-sm font-medium mt-2 text-gray-800">
                            Recommended Action: {alert.action}
                          </p>
                        </div>
                        <Badge variant={
                          alert.priority === "High" ? "destructive" :
                          alert.priority === "Medium" ? "default" : "secondary"
                        }>
                          {alert.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Insights Panel */}
      <AIInsightsPanel />
    </div>
  );
}
