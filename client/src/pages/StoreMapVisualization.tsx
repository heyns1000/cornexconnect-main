import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Map, 
  Search, 
  MapPin, 
  Filter, 
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  Building2,
  Phone,
  Mail,
  Star
} from "lucide-react";
import { Loader } from "@googlemaps/js-api-loader";

declare global {
  interface Window {
    google: typeof google;
  }
}

interface HardwareStore {
  id: string;
  storeName: string;
  city: string;
  province: string;
  address: string;
  phone: string;
  email: string;
  storeSize: string;
  storeType: string;
  creditRating: string;
  monthlyPotential: string;
  isActive: boolean;
  latitude?: number;
  longitude?: number;
}

export default function StoreMapVisualization() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [selectedStoreType, setSelectedStoreType] = useState<string>("all");
  const [selectedStore, setSelectedStore] = useState<HardwareStore | null>(null);
  const [mapView, setMapView] = useState<'satellite' | 'roadmap' | 'hybrid'>('roadmap');
  const [showClusters, setShowClusters] = useState(true);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Fetch hardware stores
  const { data: stores = [], isLoading } = useQuery<HardwareStore[]>({
    queryKey: ["/api/hardware-stores"],
  });

  // South African province coordinates for initial positioning
  const provinceCoordinates: Record<string, { lat: number; lng: number }> = {
    "GAUTENG": { lat: -26.2041, lng: 28.0473 },
    "WESTERN CAPE": { lat: -33.9249, lng: 18.4241 },
    "KWAZULU-NATAL": { lat: -29.8587, lng: 31.0218 },
    "EASTERN CAPE": { lat: -32.2968, lng: 26.4194 },
    "FREE STATE": { lat: -29.1217, lng: 26.2041 },
    "LIMPOPO": { lat: -23.4013, lng: 29.4179 },
    "MPUMALANGA": { lat: -25.5653, lng: 30.5279 },
    "NORTH WEST": { lat: -25.8601, lng: 25.6384 },
    "NORTHERN CAPE": { lat: -29.0467, lng: 21.8569 }
  };

  // Filter stores based on current filters
  const filteredStores = stores.filter(store => {
    const matchesSearch = !searchTerm || 
      store.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.province?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProvince = selectedProvince === "all" || 
      store.province?.toLowerCase() === selectedProvince.toLowerCase();
    
    const matchesType = selectedStoreType === "all" || 
      store.storeType?.toLowerCase() === selectedStoreType.toLowerCase();

    return matchesSearch && matchesProvince && matchesType && store.isActive;
  });

  // Initialize Google Maps or fallback to SVG visualization
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      try {
        // Check if Google Maps API key is properly configured
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
          throw new Error("Google Maps API key not configured");
        }

        const loader = new Loader({
          apiKey: apiKey,
          version: "weekly",
          libraries: ["places", "geometry"]
        });

        await loader.load();

        const map = new google.maps.Map(mapRef.current, {
          center: { lat: -28.5, lng: 24.5 }, // Center of South Africa
          zoom: 6,
          mapTypeId: mapView,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ],
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true
        });

        googleMapRef.current = map;
        infoWindowRef.current = new google.maps.InfoWindow();

        // Add map type change listener
        map.addListener("maptypeid_changed", () => {
          setMapView(map.getMapTypeId() as 'satellite' | 'roadmap' | 'hybrid');
        });

      } catch (error) {
        console.error("Error loading Google Maps, using fallback visualization:", error);
        // Show fallback SVG-based visualization
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100 rounded-lg">
              <div class="text-center p-8">
                <svg width="400" height="300" viewBox="0 0 400 300" class="mx-auto mb-4">
                  <rect width="400" height="300" fill="#e0f2fe" stroke="#0ea5e9" stroke-width="2" rx="8"/>
                  <text x="200" y="30" text-anchor="middle" class="text-lg font-bold fill-blue-800">South Africa - Hardware Store Network</text>
                  <g class="stores">
                    ${filteredStores.slice(0, 20).map((store, i) => {
                      const x = 50 + (i % 5) * 70;
                      const y = 60 + Math.floor(i / 5) * 50;
                      return `
                        <circle cx="${x}" cy="${y}" r="4" fill="${store.storeSize === 'large' ? '#059669' : store.storeSize === 'medium' ? '#0284c7' : '#7c3aed'}" stroke="white" stroke-width="1"/>
                        <text x="${x}" y="${y + 20}" text-anchor="middle" class="text-xs fill-gray-700">${store.storeName.substring(0, 10)}...</text>
                      `;
                    }).join('')}
                  </g>
                  <text x="200" y="280" text-anchor="middle" class="text-sm fill-gray-600">Showing ${filteredStores.length.toLocaleString()} stores across South Africa</text>
                </svg>
                <p class="text-gray-600 mb-4">Interactive map visualization with ${filteredStores.length.toLocaleString()} hardware stores</p>
                <p class="text-sm text-blue-600">Note: For full Google Maps integration, please configure the Google Maps API key</p>
              </div>
            </div>
          `;
        }
      }
    };

    initMap();
  }, [stores.length]);

  // Update map type when view changes
  useEffect(() => {
    if (googleMapRef.current) {
      googleMapRef.current.setMapTypeId(mapView);
    }
  }, [mapView]);

  // Generate coordinates for stores that don't have them
  const generateCoordinatesForStore = (store: HardwareStore): { lat: number; lng: number } => {
    const provinceCoords = provinceCoordinates[store.province?.toUpperCase()] || { lat: -28.5, lng: 24.5 };
    
    // Add some randomness around the province center (±0.5 degrees)
    const lat = provinceCoords.lat + (Math.random() - 0.5) * 1.0;
    const lng = provinceCoords.lng + (Math.random() - 0.5) * 1.0;
    
    return { lat, lng };
  };

  // Update markers when stores data changes
  useEffect(() => {
    if (!googleMapRef.current || !stores.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Filter stores based on current filters
    const filteredStores = stores.filter(store => {
      const matchesSearch = !searchTerm || 
        store.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.province?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProvince = selectedProvince === "all" || 
        store.province?.toLowerCase() === selectedProvince.toLowerCase();
      
      const matchesType = selectedStoreType === "all" || 
        store.storeType?.toLowerCase() === selectedStoreType.toLowerCase();

      return matchesSearch && matchesProvince && matchesType && store.isActive;
    });

    // Create markers for filtered stores
    filteredStores.forEach(store => {
      const coordinates = store.latitude && store.longitude 
        ? { lat: store.latitude, lng: store.longitude }
        : generateCoordinatesForStore(store);

      const marker = new google.maps.Marker({
        position: coordinates,
        map: googleMapRef.current,
        title: store.storeName,
        icon: {
          url: `data:image/svg+xml,${encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="${store.storeSize === 'large' ? '#059669' : store.storeSize === 'medium' ? '#0284c7' : '#7c3aed'}" stroke="white" stroke-width="2"/>
              <circle cx="12" cy="10" r="3" fill="white"/>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(24, 24)
        }
      });

      marker.addListener("click", () => {
        setSelectedStore(store);
        
        const infoContent = `
          <div style="padding: 12px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${store.storeName}</h3>
            <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
              <strong>Location:</strong> ${store.city}, ${store.province}
            </p>
            <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
              <strong>Type:</strong> ${store.storeType || 'Hardware Store'}
            </p>
            <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
              <strong>Size:</strong> ${store.storeSize || 'Medium'}
            </p>
            <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
              <strong>Credit Rating:</strong> ${store.creditRating || 'B'}
            </p>
            ${store.phone ? `<p style="margin: 4px 0; color: #6b7280; font-size: 14px;"><strong>Phone:</strong> ${store.phone}</p>` : ''}
          </div>
        `;

        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(infoContent);
          infoWindowRef.current.open(googleMapRef.current, marker);
        }
      });

      markersRef.current.push(marker);
    });

  }, [stores, searchTerm, selectedProvince, selectedStoreType]);

  // Get unique provinces and store types for filters
  const provinces = Array.from(new Set(stores.map(store => store.province).filter(Boolean))).sort();
  const storeTypes = Array.from(new Set(stores.map(store => store.storeType).filter(Boolean))).sort();

  const resetView = () => {
    if (googleMapRef.current) {
      googleMapRef.current.setCenter({ lat: -28.5, lng: 24.5 });
      googleMapRef.current.setZoom(6);
    }
  };

  const zoomIn = () => {
    if (googleMapRef.current) {
      googleMapRef.current.setZoom(googleMapRef.current.getZoom()! + 1);
    }
  };

  const zoomOut = () => {
    if (googleMapRef.current) {
      googleMapRef.current.setZoom(googleMapRef.current.getZoom()! - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent flex items-center">
              <Map className="w-8 h-8 mr-3 text-blue-600" />
              Interactive Store Map
            </h1>
            <p className="text-muted-foreground mt-2">
              Visualize and explore {stores.length.toLocaleString()} hardware stores across South Africa
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="backdrop-blur-sm bg-white/80 border border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Stores</p>
                  <p className="text-2xl font-bold text-blue-600">{stores.length.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 border border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Filtered Results</p>
                  <p className="text-2xl font-bold text-green-600">{filteredStores.length.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 border border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Provinces</p>
                  <p className="text-2xl font-bold text-purple-600">{provinces.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 border border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Stores</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stores.filter(s => s.isActive).length.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters and Controls */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="backdrop-blur-sm bg-white/80 border border-white/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters & Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search Stores</label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Store name, city, province..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Province Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Province</label>
                  <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Provinces</SelectItem>
                      {provinces.map(province => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Store Type Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Store Type</label>
                  <Select value={selectedStoreType} onValueChange={setSelectedStoreType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {storeTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Map Controls */}
                <div className="border-t pt-4">
                  <label className="text-sm font-medium mb-2 block">Map Controls</label>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <Button size="sm" variant="outline" onClick={zoomIn}>
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={zoomOut}>
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={resetView}>
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Select value={mapView} onValueChange={(value: 'satellite' | 'roadmap' | 'hybrid') => setMapView(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="roadmap">Road Map</SelectItem>
                        <SelectItem value="satellite">Satellite</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Legend */}
                <div className="border-t pt-4">
                  <label className="text-sm font-medium mb-2 block">Legend</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-600"></div>
                      <span className="text-xs">Large Stores</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                      <span className="text-xs">Medium Stores</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-purple-600"></div>
                      <span className="text-xs">Small Stores</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Store Info */}
            {selectedStore && (
              <Card className="backdrop-blur-sm bg-white/80 border border-white/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Store Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm">{selectedStore.storeName}</h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedStore.city}, {selectedStore.province}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Store Type:</span>
                      <Badge variant="outline" className="text-xs">
                        {selectedStore.storeType || 'Hardware Store'}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Size:</span>
                      <Badge variant="outline" className="text-xs">
                        {selectedStore.storeSize || 'Medium'}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Credit Rating:</span>
                      <Badge variant="outline" className="text-xs">
                        {selectedStore.creditRating || 'B'}
                      </Badge>
                    </div>
                    
                    {selectedStore.monthlyPotential && parseFloat(selectedStore.monthlyPotential) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Monthly Potential:</span>
                        <span className="text-xs font-medium">
                          R{parseFloat(selectedStore.monthlyPotential).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {(selectedStore.phone || selectedStore.email) && (
                    <div className="border-t pt-3 space-y-2">
                      {selectedStore.phone && selectedStore.phone !== "NO" && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">{selectedStore.phone}</span>
                        </div>
                      )}
                      {selectedStore.email && selectedStore.email !== "NO" && (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">{selectedStore.email}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <Card className="backdrop-blur-sm bg-white/80 border border-white/20">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="h-[600px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading map and store data...</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div 
                      ref={mapRef} 
                      className="w-full h-[600px] rounded-lg bg-gray-100"
                      style={{ minHeight: '600px' }}
                    />
                    {/* Store count overlay */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                      <p className="text-sm font-medium text-gray-800">
                        📍 {filteredStores.length.toLocaleString()} stores displayed
                      </p>
                      <p className="text-xs text-gray-600">
                        {provinces.length} provinces • {storeTypes.length} store types
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}