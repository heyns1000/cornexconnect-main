import { Bell, RefreshCw, LogOut, User, Settings, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { CURRENCIES } from "@/lib/constants";
import { useState } from "react";
import CountrySelector from "@/components/CountrySelector";
import { useTranslation } from "@/hooks/useTranslation";

export default function Header() {
  const { user } = useAuth();
  const { currentCountry, currency, flag } = useTranslation();
  const [selectedCurrency, setSelectedCurrency] = useState(currency || "ZAR");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCountrySelector, setShowCountrySelector] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50 shadow-xl">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 shadow-lg">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                CornexConnect
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                🍎 Powered by Fruitful Assist AI • Manufacturing Excellence
              </p>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center space-x-4">
            {/* Country Selector - Instant Selection */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCountrySelector(true)}
                className="flex items-center space-x-2 px-3"
              >
                <Globe className="w-4 h-4" />
                <span className="text-lg">{flag}</span>
                <span className="font-medium">{currentCountry}</span>
              </Button>
            </div>
            
            {/* Currency Display */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Currency:</span>
              <span className="font-medium text-emerald-600">ZAR</span>
            </div>
            
            {/* Refresh Button */}
            <Button 
              className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white shadow-lg"
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </Button>
            
            {/* User Menu */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.email || "User"}
                </p>
                <p className="text-xs text-gray-500">Team Member</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={user?.profileImageUrl || ""} />
                      <AvatarFallback className="bg-cornex-blue text-white">
                        {user?.firstName && user?.lastName
                          ? `${user.firstName[0]}${user.lastName[0]}`
                          : user?.email?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/company-settings'}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.location.href = '/api/logout'}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      
      {/* Country Selector Modal */}
      <CountrySelector
        open={showCountrySelector}
        onClose={() => setShowCountrySelector(false)}
      />
    </header>
  );
}
