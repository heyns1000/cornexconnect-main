import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import ProductTable from "@/components/ProductTable";
import { useTranslation } from "@/hooks/useTranslation";

export default function ProductCatalog() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  const handleImportProducts = () => {
    setLocation("/excel-upload");
    toast({
      title: "Redirecting to Import",
      description: "Opening product import interface...",
    });
  };

  const handleAddProduct = () => {
    toast({
      title: "Add Product",
      description: "Product creation form will open here",
    });
  };

  const productCategories = [
    {
      name: "EPS Premium Range",
      count: Array.isArray(products) ? products.filter((p: any) => p.category === "EPS Premium Range").length : 0,
      description: "Standard density polystyrene cornices for cost-effective installations",
      sizeRange: "55mm - 175mm",
      priceRange: "R 8.63 - R 18.58",
      color: "blue"
    },
    {
      name: "BR XPS Budget Range", 
      count: Array.isArray(products) ? products.filter((p: any) => p.category === "BR XPS Budget Range").length : 0,
      description: "High-density XPS cornices for professional installations",
      sizeRange: "55mm - 170mm", 
      priceRange: "R 6.90 - R 21.50",
      color: "green"
    },
    {
      name: "LED Ready Series",
      count: Array.isArray(products) ? products.filter((p: any) => p.category === "LED Ready Series").length : 0,
      description: "Specialized cornices with integrated LED lighting channels",
      sizeRange: "40mm - 145mm",
      priceRange: "R 15.90 - R 32.75", 
      color: "purple"
    }
  ];

  return (
    <div className="space-y-8 p-8">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 -mx-8 -mt-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Cornex™ Product Catalog</h2>
            <p className="text-gray-600 mt-1">Complete EPS and BR XPS product range with real-time inventory</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleImportProducts}>
              <Package className="w-4 h-4 mr-2" />
              Import Products
            </Button>
            <Button className="bg-cornex-blue hover:bg-cornex-dark" onClick={handleAddProduct}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* Product Categories Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {productCategories.map((category) => (
          <Card key={category.name} className="dashboard-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <Badge variant="secondary" className={
                  category.color === "blue" ? "bg-blue-100 text-blue-800" :
                  category.color === "green" ? "bg-green-100 text-green-800" :
                  "bg-purple-100 text-purple-800"
                }>
                  {category.count} Products
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 text-sm">{category.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Size Range:</span>
                  <span className="font-medium">{category.sizeRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Price Range:</span>
                  <span className="font-medium">{category.priceRange}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductTable />
        </CardContent>
      </Card>
    </div>
  );
}
