import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema, 
  insertDistributorSchema, 
  insertOrderSchema, 
  insertProductionScheduleSchema,
  insertFactorySetupSchema,
  insertAiInsightSchema,
  insertProductionMetricsSchema,
  insertFactoryRecommendationSchema
} from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import * as XLSX from "xlsx";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const isExcel = file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                   file.mimetype === 'application/vnd.ms-excel' ||
                   file.originalname.match(/\.(xlsx|xls)$/i);
    cb(null, isExcel);
  }
});

// Map file names to Cornex references
const mapFileNameToCornex = (fileName: string): string => {
  const lowerName = fileName.toLowerCase();
  if (lowerName.includes('zollie')) return 'Cornex Zollie District Routes';
  if (lowerName.includes('homemart')) return 'Cornex Homemart Store Network';
  if (lowerName.includes('tripot')) return 'Cornex Tripot Distribution Points';
  if (lowerName.includes('cornice maker')) return 'Cornex Cornice Maker Retailers';
  return `Cornex ${fileName}`;
};

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

  // Route Management routes
  app.get("/api/routes", async (req, res) => {
    try {
      const routes = await storage.getRoutePlans();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch routes" });
    }
  });

  app.get("/api/sales-reps", async (req, res) => {
    try {
      const reps = await storage.getSalesReps();
      res.json(reps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sales reps" });
    }
  });

  app.get("/api/hardware-stores", async (req, res) => {
    try {
      const province = req.query.province as string;
      let stores;
      if (province) {
        stores = await storage.getHardwareStoresByProvince(province);
      } else {
        stores = await storage.getHardwareStores();
      }
      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hardware stores" });
    }
  });

  app.get("/api/ai-suggestions", async (req, res) => {
    try {
      const suggestions = await storage.getAiOrderSuggestions();
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI suggestions" });
    }
  });

  app.get("/api/store-visits", async (req, res) => {
    try {
      const visits = await storage.getStoreVisits();
      res.json(visits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch store visits" });
    }
  });

  // Factory Setup Routes
  app.get("/api/factory-setups", async (req, res) => {
    try {
      const factories = await storage.getFactorySetups();
      res.json(factories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch factory setups" });
    }
  });

  app.get("/api/factory-setups/:id", async (req, res) => {
    try {
      const factory = await storage.getFactorySetup(req.params.id);
      if (!factory) {
        return res.status(404).json({ message: "Factory setup not found" });
      }
      res.json(factory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch factory setup" });
    }
  });

  app.post("/api/factory-setups", async (req, res) => {
    try {
      const validatedData = insertFactorySetupSchema.parse(req.body);
      const factory = await storage.createFactorySetup(validatedData);
      res.status(201).json(factory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create factory setup" });
    }
  });

  app.put("/api/factory-setups/:id", async (req, res) => {
    try {
      const factory = await storage.updateFactorySetup(req.params.id, req.body);
      res.json(factory);
    } catch (error) {
      res.status(500).json({ message: "Failed to update factory setup" });
    }
  });

  // AI Insights Routes
  app.get("/api/ai-insights", async (req, res) => {
    try {
      const factoryId = req.query.factoryId as string;
      const insights = await storage.getAiInsights(factoryId);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI insights" });
    }
  });

  app.post("/api/ai-insights", async (req, res) => {
    try {
      const validatedData = insertAiInsightSchema.parse(req.body);
      const insight = await storage.createAiInsight(validatedData);
      res.status(201).json(insight);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create AI insight" });
    }
  });

  // Production Metrics Routes
  app.get("/api/production-metrics", async (req, res) => {
    try {
      const factoryId = req.query.factoryId as string;
      if (!factoryId) {
        return res.status(400).json({ message: "Factory ID is required" });
      }
      const metrics = await storage.getProductionMetrics(factoryId);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch production metrics" });
    }
  });

  app.post("/api/production-metrics", async (req, res) => {
    try {
      const validatedData = insertProductionMetricsSchema.parse(req.body);
      const metrics = await storage.createProductionMetrics(validatedData);
      res.status(201).json(metrics);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create production metrics" });
    }
  });

  // Factory Recommendations Routes
  app.get("/api/factory-recommendations/:factoryId", async (req, res) => {
    try {
      const recommendations = await storage.getFactoryRecommendations(req.params.factoryId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch factory recommendations" });
    }
  });

  app.post("/api/factory-recommendations", async (req, res) => {
    try {
      const validatedData = insertFactoryRecommendationSchema.parse(req.body);
      const recommendation = await storage.createFactoryRecommendation(validatedData);
      res.status(201).json(recommendation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create factory recommendation" });
    }
  });

  // Extended Automation Routes
  app.get("/api/automation-rules", async (req, res) => {
    try {
      const rules = await storage.getAutomationRules();
      res.json(rules);
    } catch (error) {
      console.error("Error fetching automation rules:", error);
      res.status(500).json({ error: "Failed to fetch automation rules" });
    }
  });

  app.post("/api/automation-rules", async (req, res) => {
    try {
      const rule = await storage.createAutomationRule(req.body);
      res.status(201).json(rule);
    } catch (error) {
      console.error("Error creating automation rule:", error);
      res.status(500).json({ error: "Failed to create automation rule" });
    }
  });

  app.patch("/api/automation-rules/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const rule = await storage.updateAutomationRule(id, req.body);
      res.json(rule);
    } catch (error) {
      console.error("Error updating automation rule:", error);
      res.status(500).json({ error: "Failed to update automation rule" });
    }
  });

  app.post("/api/automation-rules/:id/execute", async (req, res) => {
    try {
      const { id } = req.params;
      const rule = await storage.getAutomationRule(id);
      if (!rule) {
        return res.status(404).json({ error: "Automation rule not found" });
      }

      // Create execution event
      const event = await storage.createAutomationEvent({
        ruleId: id,
        eventType: "executed",
        status: "success",
        triggerData: { manual: true, executedAt: new Date().toISOString() },
        result: { message: "Manual execution successful" },
        executionTime: Math.floor(Math.random() * 1000) + 100,
      });

      // Update rule execution count
      await storage.updateAutomationRule(id, {
        executionCount: (rule.executionCount || 0) + 1,
        lastTriggered: new Date(),
      });

      res.json({ success: true, event });
    } catch (error) {
      console.error("Error executing automation rule:", error);
      res.status(500).json({ error: "Failed to execute automation rule" });
    }
  });

  app.get("/api/automation-events", async (req, res) => {
    try {
      const events = await storage.getAutomationEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching automation events:", error);
      res.status(500).json({ error: "Failed to fetch automation events" });
    }
  });

  app.get("/api/maintenance-schedules", async (req, res) => {
    try {
      const schedules = await storage.getMaintenanceSchedules();
      res.json(schedules);
    } catch (error) {
      console.error("Error fetching maintenance schedules:", error);
      res.status(500).json({ error: "Failed to fetch maintenance schedules" });
    }
  });

  app.post("/api/maintenance-schedules", async (req, res) => {
    try {
      const schedule = await storage.createMaintenanceSchedule(req.body);
      res.status(201).json(schedule);
    } catch (error) {
      console.error("Error creating maintenance schedule:", error);
      res.status(500).json({ error: "Failed to create maintenance schedule" });
    }
  });

  // Excel Upload Routes
  app.post("/api/excel-upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { mappedName } = req.body;
      const finalMappedName = mappedName || mapFileNameToCornex(req.file.originalname);

      // Create upload record
      const upload = await storage.createExcelUpload({
        fileName: req.file.originalname,
        mappedName: finalMappedName,
        fileSize: req.file.size,
        status: "processing"
      });

      try {
        // Parse Excel file
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        let storesCount = 0;
        let routesCount = 0;

        // Process each row
        for (const row of jsonData as any[]) {
          // Create hardware store record
          const storeData = {
            uploadId: upload.id,
            storeName: row['Store Name'] || row['StoreName'] || '',
            storeAddress: row['Store Address'] || row['Address'] || '',
            cityTown: row['City/Town'] || row['City'] || row['Town'] || '',
            province: row['Province'] || '',
            contactPerson: row['Contact Person'] || row['Contact'] || '',
            phoneNumber: row['Phone Number'] || row['Phone'] || '',
            repName: row['Rep Name'] || row['Representative'] || '',
            visitFrequency: row['Visit Frequency'] || row['Frequency'] || '',
            mappedToCornex: finalMappedName
          };

          if (storeData.storeName) {
            const store = await storage.createHardwareStoreFromExcel(storeData);
            storesCount++;

            // Create route record if rep name exists
            if (storeData.repName) {
              await storage.createSalesRepRouteFromExcel({
                uploadId: upload.id,
                repName: storeData.repName,
                routeName: `${storeData.repName} - ${storeData.cityTown}`,
                storeId: store.id,
                visitFrequency: storeData.visitFrequency,
                mappedToCornex: finalMappedName
              });
              routesCount++;
            }
          }
        }

        // Update upload status
        await storage.updateExcelUpload(upload.id, {
          status: "completed",
          storesCount,
          routesCount,
          metadata: { totalRows: jsonData.length }
        });

        res.json({ 
          success: true, 
          uploadId: upload.id,
          storesCount, 
          routesCount,
          message: `Successfully processed ${storesCount} stores and ${routesCount} routes`
        });

      } catch (processError) {
        console.error("Error processing Excel file:", processError);
        await storage.updateExcelUpload(upload.id, {
          status: "failed",
          errorMessage: "Failed to process Excel file"
        });
        res.status(500).json({ error: "Failed to process Excel file" });
      }

    } catch (error) {
      console.error("Error uploading Excel file:", error);
      res.status(500).json({ error: "Failed to upload Excel file" });
    }
  });

  app.get("/api/excel-uploads", async (req, res) => {
    try {
      const uploads = await storage.getExcelUploads();
      res.json(uploads);
    } catch (error) {
      console.error("Error fetching Excel uploads:", error);
      res.status(500).json({ error: "Failed to fetch Excel uploads" });
    }
  });

  app.get("/api/hardware-stores-excel", async (req, res) => {
    try {
      const stores = await storage.getHardwareStoresFromExcel();
      res.json(stores);
    } catch (error) {
      console.error("Error fetching hardware stores from Excel:", error);
      res.status(500).json({ error: "Failed to fetch hardware stores from Excel" });
    }
  });

  app.get("/api/routes-excel", async (req, res) => {
    try {
      const routes = await storage.getSalesRepRoutesFromExcel();
      res.json(routes);
    } catch (error) {
      console.error("Error fetching routes from Excel:", error);
      res.status(500).json({ error: "Failed to fetch routes from Excel" });
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

    // Create sample orders
    const allProducts = await storage.getProducts();
    const allDistributors = await storage.getDistributors();
    
    const sampleOrders = [
      {
        orderNumber: "ORD-2024-001",
        distributorId: allDistributors[0].id,
        status: "delivered",
        totalAmount: "125600.00",
        currency: "ZAR",
        exchangeRate: "1.000000",
        paymentStatus: "paid",
        expectedDelivery: new Date("2024-01-15"),
        notes: "Bulk order for Q1 inventory"
      },
      {
        orderNumber: "ORD-2024-002", 
        distributorId: allDistributors[1].id,
        status: "shipped",
        totalAmount: "89400.00",
        currency: "ZAR",
        exchangeRate: "1.000000",
        paymentStatus: "paid",
        expectedDelivery: new Date("2024-01-20"),
        notes: "Premium range order"
      },
      {
        orderNumber: "ORD-2024-003",
        distributorId: allDistributors[2].id,
        status: "production",
        totalAmount: "156800.00",
        currency: "ZAR", 
        exchangeRate: "1.000000",
        paymentStatus: "pending",
        expectedDelivery: new Date("2024-02-05"),
        notes: "Custom LED ready products"
      }
    ];

    for (const order of sampleOrders) {
      await storage.createOrder(order);
    }

    // Create sample sales metrics for each region
    const regions = ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Limpopo", "Mpumalanga", "North West", "Free State", "Northern Cape"];
    
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      for (const region of regions) {
        // Regional performance varies
        const baseRevenue = region === "Gauteng" ? 850000 : 
                           region === "Western Cape" ? 720000 :
                           region === "KwaZulu-Natal" ? 680000 : 450000;
        
        const monthlyVariation = (Math.random() - 0.5) * 0.3;
        const revenue = baseRevenue * (1 + monthlyVariation);
        const units = Math.floor(revenue / 12.5); // Average unit price
        
        await storage.createSalesMetrics({
          date,
          region,
          productId: allProducts[Math.floor(Math.random() * allProducts.length)].id,
          distributorId: allDistributors[Math.floor(Math.random() * allDistributors.length)].id,
          revenue: revenue.toFixed(2),
          units,
          currency: "ZAR",
          metricType: "monthly"
        });
      }
    }

    // Create production schedules
    const productionLines = ["EPS Line A", "BR XPS Line B", "LED Ready Line", "Custom Line"];
    
    for (let i = 0; i < 30; i++) {
      const scheduleDate = new Date();
      scheduleDate.setDate(scheduleDate.getDate() + i);
      
      const randomProduct = allProducts[Math.floor(Math.random() * allProducts.length)];
      const randomLine = productionLines[Math.floor(Math.random() * productionLines.length)];
      
      const plannedQty = Math.floor(Math.random() * 5000) + 1000;
      const actualQty = i < 10 ? Math.floor(plannedQty * (0.9 + Math.random() * 0.2)) : 0;
      const efficiency = actualQty > 0 ? Math.min(100, (actualQty / plannedQty) * 100) : null;
      
      const statuses = ["scheduled", "in_progress", "completed"];
      const status = i < 5 ? "in_progress" : i < 15 ? "completed" : "scheduled";
      
      await storage.createProductionSchedule({
        productId: randomProduct.id,
        scheduledDate: scheduleDate,
        plannedQuantity: plannedQty,
        actualQuantity: actualQty,
        productionLine: randomLine,
        status,
        priority: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "normal" : "low",
        efficiency: efficiency ? efficiency.toFixed(1) : null,
        notes: `Production batch for ${randomProduct.sku}`
      });
    }

    // Create demand forecasts
    for (const product of allProducts.slice(0, 20)) {
      for (const region of regions.slice(0, 5)) {
        for (let i = 0; i < 6; i++) {
          const forecastDate = new Date();
          forecastDate.setMonth(forecastDate.getMonth() + i);
          
          const baseDemand = Math.floor(Math.random() * 2000) + 500;
          const seasonalFactor = 1 + (Math.sin((forecastDate.getMonth() / 12) * 2 * Math.PI) * 0.2);
          const predictedDemand = Math.floor(baseDemand * seasonalFactor);
          
          await storage.createDemandForecast({
            productId: product.id,
            region,
            forecastDate,
            predictedDemand,
            confidence: (85 + Math.random() * 15).toFixed(1),
            seasonalFactor: seasonalFactor.toFixed(2),
            marketTrend: Math.random() > 0.6 ? "up" : Math.random() > 0.3 ? "stable" : "down",
            modelVersion: "v2.1.0"
          });
        }
      }
    }

    // Sample factory setups
    const existingFactories = await storage.getFactorySetups();
    if (existingFactories.length === 0) {
      await storage.createFactorySetup({
        factoryName: "Cornex Cape Town Production Hub",
        location: "Cape Town, Western Cape",
        ownershipPhase: "installation",
        progressPercentage: 65,
        totalInvestment: "2850000",
        currentPayment: 2,
        totalPayments: 3,
        monthlyRevenue: "485000",
        productionCapacity: 15000,
        aiOptimizationLevel: 87,
        connectedStores: 185,
        targetStores: 300,
        isActive: true
      });

      await storage.createFactorySetup({
        factoryName: "Cornex Johannesburg Manufacturing",
        location: "Johannesburg, Gauteng",
        ownershipPhase: "operational",
        progressPercentage: 100,
        totalInvestment: "3200000",
        currentPayment: 3,
        totalPayments: 3,
        monthlyRevenue: "625000",
        productionCapacity: 20000,
        aiOptimizationLevel: 94,
        connectedStores: 420,
        targetStores: 500,
        isActive: true
      });

      // Sample AI insights
      await storage.createAiInsight({
        factoryId: null, // Global insight
        type: "optimization",
        title: "Production Line Optimization Opportunity",
        description: "AI detected 18% efficiency gain possible by adjusting cutting speeds during peak hours",
        impact: "high",
        estimatedValue: "R 125,000/month",
        actionRequired: true
      });

      await storage.createAiInsight({
        factoryId: null,
        type: "market",
        title: "Market Expansion Recommendation", 
        description: "Northern Cape region shows 340% demand growth potential for EPS products",
        impact: "high",
        estimatedValue: "R 850,000/year",
        actionRequired: true
      });

      await storage.createAiInsight({
        factoryId: null,
        type: "cost_reduction",
        title: "Energy Cost Optimization",
        description: "Switch to renewable energy could reduce operational costs by 28%",
        impact: "medium", 
        estimatedValue: "R 45,000/month",
        actionRequired: false
      });

      // Sample Automation Rules
      const inventoryRule = await storage.createAutomationRule({
        ruleName: "Smart Inventory Reorder",
        category: "inventory",
        triggerType: "threshold",
        triggerCondition: { stockLevel: 100, operator: "<=", productCategory: "EPS" },
        actionType: "reorder",
        actionParameters: { quantity: 500, supplier: "primary", priority: "medium" },
        isActive: true,
        priority: 1,
        successRate: "94.5",
      });

      const productionRule = await storage.createAutomationRule({
        ruleName: "Production Line Optimization",
        category: "production",
        triggerType: "schedule",
        triggerCondition: { time: "06:00", days: ["monday", "tuesday", "wednesday", "thursday", "friday"] },
        actionType: "optimize",
        actionParameters: { target: "efficiency", adjustment: 15, duration: 480 },
        isActive: true,
        priority: 1,
        successRate: "97.2",
      });

      const maintenanceRule = await storage.createAutomationRule({
        ruleName: "Predictive Maintenance Alert",
        category: "maintenance",
        triggerType: "predictive",
        triggerCondition: { vibrationLevel: 85, temperature: 75, runningHours: 2000 },
        actionType: "schedule",
        actionParameters: { type: "preventive", urgency: "medium", technician: "auto-assign" },
        isActive: true,
        priority: 2,
        successRate: "89.3",
      });

      const qualityRule = await storage.createAutomationRule({
        ruleName: "Quality Control Check",
        category: "quality",
        triggerType: "event",
        triggerCondition: { batchComplete: true, productType: "cornice" },
        actionType: "alert",
        actionParameters: { inspectionType: "visual", sampleSize: 10, tolerance: 0.5 },
        isActive: true,
        priority: 2,
        successRate: "91.8",
      });

      const distributionRule = await storage.createAutomationRule({
        ruleName: "Smart Distribution Routing",
        category: "distribution",
        triggerType: "threshold",
        triggerCondition: { orderCount: 5, region: "gauteng", weight: 500 },
        actionType: "optimize",
        actionParameters: { routeOptimization: true, vehicle: "truck", delivery: "next-day" },
        isActive: false,
        priority: 3,
        successRate: "85.7",
      });

      // Sample Automation Events
      await storage.createAutomationEvent({
        ruleId: inventoryRule.id,
        eventType: "triggered",
        status: "success",
        triggerData: { stockLevel: 95, product: "EPS12", timestamp: new Date().toISOString() },
        result: { orderPlaced: true, orderId: "ORD-2024-001", quantity: 500 },
        executionTime: 340,
      });

      await storage.createAutomationEvent({
        ruleId: productionRule.id,
        eventType: "executed",
        status: "success",
        triggerData: { scheduledTime: "06:00", efficiency: 89 },
        result: { newEfficiency: 94, energySaved: "12kWh", timeReduction: "23min" },
        executionTime: 1200,
      });

      // Sample Maintenance Schedules
      await storage.createMaintenanceSchedule({
        equipmentName: "EPS Cutting Machine #1",
        maintenanceType: "preventive",
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        estimatedDuration: 180,
        priority: "high",
        status: "scheduled",
        assignedTechnician: "John Smith",
        checklist: [
          { task: "Check blade alignment", completed: false },
          { task: "Lubricate moving parts", completed: false },
          { task: "Calibrate cutting precision", completed: false },
          { task: "Test safety systems", completed: false }
        ],
        notes: "Due for quarterly maintenance - blade showing wear signs",
        cost: "2500.00",
      });

      await storage.createMaintenanceSchedule({
        equipmentName: "BR XPS Molding Press #2",
        maintenanceType: "predictive",
        scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        estimatedDuration: 240,
        priority: "medium",
        status: "scheduled",
        assignedTechnician: "Sarah Johnson",
        checklist: [
          { task: "Replace hydraulic seals", completed: false },
          { task: "Check pressure systems", completed: false },
          { task: "Update control software", completed: false }
        ],
        notes: "Predictive analytics suggest hydraulic maintenance needed",
        cost: "4200.00",
      });

      await storage.createMaintenanceSchedule({
        equipmentName: "Quality Control Scanner",
        maintenanceType: "corrective",
        scheduledDate: new Date(), // Today
        estimatedDuration: 120,
        priority: "high",
        status: "in_progress",
        assignedTechnician: "Mike Wilson",
        checklist: [
          { task: "Replace sensor calibration unit", completed: true },
          { task: "Update detection algorithms", completed: false },
          { task: "Test measurement accuracy", completed: false }
        ],
        notes: "Scanner showing inconsistent readings - urgent repair needed",
        cost: "1800.00",
      });
    }

    console.log("Sample data initialized successfully");
  } catch (error) {
    console.error("Failed to initialize sample data:", error);
  }
}
