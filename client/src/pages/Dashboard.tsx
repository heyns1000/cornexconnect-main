import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  Factory,
  MapPin,
  BarChart3,
  Lightbulb
} from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { TransitionHints, useTransitionHints, HINT_SEQUENCES } from "@/components/TransitionHints";
import { AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [showWelcomeHints, setShowWelcomeHints] = useState(true);
  
  // Transition hints system
  const { 
    activeHints, 
    isVisible: hintsVisible, 
    currentStep, 
    showHints, 
    hideHints, 
    completeHints 
  } = useTransitionHints();

  // Dashboard data queries
  const { data: summary = {} } = useQuery({
    queryKey: ["/api/dashboard/summary"],
  });

  const { data: distributors = [] } = useQuery({
    queryKey: ["/api/distributors"],
  });

  const { data: regionalSales = [] } = useQuery({
    queryKey: ["/api/sales-metrics/by-region"],
  });

  const { data: topProducts = [] } = useQuery({
    queryKey: ["/api/sales-metrics/top-products"],
  });

  const { data: productionSchedule = [] } = useQuery({
    queryKey: ["/api/production-schedule"],
  });

  const { data: demandForecast = [] } = useQuery({
    queryKey: ["/api/demand-forecast"],
  });

  // Show welcome hints on first visit
  const startDashboardTour = () => {
    showHints(HINT_SEQUENCES.dashboard);
  };

  const skipDashboardTour = () => {
    setShowWelcomeHints(false);
    hideHints();
  };

  // Format currency for display
  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <PageTransition>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              🏭 CornexConnect Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor your global manufacturing and distribution network
            </p>
          </div>
          <div className="flex gap-2">
            {showWelcomeHints && (
              <Button 
                variant="outline" 
                onClick={startDashboardTour}
                className="bg-gradient-to-r from-emerald-50 to-blue-50 hover:from-emerald-100 hover:to-blue-100"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Dashboard Tour
              </Button>
            )}
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-hint="dashboard-metrics">
          <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {(summary as any)?.revenue ? formatCurrency((summary as any).revenue) : 'R57.8M'}
              </div>
              <p className="text-xs text-muted-foreground">
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Distributors</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {(summary as any)?.distributors || (distributors as any[]).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Across 9 provinces
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products in Catalog</CardTitle>
              <Package className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {(summary as any)?.products || '31+'}
              </div>
              <p className="text-xs text-muted-foreground">
                EPS & BR XPS ranges
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hardware Stores</CardTitle>
              <MapPin className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                1,864+
              </div>
              <p className="text-xs text-muted-foreground">
                Nationwide coverage
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Regional Sales Performance */}
          <Card className="backdrop-blur-sm bg-white/10 border border-white/20" data-hint="regional-chart">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-500" />
                Regional Sales Performance
              </CardTitle>
              <CardDescription>
                Revenue breakdown by province
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(regionalSales as any[]).slice(0, 5).map((region: any, index: number) => (
                <div key={region.region} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{region.region}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(region.revenue)}
                    </span>
                  </div>
                  <Progress 
                    value={(region.revenue / ((regionalSales as any[])[0]?.revenue || 1)) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Top Performing Products
              </CardTitle>
              <CardDescription>
                Best-selling Cornex products this month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(topProducts as any[]).slice(0, 5).map((item: any, index: number) => (
                <div key={item.product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">{item.product.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.quantity} units</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Production and Demand Forecast */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Production Schedule */}
          <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="w-5 h-5 text-purple-500" />
                Production Schedule
              </CardTitle>
              <CardDescription>
                Upcoming manufacturing plans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(productionSchedule as any[]).slice(0, 4).map((schedule: any) => (
                <div key={schedule.id} className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5">
                  <div>
                    <p className="font-medium">{schedule.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(schedule.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{schedule.plannedQuantity} units</p>
                    <Badge 
                      variant={schedule.status === 'scheduled' ? 'secondary' : 'default'}
                      className="text-xs"
                    >
                      {schedule.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Demand Forecast */}
          <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                AI Demand Forecast
              </CardTitle>
              <CardDescription>
                Predicted demand for next 30 days
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(demandForecast as any[]).slice(0, 4).map((forecast: any) => (
                <div key={forecast.id} className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5">
                  <div>
                    <p className="font-medium">{forecast.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      Confidence: {Math.round(forecast.confidence * 100)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{forecast.predictedDemand} units</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">
                        +{Math.round((forecast.predictedDemand / 1000) * 15)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Package className="w-6 h-6" />
                <span className="text-sm">Add Product</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Users className="w-6 h-6" />
                <span className="text-sm">New Distributor</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Factory className="w-6 h-6" />
                <span className="text-sm">Schedule Production</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <TrendingUp className="w-6 h-6" />
                <span className="text-sm">View Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transition Hints Component */}
        <AnimatePresence>
          {hintsVisible && (
            <TransitionHints
              steps={activeHints}
              isVisible={hintsVisible}
              onComplete={completeHints}
              onSkip={skipDashboardTour}
              currentStep={currentStep}
            />
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}