import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// import { setupAuth, isAuthenticated } from "./replitAuth"; // DISABLED FOR DEMO
import { 
  insertProductSchema, 
  insertDistributorSchema, 
  insertOrderSchema, 
  insertProductionScheduleSchema,
  insertFactorySetupSchema,
  insertAiInsightSchema,
  insertProductionMetricsSchema,
  insertFactoryRecommendationSchema,
  insertPurchaseOrderSchema,
  insertPurchaseOrderItemSchema,
  insertPoStatusHistorySchema,
  insertPoDocumentSchema,
  insertProductLabelSchema,
  insertPrinterSchema,
  insertPrintJobSchema,
  insertLabelTemplateSchema
} from "@shared/schema";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { z } from "zod";
import multer from "multer";
import * as XLSX from "xlsx";
import path from "path";

// Configure multer for bulk file uploads
const bulkUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 50 // Maximum 50 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(xlsx|xls|csv)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel and CSV files are allowed.'));
    }
  }
});

// Single file upload for existing functionality
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const isExcel = file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                   file.mimetype === 'application/vnd.ms-excel' ||
                   !!file.originalname.match(/\.(xlsx|xls)$/i);
    cb(null, isExcel);
  }
});

// Global storage for import sessions
const importSessions = new Map<string, any>();

// Helper function to generate session ID
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Map file names to Cornex references
const mapFileNameToCornex = (fileName: string): string => {
  const lowerName = fileName.toLowerCase();
  if (lowerName.includes('zollie')) return 'Cornex Zollie District Routes';
  if (lowerName.includes('homemart')) return 'Cornex Homemart Store Network';
  if (lowerName.includes('tripot')) return 'Cornex Tripot Distribution Points';
  if (lowerName.includes('cornice maker')) return 'Cornex Cornice Maker Retailers';
  return `Cornex ${fileName}`;
};

// Smart Excel data extraction for unstructured files
const extractHardwareStoreData = (worksheet: XLSX.WorkSheet, fileName: string): any[] => {
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
  const extractedStores: any[] = [];
  
  // Common field patterns to look for
  const fieldPatterns = {
    name: /(store|shop|hardware|name|business|company)/i,
    address: /(address|location|street|addr)/i,
    contact: /(contact|phone|tel|mobile|cell)/i,
    email: /(email|mail|e-mail)/i,
    province: /(province|prov|state|region)/i,
    city: /(city|town|municipality)/i,
    manager: /(manager|owner|contact\s*person)/i,
    creditLimit: /(credit|limit|cr\s*limit)/i,
    type: /(type|category|size|class)/i
  };

  // Find header row by looking for the most field matches
  let headerRowIndex = -1;
  let maxMatches = 0;
  
  for (let i = 0; i < Math.min(10, jsonData.length); i++) {
    const row = jsonData[i];
    if (!row || !Array.isArray(row)) continue;
    
    let matches = 0;
    for (const cell of row) {
      if (typeof cell === 'string') {
        for (const pattern of Object.values(fieldPatterns)) {
          if (pattern.test(cell)) {
            matches++;
            break;
          }
        }
      }
    }
    
    if (matches > maxMatches) {
      maxMatches = matches;
      headerRowIndex = i;
    }
  }

  if (headerRowIndex === -1) {
    // Fallback: assume first row is header
    headerRowIndex = 0;
  }

  const headers = jsonData[headerRowIndex] || [];
  const fieldMapping: { [key: string]: number } = {};

  // Map headers to field indices
  headers.forEach((header, index) => {
    if (typeof header === 'string') {
      const lowerHeader = header.toLowerCase();
      for (const [field, pattern] of Object.entries(fieldPatterns)) {
        if (pattern.test(lowerHeader)) {
          fieldMapping[field] = index;
          break;
        }
      }
    }
  });

  // Extract data rows
  for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (!row || !Array.isArray(row)) continue;
    
    // Skip empty rows
    if (row.every(cell => !cell || String(cell).trim() === '')) continue;

    const store: any = {
      id: `${fileName.replace(/\.[^/.]+$/, "")}_${i}`,
      name: row[fieldMapping.name] || `Store ${i}`,
      address: row[fieldMapping.address] || '',
      contactPerson: row[fieldMapping.manager] || '',
      phone: row[fieldMapping.contact] || '',
      email: row[fieldMapping.email] || '',
      province: row[fieldMapping.province] || 'Unknown',
      city: row[fieldMapping.city] || '',
      creditLimit: parseFloat(String(row[fieldMapping.creditLimit] || 0)) || 0,
      storeType: row[fieldMapping.type] || 'hardware',
      status: 'active',
      source: `Bulk Import - ${fileName}`,
      importedAt: new Date().toISOString()
    };

    // Validate minimum required data
    if (store.name && store.name !== `Store ${i}`) {
      extractedStores.push(store);
    }
  }

  return extractedStores;
};

// Process a single file and extract hardware store data
const processImportFile = async (file: Express.Multer.File): Promise<{
  fileName: string;
  totalRows: number;
  validRows: number;
  errors: string[];
  extractedData: any[];
}> => {
  const errors: string[] = [];
  let extractedData: any[] = [];

  try {
    let workbook: XLSX.WorkBook;

    // Parse the file based on type
    if (file.mimetype.includes('csv')) {
      const csvContent = file.buffer.toString('utf-8');
      workbook = XLSX.read(csvContent, { type: 'string' });
    } else {
      workbook = XLSX.read(file.buffer, { type: 'buffer' });
    }

    // Process each worksheet
    const sheetNames = workbook.SheetNames;
    for (const sheetName of sheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      if (worksheet) {
        const sheetData = extractHardwareStoreData(worksheet, file.originalname);
        extractedData = extractedData.concat(sheetData);
      }
    }

    return {
      fileName: file.originalname,
      totalRows: extractedData.length,
      validRows: extractedData.filter(store => store.name && store.name !== '').length,
      errors,
      extractedData
    };

  } catch (error) {
    errors.push(`Failed to parse file: ${error.message}`);
    return {
      fileName: file.originalname,
      totalRows: 0,
      validRows: 0,
      errors,
      extractedData: []
    };
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit Authentication - DISABLED FOR DEMO
  // await setupAuth(app);

  // Initialize sample data
  await initializeSampleData();

  // Authentication routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Check if user is authenticated without middleware throwing error
      if (!req.isAuthenticated() || !req.user?.claims?.sub) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Company Settings routes
  app.get('/api/company-settings', async (req: any, res) => {
    try {
      // Return Homemart Africa's company settings for the demo
      const companySettings = {
        companyName: "HOMEMART AFRICA",
        companyRegistration: "2022/854581/07",
        contactEmail: "info@homemart.co.za",
        alternateEmail: "sales@homemart.co.za",
        phone: "+27 11 123 4567",
        alternatePhone: "+27 11 765 4321",
        address: "123 Industrial Street, Johannesburg",
        city: "Johannesburg",
        province: "Gauteng",
        postalCode: "2001",
        country: "South Africa",
        vatNumber: "4123456789",
        businessType: "distributor",
        creditLimit: "500000",
        paymentTerms: "30_days"
      };
      res.json(companySettings);
    } catch (error) {
      console.error("Error fetching company settings:", error);
      res.status(500).json({ message: "Failed to fetch company settings" });
    }
  });

  app.put('/api/company-settings', async (req: any, res) => {
    try {
      // For demo purposes, just return the updated settings
      const updatedSettings = req.body;
      res.json({ 
        message: "Company settings updated successfully",
        data: updatedSettings 
      });
    } catch (error) {
      console.error("Error updating company settings:", error);
      res.status(500).json({ message: "Failed to update company settings" });
    }
  });

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
      console.log("Creating distributor with data:", req.body);
      const distributorData = insertDistributorSchema.parse(req.body);
      console.log("Parsed distributor data:", distributorData);
      const distributor = await storage.createDistributor(distributorData);
      console.log("Created distributor:", distributor);
      res.status(201).json(distributor);
    } catch (error) {
      console.error("Error creating distributor:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create distributor", error: error.message });
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

        // Process each row with flexible column matching
        for (const row of jsonData as any[]) {
          // Get all keys from the row to understand the structure
          const keys = Object.keys(row);
          console.log('Row keys:', keys); // Debug log
          console.log('Row data:', row); // Debug log
          
          // Flexible column matching
          const storeData = {
            uploadId: upload.id,
            storeName: row['Store Name'] || row['StoreName'] || row['Store'] || row['Name'] || 
                      row['STORE NAME'] || row['STORE'] || row['Business Name'] || 
                      keys.find(k => k.toLowerCase().includes('store') || k.toLowerCase().includes('name'))
                      ? row[keys.find(k => k.toLowerCase().includes('store') || k.toLowerCase().includes('name'))] : '',
            storeAddress: row['Store Address'] || row['Address'] || row['STORE ADDRESS'] || 
                         row['Physical Address'] || row['Location'] ||
                         keys.find(k => k.toLowerCase().includes('address') || k.toLowerCase().includes('location'))
                         ? row[keys.find(k => k.toLowerCase().includes('address') || k.toLowerCase().includes('location'))] : '',
            cityTown: row['City/Town'] || row['City'] || row['Town'] || row['CITY'] || row['TOWN'] ||
                     keys.find(k => k.toLowerCase().includes('city') || k.toLowerCase().includes('town'))
                     ? row[keys.find(k => k.toLowerCase().includes('city') || k.toLowerCase().includes('town'))] : '',
            province: row['Province'] || row['PROVINCE'] || row['Region'] ||
                     keys.find(k => k.toLowerCase().includes('province') || k.toLowerCase().includes('region'))
                     ? row[keys.find(k => k.toLowerCase().includes('province') || k.toLowerCase().includes('region'))] : '',
            contactPerson: row['Contact Person'] || row['Contact'] || row['CONTACT'] || row['Manager'] ||
                          keys.find(k => k.toLowerCase().includes('contact') || k.toLowerCase().includes('manager'))
                          ? row[keys.find(k => k.toLowerCase().includes('contact') || k.toLowerCase().includes('manager'))] : '',
            phoneNumber: row['Phone Number'] || row['Phone'] || row['PHONE'] || row['Tel'] || row['Mobile'] ||
                        keys.find(k => k.toLowerCase().includes('phone') || k.toLowerCase().includes('tel') || k.toLowerCase().includes('mobile'))
                        ? row[keys.find(k => k.toLowerCase().includes('phone') || k.toLowerCase().includes('tel') || k.toLowerCase().includes('mobile'))] : '',
            repName: row['Rep Name'] || row['Representative'] || row['REP'] || row['Sales Rep'] || row['Agent'] ||
                    keys.find(k => k.toLowerCase().includes('rep') || k.toLowerCase().includes('sales') || k.toLowerCase().includes('agent'))
                    ? row[keys.find(k => k.toLowerCase().includes('rep') || k.toLowerCase().includes('sales') || k.toLowerCase().includes('agent'))] : '',
            visitFrequency: row['Visit Frequency'] || row['Frequency'] || row['Schedule'] || 'weekly',
            mappedToCornex: finalMappedName
          };

          // Only create store if we have at least a store name
          if (storeData.storeName && storeData.storeName.trim() !== '') {
            console.log('Creating store:', storeData); // Debug log
            try {
              const store = await storage.createHardwareStoreFromExcel(storeData);
              storesCount++;

              // Create route record if rep name exists
              if (storeData.repName && storeData.repName.trim() !== '') {
                await storage.createSalesRepRouteFromExcel({
                  uploadId: upload.id,
                  repName: storeData.repName,
                  routeName: `${storeData.repName} - ${storeData.cityTown || 'Route'}`,
                  storeId: store.id,
                  visitFrequency: storeData.visitFrequency || 'weekly',
                  mappedToCornex: finalMappedName
                });
                routesCount++;
              }
            } catch (storeError) {
              console.error('Error creating store:', storeError);
            }
          } else {
            console.log('Skipping row - no valid store name found:', row);
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

  // Sync verification endpoint for 24/7 balanced data
  app.get("/api/sync-status", async (req, res) => {
    try {
      const [uploads, excelStores, excelRoutes, mainStores, mainRoutes] = await Promise.all([
        storage.getExcelUploads(),
        storage.getHardwareStoresFromExcel(),
        storage.getSalesRepRoutesFromExcel(),
        storage.getHardwareStores(),
        storage.getRoutePlans()
      ]);

      const syncStatus = {
        totalUploads: uploads.length,
        completedUploads: uploads.filter(u => u.status === 'completed').length,
        processingUploads: uploads.filter(u => u.status === 'processing').length,
        failedUploads: uploads.filter(u => u.status === 'failed').length,
        excelStores: excelStores.length,
        excelRoutes: excelRoutes.length,
        mainStores: mainStores.length,
        mainRoutes: mainRoutes.length,
        isBalanced: excelStores.length > 0 && mainStores.length >= excelStores.length,
        lastSync: new Date().toISOString(),
        syncHealth: uploads.filter(u => u.status === 'processing').length === 0 ? 'healthy' : 'processing'
      };

      res.json(syncStatus);
    } catch (error) {
      console.error("Error checking sync status:", error);
      res.status(500).json({ error: "Failed to check sync status" });
    }
  });

  // Bulk Import API Routes
  app.get("/api/import-sessions", async (req, res) => {
    try {
      const sessions = await storage.getImportSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching import sessions:", error);
      res.status(500).json({ error: "Failed to fetch import sessions" });
    }
  });

  app.post("/api/bulk-import/process", upload.array('files', 50), async (req, res) => {
    try {
      console.log("Processing bulk import with files:", req.files?.length || 0);
      
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files provided" });
      }

      // Create import session
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const session = await storage.createImportSession({
        id: sessionId,
        name: `Import Session ${new Date().toLocaleString()}`,
        totalFiles: req.files.length,
        processedFiles: 0,
        status: "active",
        createdAt: new Date().toISOString(),
        files: []
      });

      const processedFiles = [];

      // Process each file
      for (const file of req.files) {
        console.log(`Processing file: ${file.originalname}`);
        
        try {
          const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          // Add file to session
          const importFile = {
            id: fileId,
            name: file.originalname,
            status: "processing",
            progress: 0,
            result: null
          };

          await storage.addFileToImportSession(sessionId, importFile);

          // Process Excel file
          const workbook = XLSX.read(file.buffer, { type: 'buffer' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          console.log(`Found ${jsonData.length} rows in ${file.originalname}`);

          let validRows = 0;
          let totalRows = jsonData.length;
          const errors = [];

          // Process hardware stores
          for (let i = 0; i < jsonData.length; i++) {
            const row = jsonData[i];
            
            try {
              // Detect if this is hardware store data
              const storeData = await storage.processHardwareStoreRow(row, file.originalname);
              if (storeData) {
                validRows++;
              }
            } catch (rowError) {
              console.error(`Error processing row ${i + 1}:`, rowError);
              errors.push(`Row ${i + 1}: ${rowError.message}`);
            }
          }

          // Update file with results
          await storage.updateFileInImportSession(sessionId, fileId, {
            status: "completed",
            progress: 100,
            result: {
              totalRows,
              validRows,
              errors,
              preview: jsonData.slice(0, 5) // First 5 rows as preview
            }
          });

          processedFiles.push({
            id: fileId,
            name: file.originalname,
            status: "completed",
            totalRows,
            validRows,
            errors: errors.length
          });

        } catch (fileError) {
          console.error(`Error processing file ${file.originalname}:`, fileError);
          
          await storage.updateFileInImportSession(sessionId, fileId, {
            status: "error",
            progress: 0,
            result: {
              totalRows: 0,
              validRows: 0,
              errors: [fileError.message],
              preview: []
            }
          });

          processedFiles.push({
            id: fileId,
            name: file.originalname,
            status: "error",
            totalRows: 0,
            validRows: 0,
            errors: 1
          });
        }
      }

      // Update session as completed
      await storage.updateImportSession(sessionId, {
        processedFiles: req.files.length,
        status: "completed"
      });

      console.log(`Bulk import completed: ${processedFiles.length} files processed`);

      res.json({
        success: true,
        sessionId,
        processedFiles,
        message: `Successfully processed ${processedFiles.length} files`
      });

    } catch (error) {
      console.error("Error in bulk import process:", error);
      res.status(500).json({ error: "Bulk import failed" });
    }
  });

  app.get("/api/bulk-import/history", async (req, res) => {
    try {
      const sessions = await storage.getImportSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching import history:", error);
      res.status(500).json({ error: "Failed to fetch import history" });
    }
  });

  app.get("/api/bulk-import/session/:id", async (req, res) => {
    try {
      const session = await storage.getImportSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Error fetching import session:", error);
      res.status(500).json({ error: "Failed to fetch import session" });
    }
  });

  app.get("/api/bulk-import/status/:id", async (req, res) => {
    try {
      const session = await storage.getImportSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      // Return session status for polling
      res.json({
        id: session.id,
        status: session.status,
        processedFiles: session.processedFiles,
        totalFiles: session.totalFiles,
        files: session.files || []
      });
    } catch (error) {
      console.error("Error fetching session status:", error);
      res.status(500).json({ error: "Failed to fetch session status" });
    }
  });

  // Clear all import files endpoint
  app.post("/api/bulk-import/clear", async (req, res) => {
    try {
      // This would clear any pending files from the session
      res.json({ success: true, message: "Files cleared" });
    } catch (error) {
      console.error("Error clearing files:", error);
      res.status(500).json({ error: "Failed to clear files" });
    }
  });

  // Manual sync trigger endpoint
  app.post("/api/force-sync", async (req, res) => {
    try {
      const excelStores = await storage.getHardwareStoresFromExcel();
      const excelRoutes = await storage.getSalesRepRoutesFromExcel();
      
      let syncedStores = 0;
      let syncedRoutes = 0;

      // Force sync all Excel stores to main directory
      for (const store of excelStores) {
        try {
          await storage.syncStoreToMainDirectory(store);
          syncedStores++;
        } catch (error) {
          console.error(`Error syncing store ${store.id}:`, error);
        }
      }

      // Force sync all Excel routes to main directory
      for (const route of excelRoutes) {
        try {
          await storage.syncRouteToMainDirectory(route);
          syncedRoutes++;
        } catch (error) {
          console.error(`Error syncing route ${route.id}:`, error);
        }
      }

      res.json({
        success: true,
        syncedStores,
        syncedRoutes,
        message: `Forced sync completed: ${syncedStores} stores and ${syncedRoutes} routes synchronized`
      });
    } catch (error) {
      console.error("Error during force sync:", error);
      res.status(500).json({ error: "Force sync failed" });
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

  // Purchase Order System Routes
  app.get("/api/purchase-orders", async (req, res) => {
    try {
      const status = req.query.status as string;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const search = req.query.search as string;

      let orders;
      if (status) {
        orders = await storage.getPurchaseOrdersByStatus(status);
      } else if (startDate && endDate) {
        orders = await storage.getPurchaseOrdersByDateRange(new Date(startDate), new Date(endDate));
      } else if (search) {
        orders = await storage.searchPurchaseOrders(search);
      } else {
        orders = await storage.getPurchaseOrders();
      }

      res.json(orders);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      res.status(500).json({ error: "Failed to fetch purchase orders" });
    }
  });

  app.get("/api/purchase-orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const order = await storage.getPurchaseOrder(id);
      
      if (!order) {
        return res.status(404).json({ error: "Purchase order not found" });
      }

      res.json(order);
    } catch (error) {
      console.error("Error fetching purchase order:", error);
      res.status(500).json({ error: "Failed to fetch purchase order" });
    }
  });

  app.post("/api/purchase-orders", async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const validatedData = insertPurchaseOrderSchema.parse({
        ...req.body,
        createdBy: userId
      });

      const order = await storage.createPurchaseOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating purchase order:", error);
      res.status(500).json({ error: "Failed to create purchase order" });
    }
  });

  app.put("/api/purchase-orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertPurchaseOrderSchema.partial().parse(req.body);
      
      const order = await storage.updatePurchaseOrder(id, validatedData);
      res.json(order);
    } catch (error) {
      console.error("Error updating purchase order:", error);
      res.status(500).json({ error: "Failed to update purchase order" });
    }
  });

  app.patch("/api/purchase-orders/:id/status", async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status, reason, notes } = req.body;
      const userId = req.user?.claims?.sub;

      const order = await storage.updatePurchaseOrderStatus(id, status, userId, reason, notes);
      res.json(order);
    } catch (error) {
      console.error("Error updating purchase order status:", error);
      res.status(500).json({ error: "Failed to update purchase order status" });
    }
  });

  app.post("/api/purchase-orders/:id/items", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertPurchaseOrderItemSchema.parse({
        ...req.body,
        purchaseOrderId: id
      });

      const item = await storage.addPurchaseOrderItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error adding purchase order item:", error);
      res.status(500).json({ error: "Failed to add purchase order item" });
    }
  });

  app.post("/api/purchase-orders/:id/documents", async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.claims?.sub;
      const validatedData = insertPoDocumentSchema.parse({
        ...req.body,
        purchaseOrderId: id,
        uploadedBy: userId
      });

      const document = await storage.addDocument(validatedData);
      res.status(201).json(document);
    } catch (error) {
      console.error("Error adding purchase order document:", error);
      res.status(500).json({ error: "Failed to add purchase order document" });
    }
  });

  app.get("/api/purchase-orders/generate-po-number", async (req, res) => {
    try {
      const poNumber = await storage.generatePONumber();
      res.json({ poNumber });
    } catch (error) {
      console.error("Error generating PO number:", error);
      res.status(500).json({ error: "Failed to generate PO number" });
    }
  });

  // Logistics integration routes
  app.get("/api/logistics-partners", async (req, res) => {
    try {
      const partners = await storage.getLogisticsPartners();
      res.json(partners);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch logistics partners" });
    }
  });

  app.get("/api/logistics-brands", async (req, res) => {
    try {
      const brands = await storage.getLogisticsBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch logistics brands" });
    }
  });

  // Hardware stores endpoint
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
      console.error("Error fetching hardware stores:", error);
      res.status(500).json({ message: "Failed to fetch hardware stores" });
    }
  });

  // Add bulk import routes
  addBulkImportRoutes(app);

  // User Management endpoints - DATABASE INTEGRATION (NO AUTH FOR DEMO)
  app.get('/api/users', async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      const newUser = await storage.createUser({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: req.body.role || 'viewer',
        department: req.body.department,
        phone: req.body.phone,
        region: req.body.region,
        currency: req.body.currency || 'ZAR'
      });
      
      await storage.createAuditLog({
        userId: 'homemart_admin_001',
        action: 'create',
        details: `Created new user: ${newUser.email}`,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.get('User-Agent') || 'Unknown'
      });
      
      console.log('[API] Created user in database:', newUser.email);
      res.json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  app.put('/api/users/:id', async (req, res) => {
    try {
      const updatedUser = await storage.updateUser(req.params.id, req.body);
      
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      await storage.createAuditLog({
        userId: 'homemart_admin_001',
        action: 'update',
        details: `Updated user: ${updatedUser.email}`,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.get('User-Agent') || 'Unknown'
      });
      
      console.log('[API] Updated user in database:', req.params.id);
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  });

  app.delete('/api/users/:id', async (req, res) => {
    try {
      const success = await storage.deleteUser(req.params.id);
      
      if (!success) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      await storage.createAuditLog({
        userId: 'homemart_admin_001',
        action: 'delete',
        details: `Deleted user: ${req.params.id}`,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.get('User-Agent') || 'Unknown'
      });
      
      console.log('[API] Deleted user from database:', req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  });

  // Company Settings endpoints - DATABASE INTEGRATION (NO AUTH FOR DEMO)
  app.get('/api/company-settings', async (req, res) => {
    try {
      const settings = await storage.getCompanySettings();
      if (!settings) {
        const initialSettings = await storage.updateCompanySettings({
          companyName: 'HOMEMART AFRICA',
          companyRegistration: '2022/854581/07',
          contactEmail: 'info@homemart.co.za',
          phone: '+27 11 555 0000',
          address: '123 Industrial Drive',
          city: 'Johannesburg',
          province: 'Gauteng',
          country: 'South Africa',
          postalCode: '2000',
          vatNumber: '9169062271',
          creditLimit: '500000.00',
          paymentTerms: '30_days',
          businessType: 'distributor'
        });
        res.json(initialSettings);
      } else {
        res.json(settings);
      }
    } catch (error) {
      console.error('Error fetching company settings:', error);
      res.status(500).json({ error: 'Failed to fetch company settings' });
    }
  });

  app.put('/api/company-settings', async (req, res) => {
    try {
      const updatedSettings = await storage.updateCompanySettings(req.body);
      
      await storage.createAuditLog({
        userId: 'homemart_admin_001',
        action: 'update',
        details: `Updated company settings: ${updatedSettings.companyName}`,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.get('User-Agent') || 'Unknown'
      });
      
      console.log('[API] Company settings updated in database:', updatedSettings.companyName);
      res.json(updatedSettings);
    } catch (error) {
      console.error('Error updating company settings:', error);
      res.status(500).json({ error: 'Failed to update company settings' });
    }
  });

  // Audit Trail endpoints - DATABASE INTEGRATION (NO AUTH FOR DEMO) 
  app.get('/api/audit-logs/:filters?', async (req, res) => {
    try {
      let filters = {};
      try {
        filters = req.params.filters && req.params.filters !== '[object Object]' 
          ? JSON.parse(decodeURIComponent(req.params.filters)) 
          : {};
      } catch (e) {
        filters = {};
      }
      
      const auditLogs = await storage.getAuditLogs(filters);
      res.json(auditLogs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      res.status(500).json({ error: 'Failed to fetch audit logs' });
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
        name: "HOMEMART AFRICA",
        contactPerson: "SCHOEMAN HEYNS",
        email: "KATRYNCC@GMAIL.COM",
        phone: "0814159468",
        address: "40 ZANIE STREET, NEWPARK ESTATE, HAZELDEAN",
        city: "HAZELDEAN",
        region: "GAUTENG",
        country: "South Africa",
        currency: "ZAR",
        status: "active",
        tier: "premium",
        creditLimit: "500000.00",
        paymentTerms: "NET30",
        brands: ["TrimStyle™", "DesignAura™", "CorniceCraft™", "CeilingTech™"],
        taxNumber: "9169062271",
        registrationNumber: "2022/854581/07",
        commissionRate: "15.00"
      },
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

// Add bulk import routes before server creation
const addBulkImportRoutes = (app: Express) => {
  // Process bulk import files
  app.post("/api/bulk-import/process", bulkUpload.array('files', 50), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files provided" });
      }

      const sessionId = generateSessionId();
      const session = {
        id: sessionId,
        name: `Import Session ${new Date().toLocaleString()}`,
        totalFiles: files.length,
        processedFiles: 0,
        status: "active",
        createdAt: new Date().toISOString(),
        files: files.map(file => ({
          id: `${sessionId}_${file.originalname}`,
          fileName: file.originalname,
          status: "pending",
          progress: 0
        }))
      };

      await storage.createBulkImportSession(session);

      // Process files asynchronously
      processFilesAsync(sessionId, files);

      res.json({ sessionId, message: "Import started successfully" });
    } catch (error) {
      console.error("Bulk import error:", error);
      res.status(500).json({ error: "Failed to start import process" });
    }
  });

  // Get import status
  app.get("/api/bulk-import/status/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const session = await storage.getBulkImportSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.json(session);
    } catch (error) {
      console.error("Status check error:", error);
      res.status(500).json({ error: "Failed to get import status" });
    }
  });

  // Get import history
  app.get("/api/bulk-import/history", async (req, res) => {
    try {
      const history = await storage.getBulkImportSessions();
      res.json(history);
    } catch (error) {
      console.error("History fetch error:", error);
      res.status(500).json({ error: "Failed to fetch import history" });
    }
  });

  // Get detailed session information
  app.get("/api/bulk-import/session/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const session = await storage.getBulkImportSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.json(session);
    } catch (error) {
      console.error("Session fetch error:", error);
      res.status(500).json({ error: "Failed to fetch session details" });
    }
  });

  // Product Labeling and Inserts Library API Routes
  const objectStorageService = new ObjectStorageService();

  // Get all product labels
  app.get("/api/product-labels", async (req, res) => {
    try {
      const labels = await storage.getProductLabels();
      res.json(labels);
    } catch (error) {
      console.error("Error fetching product labels:", error);
      res.status(500).json({ error: "Failed to fetch product labels" });
    }
  });

  // Create a new product label
  app.post("/api/product-labels", async (req, res) => {
    try {
      const validatedData = insertProductLabelSchema.parse(req.body);
      const label = await storage.createProductLabel(validatedData);
      res.status(201).json(label);
    } catch (error) {
      console.error("Error creating product label:", error);
      res.status(500).json({ error: "Failed to create product label" });
    }
  });

  // Get upload URL for product label PDF
  app.post("/api/product-labels/upload-url", async (req, res) => {
    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  });

  // Update product label with file information after upload
  app.put("/api/product-labels/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (req.body.fileUrl) {
        req.body.fileUrl = objectStorageService.normalizeObjectEntityPath(req.body.fileUrl);
      }
      const validatedData = insertProductLabelSchema.partial().parse(req.body);
      const label = await storage.updateProductLabel(id, validatedData);
      res.json(label);
    } catch (error) {
      console.error("Error updating product label:", error);
      res.status(500).json({ error: "Failed to update product label" });
    }
  });

  // Delete product label
  app.delete("/api/product-labels/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteProductLabel(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting product label:", error);
      res.status(500).json({ error: "Failed to delete product label" });
    }
  });

  // Get all printers
  app.get("/api/printers", async (req, res) => {
    try {
      const printers = await storage.getPrinters();
      res.json(printers);
    } catch (error) {
      console.error("Error fetching printers:", error);
      res.status(500).json({ error: "Failed to fetch printers" });
    }
  });

  // Add a new printer
  app.post("/api/printers", async (req, res) => {
    try {
      const validatedData = insertPrinterSchema.parse(req.body);
      const printer = await storage.createPrinter(validatedData);
      res.status(201).json(printer);
    } catch (error) {
      console.error("Error adding printer:", error);
      res.status(500).json({ error: "Failed to add printer" });
    }
  });

  // Update printer status or details
  app.put("/api/printers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertPrinterSchema.partial().parse(req.body);
      const printer = await storage.updatePrinter(id, validatedData);
      res.json(printer);
    } catch (error) {
      console.error("Error updating printer:", error);
      res.status(500).json({ error: "Failed to update printer" });
    }
  });

  // Create a print job
  app.post("/api/print-jobs", async (req, res) => {
    try {
      const validatedData = insertPrintJobSchema.parse(req.body);
      const printJob = await storage.createPrintJob(validatedData);
      res.status(201).json(printJob);
    } catch (error) {
      console.error("Error creating print job:", error);
      res.status(500).json({ error: "Failed to create print job" });
    }
  });

  // Get print jobs for a user or printer
  app.get("/api/print-jobs", async (req, res) => {
    try {
      const printerId = req.query.printerId as string;
      const userId = req.query.userId as string;
      
      let jobs;
      if (printerId) {
        jobs = await storage.getPrintJobsByPrinter(printerId);
      } else if (userId) {
        jobs = await storage.getPrintJobsByUser(userId);
      } else {
        jobs = await storage.getPrintJobs();
      }
      
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching print jobs:", error);
      res.status(500).json({ error: "Failed to fetch print jobs" });
    }
  });

  // Update print job status
  app.patch("/api/print-jobs/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const job = await storage.updatePrintJobStatus(id, status);
      res.json(job);
    } catch (error) {
      console.error("Error updating print job status:", error);
      res.status(500).json({ error: "Failed to update print job status" });
    }
  });

  // Serve PDF files from object storage
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving file:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.status(404).json({ error: "File not found" });
      }
      res.status(500).json({ error: "Failed to serve file" });
    }
  });

  // Public object serving for assets
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      await objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get label templates
  app.get("/api/label-templates", async (req, res) => {
    try {
      const templates = await storage.getLabelTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching label templates:", error);
      res.status(500).json({ error: "Failed to fetch label templates" });
    }
  });

  // Create label template
  app.post("/api/label-templates", async (req, res) => {
    try {
      const validatedData = insertLabelTemplateSchema.parse(req.body);
      const template = await storage.createLabelTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      console.error("Error creating label template:", error);
      res.status(500).json({ error: "Failed to create label template" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
};

// Async file processing function
const processFilesAsync = async (sessionId: string, files: Express.Multer.File[]) => {
  let session = await storage.getBulkImportSession(sessionId);
  if (!session) return;

  try {
    let totalImported = 0;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = `${sessionId}_${file.originalname}`;
      
      // Update file status to processing
      session.files[i].status = "processing";
      session.files[i].progress = 0;
      await storage.updateBulkImportSession(sessionId, session);

      try {
        const result = await processImportFile(file);
        
        // Update progress during processing
        for (let progress = 10; progress <= 90; progress += 20) {
          session.files[i].progress = progress;
          await storage.updateBulkImportSession(sessionId, session);
          await new Promise(resolve => setTimeout(resolve, 100)); // Simulate processing time
        }

        // Import hardware stores to storage
        for (const storeData of result.extractedData) {
          try {
            await storage.createHardwareStore(storeData);
            totalImported++;
          } catch (error) {
            console.error(`Failed to import store: ${storeData.name}`, error);
            result.errors.push(`Failed to import store: ${storeData.name}`);
          }
        }

        // Update file as completed
        session.files[i].status = "completed";
        session.files[i].progress = 100;
        session.files[i].result = {
          totalRows: result.totalRows,
          validRows: result.validRows,
          errors: result.errors,
          preview: result.extractedData.slice(0, 5) // First 5 records for preview
        };

        session.processedFiles++;
        await storage.updateBulkImportSession(sessionId, session);

      } catch (error) {
        console.error(`Failed to process file: ${file.originalname}`, error);
        session.files[i].status = "error";
        session.files[i].result = {
          totalRows: 0,
          validRows: 0,
          errors: [error.message],
          preview: []
        };
        session.processedFiles++;
        await storage.updateBulkImportSession(sessionId, session);
      }
    }

    // Update session status
    session.status = session.files.every(f => f.status === "completed") ? "completed" : "failed";
    session.totalImported = totalImported;
    await storage.updateBulkImportSession(sessionId, session);

    console.log(`Bulk import session ${sessionId} completed. Imported ${totalImported} hardware stores.`);

  } catch (error) {
    console.error(`Session ${sessionId} failed:`, error);
    if (session) {
      session.status = "failed";
      await storage.updateBulkImportSession(sessionId, session);
    }
  }
};
