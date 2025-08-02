import { useQuery } from "@tanstack/react-query";
import { Clock, TrendingUp, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useProductionEfficiency } from "@/hooks/useRealTimeData";

export default function ProductionSchedule() {
  const { data: schedule, isLoading } = useQuery({
    queryKey: ["/api/production-schedule"],
  });

  const efficiencies = useProductionEfficiency();

  if (isLoading) {
    return <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
      ))}
    </div>;
  }

  const productionLines = [
    {
      id: "eps-line-a",
      name: "EPS Line A",
      product: "EPS01-EPS06 Production",
      efficiency: efficiencies['EPS Line A'] || 97,
      status: "running",
      color: "bg-green-500"
    },
    {
      id: "br-xps-line",
      name: "BR XPS Line B", 
      product: "BR1-BR13 Production",
      efficiency: efficiencies['BR XPS Line B'] || 92,
      status: "running",
      color: "bg-blue-500"
    },
    {
      id: "led-line",
      name: "LED Ready Line",
      product: "Specialized Products",
      efficiency: efficiencies['LED Ready Line'] || 89,
      status: "scheduled",
      color: "bg-yellow-500"
    }
  ];

  return (
    <div className="space-y-4">
      {productionLines.map((line) => (
        <div key={line.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 ${line.color} rounded-full`}></div>
            <div>
              <p className="font-medium text-gray-900">{line.name}</p>
              <p className="text-sm text-gray-600">{line.product}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{line.efficiency.toFixed(1)}%</span>
                {line.efficiency > 95 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : line.efficiency < 90 ? (
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                ) : (
                  <Clock className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <p className="text-sm text-gray-600">Efficiency</p>
            </div>
            <Badge variant={line.status === "running" ? "default" : "secondary"}>
              {line.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
