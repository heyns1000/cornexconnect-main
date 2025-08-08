import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  Settings, 
  Zap, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Play, 
  Pause, 
  BarChart3, 
  Cog, 
  Factory, 
  Calendar, 
  Wrench, 
  Target, 
  TrendingUp, 
  Shield, 
  Lightbulb,
  Brain,
  PlayCircle,
  StopCircle,
  Activity,
  RefreshCw,
  Plus,
  Edit3,
  Trash2,
  Eye
} from "lucide-react";

export default function ExtendedAutomation() {
  const { toast } = useToast();
  const [selectedRule, setSelectedRule] = useState<any>(null);
  const [showCreateRule, setShowCreateRule] = useState(false);

  // Fetch automation data
  const { data: automationRules = [] } = useQuery({
    queryKey: ['/api/automation-rules'],
  });

  const { data: automationEvents = [] } = useQuery({
    queryKey: ['/api/automation-events'],
  });

  const { data: maintenanceSchedules = [] } = useQuery({
    queryKey: ['/api/maintenance-schedules'],
  });

  // Mutations
  const toggleRuleMutation = useMutation({
    mutationFn: async (data: { id: string; isActive: boolean }) => {
      return apiRequest(`/api/automation-rules/${data.id}`, {
        method: 'PATCH',
        body: { isActive: data.isActive }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/automation-rules'] });
      toast({ title: "Rule updated successfully" });
    }
  });

  const executeRuleMutation = useMutation({
    mutationFn: async (ruleId: string) => {
      return apiRequest(`/api/automation-rules/${ruleId}/execute`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/automation-events'] });
      toast({ title: "Automation rule executed successfully" });
    }
  });

  // Helper functions
  const getRuleStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-100 text-red-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 1: return 'High';
      case 2: return 'Medium';
      case 3: return 'Low';
      default: return 'Unknown';
    }
  };

  const formatExecutionTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  // Calculate automation metrics
  const totalRules = automationRules.length;
  const activeRules = automationRules.filter((rule: any) => rule.isActive).length;
  const recentEvents = automationEvents.filter((event: any) => 
    new Date(event.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length;
  const successfulEvents = automationEvents.filter((event: any) => event.status === 'success').length;
  const successRate = automationEvents.length > 0 ? (successfulEvents / automationEvents.length) * 100 : 0;

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Bot className="w-8 h-8 mr-3 text-purple-600" />
            Extended Automation
          </h1>
          <p className="text-gray-600 mt-1">
            AI-powered automation for manufacturing, inventory, and production optimization
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowCreateRule(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Rule
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Automation Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-bold">{totalRules}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{activeRules} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold">{recentEvents}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold">{successRate.toFixed(1)}%</span>
            </div>
            <Progress value={successRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">🍎 Fruitful Assist Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-green-600">ACTIVE</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">AI optimizing continuously</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="events">Event History</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Automation Rules Tab */}
        <TabsContent value="rules" className="space-y-6">
          <div className="grid gap-4">
            {automationRules.map((rule: any) => (
              <Card key={rule.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                        {rule.ruleName}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{rule.category} automation</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(rule.priority)}>
                        {getPriorityText(rule.priority)}
                      </Badge>
                      <Badge className={getRuleStatusColor(rule.isActive)}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-gray-500">Trigger Type</Label>
                      <p className="font-medium">{rule.triggerType}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Action Type</Label>
                      <p className="font-medium">{rule.actionType}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Success Rate</Label>
                      <p className="font-medium">{rule.successRate}%</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-gray-500">Executions</Label>
                      <p className="font-medium">{rule.executionCount} times</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Last Triggered</Label>
                      <p className="font-medium">
                        {rule.lastTriggered 
                          ? new Date(rule.lastTriggered).toLocaleString()
                          : 'Never'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={rule.isActive}
                        onCheckedChange={(checked) => 
                          toggleRuleMutation.mutate({ id: rule.id, isActive: checked })
                        }
                        disabled={toggleRuleMutation.isPending}
                      />
                      <Label className="text-sm">Active</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedRule(rule)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => executeRuleMutation.mutate(rule.id)}
                        disabled={!rule.isActive || executeRuleMutation.isPending}
                      >
                        <PlayCircle className="w-4 h-4 mr-1" />
                        Execute
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {automationRules.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bot className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Automation Rules</h3>
                  <p className="text-gray-600 mb-4">Create your first automation rule to get started</p>
                  <Button onClick={() => setShowCreateRule(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Rule
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Event History Tab */}
        <TabsContent value="events" className="space-y-6">
          <div className="grid gap-4">
            {automationEvents.slice(0, 20).map((event: any) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getEventStatusColor(event.status)}`}>
                        {event.status === 'success' && <CheckCircle className="w-4 h-4" />}
                        {event.status === 'failed' && <XCircle className="w-4 h-4" />}
                        {event.status === 'pending' && <Clock className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium">{event.eventType}</p>
                        <p className="text-sm text-gray-600">
                          Rule: {automationRules.find((r: any) => r.id === event.ruleId)?.ruleName || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getEventStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(event.createdAt).toLocaleString()}
                      </p>
                      {event.executionTime && (
                        <p className="text-xs text-gray-500">
                          {formatExecutionTime(event.executionTime)}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {automationEvents.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Activity className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Events Yet</h3>
                  <p className="text-gray-600">Automation events will appear here once rules start executing</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-6">
          <div className="grid gap-4">
            {maintenanceSchedules.map((schedule: any) => (
              <Card key={schedule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Wrench className="w-5 h-5 mr-2 text-orange-500" />
                      {schedule.equipmentName}
                    </CardTitle>
                    <Badge className={
                      schedule.status === 'completed' ? 'bg-green-100 text-green-800' :
                      schedule.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      schedule.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {schedule.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500">Type</Label>
                      <p className="font-medium">{schedule.maintenanceType}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Scheduled Date</Label>
                      <p className="font-medium">
                        {new Date(schedule.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Duration</Label>
                      <p className="font-medium">{schedule.estimatedDuration} min</p>
                    </div>
                  </div>
                  
                  {schedule.assignedTechnician && (
                    <div className="mt-4">
                      <Label className="text-xs text-gray-500">Assigned Technician</Label>
                      <p className="font-medium">{schedule.assignedTechnician}</p>
                    </div>
                  )}
                  
                  {schedule.notes && (
                    <div className="mt-4">
                      <Label className="text-xs text-gray-500">Notes</Label>
                      <p className="text-sm">{schedule.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {maintenanceSchedules.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Scheduled Maintenance</h3>
                  <p className="text-gray-600">Maintenance schedules will appear here when created</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Rule Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {automationRules.slice(0, 5).map((rule: any) => (
                    <div key={rule.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{rule.ruleName}</p>
                        <p className="text-xs text-gray-500">{rule.executionCount} executions</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{rule.successRate}%</p>
                        <Progress value={parseFloat(rule.successRate)} className="w-20 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Efficiency Gains
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Production Efficiency</span>
                    <span className="font-semibold text-green-600">+23%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cost Reduction</span>
                    <span className="font-semibold text-green-600">+18%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Downtime Reduction</span>
                    <span className="font-semibold text-green-600">+31%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Quality Improvement</span>
                    <span className="font-semibold text-green-600">+15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-600" />
                🍎 Fruitful Assist AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Shield className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                  <h3 className="font-semibold mb-1">Risk Prevention</h3>
                  <p className="text-sm text-gray-600">15 potential issues prevented this week</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Target className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <h3 className="font-semibold mb-1">Optimization</h3>
                  <p className="text-sm text-gray-600">8 process improvements suggested</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Lightbulb className="w-8 h-8 mx-auto text-green-600 mb-2" />
                  <h3 className="font-semibold mb-1">Innovation</h3>
                  <p className="text-sm text-gray-600">3 new automation opportunities identified</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}