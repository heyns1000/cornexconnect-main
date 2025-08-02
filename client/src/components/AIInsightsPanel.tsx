import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AIInsightsPanel() {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

  const insights = [
    {
      id: "demand-optimization",
      title: "Demand Pattern Optimization",
      type: "opportunity",
      impact: "High",
      confidence: 94,
      description: "AI detected 23% increase in EPS04 demand during Q2. Recommend increasing production by 15%.",
      savings: "R 340,000",
      timeframe: "Next 30 days",
      actions: [
        "Increase EPS04 production schedule by 15%",
        "Adjust raw material orders accordingly", 
        "Notify key distributors of increased availability"
      ]
    },
    {
      id: "inventory-efficiency",
      title: "Inventory Efficiency Improvement",
      type: "optimization",
      impact: "Medium",
      confidence: 87,
      description: "Current BR9 stock levels are 40% above optimal. Consider promotional pricing to reduce excess inventory.",
      savings: "R 125,000",
      timeframe: "Next 60 days",
      actions: [
        "Implement 12% promotional discount on BR9",
        "Target high-volume distributors",
        "Reduce next production batch by 25%"
      ]
    },
    {
      id: "maintenance-prediction",
      title: "Predictive Maintenance Alert",
      type: "warning",
      impact: "Critical",
      confidence: 91,
      description: "LED production line showing early wear indicators. Schedule maintenance within 5 days to prevent downtime.",
      savings: "R 85,000",
      timeframe: "Next 5 days",
      actions: [
        "Schedule immediate maintenance inspection",
        "Order replacement parts proactively",
        "Shift LED orders to backup production capacity"
      ]
    },
    {
      id: "market-expansion",
      title: "Market Expansion Opportunity",
      type: "growth",
      impact: "High",
      confidence: 78,
      description: "Eastern Cape showing 45% growth potential based on construction activity data and competitor analysis.",
      savings: "R 890,000",
      timeframe: "Next 90 days",
      actions: [
        "Identify 3-5 potential distributors in Eastern Cape",
        "Develop region-specific pricing strategy",
        "Launch targeted marketing campaign"
      ]
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "optimization":
        return <Target className="w-5 h-5 text-blue-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "growth":
        return <Lightbulb className="w-5 h-5 text-purple-600" />;
      default:
        return <Brain className="w-5 h-5 text-gray-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Critical":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-cornex-blue" />
            <span>AI Intelligence Center</span>
          </CardTitle>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Zap className="w-3 h-3 mr-1" />
            4 Active Insights
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="performance">AI Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight) => (
                <Card 
                  key={insight.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedInsight === insight.id ? 'ring-2 ring-cornex-blue' : ''
                  }`}
                  onClick={() => setSelectedInsight(insight.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getInsightIcon(insight.type)}
                        <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      </div>
                      <Badge className={getImpactColor(insight.impact)}>
                        {insight.impact}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {insight.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Confidence:</span>
                        <span className="font-medium">{insight.confidence}%</span>
                      </div>
                      <Progress value={insight.confidence} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <div className="text-sm">
                        <span className="text-gray-500">Potential Impact: </span>
                        <span className="font-medium text-green-600">{insight.savings}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {insight.timeframe}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedInsight && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Detailed Analysis & Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const insight = insights.find(i => i.id === selectedInsight);
                    if (!insight) return null;

                    return (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          {getInsightIcon(insight.type)}
                          <h4 className="text-lg font-medium">{insight.title}</h4>
                          <Badge className={getImpactColor(insight.impact)}>
                            {insight.impact} Impact
                          </Badge>
                        </div>

                        <p className="text-gray-700">{insight.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Confidence Level</p>
                            <p className="text-xl font-bold text-gray-900">{insight.confidence}%</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-gray-500">Potential Savings</p>
                            <p className="text-xl font-bold text-green-600">{insight.savings}</p>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-500">Implementation Time</p>
                            <p className="text-xl font-bold text-blue-600">{insight.timeframe}</p>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Recommended Actions:</h5>
                          <div className="space-y-2">
                            {insight.actions.map((action, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-cornex-blue text-white rounded-full flex items-center justify-center text-xs font-bold">
                                  {index + 1}
                                </div>
                                <span className="text-sm text-gray-700">{action}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex space-x-3 pt-4">
                          <Button className="bg-cornex-blue hover:bg-cornex-dark">
                            Implement Recommendations
                          </Button>
                          <Button variant="outline">
                            Schedule Review
                          </Button>
                          <Button variant="ghost">
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <div className="text-center py-8">
              <Lightbulb className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">AI Recommendations Engine</p>
              <p className="text-sm text-gray-400">Intelligent suggestions based on data analysis</p>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-cornex-blue">94.7%</div>
                  <p className="text-sm text-gray-500">Prediction Accuracy</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">R 2.4M</div>
                  <p className="text-sm text-gray-500">Cost Savings YTD</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">127</div>
                  <p className="text-sm text-gray-500">Insights Generated</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
