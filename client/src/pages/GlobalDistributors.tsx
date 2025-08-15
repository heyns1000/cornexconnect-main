import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Globe, Plus, Search, MapPin, DollarSign, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DistributorPortal from "@/components/DistributorPortal";
import CurrencyConverter from "@/components/CurrencyConverter";
import { formatCurrency, getCurrencyFlag } from "@/lib/currency";
import { CORNEX_BRANDS, CURRENCIES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useTranslation } from "@/hooks/useTranslation";

export default function GlobalDistributors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: distributors, isLoading } = useQuery({
    queryKey: ["/api/distributors", regionFilter],
  });

  const { data: orders } = useQuery({
    queryKey: ["/api/orders"],
  });

  const { data: regionalMetrics } = useQuery({
    queryKey: ["/api/sales-metrics/by-region"],
  });

  const createDistributorMutation = useMutation({
    mutationFn: async (distributorData: any) => {
      return await apiRequest("POST", "/api/distributors", distributorData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/distributors"] });
      toast({
        title: "Distributor Added",
        description: "New distributor has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add distributor.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "premium":
        return "bg-purple-100 text-purple-800";
      case "standard":
        return "bg-blue-100 text-blue-800";
      case "basic":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredDistributors = distributors?.filter((distributor: any) => {
    const matchesSearch = !searchTerm || 
      distributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      distributor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      distributor.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = regionFilter === "all" || distributor.region === regionFilter;
    const matchesStatus = statusFilter === "all" || distributor.status === statusFilter;
    
    return matchesSearch && matchesRegion && matchesStatus;
  }) || [];

  const regions = [
    "Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", 
    "Limpopo", "Mpumalanga", "North West", "Free State", "Northern Cape"
  ];

  return (
    <div className="space-y-8 p-8">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 -mx-8 -mt-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Global Distributors Portal</h2>
            <p className="text-gray-600 mt-1">Multi-currency distributor management with regional pricing</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Globe className="w-4 h-4 mr-2" />
              Regional Analytics
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-cornex-blue hover:bg-cornex-dark">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Distributor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Distributor</DialogTitle>
                </DialogHeader>
                <DistributorForm 
                  onSubmit={(data) => createDistributorMutation.mutate(data)}
                  isLoading={createDistributorMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Distributor Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="dashboard-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Total Distributors</CardTitle>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {distributors?.length || 0}
            </div>
            <p className="text-sm text-blue-600 mt-1">Across 16 countries</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Active Partners</CardTitle>
              <Globe className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {distributors?.filter((d: any) => d.status === "active").length || 0}
            </div>
            <p className="text-sm text-green-600 mt-1">+12% this month</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">R 12.8M</div>
            <p className="text-sm text-green-600 mt-1">+23.5% growth</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Premium Partners</CardTitle>
              <Users className="w-5 h-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {distributors?.filter((d: any) => d.tier === "premium").length || 0}
            </div>
            <p className="text-sm text-purple-600 mt-1">Elite distributors</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Distributor Management</CardTitle>
            <CurrencyConverter />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search distributors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Distributors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDistributors.map((distributor: any) => (
              <Card key={distributor.id} className="dashboard-card">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{distributor.name}</h3>
                      <p className="text-sm text-gray-600">{distributor.contactPerson}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(distributor.status)}>
                        {distributor.status}
                      </Badge>
                      <Badge className={getTierColor(distributor.tier)}>
                        {distributor.tier}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{distributor.city}, {distributor.region}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span>{getCurrencyFlag(distributor.currency)} {distributor.country}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{distributor.email}</span>
                  </div>
                  
                  {distributor.phone && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{distributor.phone}</span>
                    </div>
                  )}

                  {/* Brands */}
                  {distributor.brands && distributor.brands.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500 mb-2">Authorized Brands:</p>
                      <div className="flex flex-wrap gap-1">
                        {distributor.brands.map((brandName: string) => {
                          const brand = CORNEX_BRANDS.find(b => b.name === brandName);
                          return brand ? (
                            <Badge key={brandName} variant="outline" className="text-xs">
                              {brand.icon} {brand.displayName}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {/* Credit Information */}
                  <div className="pt-2 border-t space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Credit Limit:</span>
                      <span className="font-medium">
                        {formatCurrency(parseFloat(distributor.creditLimit || "0"), distributor.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Payment Terms:</span>
                      <span className="font-medium">{distributor.paymentTerms || "COD"}</span>
                    </div>
                    {distributor.commissionRate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Commission:</span>
                        <span className="font-medium">{parseFloat(distributor.commissionRate).toFixed(1)}%</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Portal
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDistributors.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No distributors found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Regional Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regionalMetrics?.slice(0, 9).map((metric: any) => (
              <div key={metric.region} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">{metric.region}</h4>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Revenue:</span>
                    <span className="font-medium">{formatCurrency(parseFloat(metric.revenue), "ZAR")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Units:</span>
                    <span className="font-medium">{metric.units.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Distributors:</span>
                    <span className="font-medium">
                      {distributors?.filter((d: any) => d.region === metric.region).length || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Distributor Portal Component */}
      <DistributorPortal distributors={filteredDistributors} />
    </div>
  );
}

function DistributorForm({ 
  onSubmit, 
  isLoading 
}: { 
  onSubmit: (data: any) => void; 
  isLoading: boolean; 
}) {
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    region: "",
    country: "South Africa",
    currency: "ZAR",
    tier: "standard",
    creditLimit: "0",
    paymentTerms: "COD",
    brands: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      creditLimit: parseFloat(formData.creditLimit)
    });
  };

  const handleBrandToggle = (brandName: string) => {
    setFormData(prev => ({
      ...prev,
      brands: prev.brands.includes(brandName)
        ? prev.brands.filter(b => b !== brandName)
        : [...prev.brands, brandName]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Company Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="contactPerson">Contact Person</Label>
          <Input
            value={formData.contactPerson}
            onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="region">Region</Label>
          <Select value={formData.region} onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Limpopo", "Mpumalanga", "North West", "Free State", "Northern Cape"].map((region) => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency.currency} value={currency.currency}>
                  {currency.flag} {currency.currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tier">Tier</Label>
          <Select value={formData.tier} onValueChange={(value) => setFormData(prev => ({ ...prev, tier: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="creditLimit">Credit Limit</Label>
          <Input
            type="number"
            value={formData.creditLimit}
            onChange={(e) => setFormData(prev => ({ ...prev, creditLimit: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <Label>Authorized Brands</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {CORNEX_BRANDS.map((brand) => (
            <Button
              key={brand.id}
              type="button"
              variant={formData.brands.includes(brand.name) ? "default" : "outline"}
              size="sm"
              onClick={() => handleBrandToggle(brand.name)}
            >
              {brand.icon} {brand.displayName}
            </Button>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Adding..." : "Add Distributor"}
      </Button>
    </form>
  );
}
