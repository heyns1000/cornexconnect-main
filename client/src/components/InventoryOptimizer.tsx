import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, TrendingUp, AlertTriangle, Target, Zap, Settings } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { STOCK_STATUS_COLORS } from "@/lib/constants";

interface InventoryOptimizerProps {
  inventory: any[];
  products: any[];
}

export default function InventoryOptimizer({ inventory, products }: InventoryOptimizerProps) {
  const [optimizationMode, setOptimizationMode] = useState("balanced");
  const [selectedProduct, setSelectedProduct] = useState("");
  
  // Calculate optimization recommendations
  const getOptimizationRecommendations = () => {
    if (!inventory) return [];

    return inventory.map((item: any) => {
      const product = item.products || item.product;
      const inv = item.inventory || item;
      const currentStock = inv.currentStock || 0;
      const reorderPoint = inv.reorderPoint || 0;
      const maxStock = inv.maxStock || 10000;

      let recommendation = "optimal";
      let action = "No action needed";
      let priority = "low";
      let savings = 0;

      if (currentStock === 0) {
        recommendation = "critical";
        action = `Immediate reorder of ${reorderPoint * 2} units`;
        priority = "critical";
        savings = parseFloat(product?.basePrice || 0) * reorderPoint;
      } else if (currentStock <= reorderPoint) {
        recommendation = "reorder";
        action = `Reorder ${maxStock - currentStock} units`;
        priority = "high";
        savings = parseFloat(product?.basePrice || 0) * (maxStock - currentStock) * 0.1;
      } else if (currentStock > maxStock * 0.8) {
        recommendation = "excess";
        action = `Reduce stock by ${currentStock - Math.floor(maxStock * 0.7)} units`;
        priority = "medium";
        savings = parseFloat(product?.basePrice || 0) * (currentStock - Math.floor(maxStock * 0.7)) * 0.2;
      }

      return {
        product,
        inventory: inv,
        recommendation,
        action,
        priority,
        potentialSavings: savings,
        currentUtilization: (currentStock / maxStock) * 100
      };
    }).sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
    });
  };

  const recommendations = getOptimizationRecommendations();

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "reorder":
        return "bg-yellow-100 text-yellow-800";
      case "excess":
        return "bg-blue-100 text-blue-800";
      case "optimal":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const totalPotentialSavings = recommendations.reduce((sum, rec) => sum + rec.potentialSavings, 0);

  return (
    <div className="space-y-6">
      {/* Optimization Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-cornex-blue" />
              <span>Inventory Optimization Engine</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={optimizationMode} onValueChange={setOptimizationMode}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-cornex-blue hover:bg-cornex-dark">
                <Zap className="w-4 h-4 mr-2" />
                Optimize All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{recommendations.length}</div>
              <p className="text-sm text-gray-500">Items Analyzed</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {recommendations.filter(r => r.priority === "critical").length}
              </div>
              <p className="text-sm text-gray-500">Critical Actions</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {recommendations.filter(r => r.priority === "high").length}
              </div>
              <p className="text-sm text-gray-500">High Priority</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalPotentialSavings, "ZAR")}
              </div>
              <p className="text-sm text-gray-500">Potential Savings</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Optimization Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.slice(0, 10).map((rec, index) => (
              <div key={rec.product.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(rec.priority)}`}></div>
                    <div>
                      <h4 className="font-medium text-gray-900">{rec.product.name}</h4>
                      <p className="text-sm text-gray-500">{rec.product.sku}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRecommendationColor(rec.recommendation)}>
                      {rec.recommendation}
                    </Badge>
                    <Badge variant="outline" className={
                      rec.priority === "critical" ? "text-red-600" :
                      rec.priority === "high" ? "text-orange-600" :
                      rec.priority === "medium" ? "text-yellow-600" : "text-green-600"
                    }>
                      {rec.priority}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Current Stock</p>
                    <p className="font-medium">{rec.inventory.currentStock?.toLocaleString() || 0} units</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Stock Utilization</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={rec.currentUtilization} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{rec.currentUtilization.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Potential Savings</p>
                    <p className="font-medium text-green-600">
                      {formatCurrency(rec.potentialSavings, "ZAR")}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700">
                    <strong>Recommendation:</strong> {rec.action}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Package className="w-4 h-4" />
                    <span>Reorder Point: {rec.inventory.reorderPoint?.toLocaleString() || 0}</span>
                    <span>•</span>
                    <span>Max Stock: {rec.inventory.maxStock?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Settings className="w-3 h-3 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm" className="bg-cornex-blue hover:bg-cornex-dark">
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {recommendations.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No inventory data available for optimization</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Optimization Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="safety-stock">Safety Stock Multiplier</Label>
              <Input
                id="safety-stock"
                type="number"
                defaultValue="1.5"
                step="0.1"
                min="1"
                max="3"
              />
              <p className="text-xs text-gray-500">Higher values = more safety stock</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="turnover-target">Target Turnover Rate</Label>
              <Input
                id="turnover-target"
                type="number"
                defaultValue="8"
                step="0.5"
                min="4"
                max="20"
              />
              <p className="text-xs text-gray-500">Times per year</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-level">Service Level Target</Label>
              <Input
                id="service-level"
                type="number"
                defaultValue="95"
                step="1"
                min="90"
                max="99"
              />
              <p className="text-xs text-gray-500">Percentage availability</p>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button variant="outline" className="mr-3">
              Reset to Defaults
            </Button>
            <Button className="bg-cornex-blue hover:bg-cornex-dark">
              Save Parameters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
