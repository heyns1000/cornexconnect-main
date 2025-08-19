import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Map, Search, MapPin, Filter, Info } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function StoreMapVisualization() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string>("all");

  const { data: stores = [], isLoading: storesLoading } = useQuery({
    queryKey: ["/api/hardware-stores"],
  });

  // Filter stores
  const filteredStores = (stores as any[]).filter((store: any) => {
    const matchesSearch = store.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince = selectedProvince === "all" || store.province === selectedProvince;
    return matchesSearch && matchesProvince;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            🗺️ Store Map Visualization
          </h1>
          <p className="text-muted-foreground mt-2">
            Interactive map visualization of hardware stores across South Africa
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Search and Controls */}
      <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="w-5 h-5 text-emerald-500" />
            Map Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search stores or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {filteredStores.length}
              </div>
              <div className="text-sm text-muted-foreground">Stores Found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {new Set(filteredStores.map((s: any) => s.province)).size}
              </div>
              <div className="text-sm text-muted-foreground">Provinces</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(filteredStores.map((s: any) => s.city)).size}
              </div>
              <div className="text-sm text-muted-foreground">Cities</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Placeholder */}
      <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
        <CardContent className="p-0">
          <div className="h-96 bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center rounded-lg">
            <div className="text-center space-y-4">
              <Map className="w-16 h-16 text-emerald-500 mx-auto" />
              <div>
                <h3 className="text-xl font-semibold text-gray-700">Interactive Map</h3>
                <p className="text-gray-500">Hardware stores visualization across South Africa</p>
                <Badge variant="secondary" className="mt-2">
                  {filteredStores.length} stores displayed
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Store List */}
      <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
        <CardHeader>
          <CardTitle>Store Locations</CardTitle>
        </CardHeader>
        <CardContent>
          {storesLoading ? (
            <div className="text-center py-8">Loading stores...</div>
          ) : filteredStores.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No stores found matching your search criteria
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground">
                  Displaying all {filteredStores.length} stores
                </p>
              </div>
              {filteredStores.map((store: any, index: number) => (
                <div key={store.id || index} className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <div>
                      <p className="font-medium">{store.storeName || 'Hardware Store'}</p>
                      <p className="text-sm text-muted-foreground">
                        {store.city || 'City'}, {store.province || 'Province'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {store.storeType || 'Hardware'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}