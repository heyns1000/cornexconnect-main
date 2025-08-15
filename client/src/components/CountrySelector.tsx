import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Clock, DollarSign, Phone } from "lucide-react";
import { SUPPORTED_COUNTRIES, CountryConfig } from "@/lib/i18n";
import { useCountry } from "@/hooks/useCountryContext";

interface CountrySelectorProps {
  open: boolean;
  onClose: () => void;
}

export default function CountrySelector({ open, onClose }: CountrySelectorProps) {
  const { currentCountry, setCountry } = useCountry();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig | null>(null);

  const filteredCountries = SUPPORTED_COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (country: CountryConfig) => {
    setSelectedCountry(country);
  };

  const handleConfirmSelection = () => {
    if (selectedCountry) {
      setCountry(selectedCountry.code);
      onClose();
    }
  };

  const groupedCountries = filteredCountries.reduce((groups, country) => {
    let region = 'Other';
    
    if (['ZA', 'EG', 'MA', 'NG', 'GH', 'KE'].includes(country.code)) {
      region = 'Africa';
    } else if (['GB', 'DE', 'FR', 'ES', 'IT', 'NL'].includes(country.code)) {
      region = 'Europe';
    } else if (['US', 'CA', 'MX', 'AR', 'BR'].includes(country.code)) {
      region = 'Americas';
    } else if (['JP', 'CN', 'IN', 'AU'].includes(country.code)) {
      region = 'Asia-Pacific';
    } else if (['SA', 'AE'].includes(country.code)) {
      region = 'Middle East';
    }
    
    if (!groups[region]) groups[region] = [];
    groups[region].push(country);
    return groups;
  }, {} as Record<string, CountryConfig[]>);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Select Your Country</span>
          </DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by country, language, or currency..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Current Selection */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{currentCountry.flag}</span>
                <div>
                  <h3 className="font-medium text-blue-900">Current: {currentCountry.name}</h3>
                  <p className="text-sm text-blue-700">{currentCountry.language} • {currentCountry.currency} • {currentCountry.regions} regions</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                Selected
              </Badge>
            </div>
          </div>

          {/* Country Groups */}
          {Object.entries(groupedCountries).map(([region, countries]) => (
            <div key={region}>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  {region}
                </span>
                <Badge variant="secondary" className="ml-2">
                  {countries.length}
                </Badge>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {countries.map((country) => (
                  <Card
                    key={country.code}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedCountry?.code === country.code
                        ? 'ring-2 ring-blue-500 bg-blue-50'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleCountrySelect(country)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-xl">{country.flag}</span>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{country.name}</h4>
                          <p className="text-xs text-gray-500">{country.capital}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {country.currency}
                          </span>
                          <span className="flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {country.phonePrefix}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span>{country.language}</span>
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {country.regions} regions
                          </span>
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {country.timezone.split('/')[1]?.replace('_', ' ')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Selection Details & Actions */}
        {selectedCountry && (
          <div className="border-t pt-4 space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                <span className="text-xl mr-2">{selectedCountry.flag}</span>
                Current Selection Details
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Phone Prefix</span>
                  <p className="font-medium">{selectedCountry.phonePrefix}</p>
                </div>
                <div>
                  <span className="text-gray-500">Currency</span>
                  <p className="font-medium">{selectedCountry.currency}</p>
                </div>
                <div>
                  <span className="text-gray-500">Date Format</span>
                  <p className="font-medium">{selectedCountry.dateFormat}</p>
                </div>
                <div>
                  <span className="text-gray-500">Timezone</span>
                  <p className="font-medium">{selectedCountry.timezone.split('/')[1]?.replace('_', ' ')}</p>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mt-2">
                Marketing campaigns will follow {selectedCountry.name} regulations
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmSelection}
                className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white"
              >
                Confirm Selection
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}