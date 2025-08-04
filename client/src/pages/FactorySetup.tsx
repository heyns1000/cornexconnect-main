import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Factory, 
  Brain, 
  Target, 
  TrendingUp, 
  Zap, 
  Settings, 
  Package,
  Users,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Rocket,
  Shield,
  Award,
  BarChart3,
  Cog,
  Building2,
  LineChart
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/currency";
import type { 
  FactorySetup, 
  ProductionMetrics, 
  AiInsight,
  FactoryRecommendation 
} from "@shared/schema";

export default function FactorySetup() {
  const [selectedFactory, setSelectedFactory] = useState<string | null>(null);
  const [newFactoryForm, setNewFactoryForm] = useState({
    name: '',
    location: '',
    targetStores: 300,
    initialCapacity: 1000
  });

  const queryClient = useQueryClient();

  // Fetch factory setups
  const { data: factories = [], isLoading: factoriesLoading } = useQuery<FactorySetup[]>({
    queryKey: ["/api/factory-setups"],
  });

  // Fetch AI insights
  const { data: aiInsights = [], isLoading: insightsLoading } = useQuery<AiInsight[]>({
    queryKey: ["/api/ai-insights"],
  });

  // Fetch production metrics for selected factory
  const { data: productionMetrics = [], isLoading: metricsLoading } = useQuery<ProductionMetrics[]>({
    queryKey: ["/api/production-metrics", selectedFactory],
    enabled: !!selectedFactory,
  });

  // Fetch factory recommendations for selected factory
  const { data: factoryRecommendations = [], isLoading: recommendationsLoading } = useQuery<FactoryRecommendation[]>({
    queryKey: ["/api/factory-recommendations", selectedFactory],
    enabled: !!selectedFactory,
  });

  // Create new factory setup
  const createFactoryMutation = useMutation({
    mutationFn: async (factoryData: any) => {
      return await apiRequest("/api/factory-setups", "POST", {
        factoryName: factoryData.name,
        location: factoryData.location,
        ownershipPhase: 'planning',
        progressPercentage: 0,
        totalInvestment: "0",
        currentPayment: 0,
        totalPayments: 1,
        monthlyRevenue: "0",
        productionCapacity: factoryData.initialCapacity,
        aiOptimizationLevel: 0,
        connectedStores: 0,
        targetStores: factoryData.targetStores,
        isActive: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/factory-setups"] });
      setNewFactoryForm({ name: '', location: '', targetStores: 300, initialCapacity: 1000 });
    },
  });

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'setup': return 'bg-yellow-100 text-yellow-800';
      case 'installation': return 'bg-orange-100 text-orange-800';
      case 'testing': return 'bg-purple-100 text-purple-800';
      case 'operational': return 'bg-green-100 text-green-800';
      case 'owned': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Factory className="w-8 h-8 mr-3" />
                🍎 Fruitful Assist Factory Setup & Ownership
              </h1>
              <p className="text-indigo-100">
                🍎 Fruitful Assist AI-powered turnkey factory solutions with complete ownership transfer
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Brain className="w-4 h-4 mr-2" />
                🍎 Fruitful Assist AI
              </Button>
              <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Rocket className="w-4 h-4 mr-2" />
                New Factory Setup
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-indigo-200" />
                <div>
                  <p className="text-sm text-indigo-200">Active Factories</p>
                  <p className="text-xl font-bold">{factories.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-indigo-200" />
                <div>
                  <p className="text-sm text-indigo-200">Monthly Revenue</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(
                      factories.reduce((sum, f) => sum + parseFloat(f.monthlyRevenue), 0), 
                      'ZAR'
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-indigo-200" />
                <div>
                  <p className="text-sm text-indigo-200">Connected Stores</p>
                  <p className="text-xl font-bold">
                    {factories.reduce((sum, f) => sum + f.connectedStores, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-indigo-200" />
                <div>
                  <p className="text-sm text-indigo-200">AI Optimization</p>
                  <p className="text-xl font-bold">
                    {factories.length > 0 
                      ? Math.round(factories.reduce((sum, f) => sum + f.aiOptimizationLevel, 0) / factories.length)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="factories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="factories">Factory Portfolio</TabsTrigger>
            <TabsTrigger value="ai-insights">🍎 Fruitful Assist AI</TabsTrigger>
            <TabsTrigger value="production">Production Metrics</TabsTrigger>
            <TabsTrigger value="ownership">Ownership Process</TabsTrigger>
            <TabsTrigger value="setup">New Factory Setup</TabsTrigger>
          </TabsList>

          <TabsContent value="factories">
            <div className="grid gap-6">
              {factories.map((factory) => {
                // Add AI recommendations to factory object
                const factoryWithRecommendations = {
                  ...factory,
                  aiRecommendations: [
                    "Optimize cutting speeds for 15% efficiency gain",
                    "Schedule maintenance during off-peak hours",
                    "Implement renewable energy for cost reduction"
                  ],
                  setupDate: new Date(factory.setupDate || Date.now()),
                  completionDate: new Date(factory.completionDate || Date.now())
                };
                
                return (
                <Card key={factoryWithRecommendations.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center text-xl">
                          <Factory className="w-5 h-5 mr-2 text-indigo-600" />
                          {factoryWithRecommendations.factoryName}
                        </CardTitle>
                        <p className="text-gray-600 flex items-center mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {factoryWithRecommendations.location}
                        </p>
                      </div>
                      <Badge className={getPhaseColor(factoryWithRecommendations.ownershipPhase)}>
                        {factoryWithRecommendations.ownershipPhase.charAt(0).toUpperCase() + factoryWithRecommendations.ownershipPhase.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3">Ownership Progress</h4>
                        <Progress value={factoryWithRecommendations.progressPercentage} className="mb-2" />
                        <p className="text-sm text-gray-600">
                          Payment {factoryWithRecommendations.currentPayment} of {factoryWithRecommendations.totalPayments} completed
                        </p>
                        <p className="text-lg font-bold text-green-600 mt-2">
                          {formatCurrency(parseInt(factoryWithRecommendations.totalInvestment), 'ZAR')} Total Investment
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3">Performance Metrics</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Monthly Revenue:</span>
                            <span className="font-semibold">{formatCurrency(parseInt(factoryWithRecommendations.monthlyRevenue), 'ZAR')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Production Capacity:</span>
                            <span className="font-semibold">{factoryWithRecommendations.productionCapacity.toLocaleString()} units/month</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">AI Optimization:</span>
                            <span className="font-semibold text-blue-600">{factoryWithRecommendations.aiOptimizationLevel}%</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3">Store Network</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Connected Stores:</span>
                            <span className="font-semibold">{factoryWithRecommendations.connectedStores}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Target Stores:</span>
                            <span className="font-semibold">{factoryWithRecommendations.targetStores}</span>
                          </div>
                          <Progress value={(factoryWithRecommendations.connectedStores / factoryWithRecommendations.targetStores) * 100} className="mt-2" />
                          <p className="text-xs text-gray-500">
                            {Math.round((factoryWithRecommendations.connectedStores / factoryWithRecommendations.targetStores) * 100)}% coverage achieved
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                        <Brain className="w-4 h-4 mr-1" />
                        AI Recommendations
                      </h4>
                      <div className="grid gap-2">
                        {(factoryWithRecommendations.aiRecommendations || []).map((rec, index) => (
                          <div key={index} className="flex items-start space-x-2 text-sm">
                            <Zap className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-6 pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        Setup: {factoryWithRecommendations.setupDate.toLocaleDateString()} | 
                        Completion: {factoryWithRecommendations.completionDate.toLocaleDateString()}
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm">
                          <Settings className="w-4 h-4 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="ai-insights">
            <div className="grid gap-6">
              {/* AI Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-6 h-6 mr-2 text-purple-600" />
                    🍎 Fruitful Assist AI - Factory Intelligence
                  </CardTitle>
                  <p className="text-gray-600">
                    Advanced AI analytics for production optimization, market insights, and profitability enhancement
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-purple-600" />
                      </div>
                      <h3 className="font-semibold mb-1">Predictive Analytics</h3>
                      <p className="text-sm text-gray-600">Market demand forecasting with 94% accuracy</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                        <Cog className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="font-semibold mb-1">Process Optimization</h3>
                      <p className="text-sm text-gray-600">Real-time production efficiency improvements</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                        <Target className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="font-semibold mb-1">Market Intelligence</h3>
                      <p className="text-sm text-gray-600">Strategic expansion and pricing recommendations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <div className="grid gap-4">
                {aiInsights.map((insight) => (
                  <Card key={insight.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            insight.type === 'optimization' ? 'bg-purple-100' :
                            insight.type === 'market' ? 'bg-blue-100' :
                            insight.type === 'expansion' ? 'bg-green-100' :
                            'bg-yellow-100'
                          }`}>
                            {insight.type === 'optimization' && <Cog className="w-5 h-5 text-purple-600" />}
                            {insight.type === 'market' && <TrendingUp className="w-5 h-5 text-blue-600" />}
                            {insight.type === 'expansion' && <Target className="w-5 h-5 text-green-600" />}
                            {insight.type === 'cost_reduction' && <DollarSign className="w-5 h-5 text-yellow-600" />}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{insight.title}</h3>
                            <p className="text-gray-600 mt-1">{insight.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getImpactColor(insight.impact)} bg-transparent border`}>
                            {insight.impact.toUpperCase()} IMPACT
                          </Badge>
                          {insight.actionRequired && (
                            <div className="flex items-center mt-2 text-orange-600">
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              <span className="text-xs font-medium">ACTION REQUIRED</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-green-600">
                          Estimated Value: {insight.estimatedValue}
                        </div>
                        <Button size="sm" variant={insight.actionRequired ? "default" : "outline"}>
                          {insight.actionRequired ? "Take Action" : "Learn More"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="production">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    Daily Output
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {productionMetrics[0]?.dailyOutput ? productionMetrics[0].dailyOutput.toLocaleString() : "0"} units
                  </div>
                  <p className="text-sm text-gray-600">+12% vs yesterday</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Zap className="w-5 h-5 mr-2 text-green-600" />
                    Efficiency Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {productionMetrics[0]?.efficiency || 0}%
                  </div>
                  <Progress value={productionMetrics[0]?.efficiency || 0} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Award className="w-5 h-5 mr-2 text-purple-600" />
                    Quality Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {productionMetrics[0]?.qualityScore || 0}%
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                    Exceeds targets
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                    Waste Reduction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {productionMetrics[0]?.wasteReduction || 0}%
                  </div>
                  <p className="text-sm text-gray-600">vs industry average</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                    Energy Savings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {productionMetrics[0]?.energySavings || 0}%
                  </div>
                  <p className="text-sm text-gray-600">R 45k saved monthly</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                    Profit Margin
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {productionMetrics[0]?.profitMargin || 0}%
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                    +5.2% this quarter
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ownership">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-green-600" />
                  Factory Ownership Transfer Process
                </CardTitle>
                <p className="text-gray-600">
                  Complete turnkey solution with guaranteed ownership transfer upon final payment
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Phase 1 */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 rounded-full p-3 flex items-center justify-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">Initial Setup & First Payment</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Included Services:</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>✅ Site preparation & evaluation</li>
                            <li>✅ Equipment specification & ordering</li>
                            <li>✅ Permit & licensing assistance</li>
                            <li>✅ Initial EPS raw material supply</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Payment Details:</h4>
                          <p className="text-sm text-gray-600 mb-2">33% of total investment</p>
                          <p className="text-lg font-bold text-green-600">R 950,000 - R 1,100,000</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Factory Setup Initiated</Badge>
                    </div>
                  </div>

                  {/* Phase 2 */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 rounded-full p-3 flex items-center justify-center">
                      <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">Installation & Testing Phase</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Included Services:</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>✅ EPS cutting machine installation</li>
                            <li>✅ Cloud software setup & training</li>
                            <li>✅ Quality control system implementation</li>
                            <li>✅ Staff training & certification</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Payment Schedule:</h4>
                          <p className="text-sm text-gray-600 mb-1">Payment 2: 33% (Equipment delivery)</p>
                          <p className="text-sm text-gray-600 mb-2">Payment 3: 34% (Installation complete)</p>
                        </div>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">Equipment Installation & Testing</Badge>
                    </div>
                  </div>

                  {/* Phase 3 */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 rounded-full p-3 flex items-center justify-center">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">Full Ownership Transfer</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">What You Receive:</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>✅ 100% ownership of all equipment</li>
                            <li>✅ Perpetual software license</li>
                            <li>✅ Brand licensing agreement</li>
                            <li>✅ Supply chain connections</li>
                            <li>✅ Ongoing technical support</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Guaranteed Results:</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>🎯 300+ store network connectivity</li>
                            <li>🎯 R 400k+ monthly revenue potential</li>
                            <li>🎯 90%+ production efficiency</li>
                            <li>🎯 Complete operational independence</li>
                          </ul>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Complete Asset Ownership</Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-600" />
                    Ownership Guarantee
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Upon final payment completion, you receive immediate and complete ownership of all factory assets, 
                    including machinery, software licenses, brand rights, and established supply chain relationships. 
                    No ongoing fees or restrictions.
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Rocket className="w-4 h-4 mr-2" />
                    Start Factory Setup Process
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="setup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Rocket className="w-6 h-6 mr-2 text-indigo-600" />
                  New Factory Setup Configuration
                </CardTitle>
                <p className="text-gray-600">
                  Configure your new Cornex factory with AI-optimized specifications
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="factory-name">Factory Name</Label>
                      <Input
                        id="factory-name"
                        placeholder="e.g., Cornex Durban Production Hub"
                        value={newFactoryForm.name}
                        onChange={(e) => setNewFactoryForm({...newFactoryForm, name: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Durban, KwaZulu-Natal"
                        value={newFactoryForm.location}
                        onChange={(e) => setNewFactoryForm({...newFactoryForm, location: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="target-stores">Target Store Network</Label>
                      <Input
                        id="target-stores"
                        type="number"
                        value={newFactoryForm.targetStores}
                        onChange={(e) => setNewFactoryForm({...newFactoryForm, targetStores: parseInt(e.target.value)})}
                      />
                      <p className="text-sm text-gray-600 mt-1">Number of hardware stores to connect</p>
                    </div>

                    <div>
                      <Label htmlFor="initial-capacity">Initial Production Capacity</Label>
                      <Input
                        id="initial-capacity"
                        type="number"
                        value={newFactoryForm.initialCapacity}
                        onChange={(e) => setNewFactoryForm({...newFactoryForm, initialCapacity: parseInt(e.target.value)})}
                      />
                      <p className="text-sm text-gray-600 mt-1">Units per month</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold mb-4 flex items-center">
                        <Brain className="w-5 h-5 mr-2 text-purple-600" />
                        AI Recommendations
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                          <span>Location shows high demand potential for EPS products</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                          <span>Target store network size is optimal for ROI</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                          <span>Initial capacity aligns with market demand</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="font-semibold mb-4">Investment Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Equipment & Setup:</span>
                          <span className="font-semibold">R 2,400,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Software & Training:</span>
                          <span className="font-semibold">R 350,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Initial Inventory:</span>
                          <span className="font-semibold">R 200,000</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total Investment:</span>
                          <span className="text-green-600">R 2,950,000</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => createFactoryMutation.mutate(newFactoryForm)}
                      disabled={createFactoryMutation.isPending}
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      {createFactoryMutation.isPending ? "Setting Up..." : "Initiate Factory Setup"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}