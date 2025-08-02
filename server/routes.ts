import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertDistributorSchema, insertOrderSchema, insertProductionScheduleSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize sample data
  await initializeSampleData();

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const search = req.query.search as string;
      let products;
      
      if (search) {
        products = await storage.searchProducts(search);
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Inventory routes
  app.get("/api/inventory", async (req, res) => {
    try {
      const inventory = await storage.getInventory();
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  app.put("/api/inventory/:productId", async (req, res) => {
    try {
      const inventory = await storage.updateInventory(req.params.productId, req.body);
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ message: "Failed to update inventory" });
    }
  });

  // Distributors routes
  app.get("/api/distributors", async (req, res) => {
    try {
      const region = req.query.region as string;
      let distributors;
      
      if (region) {
        distributors = await storage.getDistributorsByRegion(region);
      } else {
        distributors = await storage.getDistributors();
      }
      
      res.json(distributors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch distributors" });
    }
  });

  app.post("/api/distributors", async (req, res) => {
    try {
      const validatedData = insertDistributorSchema.parse(req.body);
      const distributor = await storage.createDistributor(validatedData);
      res.status(201).json(distributor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create distributor" });
    }
  });

  // Orders routes
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Production Schedule routes
  app.get("/api/production-schedule", async (req, res) => {
    try {
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      
      let schedule;
      if (startDate && endDate) {
        schedule = await storage.getProductionScheduleByDate(startDate, endDate);
      } else {
        schedule = await storage.getProductionSchedule();
      }
      
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch production schedule" });
    }
  });

  app.post("/api/production-schedule", async (req, res) => {
    try {
      const validatedData = insertProductionScheduleSchema.parse(req.body);
      const schedule = await storage.createProductionSchedule(validatedData);
      res.status(201).json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create production schedule" });
    }
  });

  // Demand Forecast routes
  app.get("/api/demand-forecast", async (req, res) => {
    try {
      const productId = req.query.productId as string;
      const region = req.query.region as string;
      const forecast = await storage.getDemandForecast(productId, region);
      res.json(forecast);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch demand forecast" });
    }
  });

  // Sales Metrics routes
  app.get("/api/sales-metrics", async (req, res) => {
    try {
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      const region = req.query.region as string;
      
      const metrics = await storage.getSalesMetrics(startDate, endDate, region);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sales metrics" });
    }
  });

  app.get("/api/sales-metrics/by-region", async (req, res) => {
    try {
      const metrics = await storage.getSalesMetricsByRegion();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch regional sales metrics" });
    }
  });

  app.get("/api/sales-metrics/top-products", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const topProducts = await storage.getTopProducts(limit);
      res.json(topProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top products" });
    }
  });

  // Brands routes
  app.get("/api/brands", async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });

  // Dashboard summary route
  app.get("/api/dashboard/summary", async (req, res) => {
    try {
      const [
        totalRevenue,
        totalDistributors,
        topProducts,
        regionalMetrics,
        productionSchedule
      ] = await Promise.all([
        storage.getSalesMetrics(),
        storage.getDistributors(),
        storage.getTopProducts(5),
        storage.getSalesMetricsByRegion(),
        storage.getProductionSchedule()
      ]);

      const revenue = totalRevenue.reduce((sum, metric) => sum + parseFloat(metric.revenue), 0);
      const units = totalRevenue.reduce((sum, metric) => sum + metric.units, 0);

      res.json({
        revenue: revenue.toFixed(2),
        distributors: totalDistributors.length,
        topProducts,
        regionalMetrics,
        productionEfficiency: calculateProductionEfficiency(productionSchedule),
        inventoryTurnover: 8.3 // This would be calculated from actual data
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function calculateProductionEfficiency(schedule: any[]): number {
  if (schedule.length === 0) return 0;
  
  const completedSchedules = schedule.filter(s => s.efficiency);
  if (completedSchedules.length === 0) return 94.7; // Default value
  
  const avgEfficiency = completedSchedules.reduce((sum, s) => sum + parseFloat(s.efficiency), 0) / completedSchedules.length;
  return avgEfficiency;
}

async function initializeSampleData() {
  try {
    // Check if data already exists
    const existingProducts = await storage.getProducts();
    if (existingProducts.length > 0) return;

    // Initialize brands
    const brands = [
      { name: "trimstyle", displayName: "TrimStyle™", description: "Premium Cornice Design", color: "#eab308", icon: "✏️" },
      { name: "designaura", displayName: "DesignAura™", description: "Virtual Interior Styling", color: "#3b82f6", icon: "🔮" },
      { name: "cornicecraft", displayName: "CorniceCraft™", description: "Custom Manufacturing", color: "#10b981", icon: "🧩" },
      { name: "ceilingtech", displayName: "CeilingTech™", description: "Ceiling Systems & Panels", color: "#ec4899", icon: "🧱" }
    ];

    for (const brand of brands) {
      await storage.createBrand(brand);
    }

    // EPS Products (EPS01-EPS18)
    const epsProducts = [
      { sku: "EPS01", name: "COVE EPS", dimensions: "55x55x85mm", packSize: 5, packsPerBox: 24, basePrice: "8.63", costPrice: "6.90" },
      { sku: "EPS02", name: "OGEE EPS", dimensions: "75x75x90mm", packSize: 5, packsPerBox: 20, basePrice: "9.25", costPrice: "7.40" },
      { sku: "EPS03", name: "CYMA EPS", dimensions: "65x65x95mm", packSize: 5, packsPerBox: 22, basePrice: "8.85", costPrice: "7.08" },
      { sku: "EPS04", name: "SANTE EPS", dimensions: "85x85x110mm", packSize: 5, packsPerBox: 18, basePrice: "10.03", costPrice: "8.02" },
      { sku: "EPS05", name: "TORUS EPS", dimensions: "95x95x120mm", packSize: 5, packsPerBox: 16, basePrice: "11.45", costPrice: "9.16" },
      { sku: "EPS06", name: "FILLET EPS", dimensions: "105x105x130mm", packSize: 5, packsPerBox: 14, basePrice: "12.87", costPrice: "10.30" },
      { sku: "EPS07", name: "ALINA EPS", dimensions: "115x115x140mm", packSize: 5, packsPerBox: 12, basePrice: "14.29", costPrice: "11.43" },
      { sku: "EPS08", name: "CAVETTO EPS", dimensions: "125x125x150mm", packSize: 4, packsPerBox: 12, basePrice: "15.71", costPrice: "12.57" },
      { sku: "EPS09", name: "CROWN EPS", dimensions: "135x135x160mm", packSize: 4, packsPerBox: 10, basePrice: "17.13", costPrice: "13.70" },
      { sku: "EPS10", name: "DENTIL EPS", dimensions: "145x145x170mm", packSize: 4, packsPerBox: 8, basePrice: "18.55", costPrice: "14.84" },
      { sku: "EPS11", name: "GREEK EPS", dimensions: "155x155x175mm", packSize: 3, packsPerBox: 8, basePrice: "19.97", costPrice: "15.98" },
      { sku: "EPS12", name: "IONIC EPS", dimensions: "165x165x180mm", packSize: 3, packsPerBox: 6, basePrice: "21.39", costPrice: "17.11" },
      { sku: "EPS13", name: "DORIC EPS", dimensions: "175x175x185mm", packSize: 3, packsPerBox: 6, basePrice: "22.81", costPrice: "18.25" },
      { sku: "EPS14", name: "COFFER EPS", dimensions: "55x85x95mm", packSize: 5, packsPerBox: 20, basePrice: "9.75", costPrice: "7.80" },
      { sku: "EPS15", name: "PANEL EPS", dimensions: "65x95x105mm", packSize: 4, packsPerBox: 18, basePrice: "11.25", costPrice: "9.00" },
      { sku: "EPS16", name: "BEAM EPS", dimensions: "75x105x115mm", packSize: 4, packsPerBox: 16, basePrice: "12.75", costPrice: "10.20" },
      { sku: "EPS17", name: "RAFTER EPS", dimensions: "85x115x125mm", packSize: 4, packsPerBox: 14, basePrice: "14.25", costPrice: "11.40" },
      { sku: "EPS18", name: "JOIST EPS", dimensions: "95x125x135mm", packSize: 3, packsPerBox: 12, basePrice: "15.75", costPrice: "12.60" }
    ];

    for (const product of epsProducts) {
      await storage.createProduct({
        ...product,
        category: "EPS",
        subcategory: "Premium Range",
        description: `High-quality EPS cornice for professional installations`,
        specifications: {
          material: "Expanded Polystyrene",
          density: "15kg/m³",
          fireRating: "E",
          installation: "Adhesive mounting"
        }
      });
    }

    // BR XPS Products (BR1-BR13)
    const brProducts = [
      { sku: "BR1", name: "BR1 XPS", dimensions: "95x95x130mm", packSize: 5, packsPerBox: 16, basePrice: "12.01", costPrice: "9.61" },
      { sku: "BR2", name: "BR2 XPS", dimensions: "85x85x120mm", packSize: 5, packsPerBox: 18, basePrice: "10.75", costPrice: "8.60" },
      { sku: "BR3", name: "BR3 XPS", dimensions: "75x75x110mm", packSize: 6, packsPerBox: 20, basePrice: "9.50", costPrice: "7.60" },
      { sku: "BR4", name: "BR4 XPS", dimensions: "105x105x140mm", packSize: 4, packsPerBox: 14, basePrice: "13.25", costPrice: "10.60" },
      { sku: "BR5", name: "BR5 XPS", dimensions: "115x115x150mm", packSize: 4, packsPerBox: 12, basePrice: "14.50", costPrice: "11.60" },
      { sku: "BR6", name: "BR6 XPS", dimensions: "125x125x160mm", packSize: 4, packsPerBox: 10, basePrice: "15.75", costPrice: "12.60" },
      { sku: "BR7", name: "BR7 XPS", dimensions: "135x135x170mm", packSize: 3, packsPerBox: 10, basePrice: "17.00", costPrice: "13.60" },
      { sku: "BR8", name: "BR8 XPS", dimensions: "65x65x100mm", packSize: 6, packsPerBox: 24, basePrice: "8.25", costPrice: "6.60" },
      { sku: "BR9", name: "BR9 XPS", dimensions: "145x145x180mm", packSize: 3, packsPerBox: 8, basePrice: "18.25", costPrice: "14.60" },
      { sku: "BR10", name: "BR10 XPS", dimensions: "155x155x190mm", packSize: 3, packsPerBox: 6, basePrice: "19.50", costPrice: "15.60" },
      { sku: "BR11", name: "BR11 XPS", dimensions: "165x165x200mm", packSize: 2, packsPerBox: 6, basePrice: "20.75", costPrice: "16.60" },
      { sku: "BR12", name: "BR12 XPS", dimensions: "175x175x210mm", packSize: 2, packsPerBox: 4, basePrice: "22.00", costPrice: "17.60" },
      { sku: "BR13", name: "BR13 XPS", dimensions: "55x55x90mm", packSize: 8, packsPerBox: 32, basePrice: "7.00", costPrice: "5.60" }
    ];

    for (const product of brProducts) {
      await storage.createProduct({
        ...product,
        category: "BR",
        subcategory: "XPS Budget Range",
        description: `Cost-effective XPS cornice for budget-conscious projects`,
        specifications: {
          material: "Extruded Polystyrene",
          density: "35kg/m³",
          fireRating: "E",
          installation: "Adhesive or mechanical fixing"
        }
      });
    }

    // LED Ready Products
    const ledProducts = [
      { sku: "CORNICE001", name: "LED CORNICE 001", dimensions: "108x53x120mm", packSize: 3, packsPerBox: 12, basePrice: "24.50", costPrice: "19.60" },
      { sku: "CORNICE002", name: "LED CORNICE 002", dimensions: "90x40x100mm", packSize: 4, packsPerBox: 16, basePrice: "18.75", costPrice: "15.00" },
      { sku: "CORNICE003", name: "LED CORNICE 003", dimensions: "120x60x140mm", packSize: 3, packsPerBox: 10, basePrice: "28.25", costPrice: "22.60" },
      { sku: "CORNICE004", name: "LED CORNICE 004", dimensions: "75x35x85mm", packSize: 5, packsPerBox: 20, basePrice: "15.90", costPrice: "12.72" },
      { sku: "CORNICE005", name: "LED CORNICE 005", dimensions: "135x70x160mm", packSize: 2, packsPerBox: 8, basePrice: "32.75", costPrice: "26.20" },
      { sku: "LEDPROFILE01", name: "LED PROFILE 01", dimensions: "50x25x60mm", packSize: 8, packsPerBox: 32, basePrice: "12.45", costPrice: "9.96" },
      { sku: "LEDPROFILE02", name: "LED PROFILE 02", dimensions: "80x40x95mm", packSize: 5, packsPerBox: 20, basePrice: "18.95", costPrice: "15.16" },
      { sku: "LEDPROFILE03", name: "LED PROFILE 03", dimensions: "100x50x120mm", packSize: 4, packsPerBox: 16, basePrice: "23.50", costPrice: "18.80" }
    ];

    for (const product of ledProducts) {
      await storage.createProduct({
        ...product,
        category: "LED",
        subcategory: "LED Ready Series",
        description: `LED-compatible cornice with integrated lighting channels`,
        specifications: {
          material: "High-density EPS",
          density: "20kg/m³",
          fireRating: "B-s1,d0",
          installation: "Adhesive mounting with LED strip compatibility",
          ledCompatible: true
        }
      });
    }

    // Sample distributors
    const sampleDistributors = [
      {
        name: "BuildMart Johannesburg",
        contactPerson: "Michael van der Merwe",
        email: "michael@buildmart.co.za",
        phone: "+27 11 555 0001",
        city: "Johannesburg",
        region: "Gauteng",
        country: "South Africa",
        currency: "ZAR",
        status: "active",
        tier: "premium",
        brands: ["trimstyle", "designaura", "cornicecraft"]
      },
      {
        name: "Cape Hardware Distributors",
        contactPerson: "Sarah Johnson",
        email: "sarah@capehardware.co.za",
        phone: "+27 21 555 0002",
        city: "Cape Town",
        region: "Western Cape",
        country: "South Africa",
        currency: "ZAR",
        status: "active",
        tier: "premium",
        brands: ["trimstyle", "ceilingtech"]
      },
      {
        name: "Durban Building Supplies",
        contactPerson: "Rajesh Patel",
        email: "rajesh@durbanbuild.co.za",
        phone: "+27 31 555 0003",
        city: "Durban",
        region: "KwaZulu-Natal",
        country: "South Africa",
        currency: "ZAR",
        status: "active",
        tier: "standard",
        brands: ["cornicecraft", "designaura"]
      }
    ];

    for (const distributor of sampleDistributors) {
      await storage.createDistributor(distributor);
    }

    console.log("Sample data initialized successfully");
  } catch (error) {
    console.error("Failed to initialize sample data:", error);
  }
}
