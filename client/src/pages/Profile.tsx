import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageTransition } from "@/components/PageTransition";
import { User, Mail, Building2, CreditCard, Shield } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  return (
    <PageTransition>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            👤 User Profile
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Information */}
          <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.profileImageUrl || ""} />
                  <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-lg">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <Badge className="mt-1">Team Member</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Company Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm font-medium">Company Name</p>
                <p className="text-lg font-bold">HOMEMART AFRICA</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Registration Number</p>
                <p>2022/854581/07</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Credit Limit</p>
                <p className="text-lg font-bold text-green-600">R500,000</p>
              </div>
              <Badge variant="outline" className="bg-emerald-100 text-emerald-700">
                Enterprise Evaluation
              </Badge>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Account Status</span>
                <Badge className="bg-green-100 text-green-700">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Access Level</span>
                <Badge variant="outline">Admin</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Login</span>
                <span className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => window.location.href = '/company-settings'}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Company Settings
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => window.location.href = '/audit-trail'}
              >
                <Shield className="w-4 h-4 mr-2" />
                Audit Trail
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => window.location.href = '/user-management'}
              >
                <User className="w-4 h-4 mr-2" />
                User Management
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}