import { CurrencyRate, Brand } from "@/types";

export const CURRENCIES: CurrencyRate[] = [
  { currency: "USD", rate: 1, symbol: "$", flag: "🇺🇸" },
  { currency: "EUR", rate: 0.85, symbol: "€", flag: "🇪🇺" },
  { currency: "ZAR", rate: 18.5, symbol: "R", flag: "🇿🇦" },
  { currency: "GBP", rate: 0.73, symbol: "£", flag: "🇬🇧" },
];

export const CORNEX_BRANDS: Brand[] = [
  {
    id: "trimstyle",
    name: "trimstyle",
    displayName: "TrimStyle™",
    description: "Premium Cornice Design",
    color: "#eab308",
    icon: "✏️"
  },
  {
    id: "designaura",
    name: "designaura", 
    displayName: "DesignAura™",
    description: "Virtual Interior Styling",
    color: "#3b82f6",
    icon: "🔮"
  },
  {
    id: "cornicecraft",
    name: "cornicecraft",
    displayName: "CorniceCraft™", 
    description: "Custom Manufacturing",
    color: "#10b981",
    icon: "🧩"
  },
  {
    id: "ceilingtech",
    name: "ceilingtech",
    displayName: "CeilingTech™",
    description: "Ceiling Systems & Panels", 
    color: "#ec4899",
    icon: "🧱"
  }
];

export const SOUTH_AFRICAN_PROVINCES = [
  "Gauteng",
  "Western Cape", 
  "KwaZulu-Natal",
  "Eastern Cape",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Free State",
  "Northern Cape"
];

export const PRODUCTION_LINES = [
  {
    id: "eps-line-a",
    name: "EPS Line A",
    products: ["EPS01", "EPS02", "EPS03", "EPS04", "EPS05", "EPS06"],
    capacity: 5000,
    efficiency: 97
  },
  {
    id: "eps-line-b", 
    name: "EPS Line B",
    products: ["EPS07", "EPS08", "EPS09", "EPS10", "EPS11", "EPS12", "EPS13"],
    capacity: 4500,
    efficiency: 94
  },
  {
    id: "br-xps-line",
    name: "BR XPS Line",
    products: ["BR1", "BR2", "BR3", "BR4", "BR5", "BR6", "BR7", "BR8", "BR9", "BR10", "BR11", "BR12", "BR13"],
    capacity: 6000,
    efficiency: 92
  },
  {
    id: "led-line",
    name: "LED Ready Line", 
    products: ["CORNICE001", "CORNICE002", "CORNICE003", "CORNICE004", "CORNICE005", "LEDPROFILE01", "LEDPROFILE02", "LEDPROFILE03"],
    capacity: 2000,
    efficiency: 89
  },
  {
    id: "custom-line",
    name: "Custom Production Line",
    products: ["CUSTOM"],
    capacity: 1000,
    efficiency: 95
  }
];

export const STOCK_STATUS_COLORS = {
  in_stock: "bg-green-100 text-green-800",
  low_stock: "bg-yellow-100 text-yellow-800", 
  out_of_stock: "bg-red-100 text-red-800"
};

export const ORDER_STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  production: "bg-purple-100 text-purple-800",
  shipped: "bg-green-100 text-green-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};
