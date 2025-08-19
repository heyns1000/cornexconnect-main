import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageTransition } from "@/components/PageTransition";
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
import BulkImport from "@/pages/BulkImport";
import HardwareStores from "@/pages/HardwareStores";
import LogisticsIntegration from "@/pages/LogisticsIntegration";
import CompanyManagement from "@/pages/CompanyManagement";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import CompanySettings from "@/pages/CompanySettings";
import UserManagement from "@/pages/UserManagement";
import InventoryUpload from "@/pages/InventoryUpload";
import AuditTrail from "@/pages/AuditTrail";
import ProductLabels from "@/pages/ProductLabels";
import StoreMapVisualization from "@/pages/StoreMapVisualization";
import Profile from "@/pages/Profile";
import Achievements from "@/pages/Achievements";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { FruitfulAssistChatbot, FruitfulAssistFloatingButton } from "@/components/FruitfulAssistChatbot";
import { LoadingTransition } from "@/components/PageTransition";
import { AnimatedCard, FadeIn } from "@/components/AnimatedComponents";
import { MoodFloatingButton } from "@/components/MoodFloatingButton";
import { MoodProvider } from "@/hooks/useMoodContext";
// Translation system is now self-contained in useTranslation hook
import { useState } from "react";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Demo mode for Homemart Africa - bypass authentication
  const isDemoMode = window.location.hostname.includes('replit.dev') || true;

  // Show loading while checking authentication (only briefly)
  if (isLoading && !isDemoMode) {
    return (
      <LoadingTransition isLoading={true}>
        <div />
      </LoadingTransition>
    );
  }

  // Show public pages for unauthenticated users (only if not demo mode)
  if (!isAuthenticated && !isDemoMode) {
    return (
      <PageTransition>
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route component={Landing} />
        </Switch>
      </PageTransition>
    );
  }

  // Show authenticated app routes only (layout handled by AuthenticatedApp)
  return (
    <PageTransition>
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
        <Route path="/bulk-import" component={BulkImport} />
        <Route path="/hardware-stores" component={HardwareStores} />
        <Route path="/store-map" component={StoreMapVisualization} />
        <Route path="/logistics" component={LogisticsIntegration} />
        <Route path="/company-management" component={CompanyManagement} />
        <Route path="/company-settings" component={CompanySettings} />
        <Route path="/user-management" component={UserManagement} />
        <Route path="/inventory-upload" component={InventoryUpload} />
        <Route path="/audit-trail" component={AuditTrail} />
        <Route path="/product-labels" component={ProductLabels} />
        <Route path="/profile" component={Profile} />
        <Route path="/achievements" component={Achievements} />
        <Route path="/brands/:id" component={BrandDetail} />
      </Switch>
    </PageTransition>
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
      
      {/* AI-Powered Mood Selector */}
      <MoodFloatingButton />

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

  // Always use AuthenticatedApp in demo mode (bypasses authentication)
  return <AuthenticatedApp />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MoodProvider>
          <AppContent />
          
          <Toaster />
        </MoodProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
