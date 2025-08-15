import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, DollarSign } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface CountrySelectorProps {
  open: boolean;
  onClose: () => void;
}

export default function CountrySelector({ open, onClose }: CountrySelectorProps) {
  const { currentCountry, changeCountry, countries } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCountries = countries.filter(country =>
    country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (countryCode: string) => {
    changeCountry(countryCode);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Select Your Country</span>
          </DialogTitle>
          <DialogDescription>
            Choose your country to customize language, currency, and regional settings for your CornexConnect experience.
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by country code or currency..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Available Countries */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {filteredCountries.map((country) => (
              <Card
                key={country.code}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  currentCountry === country.code
                    ? 'ring-2 ring-emerald-500 bg-emerald-50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleCountrySelect(country.code)}
                data-testid={`country-${country.code}`}
              >
                <CardContent className="p-4 text-center">
                  <span className="text-2xl mb-2 block">{country.flag}</span>
                  <div className="text-sm font-medium">{country.code}</div>
                  <div className="text-xs text-gray-500 flex items-center justify-center">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {country.currency}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Current: {currentCountry}
            </div>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}