import { 
  LayoutDashboard, 
  Package, 
  Factory, 
  Warehouse, 
  Users, 
  TrendingUp, 
  Settings, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Route,
  Bot,
  Upload,
  ShoppingCart,
  Truck,
  Store,
  Building2,
  User,
  LogOut
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CORNEX_BRANDS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { HoverLift } from "@/components/AnimatedComponents";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const navigation = [
    { name: "AI Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Product Catalog", href: "/catalog", icon: Package },
    { name: "Production Planning", href: "/production", icon: Factory },
    { name: "Inventory AI", href: "/inventory", icon: Warehouse },
    { name: "Global Distributors", href: "/distributors", icon: Users },
    { name: "Route Management", href: "/routes", icon: Route },
    { name: "Purchase Orders", href: "/purchase-orders", icon: ShoppingCart },
    { name: "SA Logistics", href: "/logistics", icon: Truck },
    { name: "Factory Setup", href: "/factory-setup", icon: Factory },
    { name: "Extended Automation", href: "/automation", icon: Settings },
    { name: "Bulk Import", href: "/bulk-import", icon: Upload },
    { name: "Business Intelligence", href: "/analytics", icon: TrendingUp },
  ];

  const handleLogout = async () => {
    try {
      // Log the logout action
      await apiRequest("/api/auth/audit", "POST", {
        action: "logout",
        details: "User logged out from CornexConnect platform",
      });

      // Redirect to logout endpoint (will handle the actual logout)
      window.location.href = "/api/logout";
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if audit fails
      window.location.href = "/api/logout";
    }
  };

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <aside className={cn(
      "bg-white shadow-lg border-r border-gray-200 sidebar-transition flex flex-col transition-all duration-300 ease-out",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Collapse/Expand Button */}
      <div className="p-4 border-b border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-center"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <nav className="flex-1 mt-6 px-4">
        {/* Main Navigation */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, staggerChildren: 0.05 }}
        >
          {navigation.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
              >
                <HoverLift lift={2}>
                  <Link href={item.href}>
                    <div className={cn(
                      "flex items-center p-3 mx-2 my-1 rounded-lg transition-all duration-200 ease-out cursor-pointer transform",
                      isActive(item.href) 
                        ? "bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 font-semibold shadow-sm scale-105" 
                        : "text-gray-600 hover:text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 hover:scale-105"
                    )}>
                      <Icon className="w-5 h-5 mr-3 flex-shrink-0 transition-transform duration-200 ease-out hover:scale-110" />
                      {!collapsed && (
                        <motion.span 
                          className="transition-opacity duration-300"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </div>
                  </Link>
                </HoverLift>
              </motion.div>
            );
          })}
        </motion.div>
        
        {/* Sub-Brands Section */}
        {!collapsed && (
          <div className="mt-8">
            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Cornex™ Brands
            </h3>
            <div className="mt-3 space-y-1">
              {CORNEX_BRANDS.map((brand) => (
                <Link key={brand.id} href={`/brands/${brand.id}`}>
                  <div className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <span 
                      className="brand-dot" 
                      style={{ backgroundColor: brand.color }}
                    ></span>
                    <span>{brand.displayName}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* User Profile & Settings */}
        <div className="mt-auto pt-6 border-t border-gray-200">
          {!collapsed && user && (
            <motion.div 
              className="px-3 py-3 mb-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          
          <div className="space-y-1">
            <HoverLift lift={2}>
              <Link href="/company-settings">
                <div className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 hover:text-emerald-700 rounded-lg transition-all duration-200">
                  <Settings className="w-4 h-4 mr-3 flex-shrink-0" />
                  {!collapsed && <span>Company Settings</span>}
                </div>
              </Link>
            </HoverLift>
            
            <HoverLift lift={2}>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-3 flex-shrink-0" />
                {!collapsed && <span>Logout</span>}
              </button>
            </HoverLift>
          </div>
        </div>
        
        {/* Footer Links */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="space-y-1">
            <Link href="/hardware-stores">
              <div className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Store className="w-4 h-4 mr-3 flex-shrink-0" />
                {!collapsed && <span>Hardware Stores</span>}
              </div>
            </Link>
            <Link href="/company-management">
              <div className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Building2 className="w-4 h-4 mr-3 flex-shrink-0" />
                {!collapsed && <span>Company Management</span>}
              </div>
            </Link>
            <Link href="/licensing">
              <div className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <FileText className="w-4 h-4 mr-3 flex-shrink-0" />
                {!collapsed && <span>Licensing</span>}
              </div>
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  );
}
