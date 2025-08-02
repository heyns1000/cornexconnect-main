import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export default function MetricCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-blue-600",
  className
}: MetricCardProps) {
  const changeColorClass = {
    positive: "text-green-600",
    negative: "text-red-600", 
    neutral: "text-gray-600"
  }[changeType];

  return (
    <Card className={cn("metric-card dashboard-card", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {change && (
              <p className={cn("text-sm mt-1", changeColorClass)}>
                {changeType === "positive" && "↗ "}
                {changeType === "negative" && "↙ "}
                {change}
              </p>
            )}
          </div>
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center ml-4",
            iconColor.includes("blue") && "bg-blue-100",
            iconColor.includes("green") && "bg-green-100",
            iconColor.includes("purple") && "bg-purple-100",
            iconColor.includes("orange") && "bg-orange-100",
            iconColor.includes("red") && "bg-red-100"
          )}>
            <Icon className={cn("w-6 h-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
