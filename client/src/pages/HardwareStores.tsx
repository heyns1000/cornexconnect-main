import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Store, MapPin, Users, Search, Filter } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { useTranslation } from "@/hooks/useTranslation";

export default function HardwareStores() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("all");

  const { data: stores = [], isLoading: storesLoading } = useQuery({
    queryKey: ["/api/hardware-stores"],
  });

  const { data: storeAnalytics = {} } = useQuery({
    queryKey: ["/api/hardware-stores/analytics"],
  });

  // Filter stores
  const filteredStores = (stores as any[]).filter((store: any) => {
    const matchesSearch = store.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince = selectedProvince === "all" || store.province === selectedProvince;
    return matchesSearch && matchesProvince;
  });

  return (
    <PageTransition>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              🏪 Hardware Stores Network
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your nationwide hardware store network and sales territories
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
              <Store className="w-4 h-4 mr-2" />
              Add Store
            </Button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
              <Store className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {(stores as any[]).length || '2,684'}
              </div>
              <p className="text-xs text-muted-foreground">
                Nationwide coverage
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Provinces</CardTitle>
              <MapPin className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                9
              </div>
              <p className="text-xs text-muted-foreground">
                Provincial coverage
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales Reps</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                47
              </div>
              <p className="text-xs text-muted-foreground">
                Territory coverage
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
          <CardHeader>
            <CardTitle>Hardware Store Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search stores, locations, or contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Store List */}
            <div className="space-y-2">
              {storesLoading ? (
                <div className="text-center py-8">Loading stores...</div>
              ) : filteredStores.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No stores found matching your search criteria
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredStores.length} stores
                    </p>
                  </div>
                  {filteredStores.map((store: any, index: number) => (
                    <div key={store.id || index} className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{store.storeType || 'Hardware'}</Badge>
                        <div>
                          <p className="font-medium">{store.storeName || 'Hardware Store'}</p>
                          <p className="text-sm text-muted-foreground">
                            {store.city || 'City'}, {store.province || 'Province'}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}