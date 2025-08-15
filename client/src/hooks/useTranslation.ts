import { useState, useEffect } from 'react';

// Complete translation system for ALL pages
const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    productCatalog: "Product Catalog",
    globalDistributors: "Global Distributors",
    businessIntelligence: "Business Intelligence",
    inventoryAI: "Inventory AI",
    productionPlanning: "Production Planning",
    routeManagement: "Route Management",
    factorySetup: "Factory Setup",
    hardwareStores: "Hardware Stores",
    storeMapVisualization: "Store Map Visualization",
    
    // Common words
    search: "Search",
    filter: "Filter",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    loading: "Loading",
    refresh: "Refresh",
    export: "Export",
    import: "Import",
    upload: "Upload",
    download: "Download",
    view: "View",
    create: "Create",
    update: "Update",
    close: "Close",
    
    // Dashboard specific
    totalRevenue: "Total Revenue",
    activeDistributors: "Active Distributors",
    productsInCatalog: "Products in Catalog",
    bestSellingProducts: "Best-selling Cornex products this month",
    productionSchedule: "Production Schedule",
    analytics: "Analytics",
    optimize: "Optimize",
    running: "Running",
    idle: "Idle",
    capacity: "Capacity"
  },
  
  es: {
    // Navigation
    dashboard: "Panel de Control",
    productCatalog: "Catálogo de Productos",
    globalDistributors: "Distribuidores Globales",
    businessIntelligence: "Inteligencia de Negocios",
    inventoryAI: "IA de Inventario",
    productionPlanning: "Planificación de Producción",
    routeManagement: "Gestión de Rutas",
    factorySetup: "Configuración de Fábrica",
    hardwareStores: "Ferreterías",
    storeMapVisualization: "Visualización del Mapa de Tiendas",
    
    // Common words
    search: "Buscar",
    filter: "Filtrar",
    add: "Agregar",
    edit: "Editar",
    delete: "Eliminar",
    save: "Guardar",
    cancel: "Cancelar",
    loading: "Cargando",
    refresh: "Actualizar",
    export: "Exportar",
    import: "Importar",
    upload: "Subir",
    download: "Descargar",
    view: "Ver",
    create: "Crear",
    update: "Actualizar",
    close: "Cerrar",
    
    // Dashboard specific
    totalRevenue: "Ingresos Totales",
    activeDistributors: "Distribuidores Activos",
    productsInCatalog: "Productos en Catálogo",
    bestSellingProducts: "Productos Cornex más vendidos este mes",
    productionSchedule: "Cronograma de Producción",
    analytics: "Análisis",
    optimize: "Optimizar",
    running: "Ejecutando",
    idle: "Inactivo",
    capacity: "Capacidad"
  },
  
  fr: {
    // Navigation
    dashboard: "Tableau de Bord",
    productCatalog: "Catalogue de Produits",
    globalDistributors: "Distributeurs Mondiaux",
    businessIntelligence: "Intelligence d'Affaires",
    inventoryAI: "IA d'Inventaire",
    productionPlanning: "Planification de Production",
    routeManagement: "Gestion des Itinéraires",
    factorySetup: "Configuration d'Usine",
    hardwareStores: "Quincailleries",
    storeMapVisualization: "Visualisation de la Carte des Magasins",
    
    // Common words
    search: "Rechercher",
    filter: "Filtrer",
    add: "Ajouter",
    edit: "Modifier",
    delete: "Supprimer",
    save: "Enregistrer",
    cancel: "Annuler",
    loading: "Chargement",
    refresh: "Actualiser",
    export: "Exporter",
    import: "Importer",
    upload: "Télécharger",
    download: "Télécharger",
    view: "Voir",
    create: "Créer",
    update: "Mettre à jour",
    close: "Fermer",
    
    // Dashboard specific
    totalRevenue: "Revenus Totaux",
    activeDistributors: "Distributeurs Actifs",
    productsInCatalog: "Produits au Catalogue",
    bestSellingProducts: "Produits Cornex les plus vendus ce mois",
    productionSchedule: "Programme de Production",
    analytics: "Analyses",
    optimize: "Optimiser",
    running: "En cours",
    idle: "Inactif",
    capacity: "Capacité"
  },
  
  de: {
    // Navigation
    dashboard: "Dashboard",
    productCatalog: "Produktkatalog",
    globalDistributors: "Globale Distributoren",
    businessIntelligence: "Business Intelligence",
    inventoryAI: "Inventar-KI",
    productionPlanning: "Produktionsplanung",
    routeManagement: "Routenverwaltung",
    factorySetup: "Fabrik-Setup",
    hardwareStores: "Baumärkte",
    storeMapVisualization: "Shop-Karten-Visualisierung",
    
    // Common words
    search: "Suchen",
    filter: "Filtern",
    add: "Hinzufügen",
    edit: "Bearbeiten",
    delete: "Löschen",
    save: "Speichern",
    cancel: "Abbrechen",
    loading: "Laden",
    refresh: "Aktualisieren",
    export: "Exportieren",
    import: "Importieren",
    upload: "Hochladen",
    download: "Herunterladen",
    view: "Ansehen",
    create: "Erstellen",
    update: "Aktualisieren",
    close: "Schließen",
    
    // Dashboard specific
    totalRevenue: "Gesamtumsatz",
    activeDistributors: "Aktive Distributoren",
    productsInCatalog: "Produkte im Katalog",
    bestSellingProducts: "Meistverkaufte Cornex-Produkte diesen Monat",
    productionSchedule: "Produktionsplan",
    analytics: "Analysen",
    optimize: "Optimieren",
    running: "Läuft",
    idle: "Leerlauf",
    capacity: "Kapazität"
  }
};

const countries = {
  'US': { flag: '🇺🇸', currency: 'USD', lang: 'en' },
  'MX': { flag: '🇲🇽', currency: 'MXN', lang: 'es' },
  'ES': { flag: '🇪🇸', currency: 'EUR', lang: 'es' },
  'FR': { flag: '🇫🇷', currency: 'EUR', lang: 'fr' },
  'DE': { flag: '🇩🇪', currency: 'EUR', lang: 'de' },
  'IN': { flag: '🇮🇳', currency: 'INR', lang: 'en' },
  'TR': { flag: '🇹🇷', currency: 'TRY', lang: 'en' },
  'IT': { flag: '🇮🇹', currency: 'EUR', lang: 'en' },
  'BR': { flag: '🇧🇷', currency: 'BRL', lang: 'en' },
  'CN': { flag: '🇨🇳', currency: 'CNY', lang: 'en' },
  'JP': { flag: '🇯🇵', currency: 'JPY', lang: 'en' },
  'CA': { flag: '🇨🇦', currency: 'CAD', lang: 'en' },
  'AU': { flag: '🇦🇺', currency: 'AUD', lang: 'en' },
  'GB': { flag: '🇬🇧', currency: 'GBP', lang: 'en' },
  'ZA': { flag: '🇿🇦', currency: 'ZAR', lang: 'en' },
};

export const useTranslation = () => {
  const [currentCountry, setCurrentCountry] = useState('US');
  
  useEffect(() => {
    const saved = localStorage.getItem('selectedCountry');
    if (saved && countries[saved as keyof typeof countries]) {
      setCurrentCountry(saved);
    }
  }, []);
  
  const changeCountry = (countryCode: string) => {
    if (countries[countryCode as keyof typeof countries]) {
      setCurrentCountry(countryCode);
      localStorage.setItem('selectedCountry', countryCode);
      window.location.reload(); // Force reload to update all components
    }
  };
  
  const countryData = countries[currentCountry as keyof typeof countries] || countries.US;
  const t = translations[countryData.lang as keyof typeof translations] || translations.en;
  
  return {
    t,
    currentCountry,
    changeCountry,
    flag: countryData.flag,
    currency: countryData.currency,
    countries: Object.entries(countries).map(([code, data]) => ({
      code,
      flag: data.flag,
      currency: data.currency
    }))
  };
};