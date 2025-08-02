import { useQuery } from "@tanstack/react-query";
import { Globe, TrendingUp, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";

export default function DistributorMap() {
  const { data: regionalMetrics } = useQuery({
    queryKey: ["/api/sales-metrics/by-region"],
  });

  const { data: distributors } = useQuery({
    queryKey: ["/api/distributors"],
  });

  const regions = [
    {
      name: "South Africa",
      distributors: distributors?.filter((d: any) => d.country === "South Africa").length || 847,
      revenue: "4.2M",
      status: "active",
      color: "bg-green-500"
    },
    {
      name: "SADC Region", 
      distributors: 234,
      revenue: "1.8M",
      status: "growing",
      color: "bg-yellow-500"
    },
    {
      name: "West Africa",
      distributors: 156,
      revenue: "0.9M", 
      status: "planning",
      color: "bg-blue-500"
    },
    {
      name: "Global",
      distributors: 2010,
      revenue: "5.9M",
      status: "active",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Status Legend */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Global Distribution Network</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Growing</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Planning</span>
          </div>
        </div>
      </div>

      {/* Regional Performance Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {regions.map((region) => (
          <Card key={region.name} className="text-center hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className={`w-8 h-8 ${region.color} rounded-full mx-auto mb-3`}></div>
              <h4 className="font-medium text-gray-900 mb-2">{region.name}</h4>
              <div className="space-y-1">
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                  <Users className="w-3 h-3" />
                  <span>{region.distributors.toLocaleString()} distributors</span>
                </div>
                <div className="flex items-center justify-center space-x-1 text-xs text-green-600">
                  <DollarSign className="w-3 h-3" />
                  <span>R {region.revenue} revenue</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-cornex-blue">70K+</p>
              <p className="text-sm text-gray-600">Monthly Production</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">31</p>
              <p className="text-sm text-gray-600">Product Variants</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">16</p>
              <p className="text-sm text-gray-600">Countries</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
