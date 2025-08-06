import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/pages/Dashboard";
import ProductCatalog from "@/pages/ProductCatalog";
import ProductionPlanning from "@/pages/ProductionPlanning";
import InventoryAI from "@/pages/InventoryAI";
import GlobalDistributors from "@/pages/GlobalDistributors";
import BusinessIntelligence from "@/pages/BusinessIntelligence";
import BrandDetail from "@/pages/BrandDetail";
import RouteManagement from "@/pages/RouteManagement";
import PurchaseOrders from "@/pages/PurchaseOrders";
import FactorySetup from "@/pages/FactorySetup";
import ExtendedAutomation from "@/pages/ExtendedAutomation";
import ExcelUpload from "@/pages/ExcelUpload";
import Landing from "@/pages/Landing";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { FruitfulAssistChatbot, FruitfulAssistFloatingButton } from "@/components/FruitfulAssistChatbot";
import { useState } from "react";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication (only briefly)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CornexConnect...</p>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={Landing} />
      </Switch>
    );
  }

  // Show authenticated app
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/catalog" component={ProductCatalog} />
      <Route path="/production" component={ProductionPlanning} />
      <Route path="/inventory" component={InventoryAI} />
      <Route path="/distributors" component={GlobalDistributors} />
      <Route path="/analytics" component={BusinessIntelligence} />
      <Route path="/routes" component={RouteManagement} />
      <Route path="/purchase-orders" component={PurchaseOrders} />
      <Route path="/factory-setup" component={FactorySetup} />
      <Route path="/automation" component={ExtendedAutomation} />
      <Route path="/excel-upload" component={ExcelUpload} />
      <Route path="/brands/:id" component={BrandDetail} />
    </Switch>
  );
}

function AuthenticatedApp() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  return (
    <div className="flex h-screen animated-background cornex-pattern">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Router />
        </main>
      </div>
      
      {/* Fruitful Assist Chatbot */}
      <FruitfulAssistFloatingButton 
        onClick={() => setChatbotOpen(true)} 
        isOpen={chatbotOpen} 
      />
      <FruitfulAssistChatbot 
        isOpen={chatbotOpen} 
        onToggle={() => setChatbotOpen(!chatbotOpen)} 
      />
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <AuthenticatedApp />;
  }

  return <Router />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
