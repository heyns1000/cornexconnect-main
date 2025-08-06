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
  Truck
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CORNEX_BRANDS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [location] = useLocation();

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
    { name: "Excel Upload", href: "/excel-upload", icon: Upload },
    { name: "Business Intelligence", href: "/analytics", icon: TrendingUp },
  ];

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
        <div className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <div className={cn(
                  "flex items-center p-3 mx-2 my-1 rounded-lg transition-all duration-200 ease-out cursor-pointer",
                  isActive(item.href) 
                    ? "bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 font-semibold shadow-sm" 
                    : "text-gray-600 hover:text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50"
                )}>
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0 transition-transform duration-200 ease-out hover:scale-110" />
                  {!collapsed && <span className="transition-opacity duration-300">{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </div>
        
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

        {/* Footer Links */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="space-y-1">
            <Link href="/factory-setup">
              <div className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-4 h-4 mr-3 flex-shrink-0" />
                {!collapsed && <span>Factory Setup</span>}
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
