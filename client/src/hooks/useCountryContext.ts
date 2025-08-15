import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { CountryConfig, getCurrentCountry, setCurrentCountry, DEFAULT_COUNTRY, getCountryByCode } from '@/lib/i18n';

interface CountryContextType {
  currentCountry: CountryConfig;
  setCountry: (countryCode: string) => void;
  translations: CountryConfig['translations'];
  currency: string;
  phonePrefix: string;
  timezone: string;
  dateFormat: string;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export const useCountry = () => {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
};

interface CountryProviderProps {
  children: ReactNode;
}

export const CountryProvider = ({ children }: CountryProviderProps) => {
  const [currentCountry, setCurrentCountryState] = useState<CountryConfig>(DEFAULT_COUNTRY);

  useEffect(() => {
    const savedCountry = getCurrentCountry();
    setCurrentCountryState(savedCountry);
  }, []);

  const setCountry = (countryCode: string) => {
    const newCountry = getCountryByCode(countryCode);
    setCurrentCountry(countryCode);
    setCurrentCountryState(newCountry);
    
    // Force a page reload to ensure all components update with new translations
    window.location.reload();
  };

  const contextValue: CountryContextType = {
    currentCountry,
    setCountry,
    translations: currentCountry.translations,
    currency: currentCountry.currency,
    phonePrefix: currentCountry.phonePrefix,
    timezone: currentCountry.timezone,
    dateFormat: currentCountry.dateFormat,
  };

  return React.createElement(CountryContext.Provider, { value: contextValue }, children);
};