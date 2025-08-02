import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Edit, Trash2, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STOCK_STATUS_COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/currency";
import type { Product, Inventory } from "@shared/schema";

export default function ProductTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: inventory, isLoading } = useQuery({
    queryKey: ["/api/inventory"],
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

  const getStockStatus = (currentStock: number, reorderPoint: number) => {
    if (currentStock === 0) return "out_of_stock";
    if (currentStock <= reorderPoint) return "low_stock";
    return "in_stock";
  };

  const getStockStatusText = (status: string, stock: number) => {
    switch (status) {
      case "in_stock":
        return `In Stock (${stock.toLocaleString()})`;
      case "low_stock":
        return `Low Stock (${stock.toLocaleString()})`;
      case "out_of_stock":
        return "Out of Stock";
      default:
        return `${stock.toLocaleString()}`;
    }
  };

  const filteredInventory = inventory?.filter((item: any) => {
    const product = item.products || item.product;
    if (!product) return false;
    
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  }) || [];

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="EPS">EPS Premium</SelectItem>
            <SelectItem value="BR">BR XPS Budget</SelectItem>
            <SelectItem value="LED">LED Ready</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Dimensions</TableHead>
              <TableHead>Pack Info</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item: any) => {
              const product = item.products || item.product;
              const inventory = item.inventory || item;
              const stockStatus = getStockStatus(inventory.currentStock, inventory.reorderPoint);
              
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                        product.category === 'EPS' ? 'bg-blue-100' :
                        product.category === 'BR' ? 'bg-green-100' : 'bg-purple-100'
                      }`}>
                        <span className={`text-xs font-bold ${
                          product.category === 'EPS' ? 'text-blue-600' :
                          product.category === 'BR' ? 'text-green-600' : 'text-purple-600'
                        }`}>
                          {product.sku}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.subcategory}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{product.sku}</TableCell>
                  <TableCell className="text-sm text-gray-600">{product.dimensions}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div>
                      <p>{product.packSize} per pack</p>
                      <p className="text-xs text-gray-500">{product.packsPerBox} packs/box</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(parseFloat(product.basePrice), "ZAR")}
                  </TableCell>
                  <TableCell>
                    <Badge className={STOCK_STATUS_COLORS[stockStatus as keyof typeof STOCK_STATUS_COLORS]}>
                      {getStockStatusText(stockStatus, inventory.currentStock)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
