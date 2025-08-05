import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/Dashboard";
import ProductCatalog from "@/pages/ProductCatalog";
import ProductionPlanning from "@/pages/ProductionPlanning";
import InventoryAI from "@/pages/InventoryAI";
import GlobalDistributors from "@/pages/GlobalDistributors";
import BusinessIntelligence from "@/pages/BusinessIntelligence";
import BrandDetail from "@/pages/BrandDetail";
import RouteManagement from "@/pages/RouteManagement";
import FactorySetup from "@/pages/FactorySetup";
import ExtendedAutomation from "@/pages/ExtendedAutomation";
import ExcelUpload from "@/pages/ExcelUpload";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { FruitfulAssistChatbot, FruitfulAssistFloatingButton } from "@/components/FruitfulAssistChatbot";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/catalog" component={ProductCatalog} />
      <Route path="/production" component={ProductionPlanning} />
      <Route path="/inventory" component={InventoryAI} />
      <Route path="/distributors" component={GlobalDistributors} />
      <Route path="/analytics" component={BusinessIntelligence} />
      <Route path="/routes" component={RouteManagement} />
      <Route path="/factory-setup" component={FactorySetup} />
      <Route path="/automation" component={ExtendedAutomation} />
      <Route path="/excel-upload" component={ExcelUpload} />
      <Route path="/brands/:id" component={BrandDetail} />
    </Switch>
  );
}

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen animated-background cornex-pattern">
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto">
              <Router />
            </main>
          </div>
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
        
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
