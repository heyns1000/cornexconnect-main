import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, TrendingUp, AlertCircle, Play, Pause, BarChart3, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ProductionScheduleCalendar from "@/components/ProductionScheduleCalendar";
import { PRODUCTION_LINES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function ProductionPlanning() {
  const [selectedLine, setSelectedLine] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: schedule, isLoading } = useQuery({
    queryKey: ["/api/production-schedule"],
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (scheduleData: any) => {
      return await apiRequest("POST", "/api/production-schedule", scheduleData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/production-schedule"] });
      toast({
        title: "Production Scheduled",
        description: "New production schedule has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create production schedule.",
        variant: "destructive",
      });
    },
  });

  const updateScheduleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest("PUT", `/api/production-schedule/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/production-schedule"] });
      toast({
        title: "Schedule Updated",
        description: "Production schedule has been updated successfully.",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const filteredSchedule = schedule?.filter((item: any) => 
    selectedLine === "all" || item.productionLine === selectedLine
  ) || [];

  return (
    <div className="space-y-8 p-8">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 -mx-8 -mt-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Production Planning & Scheduling</h2>
            <p className="text-gray-600 mt-1">AI-powered production optimization and automated scheduling</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Optimize
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-cornex-blue hover:bg-cornex-dark">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Production
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Schedule New Production</DialogTitle>
                </DialogHeader>
                <ScheduleForm 
                  products={products || []}
                  onSubmit={(data) => createScheduleMutation.mutate(data)}
                  isLoading={createScheduleMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Production Line Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRODUCTION_LINES.map((line) => {
          const lineSchedule = schedule?.filter((s: any) => 
            s.productionLine === line.name && s.status === "in_progress"
          ) || [];
          const currentProduction = lineSchedule.length > 0;
          
          return (
            <Card key={line.id} className="dashboard-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{line.name}</CardTitle>
                  <div className={`w-3 h-3 rounded-full ${
                    currentProduction ? "bg-green-500 animate-pulse" : "bg-gray-300"
                  }`}></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {line.efficiency}%
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {currentProduction ? "Running" : "Idle"}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Capacity: {line.capacity.toLocaleString()}/month</p>
                    <p className="text-xs mt-1">
                      {line.products.length} product types
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button
                      size="sm"
                      variant={currentProduction ? "destructive" : "default"}
                      className="w-full"
                    >
                      {currentProduction ? (
                        <>
                          <Pause className="w-3 h-3 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 mr-1" />
                          Start
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Production Schedule Calendar and List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Production Calendar</CardTitle>
                <Select value={selectedLine} onValueChange={setSelectedLine}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Production Lines</SelectItem>
                    {PRODUCTION_LINES.map((line) => (
                      <SelectItem key={line.id} value={line.name}>
                        {line.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ProductionScheduleCalendar 
                schedule={filteredSchedule}
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
              />
            </CardContent>
          </Card>
        </div>

        {/* Schedule Details */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSchedule
                .filter((item: any) => {
                  const itemDate = new Date(item.scheduledDate);
                  const today = new Date();
                  return (
                    itemDate.toDateString() === today.toDateString()
                  );
                })
                .map((item: any) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        {item.products?.name || item.product?.name || "Unknown Product"}
                      </h4>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Production Line:</span>
                        <span className="font-medium">{item.productionLine}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Planned Quantity:</span>
                        <span className="font-medium">{item.plannedQuantity.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Actual Quantity:</span>
                        <span className="font-medium">{item.actualQuantity.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Priority:</span>
                        <Badge className={getPriorityColor(item.priority)} variant="outline">
                          {item.priority}
                        </Badge>
                      </div>
                      {item.efficiency && (
                        <div className="flex justify-between">
                          <span>Efficiency:</span>
                          <span className="font-medium text-green-600">
                            {parseFloat(item.efficiency).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>

                    {item.notes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                        <strong>Notes:</strong> {item.notes}
                      </div>
                    )}

                    <div className="flex items-center space-x-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Update status functionality
                          const newStatus = item.status === "scheduled" ? "in_progress" : 
                                          item.status === "in_progress" ? "completed" : "scheduled";
                          updateScheduleMutation.mutate({
                            id: item.id,
                            data: { status: newStatus }
                          });
                        }}
                      >
                        {item.status === "scheduled" && "Start"}
                        {item.status === "in_progress" && "Complete"}
                        {item.status === "completed" && "Restart"}
                      </Button>
                      <Button size="sm" variant="ghost">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))
              }
              
              {filteredSchedule.filter((item: any) => {
                const itemDate = new Date(item.scheduledDate);
                const today = new Date();
                return itemDate.toDateString() === today.toDateString();
              }).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No production scheduled for today</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Optimization Insights */}
      <Card className="cornex-gradient text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">🍎 Fruitful Assist Production Optimizer</h3>
              <div className="space-y-2 text-blue-100">
                <p>• Suggested 12% efficiency improvement on EPS Line A by adjusting batch sizes</p>
                <p>• Recommend scheduling BR9 production during off-peak energy hours (R2,340 savings)</p>
                <p>• Machine maintenance window detected: LED Line requires service in 5 days</p>
              </div>
            </div>
            <Button variant="secondary" className="bg-white/20 backdrop-blur hover:bg-white/30 text-white border-0">
              Apply Suggestions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ScheduleForm({ 
  products, 
  onSubmit, 
  isLoading 
}: { 
  products: any[]; 
  onSubmit: (data: any) => void; 
  isLoading: boolean; 
}) {
  const [formData, setFormData] = useState({
    productId: "",
    scheduledDate: "",
    plannedQuantity: "",
    productionLine: "",
    priority: "normal",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      scheduledDate: new Date(formData.scheduledDate),
      plannedQuantity: parseInt(formData.plannedQuantity)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="productId">Product</Label>
        <Select value={formData.productId} onValueChange={(value) => setFormData(prev => ({ ...prev, productId: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.sku} - {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="productionLine">Production Line</Label>
        <Select value={formData.productionLine} onValueChange={(value) => setFormData(prev => ({ ...prev, productionLine: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select production line" />
          </SelectTrigger>
          <SelectContent>
            {PRODUCTION_LINES.map((line) => (
              <SelectItem key={line.id} value={line.name}>
                {line.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="scheduledDate">Scheduled Date</Label>
        <Input
          type="datetime-local"
          value={formData.scheduledDate}
          onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="plannedQuantity">Planned Quantity</Label>
        <Input
          type="number"
          value={formData.plannedQuantity}
          onChange={(e) => setFormData(prev => ({ ...prev, plannedQuantity: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes..."
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Scheduling..." : "Schedule Production"}
      </Button>
    </form>
  );
}
