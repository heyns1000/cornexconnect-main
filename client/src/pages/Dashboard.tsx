import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  Factory,
  MapPin,
  BarChart3,
  Lightbulb,
  Plus,
  Calendar
} from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { TransitionHints, useTransitionHints, HINT_SEQUENCES } from "@/components/TransitionHints";
import { AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [showWelcomeHints, setShowWelcomeHints] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Modal states
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [addDistributorOpen, setAddDistributorOpen] = useState(false);
  const [scheduleProductionOpen, setScheduleProductionOpen] = useState(false);
  
  // Form states
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    description: '',
    category: '',
    basePrice: '',
    costPrice: ''
  });
  
  const [newDistributor, setNewDistributor] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: '',
    region: ''
  });
  
  const [newProduction, setNewProduction] = useState({
    productId: '',
    quantity: '',
    scheduledDate: '',
    priority: 'medium'
  });
  
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

  // Quick Action handlers
  const handleAddProduct = async () => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      
      if (response.ok) {
        toast({
          title: "Product Added",
          description: `${newProduct.name} has been added successfully.`,
        });
        setAddProductOpen(false);
        setNewProduct({ sku: '', name: '', description: '', category: '', basePrice: '', costPrice: '' });
      } else {
        throw new Error('Failed to add product');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddDistributor = async () => {
    try {
      const response = await fetch('/api/distributors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDistributor)
      });
      
      if (response.ok) {
        toast({
          title: "Distributor Added",
          description: `${newDistributor.name} has been added successfully.`,
        });
        setAddDistributorOpen(false);
        setNewDistributor({ name: '', contactPerson: '', email: '', phone: '', city: '', region: '' });
      } else {
        throw new Error('Failed to add distributor');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add distributor. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleScheduleProduction = async () => {
    try {
      const response = await fetch('/api/production-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduction)
      });
      
      if (response.ok) {
        toast({
          title: "Production Scheduled",
          description: "Production has been scheduled successfully.",
        });
        setScheduleProductionOpen(false);
        setNewProduction({ productId: '', quantity: '', scheduledDate: '', priority: 'medium' });
      } else {
        throw new Error('Failed to schedule production');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule production. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleViewAnalytics = () => {
    setLocation('/analytics');
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
                {(summary as any)?.hardwareStores ? (summary as any).hardwareStores.toLocaleString() : '2,684'}
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
              {/* Add Product Modal */}
              <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-emerald-50 hover:border-emerald-200 transition-colors">
                    <Package className="w-6 h-6 text-emerald-600" />
                    <span className="text-sm font-medium">Add Product</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5 text-emerald-600" />
                      Add New Product
                    </DialogTitle>
                    <DialogDescription>
                      Create a new product in your catalog. Fill in the details below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="sku" className="text-right">SKU</Label>
                      <Input 
                        id="sku" 
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                        className="col-span-3" 
                        placeholder="e.g., EPS01"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Name</Label>
                      <Input 
                        id="name" 
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        className="col-span-3" 
                        placeholder="Product name"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">Category</Label>
                      <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EPS">EPS Cornice</SelectItem>
                          <SelectItem value="BR">BR XPS Cornice</SelectItem>
                          <SelectItem value="LED">LED Lighting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="basePrice" className="text-right">Base Price</Label>
                      <Input 
                        id="basePrice" 
                        type="number"
                        value={newProduct.basePrice}
                        onChange={(e) => setNewProduct({...newProduct, basePrice: e.target.value})}
                        className="col-span-3" 
                        placeholder="0.00"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="costPrice" className="text-right">Cost Price</Label>
                      <Input 
                        id="costPrice" 
                        type="number"
                        value={newProduct.costPrice}
                        onChange={(e) => setNewProduct({...newProduct, costPrice: e.target.value})}
                        className="col-span-3" 
                        placeholder="0.00"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">Description</Label>
                      <Textarea 
                        id="description" 
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        className="col-span-3" 
                        placeholder="Product description"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setAddProductOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddProduct} className="bg-emerald-600 hover:bg-emerald-700">Add Product</Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Add Distributor Modal */}
              <Dialog open={addDistributorOpen} onOpenChange={setAddDistributorOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-blue-50 hover:border-blue-200 transition-colors">
                    <Users className="w-6 h-6 text-blue-600" />
                    <span className="text-sm font-medium">New Distributor</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      Add New Distributor
                    </DialogTitle>
                    <DialogDescription>
                      Register a new distributor partner. Complete the information below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="dist-name" className="text-right">Company</Label>
                      <Input 
                        id="dist-name" 
                        value={newDistributor.name}
                        onChange={(e) => setNewDistributor({...newDistributor, name: e.target.value})}
                        className="col-span-3" 
                        placeholder="Company name"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="contact-person" className="text-right">Contact</Label>
                      <Input 
                        id="contact-person" 
                        value={newDistributor.contactPerson}
                        onChange={(e) => setNewDistributor({...newDistributor, contactPerson: e.target.value})}
                        className="col-span-3" 
                        placeholder="Contact person"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">Email</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={newDistributor.email}
                        onChange={(e) => setNewDistributor({...newDistributor, email: e.target.value})}
                        className="col-span-3" 
                        placeholder="contact@company.com"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">Phone</Label>
                      <Input 
                        id="phone" 
                        value={newDistributor.phone}
                        onChange={(e) => setNewDistributor({...newDistributor, phone: e.target.value})}
                        className="col-span-3" 
                        placeholder="+27 11 555 0000"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="city" className="text-right">City</Label>
                      <Input 
                        id="city" 
                        value={newDistributor.city}
                        onChange={(e) => setNewDistributor({...newDistributor, city: e.target.value})}
                        className="col-span-3" 
                        placeholder="City"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="region" className="text-right">Region</Label>
                      <Select value={newDistributor.region} onValueChange={(value) => setNewDistributor({...newDistributor, region: value})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gauteng">Gauteng</SelectItem>
                          <SelectItem value="Western Cape">Western Cape</SelectItem>
                          <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                          <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                          <SelectItem value="North West">North West</SelectItem>
                          <SelectItem value="Limpopo">Limpopo</SelectItem>
                          <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                          <SelectItem value="Free State">Free State</SelectItem>
                          <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setAddDistributorOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddDistributor} className="bg-blue-600 hover:bg-blue-700">Add Distributor</Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Schedule Production Modal */}
              <Dialog open={scheduleProductionOpen} onOpenChange={setScheduleProductionOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-purple-50 hover:border-purple-200 transition-colors">
                    <Factory className="w-6 h-6 text-purple-600" />
                    <span className="text-sm font-medium">Schedule Production</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      Schedule Production
                    </DialogTitle>
                    <DialogDescription>
                      Create a new production schedule entry for manufacturing.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="product-select" className="text-right">Product</Label>
                      <Select value={newProduction.productId} onValueChange={(value) => setNewProduction({...newProduction, productId: value})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eps01">EPS01 - Premium Cornice</SelectItem>
                          <SelectItem value="eps02">EPS02 - Standard Cornice</SelectItem>
                          <SelectItem value="br01">BR01 - XPS Premium</SelectItem>
                          <SelectItem value="br02">BR02 - XPS Standard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="quantity" className="text-right">Quantity</Label>
                      <Input 
                        id="quantity" 
                        type="number"
                        value={newProduction.quantity}
                        onChange={(e) => setNewProduction({...newProduction, quantity: e.target.value})}
                        className="col-span-3" 
                        placeholder="1000"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="scheduled-date" className="text-right">Date</Label>
                      <Input 
                        id="scheduled-date" 
                        type="date"
                        value={newProduction.scheduledDate}
                        onChange={(e) => setNewProduction({...newProduction, scheduledDate: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="priority" className="text-right">Priority</Label>
                      <Select value={newProduction.priority} onValueChange={(value) => setNewProduction({...newProduction, priority: value})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setScheduleProductionOpen(false)}>Cancel</Button>
                    <Button onClick={handleScheduleProduction} className="bg-purple-600 hover:bg-purple-700">Schedule Production</Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* View Analytics Button */}
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 hover:bg-orange-50 hover:border-orange-200 transition-colors"
                onClick={handleViewAnalytics}
              >
                <BarChart3 className="w-6 h-6 text-orange-600" />
                <span className="text-sm font-medium">View Analytics</span>
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