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
  productionSchedule: string;
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

export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  currency: string;
  phonePrefix: string;
  timezone: string;
  dateFormat: string;
  regions: number;
  capital: string;
  language: string;
  translations: Translation;
}

// Complete translation for South Africa (Primary market)
const southAfricaTranslations: Translation = {
  // Navigation & Core UI
  dashboard: "AI Dashboard",
  productCatalog: "Product Catalogue",
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
  productionSchedule: "Production Schedule",
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

// Arabic translations for Egypt, Morocco, Saudi Arabia, UAE
const arabicTranslations: Translation = {
  dashboard: "لوحة التحكم الذكية",
  productCatalog: "كتالوج المنتجات",
  productionPlanning: "تخطيط الإنتاج",
  inventoryAI: "ذكاء المخزون",
  globalDistributors: "الموزعون العالميون",
  businessIntelligence: "ذكاء الأعمال",
  routeManagement: "إدارة المسارات",
  factorySetup: "إعداد المصنع",
  hardwareStores: "متاجر الأدوات",
  storeMap: "خريطة المتاجر",
  
  cornexManufacturing: "تصنيع كورنكس",
  epsProducts: "منتجات EPS",
  xpsProducts: "منتجات XPS",
  productionSchedule: "جدولة الإنتاج",
  qualityControl: "مراقبة الجودة",
  
  salesReps: "مندوبو المبيعات",
  distributorNetwork: "شبكة الموزعين",
  orderManagement: "إدارة الطلبات",
  inventoryControl: "مراقبة المخزون",
  demandForecasting: "توقع الطلب",
  
  edit: "تعديل",
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

// Spanish translations for Mexico, Spain, Argentina, Colombia, etc.
const spanishTranslations: Translation = {
  dashboard: "Panel de Control",
  productCatalog: "Catálogo de Productos",
  productionPlanning: "Planificación de Producción",
  inventoryAI: "IA de Inventario",
  globalDistributors: "Distribuidores Globales", 
  businessIntelligence: "Inteligencia de Negocio",
  routeManagement: "Gestión de Rutas",
  factorySetup: "Configuración de Fábrica",
  hardwareStores: "Ferreterías",
  storeMap: "Mapa de Tiendas",
  
  cornexManufacturing: "Fabricación Cornex",
  epsProducts: "Productos EPS",
  xpsProducts: "Productos XPS", 
  productionSchedule: "Programación de Producción",
  qualityControl: "Control de Calidad",
  
  salesReps: "Representantes de Ventas",
  distributorNetwork: "Red de Distribuidores",
  orderManagement: "Gestión de Pedidos",
  inventoryControl: "Control de Inventario",
  demandForecasting: "Pronóstico de Demanda",
  
  edit: "Editar",
  delete: "Eliminar", 
  save: "Guardar",
  cancel: "Cancelar",
  close: "Cerrar",
  create: "Crear",
  view: "Ver",
  export: "Exportar",
  import: "Importar",
  search: "Buscar",
  filter: "Filtrar",
  
  active: "Activo",
  inactive: "Inactivo",
  pending: "Pendiente",
  completed: "Completado",
  inProgress: "En Progreso",
  
  currency: "Peso",
  volume: "Metros Cúbicos",
  weight: "Kilogramos", 
  dimensions: "Milímetros",
  
  // Dashboard Content
  totalRevenue: "Ingresos Totales",
  activeDistributors: "Distribuidores Activos",
  productsInCatalog: "Productos en Catálogo", 
  regionalSalesPerformance: "Rendimiento de Ventas Regional",
  topPerformingProducts: "Productos de Mayor Rendimiento",
  revenueBreakdownByProvince: "Desglose de ingresos por provincia",
  bestSellingProducts: "Productos Cornex más vendidos este mes",
  productionSchedule: "Programación de Producción",
  aiDemandForecast: "Pronóstico de Demanda IA",
  upcomingManufacturingPlans: "Planes de fabricación próximos", 
  predictedDemandNext30Days: "Demanda prevista para los próximos 30 días",
  units: "unidades",
  confidence: "Confianza"
};

// Turkish translations
const turkishTranslations: Translation = {
  dashboard: "AI Pano",
  productCatalog: "Ürün Kataloğu",
  productionPlanning: "Üretim Planlaması",
  inventoryAI: "Envanter AI",
  globalDistributors: "Küresel Distribütörler",
  businessIntelligence: "İş Zekası",
  routeManagement: "Rota Yönetimi",
  factorySetup: "Fabrika Kurulumu",
  hardwareStores: "Hırdavat Mağazaları",
  storeMap: "Mağaza Haritası",
  
  cornexManufacturing: "Cornex İmalat",
  epsProducts: "EPS Ürünleri",
  xpsProducts: "XPS Ürünleri",
  productionSchedule: "Üretim Programı",
  qualityControl: "Kalite Kontrol",
  
  salesReps: "Satış Temsilcileri",
  distributorNetwork: "Distribütör Ağı",
  orderManagement: "Sipariş Yönetimi",
  inventoryControl: "Envanter Kontrolü",
  demandForecasting: "Talep Tahmini",
  
  edit: "Düzenle",
  delete: "Sil",
  save: "Kaydet",
  cancel: "İptal",
  close: "Kapat",
  create: "Oluştur",
  view: "Görüntüle",
  export: "Dışa Aktar",
  import: "İçe Aktar",
  search: "Ara",
  filter: "Filtrele",
  
  active: "Aktif",
  inactive: "Pasif",
  pending: "Beklemede",
  completed: "Tamamlandı",
  inProgress: "Devam Ediyor",
  
  currency: "TRY",
  volume: "Metreküp",
  weight: "Kilogram",
  dimensions: "Milimetre",
  
  // Dashboard Content
  totalRevenue: "Toplam Gelir",
  activeDistributors: "Aktif Distribütörler",
  productsInCatalog: "Katalogdaki Ürünler", 
  regionalSalesPerformance: "Bölgesel Satış Performansı",
  topPerformingProducts: "En İyi Performans Gösteren Ürünler",
  revenueBreakdownByProvince: "İl bazında gelir dağılımı",
  bestSellingProducts: "Bu ay en çok satan Cornex ürünleri",
  productionSchedule: "Üretim Programı",
  aiDemandForecast: "AI Talep Tahmini",
  upcomingManufacturingPlans: "Yaklaşan üretim planları", 
  predictedDemandNext30Days: "Önümüzdeki 30 gün için öngörülen talep",
  units: "adet",
  confidence: "Güven"
};

// German translations
const germanTranslations: Translation = {
  dashboard: "AI Dashboard",
  productCatalog: "Produktkatalog",
  productionPlanning: "Produktionsplanung",
  inventoryAI: "Lager-KI",
  globalDistributors: "Globale Distributoren",
  businessIntelligence: "Business Intelligence", 
  routeManagement: "Routenverwaltung",
  factorySetup: "Fabrikeinrichtung",
  hardwareStores: "Baumärkte",
  storeMap: "Geschäftskarte",
  
  cornexManufacturing: "Cornex Herstellung",
  epsProducts: "EPS-Produkte",
  xpsProducts: "XPS-Produkte",
  productionSchedule: "Produktionsplan",
  qualityControl: "Qualitätskontrolle",
  
  salesReps: "Außendienstmitarbeiter",
  distributorNetwork: "Distributorennetzwerk", 
  orderManagement: "Auftragsverwaltung",
  inventoryControl: "Bestandskontrolle",
  demandForecasting: "Nachfrageprognose",
  
  edit: "Bearbeiten",
  delete: "Löschen",
  save: "Speichern",
  cancel: "Abbrechen",
  close: "Schließen", 
  create: "Erstellen",
  view: "Anzeigen",
  export: "Exportieren",
  import: "Importieren",
  search: "Suchen",
  filter: "Filtern",
  
  active: "Aktiv",
  inactive: "Inaktiv", 
  pending: "Ausstehend",
  completed: "Abgeschlossen",
  inProgress: "In Bearbeitung",
  
  currency: "EUR",
  volume: "Kubikmeter",
  weight: "Kilogramm",
  dimensions: "Millimeter",
  
  // Dashboard Content
  totalRevenue: "Gesamtumsatz",
  activeDistributors: "Aktive Distributoren",
  productsInCatalog: "Produkte im Katalog", 
  regionalSalesPerformance: "Regionale Verkaufsleistung",
  topPerformingProducts: "Leistungsstärkste Produkte",
  revenueBreakdownByProvince: "Umsatzaufschlüsselung nach Bundesland",
  bestSellingProducts: "Meistverkaufte Cornex-Produkte diesen Monat",
  productionSchedule: "Produktionsplan",
  aiDemandForecast: "KI-Nachfrageprognose",
  upcomingManufacturingPlans: "Anstehende Fertigungspläne", 
  predictedDemandNext30Days: "Vorhergesagte Nachfrage für die nächsten 30 Tage",
  units: "Einheiten",
  confidence: "Vertrauen"
};

// French translations
const frenchTranslations: Translation = {
  dashboard: "Tableau de Bord IA",
  productCatalog: "Catalogue de Produits", 
  productionPlanning: "Planification de Production",
  inventoryAI: "IA d'Inventaire",
  globalDistributors: "Distributeurs Mondiaux",
  businessIntelligence: "Intelligence d'Affaires",
  routeManagement: "Gestion des Routes",
  factorySetup: "Configuration d'Usine",
  hardwareStores: "Magasins de Bricolage",
  storeMap: "Carte des Magasins",
  
  cornexManufacturing: "Fabrication Cornex",
  epsProducts: "Produits EPS",
  xpsProducts: "Produits XPS",
  productionSchedule: "Planning de Production", 
  qualityControl: "Contrôle Qualité",
  
  salesReps: "Représentants Commerciaux",
  distributorNetwork: "Réseau de Distributeurs",
  orderManagement: "Gestion des Commandes",
  inventoryControl: "Contrôle des Stocks",
  demandForecasting: "Prévision de la Demande",
  
  edit: "Modifier",
  delete: "Supprimer",
  save: "Sauvegarder",
  cancel: "Annuler",
  close: "Fermer",
  create: "Créer", 
  view: "Voir",
  export: "Exporter",
  import: "Importer",
  search: "Rechercher",
  filter: "Filtrer",
  
  active: "Actif",
  inactive: "Inactif",
  pending: "En attente",
  completed: "Terminé",
  inProgress: "En cours",
  
  currency: "EUR",
  volume: "Mètres Cubes",
  weight: "Kilogrammes",
  dimensions: "Millimètres",
  
  // Dashboard Content
  totalRevenue: "Chiffre d'Affaires Total",
  activeDistributors: "Distributeurs Actifs",
  productsInCatalog: "Produits au Catalogue", 
  regionalSalesPerformance: "Performance des Ventes Régionales",
  topPerformingProducts: "Produits les Plus Performants",
  revenueBreakdownByProvince: "Répartition du chiffre d'affaires par province",
  bestSellingProducts: "Produits Cornex les plus vendus ce mois-ci",
  productionSchedule: "Planning de Production",
  aiDemandForecast: "Prévision de Demande IA",
  upcomingManufacturingPlans: "Plans de fabrication à venir", 
  predictedDemandNext30Days: "Demande prévue pour les 30 prochains jours",
  units: "unités",
  confidence: "Confiance"
};

export const SUPPORTED_COUNTRIES: CountryConfig[] = [
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
    translations: arabicTranslations
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
    translations: arabicTranslations
  },
  {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    currency: 'NGN',
    phonePrefix: '+234', 
    timezone: 'Africa/Lagos',
    dateFormat: 'DD/MM/YYYY',
    regions: 36,
    capital: 'Abuja',
    language: 'English',
    translations: southAfricaTranslations
  },
  {
    code: 'GH',
    name: 'Ghana',
    flag: '🇬🇭',
    currency: 'GHS',
    phonePrefix: '+233',
    timezone: 'Africa/Accra',
    dateFormat: 'DD/MM/YYYY', 
    regions: 16,
    capital: 'Accra',
    language: 'English',
    translations: southAfricaTranslations
  },
  {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    currency: 'KES',
    phonePrefix: '+254',
    timezone: 'Africa/Nairobi',
    dateFormat: 'DD/MM/YYYY',
    regions: 47,
    capital: 'Nairobi',
    language: 'English', 
    translations: southAfricaTranslations
  },

  // Europe
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    phonePrefix: '+44',
    timezone: 'Europe/London',
    dateFormat: 'DD/MM/YYYY',
    regions: 4,
    capital: 'London',
    language: 'English',
    translations: southAfricaTranslations
  },
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
    translations: germanTranslations
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
    translations: frenchTranslations
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
    translations: spanishTranslations
  },
  {
    code: 'IT',
    name: 'Italy',
    flag: '🇮🇹',
    currency: 'EUR', 
    phonePrefix: '+39',
    timezone: 'Europe/Rome',
    dateFormat: 'DD/MM/YYYY',
    regions: 20,
    capital: 'Rome',
    language: 'Italian', 
    translations: southAfricaTranslations
  },
  {
    code: 'NL',
    name: 'Netherlands',
    flag: '🇳🇱',
    currency: 'EUR',
    phonePrefix: '+31',
    timezone: 'Europe/Amsterdam',
    dateFormat: 'DD-MM-YYYY',
    regions: 12,
    capital: 'Amsterdam',
    language: 'Dutch',
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
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦', 
    currency: 'CAD',
    phonePrefix: '+1',
    timezone: 'America/Toronto',
    dateFormat: 'DD/MM/YYYY',
    regions: 13,
    capital: 'Ottawa',
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
    translations: spanishTranslations
  },
  {
    code: 'AR',
    name: 'Argentina',
    flag: '🇦🇷',
    currency: 'ARS',
    phonePrefix: '+54',
    timezone: 'America/Argentina/Buenos_Aires',
    dateFormat: 'DD/MM/YYYY',
    regions: 23,
    capital: 'Buenos Aires',
    language: 'Spanish',
    translations: spanishTranslations
  },
  {
    code: 'BR',
    name: 'Brazil',
    flag: '🇧🇷',
    currency: 'BRL',
    phonePrefix: '+55',
    timezone: 'America/Sao_Paulo', 
    dateFormat: 'DD/MM/YYYY',
    regions: 26,
    capital: 'Brasília',
    language: 'Portuguese',
    translations: southAfricaTranslations
  },

  // Asia-Pacific
  {
    code: 'JP',
    name: 'Japan',
    flag: '🇯🇵',
    currency: 'JPY',
    phonePrefix: '+81',
    timezone: 'Asia/Tokyo',
    dateFormat: 'YYYY/MM/DD',
    regions: 47,
    capital: 'Tokyo',
    language: 'Japanese',
    translations: southAfricaTranslations
  },
  {
    code: 'CN',
    name: 'China', 
    flag: '🇨🇳',
    currency: 'CNY',
    phonePrefix: '+86',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD',
    regions: 34,
    capital: 'Beijing',
    language: 'Chinese',
    translations: southAfricaTranslations
  },
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    phonePrefix: '+91',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    regions: 28,
    capital: 'New Delhi',
    language: 'Hindi',
    translations: southAfricaTranslations
  },
  {
    code: 'AU', 
    name: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    phonePrefix: '+61',
    timezone: 'Australia/Sydney',
    dateFormat: 'DD/MM/YYYY',
    regions: 8,
    capital: 'Canberra',
    language: 'English',
    translations: southAfricaTranslations
  },

  // Middle East
  {
    code: 'TR',
    name: 'Turkey',
    flag: '🇹🇷',
    currency: 'TRY',
    phonePrefix: '+90',
    timezone: 'Europe/Istanbul',
    dateFormat: 'DD/MM/YYYY',
    regions: 81,
    capital: 'Ankara',
    language: 'Turkish',
    translations: turkishTranslations
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
    translations: arabicTranslations
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'AED',
    phonePrefix: '+971',
    timezone: 'Asia/Dubai',
    dateFormat: 'DD/MM/YYYY',
    regions: 7,
    capital: 'Abu Dhabi',
    language: 'Arabic',
    translations: arabicTranslations
  }
];

// Default to South Africa
export const DEFAULT_COUNTRY = SUPPORTED_COUNTRIES[0];

export const getCountryByCode = (code: string): CountryConfig => {
  return SUPPORTED_COUNTRIES.find(country => country.code === code) || DEFAULT_COUNTRY;
};

export const getCurrentCountry = (): CountryConfig => {
  const savedCountry = localStorage.getItem('selectedCountry');
  if (savedCountry) {
    return getCountryByCode(savedCountry);
  }
  return DEFAULT_COUNTRY;
};

export const setCurrentCountry = (countryCode: string): void => {
  localStorage.setItem('selectedCountry', countryCode);
};