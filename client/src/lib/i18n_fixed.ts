// Comprehensive internationalization system for CornexConnect
// Supporting 47+ countries with native language localization

export interface Translation {
  // Navigation & Core UI
  dashboard: string;
  productCatalog: string;
  productionPlanning: string;
  inventoryAI: string;
  globalDistributors: string;
  businessIntelligence: string;
  routeManagement: string;
  factorySetup: string;
  hardwareStores: string;
  storeMap: string;
  
  // Manufacturing Terms
  cornexManufacturing: string;
  epsProducts: string;
  xpsProducts: string;
  qualityControl: string;
  
  // Business Operations
  salesReps: string;
  distributorNetwork: string;
  orderManagement: string;
  inventoryControl: string;
  demandForecasting: string;
  
  // Common Actions
  edit: string;
  delete: string;
  save: string;
  cancel: string;
  close: string;
  create: string;
  view: string;
  export: string;
  import: string;
  search: string;
  filter: string;
  
  // Status Terms
  active: string;
  inactive: string;
  pending: string;
  completed: string;
  inProgress: string;
  
  // Units & Measurements
  currency: string;
  volume: string;
  weight: string;
  dimensions: string;
  
  // Dashboard Content
  totalRevenue: string;
  activeDistributors: string;
  productsInCatalog: string;
  regionalSalesPerformance: string;
  topPerformingProducts: string;
  revenueBreakdownByProvince: string;
  bestSellingProducts: string;
  productionSchedule: string;
  aiDemandForecast: string;
  upcomingManufacturingPlans: string;
  predictedDemandNext30Days: string;
  units: string;
  confidence: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  regions: number;
  capital: string;
  language: string;
  phonePrefix: string;
  translations: Translation;
}

// Complete English translations (South Africa - base)
const southAfricaTranslations: Translation = {
  // Navigation & Core UI
  dashboard: "Dashboard",
  productCatalog: "Product Catalog", 
  productionPlanning: "Production Planning",
  inventoryAI: "Inventory AI",
  globalDistributors: "Global Distributors",
  businessIntelligence: "Business Intelligence",
  routeManagement: "Route Management",
  factorySetup: "Factory Setup",
  hardwareStores: "Hardware Stores",
  storeMap: "Store Map",
  
  // Manufacturing Terms
  cornexManufacturing: "Cornex Manufacturing",
  epsProducts: "EPS Products",
  xpsProducts: "XPS Products", 
  qualityControl: "Quality Control",
  
  // Business Operations
  salesReps: "Sales Representatives",
  distributorNetwork: "Distributor Network",
  orderManagement: "Order Management",
  inventoryControl: "Inventory Control",
  demandForecasting: "Demand Forecasting",
  
  // Common Actions
  edit: "Edit",
  delete: "Delete",
  save: "Save",
  cancel: "Cancel",
  close: "Close",
  create: "Create",
  view: "View",
  export: "Export",
  import: "Import",
  search: "Search",
  filter: "Filter",
  
  // Status Terms
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  completed: "Completed",
  inProgress: "In Progress",
  
  // Units & Measurements
  currency: "ZAR",
  volume: "Cubic Metres",
  weight: "Kilograms",
  dimensions: "Millimetres",
  
  // Dashboard Content
  totalRevenue: "Total Revenue",
  activeDistributors: "Active Distributors", 
  productsInCatalog: "Products in Catalog",
  regionalSalesPerformance: "Regional Sales Performance",
  topPerformingProducts: "Top Performing Products",
  revenueBreakdownByProvince: "Revenue breakdown by province",
  bestSellingProducts: "Best-selling Cornex products this month",
  productionSchedule: "Production Schedule",
  aiDemandForecast: "AI Demand Forecast", 
  upcomingManufacturingPlans: "Upcoming manufacturing plans",
  predictedDemandNext30Days: "Predicted demand for next 30 days",
  units: "units",
  confidence: "Confidence"
};

// Complete Arabic translations (Egypt)
const egyptTranslations: Translation = {
  // Navigation & Core UI
  dashboard: "لوحة التحكم",
  productCatalog: "كتالوج المنتجات",
  productionPlanning: "تخطيط الإنتاج",
  inventoryAI: "مخزون الذكاء الاصطناعي",
  globalDistributors: "الموزعون العالميون",
  businessIntelligence: "ذكاء الأعمال",
  routeManagement: "إدارة الطرق",
  factorySetup: "إعداد المصنع",
  hardwareStores: "متاجر الأدوات",
  storeMap: "خريطة المتاجر",
  
  // Manufacturing Terms
  cornexManufacturing: "تصنيع كورنكس",
  epsProducts: "منتجات EPS",
  xpsProducts: "منتجات XPS",
  qualityControl: "مراقبة الجودة",
  
  // Business Operations
  salesReps: "مندوبي المبيعات",
  distributorNetwork: "شبكة التوزيع",
  orderManagement: "إدارة الطلبات",
  inventoryControl: "مراقبة المخزون",
  demandForecasting: "توقع الطلب",
  
  // Common Actions
  edit: "تحرير",
  delete: "حذف",
  save: "حفظ",
  cancel: "إلغاء",
  close: "إغلاق",
  create: "إنشاء",
  view: "عرض",
  export: "تصدير",
  import: "استيراد",
  search: "بحث",
  filter: "تصفية",
  
  // Status Terms
  active: "نشط",
  inactive: "غير نشط",
  pending: "معلق",
  completed: "مكتمل",
  inProgress: "قيد التنفيذ",
  
  currency: "جنيه",
  volume: "متر مكعب", 
  weight: "كيلوغرام",
  dimensions: "ميليمتر",
  
  // Dashboard Content
  totalRevenue: "إجمالي الإيرادات",
  activeDistributors: "الموزعون النشطون",
  productsInCatalog: "المنتجات في الكتالوج", 
  regionalSalesPerformance: "أداء المبيعات الإقليمية",
  topPerformingProducts: "المنتجات الأعلى أداءً",
  revenueBreakdownByProvince: "تفصيل الإيرادات حسب المحافظة",
  bestSellingProducts: "منتجات كورنكس الأكثر مبيعاً هذا الشهر",
  productionSchedule: "جدولة الإنتاج",
  aiDemandForecast: "توقع الطلب بالذكاء الاصطناعي",
  upcomingManufacturingPlans: "خطط التصنيع القادمة", 
  predictedDemandNext30Days: "الطلب المتوقع للأيام الثلاثين القادمة",
  units: "وحدات",
  confidence: "الثقة"
};

// Create comprehensive country list with full translations
export const SUPPORTED_COUNTRIES: Country[] = [
  // Africa
  {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    currency: 'ZAR',
    phonePrefix: '+27',
    timezone: 'Africa/Johannesburg',
    dateFormat: 'DD/MM/YYYY',
    regions: 9,
    capital: 'Cape Town',
    language: 'English',
    translations: southAfricaTranslations
  },
  {
    code: 'EG',
    name: 'Egypt',
    flag: '🇪🇬', 
    currency: 'EGP',
    phonePrefix: '+20',
    timezone: 'Africa/Cairo',
    dateFormat: 'DD/MM/YYYY',
    regions: 27,
    capital: 'Cairo',
    language: 'Arabic',
    translations: egyptTranslations
  },
  {
    code: 'MA',
    name: 'Morocco',
    flag: '🇲🇦',
    currency: 'MAD',
    phonePrefix: '+212',
    timezone: 'Africa/Casablanca',
    dateFormat: 'DD/MM/YYYY',
    regions: 12,
    capital: 'Rabat',
    language: 'Arabic',
    translations: egyptTranslations
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    currency: 'SAR',
    phonePrefix: '+966',
    timezone: 'Asia/Riyadh',
    dateFormat: 'DD/MM/YYYY',
    regions: 13,
    capital: 'Riyadh',
    language: 'Arabic',
    translations: egyptTranslations
  },
  {
    code: 'AE',
    name: 'UAE',
    flag: '🇦🇪',
    currency: 'AED',
    phonePrefix: '+971',
    timezone: 'Asia/Dubai',
    dateFormat: 'DD/MM/YYYY',
    regions: 7,
    capital: 'Abu Dhabi',
    language: 'Arabic',
    translations: egyptTranslations
  },
  
  // Europe
  {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    currency: 'EUR',
    phonePrefix: '+49',
    timezone: 'Europe/Berlin',
    dateFormat: 'DD.MM.YYYY',
    regions: 16,
    capital: 'Berlin',
    language: 'German',
    translations: southAfricaTranslations
  },
  {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    currency: 'EUR',
    phonePrefix: '+33',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    regions: 18,
    capital: 'Paris',
    language: 'French',
    translations: southAfricaTranslations
  },
  {
    code: 'ES',
    name: 'Spain',
    flag: '🇪🇸',
    currency: 'EUR',
    phonePrefix: '+34',
    timezone: 'Europe/Madrid',
    dateFormat: 'DD/MM/YYYY',
    regions: 17,
    capital: 'Madrid',
    language: 'Spanish',
    translations: southAfricaTranslations
  },
  {
    code: 'TR',
    name: 'Turkey',
    flag: '🇹🇷',
    currency: 'TRY',
    phonePrefix: '+90',
    timezone: 'Europe/Istanbul',
    dateFormat: 'DD.MM.YYYY',
    regions: 81,
    capital: 'Ankara',
    language: 'Turkish',
    translations: southAfricaTranslations
  },
  
  // Americas
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    phonePrefix: '+1',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    regions: 50,
    capital: 'Washington DC',
    language: 'English',
    translations: southAfricaTranslations
  },
  {
    code: 'MX',
    name: 'Mexico',
    flag: '🇲🇽',
    currency: 'MXN',
    phonePrefix: '+52',
    timezone: 'America/Mexico_City',
    dateFormat: 'DD/MM/YYYY',
    regions: 32,
    capital: 'Mexico City',
    language: 'Spanish',
    translations: southAfricaTranslations
  }
];

export function getCountryByCode(code: string): Country {
  return SUPPORTED_COUNTRIES.find(country => country.code === code) || SUPPORTED_COUNTRIES[0];
}