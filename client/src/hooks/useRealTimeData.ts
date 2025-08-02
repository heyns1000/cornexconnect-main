import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export function useRealTimeData<T>(
  queryKey: string[],
  interval: number = 5000
) {
  const query = useQuery<T>({
    queryKey,
    refetchInterval: interval,
    refetchIntervalInBackground: true,
  });

  return query;
}

export function useSimulatedMetrics() {
  const [metrics, setMetrics] = useState({
    revenue: 12.8,
    efficiency: 94.7,
    distributors: 3247,
    turnover: 8.3
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        revenue: prev.revenue + (Math.random() - 0.5) * 0.2,
        efficiency: Math.max(85, Math.min(99, prev.efficiency + (Math.random() - 0.5) * 0.5)),
        distributors: prev.distributors + Math.floor((Math.random() - 0.5) * 10),
        turnover: Math.max(6, Math.min(12, prev.turnover + (Math.random() - 0.5) * 0.1))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
}

export function useProductionEfficiency() {
  const [efficiencies, setEfficiencies] = useState({
    'EPS Line A': 97,
    'BR XPS Line B': 92,
    'LED Ready Line': 89
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setEfficiencies(prev => 
        Object.fromEntries(
          Object.entries(prev).map(([line, eff]) => [
            line,
            Math.max(80, Math.min(100, eff + (Math.random() - 0.5) * 2))
          ])
        )
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return efficiencies;
}
