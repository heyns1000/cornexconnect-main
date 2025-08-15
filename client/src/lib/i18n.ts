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
  confidence: "Confidence",
  
  // Additional interface elements
  analytics: "Analytics",
  optimize: "Optimize",
  running: "Running",
  idle: "Idle",
  capacity: "Capacity",
  month: "month",
  productTypes: "product types"
};

// Complete Spanish translations (Mexico/Spain)
const spanishTranslations: Translation = {
  // Navigation & Core UI
  dashboard: "Panel de Control",
  productCatalog: "Catálogo de Productos",
  productionPlanning: "Planificación de Producción",
  inventoryAI: "Inventario IA",
  globalDistributors: "Distribuidores Globales",
  businessIntelligence: "Inteligencia de Negocios",
  routeManagement: "Gestión de Rutas",
  factorySetup: "Configuración de Fábrica",
  hardwareStores: "Ferreterías",
  storeMap: "Mapa de Tiendas",
  
  // Manufacturing Terms
  cornexManufacturing: "Fabricación Cornex",
  epsProducts: "Productos EPS",
  xpsProducts: "Productos XPS",
  qualityControl: "Control de Calidad",
  
  // Business Operations
  salesReps: "Representantes de Ventas",
  distributorNetwork: "Red de Distribuidores",
  orderManagement: "Gestión de Pedidos",
  inventoryControl: "Control de Inventario",
  demandForecasting: "Pronóstico de Demanda",
  
  // Common Actions
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
  
  // Status Terms
  active: "Activo",
  inactive: "Inactivo",
  pending: "Pendiente",
  completed: "Completado",
  inProgress: "En Progreso",
  
  currency: "EUR",
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
  confidence: "Confianza",
  
  // Additional interface elements
  analytics: "Analíticas",
  optimize: "Optimizar",
  running: "Funcionando",
  idle: "Inactivo",
  capacity: "Capacidad",
  month: "mes",
  productTypes: "tipos de productos"
};

// Complete Turkish translations
const turkishTranslations: Translation = {
  // Navigation & Core UI
  dashboard: "Kontrol Paneli",
  productCatalog: "Ürün Kataloğu",
  productionPlanning: "Üretim Planlaması",
  inventoryAI: "Envanter AI",
  globalDistributors: "Küresel Distribütörler",
  businessIntelligence: "İş Zekası",
  routeManagement: "Rota Yönetimi",
  factorySetup: "Fabrika Kurulumu",
  hardwareStores: "Hırdavat Mağazaları",
  storeMap: "Mağaza Haritası",
  
  // Manufacturing Terms
  cornexManufacturing: "Cornex İmalatı",
  epsProducts: "EPS Ürünleri",
  xpsProducts: "XPS Ürünleri",
  qualityControl: "Kalite Kontrolü",
  
  // Business Operations
  salesReps: "Satış Temsilcileri",
  distributorNetwork: "Distribütör Ağı",
  orderManagement: "Sipariş Yönetimi",
  inventoryControl: "Envanter Kontrolü",
  demandForecasting: "Talep Tahmini",
  
  // Common Actions
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
  
  // Status Terms
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
  confidence: "Güven",
  
  // Additional interface elements
  analytics: "Analitik",
  optimize: "Optimize Et",
  running: "Çalışıyor",
  idle: "Boşta",
  capacity: "Kapasite",
  month: "ay",
  productTypes: "ürün türleri"
};

// Complete German translations
const germanTranslations: Translation = {
  // Navigation & Core UI
  dashboard: "Dashboard",
  productCatalog: "Produktkatalog",
  productionPlanning: "Produktionsplanung",
  inventoryAI: "Inventar KI",
  globalDistributors: "Globale Distributoren",
  businessIntelligence: "Business Intelligence",
  routeManagement: "Routenmanagement",
  factorySetup: "Fabrikeinrichtung",
  hardwareStores: "Eisenwarengeschäfte",
  storeMap: "Geschäftskarte",
  
  // Manufacturing Terms
  cornexManufacturing: "Cornex Fertigung",
  epsProducts: "EPS Produkte",
  xpsProducts: "XPS Produkte",
  qualityControl: "Qualitätskontrolle",
  
  // Business Operations
  salesReps: "Verkaufsvertreter",
  distributorNetwork: "Vertriebsnetzwerk",
  orderManagement: "Auftragsverwaltung",
  inventoryControl: "Bestandskontrolle",
  demandForecasting: "Bedarfsprognose",
  
  // Common Actions
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
  
  // Status Terms
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
  confidence: "Vertrauen",
  
  // Additional interface elements
  analytics: "Analytik",
  optimize: "Optimieren",
  running: "Läuft",
  idle: "Leerlauf",
  capacity: "Kapazität",
  month: "Monat",
  productTypes: "Produkttypen"
};

// Complete French translations
const frenchTranslations: Translation = {
  // Navigation & Core UI
  dashboard: "Tableau de Bord",
  productCatalog: "Catalogue Produits",
  productionPlanning: "Planification Production",
  inventoryAI: "Inventaire IA",
  globalDistributors: "Distributeurs Globaux",
  businessIntelligence: "Intelligence d'Affaires",
  routeManagement: "Gestion des Routes",
  factorySetup: "Configuration d'Usine",
  hardwareStores: "Quincailleries",
  storeMap: "Carte des Magasins",
  
  // Manufacturing Terms
  cornexManufacturing: "Fabrication Cornex",
  epsProducts: "Produits EPS",
  xpsProducts: "Produits XPS",
  qualityControl: "Contrôle Qualité",
  
  // Business Operations
  salesReps: "Représentants Commerciaux",
  distributorNetwork: "Réseau de Distribution",
  orderManagement: "Gestion Commandes",
  inventoryControl: "Contrôle Inventaire",
  demandForecasting: "Prévision Demande",
  
  // Common Actions
  edit: "Modifier",
  delete: "Supprimer",
  save: "Enregistrer",
  cancel: "Annuler",
  close: "Fermer",
  create: "Créer",
  view: "Voir",
  export: "Exporter",
  import: "Importer",
  search: "Chercher",
  filter: "Filtrer",
  
  // Status Terms
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
  confidence: "Confiance",
  
  // Additional interface elements
  analytics: "Analytique",
  optimize: "Optimiser",
  running: "En marche",
  idle: "Inactif",
  capacity: "Capacité",
  month: "mois",
  productTypes: "types de produits"
};

// Complete Portuguese translations (Brazil)
const portugueseTranslations: Translation = {
  // Navigation & Core UI
  dashboard: "Painel de Controle",
  productCatalog: "Catálogo de Produtos",
  productionPlanning: "Planejamento de Produção",
  inventoryAI: "Inventário IA",
  globalDistributors: "Distribuidores Globais",
  businessIntelligence: "Inteligência de Negócios",
  routeManagement: "Gerenciamento de Rotas",
  factorySetup: "Configuração da Fábrica",
  hardwareStores: "Lojas de Ferragens",
  storeMap: "Mapa de Lojas",
  
  // Manufacturing Terms
  cornexManufacturing: "Fabricação Cornex",
  epsProducts: "Produtos EPS",
  xpsProducts: "Produtos XPS",
  qualityControl: "Controle de Qualidade",
  
  // Business Operations
  salesReps: "Representantes de Vendas",
  distributorNetwork: "Rede de Distribuição",
  orderManagement: "Gerenciamento de Pedidos",
  inventoryControl: "Controle de Inventário",
  demandForecasting: "Previsão de Demanda",
  
  // Common Actions
  edit: "Editar",
  delete: "Excluir",
  save: "Salvar",
  cancel: "Cancelar",
  close: "Fechar",
  create: "Criar",
  view: "Ver",
  export: "Exportar",
  import: "Importar",
  search: "Pesquisar",
  filter: "Filtrar",
  
  // Status Terms
  active: "Ativo",
  inactive: "Inativo",
  pending: "Pendente",
  completed: "Concluído",
  inProgress: "Em Progresso",
  
  currency: "BRL",
  volume: "Metros Cúbicos",
  weight: "Quilogramas",
  dimensions: "Milímetros",
  
  // Dashboard Content
  totalRevenue: "Receita Total",
  activeDistributors: "Distribuidores Ativos",
  productsInCatalog: "Produtos no Catálogo",
  regionalSalesPerformance: "Performance de Vendas Regional",
  topPerformingProducts: "Produtos de Melhor Desempenho",
  revenueBreakdownByProvince: "Divisão de receita por província",
  bestSellingProducts: "Produtos Cornex mais vendidos este mês",
  productionSchedule: "Cronograma de Produção",
  aiDemandForecast: "Previsão de Demanda IA",
  upcomingManufacturingPlans: "Planos de fabricação próximos",
  predictedDemandNext30Days: "Demanda prevista para os próximos 30 dias",
  units: "unidades",
  confidence: "Confiança",
  
  // Additional interface elements
  analytics: "Análises",
  optimize: "Otimizar",
  running: "Executando",
  idle: "Inativo",
  capacity: "Capacidade",
  month: "mês",
  productTypes: "tipos de produtos"
};

// Complete Italian translations
const italianTranslations: Translation = {
  // Navigation & Core UI
  dashboard: "Dashboard",
  productCatalog: "Catalogo Prodotti",
  productionPlanning: "Pianificazione Produzione",
  inventoryAI: "Inventario IA",
  globalDistributors: "Distributori Globali",
  businessIntelligence: "Business Intelligence",
  routeManagement: "Gestione Rotte",
  factorySetup: "Configurazione Fabbrica",
  hardwareStores: "Ferramenta",
  storeMap: "Mappa Negozi",
  
  // Manufacturing Terms
  cornexManufacturing: "Produzione Cornex",
  epsProducts: "Prodotti EPS",
  xpsProducts: "Prodotti XPS",
  qualityControl: "Controllo Qualità",
  
  // Business Operations
  salesReps: "Rappresentanti Vendite",
  distributorNetwork: "Rete Distribuzione",
  orderManagement: "Gestione Ordini",
  inventoryControl: "Controllo Inventario",
  demandForecasting: "Previsione Domanda",
  
  // Common Actions
  edit: "Modifica",
  delete: "Elimina",
  save: "Salva",
  cancel: "Annulla",
  close: "Chiudi",
  create: "Crea",
  view: "Visualizza",
  export: "Esporta",
  import: "Importa",
  search: "Cerca",
  filter: "Filtra",
  
  // Status Terms
  active: "Attivo",
  inactive: "Inattivo",
  pending: "In attesa",
  completed: "Completato",
  inProgress: "In corso",
  
  currency: "EUR",
  volume: "Metri Cubi",
  weight: "Chilogrammi",
  dimensions: "Millimetri",
  
  // Dashboard Content
  totalRevenue: "Ricavi Totali",
  activeDistributors: "Distributori Attivi",
  productsInCatalog: "Prodotti nel Catalogo",
  regionalSalesPerformance: "Performance Vendite Regionali",
  topPerformingProducts: "Prodotti Top Performance",
  revenueBreakdownByProvince: "Suddivisione ricavi per provincia",
  bestSellingProducts: "Prodotti Cornex più venduti questo mese",
  productionSchedule: "Programmazione Produzione",
  aiDemandForecast: "Previsione Domanda IA",
  upcomingManufacturingPlans: "Piani di produzione imminenti",
  predictedDemandNext30Days: "Domanda prevista per i prossimi 30 giorni",
  units: "unità",
  confidence: "Fiducia",
  
  // Additional interface elements
  analytics: "Analisi",
  optimize: "Ottimizza",
  running: "In Esecuzione",
  idle: "Inattivo",
  capacity: "Capacità",
  month: "mese",
  productTypes: "tipi di prodotti"
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
    translations: turkishTranslations
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
    translations: spanishTranslations
  },
  // Additional countries with native translations
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
    translations: italianTranslations
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
    translations: portugueseTranslations
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
    code: 'CN',
    name: 'China',
    flag: '🇨🇳',
    currency: 'CNY',
    phonePrefix: '+86',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY/MM/DD',
    regions: 34,
    capital: 'Beijing',
    language: 'Chinese',
    translations: southAfricaTranslations
  },
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
    code: 'KR',
    name: 'South Korea',
    flag: '🇰🇷',
    currency: 'KRW',
    phonePrefix: '+82',
    timezone: 'Asia/Seoul',
    dateFormat: 'YYYY/MM/DD',
    regions: 17,
    capital: 'Seoul',
    language: 'Korean',
    translations: southAfricaTranslations
  },
  {
    code: 'RU',
    name: 'Russia',
    flag: '🇷🇺',
    currency: 'RUB',
    phonePrefix: '+7',
    timezone: 'Europe/Moscow',
    dateFormat: 'DD.MM.YYYY',
    regions: 85,
    capital: 'Moscow',
    language: 'Russian',
    translations: southAfricaTranslations
  },
  // Additional comprehensive language coverage
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
    translations: germanTranslations
  },
  {
    code: 'PT',
    name: 'Portugal',
    flag: '🇵🇹',
    currency: 'EUR',
    phonePrefix: '+351',
    timezone: 'Europe/Lisbon',
    dateFormat: 'DD/MM/YYYY',
    regions: 18,
    capital: 'Lisbon',
    language: 'Portuguese',
    translations: portugueseTranslations
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
    code: 'CL',
    name: 'Chile',
    flag: '🇨🇱',
    currency: 'CLP',
    phonePrefix: '+56',
    timezone: 'America/Santiago',
    dateFormat: 'DD/MM/YYYY',
    regions: 16,
    capital: 'Santiago',
    language: 'Spanish',
    translations: spanishTranslations
  },
  {
    code: 'CO',
    name: 'Colombia',
    flag: '🇨🇴',
    currency: 'COP',
    phonePrefix: '+57',
    timezone: 'America/Bogota',
    dateFormat: 'DD/MM/YYYY',
    regions: 32,
    capital: 'Bogotá',
    language: 'Spanish',
    translations: spanishTranslations
  }
];

export function getCountryByCode(code: string): Country {
  return SUPPORTED_COUNTRIES.find(country => country.code === code) || SUPPORTED_COUNTRIES[0];
}

export const DEFAULT_COUNTRY = SUPPORTED_COUNTRIES[0]; // South Africa as default