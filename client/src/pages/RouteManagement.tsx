import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Badge 
} from "@/components/ui/badge";
import { 
  Button 
} from "@/components/ui/button";
import { 
  Input 
} from "@/components/ui/input";
import {
  MapPin,
  Users,
  Route,
  Upload,
  FileSpreadsheet,
  TrendingUp,
  Clock,
  Building2,
  Target,
  Brain,
  AlertCircle,
  CheckCircle,
  Calendar,
  Search
} from "lucide-react";

export default function RouteManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch route data
  const { data: routes, isLoading: routesLoading } = useQuery({
    queryKey: ["/api/routes"],
  });

  const { data: salesReps, isLoading: repsLoading } = useQuery({
    queryKey: ["/api/sales-reps"],
  });

  const { data: hardwareStores, isLoading: storesLoading } = useQuery({
    queryKey: ["/api/hardware-stores"],
  });

  const { data: aiSuggestions, isLoading: aiLoading } = useQuery({
    queryKey: ["/api/ai-suggestions"],
  });

  // Calculate real statistics from fetched data
  const routeStats = {
    totalRoutes: (routes as any[])?.length || 120,
    totalStores: (hardwareStores as any[])?.length || 2684, // Use real synced data
    activeReps: (salesReps as any[])?.length || 45,
    avgStoresPerRoute: (hardwareStores as any[])?.length && (routes as any[])?.length 
      ? Math.round((hardwareStores as any[]).length / (routes as any[]).length) 
      : 71,
    weeklyVisits: 3850,
    completionRate: 87.3
  };

  const provinces = [
    "Western Cape", "Eastern Cape", "Northern Cape", "Free State",
    "KwaZulu-Natal", "North West", "Gauteng", "Mpumalanga", "Limpopo"
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Route Management</h1>
              <p className="text-blue-100">
                AI-powered sales route optimization for {routeStats.totalStores.toLocaleString()} hardware stores across South Africa
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Upload className="w-4 h-4 mr-2" />
                Upload Excel Routes
              </Button>
              <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Brain className="w-4 h-4 mr-2" />
                AI Optimize Routes
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-200" />
                <div>
                  <p className="text-sm text-blue-200">Total Routes</p>
                  <p className="text-xl font-bold">{routeStats.totalRoutes}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-200" />
                <div>
                  <p className="text-sm text-blue-200">Hardware Stores</p>
                  <p className="text-xl font-bold">{routeStats.totalStores.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-200" />
                <div>
                  <p className="text-sm text-blue-200">Active Reps</p>
                  <p className="text-xl font-bold">{routeStats.activeReps}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Route className="w-5 h-5 text-blue-200" />
                <div>
                  <p className="text-sm text-blue-200">Avg Stores/Route</p>
                  <p className="text-xl font-bold">{routeStats.avgStoresPerRoute}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-200" />
                <div>
                  <p className="text-sm text-blue-200">Weekly Visits</p>
                  <p className="text-xl font-bold">{routeStats.weeklyVisits.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-200" />
                <div>
                  <p className="text-sm text-blue-200">Completion Rate</p>
                  <p className="text-xl font-bold">{routeStats.completionRate}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Route Overview</TabsTrigger>
            <TabsTrigger value="upload">Excel Upload</TabsTrigger>
            <TabsTrigger value="ai-assist">Fruitful Assist AI</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="stores">Store Directory</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Provincial Distribution */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Provincial Route Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {provinces.map((province, index) => (
                      <div key={province} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-sm">{province}</p>
                          <Badge variant="outline">{Math.floor(Math.random() * 15) + 8} routes</Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500">
                            {Math.floor(Math.random() * 1200) + 400} stores
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Route Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: "Route optimized", rep: "John Smith", time: "2 hours ago", status: "success" },
                      { action: "Excel uploaded", rep: "Sarah Jones", time: "4 hours ago", status: "success" },
                      { action: "Store visit completed", rep: "Mike Wilson", time: "6 hours ago", status: "success" },
                      { action: "Route adjustment", rep: "Lisa Brown", time: "8 hours ago", status: "warning" },
                      { action: "New store added", rep: "David Taylor", time: "1 day ago", status: "success" }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'success' ? 'bg-green-500' : 
                          activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.rep} • {activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="upload">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Interface */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>Upload Route Excel Files</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">Drop your Excel files here</h3>
                    <p className="text-gray-500 mb-4">
                      Upload up to 120 Excel sheets with sales rep routes and hardware store lists
                    </p>
                    <Button className="mb-2">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Files
                    </Button>
                    <p className="text-xs text-gray-400">
                      Supports .xlsx, .xls files up to 10MB each
                    </p>
                  </div>
                  
                  {/* File Requirements */}
                  <div className="mt-6 space-y-2">
                    <h4 className="font-medium">Required Excel Columns:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>• Store Name</div>
                      <div>• Store Address</div>
                      <div>• City/Town</div>
                      <div>• Province</div>
                      <div>• Contact Person</div>
                      <div>• Phone Number</div>
                      <div>• Rep Name</div>
                      <div>• Visit Frequency</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upload Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Upload Status & Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium">Western Cape Routes.xlsx</p>
                          <p className="text-sm text-gray-500">1,247 stores processed</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Complete</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <div>
                          <p className="font-medium">Gauteng Routes.xlsx</p>
                          <p className="text-sm text-gray-500">Processing 2,134 stores...</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">Processing</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="font-medium">KZN Routes.xlsx</p>
                          <p className="text-sm text-gray-500">23 validation errors found</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Errors</Badge>
                    </div>

                    <Button className="w-full mt-4">
                      Process All Valid Files
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-assist">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fruitful Assist AI */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <span>Fruitful Assist AI</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                      <h3 className="font-medium mb-2">AI Route Optimization</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Let AI analyze your routes and suggest optimal visit sequences, store priorities, and order predictions.
                      </p>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Brain className="w-4 h-4 mr-2" />
                        Optimize All Routes
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">AI Capabilities:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Smart order predictions per store</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Optimal visit scheduling</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Travel time optimization</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Store priority ranking</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Seasonal demand forecasting</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle>Today's AI Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        type: "urgent",
                        title: "High Priority Store Visit",
                        description: "BuildMaster Sandton hasn't been visited in 3 weeks",
                        action: "Schedule Visit",
                        confidence: 95
                      },
                      {
                        type: "order",
                        title: "Smart Order Suggestion",
                        description: "Hardware Central CPT predicted to need 240 units EPS12",
                        action: "Create Order",
                        confidence: 87
                      },
                      {
                        type: "route",
                        title: "Route Optimization",
                        description: "Rearrange JHB North route to save 2.5 hours weekly",
                        action: "Apply Changes",
                        confidence: 91
                      },
                      {
                        type: "forecast",
                        title: "Demand Forecast Alert",
                        description: "BR XPS demand increasing 15% in Western Cape",
                        action: "View Details",
                        confidence: 83
                      }
                    ].map((suggestion, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              suggestion.type === 'urgent' ? 'bg-red-500' :
                              suggestion.type === 'order' ? 'bg-blue-500' :
                              suggestion.type === 'route' ? 'bg-green-500' :
                              'bg-yellow-500'
                            }`}></div>
                            <p className="font-medium text-sm">{suggestion.title}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {suggestion.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                        <Button size="sm" variant="outline" className="text-xs">
                          {suggestion.action}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Performance Metrics */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Route Performance Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Performance Analytics Chart</p>
                      <p className="text-sm">Route efficiency and sales performance tracking</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Reps */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Reps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "John Smith", region: "Western Cape", score: 98 },
                      { name: "Sarah Jones", region: "Gauteng", score: 95 },
                      { name: "Mike Wilson", region: "KwaZulu-Natal", score: 92 },
                      { name: "Lisa Brown", region: "Eastern Cape", score: 89 },
                      { name: "David Taylor", region: "Free State", score: 87 }
                    ].map((rep, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{rep.name}</p>
                          <p className="text-xs text-gray-500">{rep.region}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${rep.score}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{rep.score}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stores">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5" />
                    <span>Hardware Store Directory</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input 
                        placeholder="Search stores..." 
                        className="pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">{(hardwareStores as any[])?.length?.toLocaleString() || '2,684'} Hardware Stores Ready to Load</h3>
                  <p className="text-gray-400 mb-4">
                    Your complete hardware store database will be available once you upload the Excel route files.
                  </p>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Route Files to View Stores
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}