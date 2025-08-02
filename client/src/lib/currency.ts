import { CURRENCIES } from "./constants";

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return amount;
  
  const fromRate = CURRENCIES.find(c => c.currency === fromCurrency)?.rate || 1;
  const toRate = CURRENCIES.find(c => c.currency === toCurrency)?.rate || 1;
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate;
  return usdAmount * toRate;
}

export function formatCurrency(amount: number, currency: string): string {
  const currencyInfo = CURRENCIES.find(c => c.currency === currency);
  if (!currencyInfo) return amount.toFixed(2);
  
  return `${currencyInfo.symbol}${amount.toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
}

export function getCurrencySymbol(currency: string): string {
  return CURRENCIES.find(c => c.currency === currency)?.symbol || "";
}

export function getCurrencyFlag(currency: string): string {
  return CURRENCIES.find(c => c.currency === currency)?.flag || "";
}
