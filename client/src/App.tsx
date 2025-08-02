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
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
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
    </Switch>
  );
}

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen bg-gray-50">
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto">
              <Router />
            </main>
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
