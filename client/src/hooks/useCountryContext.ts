import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Country, SUPPORTED_COUNTRIES, DEFAULT_COUNTRY, getCountryByCode } from '@/lib/i18n';

interface CountryContextType {
  currentCountry: Country;
  setCountry: (countryCode: string) => void;
  translations: Country['translations'];
  currency: string;
  phonePrefix: string;
  timezone: string;
  dateFormat: string;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export const useCountry = () => {
  const context = useContext(CountryContext);
  if (context === undefined) {
    console.error('CountryContext is undefined - Provider may not be properly wrapping the component');
    // Return default values instead of throwing error
    return {
      currentCountry: DEFAULT_COUNTRY,
      setCountry: (countryCode: string) => {
        console.warn('setCountry called outside of provider context');
        localStorage.setItem('selectedCountry', countryCode);
      },
      translations: DEFAULT_COUNTRY.translations,
      currency: DEFAULT_COUNTRY.currency,
      phonePrefix: DEFAULT_COUNTRY.phonePrefix,
      timezone: DEFAULT_COUNTRY.timezone,
      dateFormat: DEFAULT_COUNTRY.dateFormat,
    };
  }
  return context;
};

interface CountryProviderProps {
  children: ReactNode;
}

export const CountryProvider = ({ children }: CountryProviderProps) => {
  const [currentCountry, setCurrentCountryState] = useState<Country>(DEFAULT_COUNTRY);

  useEffect(() => {
    // Load saved country from localStorage
    const savedCountryCode = localStorage.getItem('selectedCountry') || 'ZA';
    const country = getCountryByCode(savedCountryCode);
    setCurrentCountryState(country);
  }, []);

  const setCountry = (countryCode: string) => {
    const newCountry = getCountryByCode(countryCode);
    localStorage.setItem('selectedCountry', countryCode);
    setCurrentCountryState(newCountry);
    // No page reload - instant translation switching
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