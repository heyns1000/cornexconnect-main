import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageTransition } from "@/components/PageTransition";
import { AnimatedCard, FadeIn } from "@/components/AnimatedComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  Shield, 
  CalendarIcon, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  User,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout';
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high';
}

export default function AuditTrail() {
  const { toast } = useToast();
  
  const [filters, setFilters] = useState({
    action: '',
    user: '',
    resource: '',
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
  });

  // Removed duplicate - using the comprehensive exportToCSV function below

  const applyFilters = () => {
    toast({
      title: "Applying Filters",
      description: "Filtering audit logs based on selected criteria...",
    });
  };

  const clearFilters = () => {
    setFilters({
      action: '',
      user: '',
      resource: '',
      dateFrom: null,
      dateTo: null,
    });
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset.",
    });
  };

  const { data: auditLogs = [], isLoading } = useQuery<AuditLog[]>({
    queryKey: ["/api/audit-logs", filters],
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return <Plus className="h-4 w-4 text-green-600" />;
      case 'read': return <Eye className="h-4 w-4 text-blue-600" />;
      case 'update': return <Edit className="h-4 w-4 text-yellow-600" />;
      case 'delete': return <Trash2 className="h-4 w-4 text-red-600" />;
      case 'login': return <User className="h-4 w-4 text-emerald-600" />;
      case 'logout': return <User className="h-4 w-4 text-gray-600" />;
      default: return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'update': return 'bg-yellow-100 text-yellow-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'login': return 'bg-emerald-100 text-emerald-800';
      case 'logout': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const exportToCSV = () => {
    toast({
      title: "Exporting Audit Logs",
      description: "Preparing audit trail export for download...",
    });
    
    // Implement CSV export functionality
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Timestamp,User,Action,Resource,Details,IP Address\n"
      + auditLogs.map(log => 
          `${log.timestamp},"${log.userName}",${log.action},"${log.resource}","${log.details}",${log.ipAddress}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_log_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sample data for demonstration
  const sampleAuditLogs: AuditLog[] = [
    {
      id: "audit_001",
      timestamp: new Date().toISOString(),
      userId: "homemart_admin_001",
      userName: "HOMEMART ADMIN",
      action: "login",
      resource: "Authentication",
      details: "User successfully logged in",
      ipAddress: "41.216.224.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "low"
    },
    {
      id: "audit_002",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      userId: "homemart_admin_001",
      userName: "HOMEMART ADMIN",
      action: "update",
      resource: "Company Settings",
      details: "Updated company contact information",
      ipAddress: "41.216.224.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "medium"
    },
    {
      id: "audit_003",
      timestamp: new Date(Date.now() - 600000).toISOString(),
      userId: "homemart_admin_001",
      userName: "HOMEMART ADMIN",
      action: "create",
      resource: "User Management",
      resourceId: "user_002",
      details: "Created new user: John Doe (sales@homemart.co.za)",
      ipAddress: "41.216.224.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "high"
    },
    {
      id: "audit_004",
      timestamp: new Date(Date.now() - 900000).toISOString(),
      userId: "homemart_admin_001",
      userName: "HOMEMART ADMIN",
      action: "read",
      resource: "Inventory",
      details: "Viewed inventory dashboard",
      ipAddress: "41.216.224.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "low"
    }
  ];

  const displayLogs = auditLogs.length > 0 ? auditLogs : sampleAuditLogs;

  return (
    <PageTransition>
      <div className="p-8 space-y-8">
        <FadeIn>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Audit Trail</h1>
              <p className="text-gray-600 mt-2">Monitor all user activities and system changes</p>
            </div>
            <Button onClick={exportToCSV} className="bg-emerald-600 hover:bg-emerald-700">
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </FadeIn>

        <AnimatedCard className="backdrop-blur-sm bg-white/80">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2 text-emerald-600" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="action-filter">Action</Label>
                <Select value={filters.action} onValueChange={(value) => setFilters(prev => ({ ...prev, action: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="login">Login</SelectItem>
                    <SelectItem value="logout">Logout</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="user-filter">User</Label>
                <Select value={filters.user} onValueChange={(value) => setFilters(prev => ({ ...prev, user: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="homemart_admin_001">HOMEMART ADMIN</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="resource-filter">Resource</Label>
                <Select value={filters.resource} onValueChange={(value) => setFilters(prev => ({ ...prev, resource: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All resources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Resources</SelectItem>
                    <SelectItem value="Authentication">Authentication</SelectItem>
                    <SelectItem value="Company Settings">Company Settings</SelectItem>
                    <SelectItem value="User Management">User Management</SelectItem>
                    <SelectItem value="Inventory">Inventory</SelectItem>
                    <SelectItem value="Products">Products</SelectItem>
                    <SelectItem value="Orders">Orders</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date-from">Date From</Label>
                <Input
                  type="date"
                  value={filters.dateFrom ? format(filters.dateFrom, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    dateFrom: e.target.value ? new Date(e.target.value) : null 
                  }))}
                />
              </div>

              <div>
                <Label htmlFor="date-to">Date To</Label>
                <Input
                  type="date"
                  value={filters.dateTo ? format(filters.dateTo, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    dateTo: e.target.value ? new Date(e.target.value) : null 
                  }))}
                />
              </div>
            </div>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard className="backdrop-blur-sm bg-white/80">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-emerald-600" />
              Audit Logs ({displayLogs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {displayLogs.map((log, index) => (
                  <FadeIn key={log.id} delay={index * 0.05}>
                    <div className="flex items-start justify-between p-4 rounded-lg border bg-white/50 hover:bg-white/80 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            {getActionIcon(log.action)}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getSeverityColor(log.severity)}`}></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge className={getActionColor(log.action)}>
                              {log.action.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-600">{log.resource}</span>
                            {log.resourceId && (
                              <span className="text-xs text-gray-500">ID: {log.resourceId}</span>
                            )}
                          </div>
                          <p className="text-gray-900 font-medium mb-1">{log.details}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {log.userName}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {format(new Date(log.timestamp), "PPpp")}
                            </span>
                            <span>IP: {log.ipAddress}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                ))}
                {displayLogs.length === 0 && (
                  <div className="text-center py-12">
                    <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
                    <p className="text-gray-500">User activities will appear here once they start using the system.</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </AnimatedCard>
      </div>
    </PageTransition>
  );
}