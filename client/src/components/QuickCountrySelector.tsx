import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useCountry } from "@/hooks/useCountryContext";
import { SUPPORTED_COUNTRIES } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function QuickCountrySelector() {
  const { currentCountry, setCountry } = useCountry();

  // Show top 8 most common countries for quick access
  const quickCountries = SUPPORTED_COUNTRIES.filter(country => 
    ['ZA', 'EG', 'TR', 'DE', 'FR', 'ES', 'US', 'MX'].includes(country.code)
  );

  const handleCountryChange = (countryCode: string) => {
    setCountry(countryCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2 w-full justify-start">
          <Globe className="w-4 h-4" />
          <span className="text-xl">{currentCountry.flag}</span>
          <span className="text-sm font-medium">{currentCountry.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {quickCountries.map((country) => (
          <DropdownMenuItem
            key={country.code}
            onClick={() => handleCountryChange(country.code)}
            className={`flex items-center space-x-3 ${
              currentCountry.code === country.code ? 'bg-blue-50' : ''
            }`}
          >
            <span className="text-lg">{country.flag}</span>
            <div className="flex-1">
              <div className="font-medium">{country.name}</div>
              <div className="text-xs text-gray-500">{country.language} • {country.currency}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}