import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Users, TrendingUp, MapPin } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface DistributorPortalProps {
  distributors: any[];
}

export default function DistributorPortal({ distributors }: DistributorPortalProps) {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-cornex-blue" />
          <span>Global Distribution Portal</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <TrendingUp className="w-3 h-3" />
                    <span>R {region.revenue} revenue</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}