import { useState } from "react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Building2, Save, Shield, CreditCard, MapPin, Phone, Mail } from "lucide-react";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { 
  FadeIn, 
  SlideUp, 
  ScaleIn, 
  AnimatedCard, 
  AnimatedButton, 
  LoadingDots 
} from "@/components/AnimatedComponents";

const companySettingsSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  companyRegistration: z.string().optional(),
  contactEmail: z.string().email("Please enter a valid email address"),
  alternateEmail: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Please enter a valid phone number"),
  alternatePhone: z.string().optional(),
  address: z.string().min(5, "Please enter a complete address"),
  city: z.string().min(2, "Please enter a city name"),
  province: z.string().min(2, "Please select a province"),
  postalCode: z.string().min(4, "Please enter a valid postal code"),
  country: z.string().default("South Africa"),
  vatNumber: z.string().optional(),
  businessType: z.enum(["distributor", "retailer", "manufacturer", "other"]),
  creditLimit: z.string().optional(),
  paymentTerms: z.enum(["cash", "30_days", "60_days", "90_days"]),
});

type CompanySettingsForm = z.infer<typeof companySettingsSchema>;

const southAfricanProvinces = [
  "Eastern Cape",
  "Free State", 
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape"
];

export default function CompanySettings() {
  const [activeSection, setActiveSection] = useState("basic");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current company settings
  const { data: companySettings, isLoading } = useQuery({
    queryKey: ["/api/company-settings"],
  });

  const form = useForm<CompanySettingsForm>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      companyName: "HOMEMART AFRICA",
      companyRegistration: "2022/854581/07",
      contactEmail: "info@homemart.co.za",
      alternateEmail: "",
      phone: "+27 11 123 4567",
      alternatePhone: "",
      address: "123 Industrial Street, Johannesburg",
      city: "Johannesburg",
      province: "Gauteng",
      postalCode: "2001",
      country: "South Africa",
      vatNumber: "4123456789",
      businessType: "distributor",
      creditLimit: "500000",
      paymentTerms: "30_days",
    },
  });

  // Update form values when data loads
  React.useEffect(() => {
    if (companySettings) {
      form.reset(companySettings);
    }
  }, [companySettings, form]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: CompanySettingsForm) => {
      return apiRequest("/api/company-settings", "PUT", data);
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Your company settings have been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/company-settings"] });
      
      // Log the update
      apiRequest("/api/auth/audit", "POST", {
        action: "update_company_settings",
        details: "Company settings updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update company settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CompanySettingsForm) => {
    updateSettingsMutation.mutate(data);
  };

  const navigationItems = [
    { id: "basic", label: "Basic Information", icon: Building2 },
    { id: "contact", label: "Contact Details", icon: Phone },
    { id: "address", label: "Address Information", icon: MapPin },
    { id: "business", label: "Business Details", icon: CreditCard },
  ];

  if (isLoading) {
    return (
      <PageTransition>
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded-md w-2/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Company Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your company profile and business information
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>All changes are audited</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <Card className="lg:col-span-1 backdrop-blur-sm bg-white/10 border border-white/20">
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
              <CardDescription>Configure your company details</CardDescription>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeSection === item.id
                          ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>

          {/* Settings Form */}
          <Card className="lg:col-span-3 backdrop-blur-sm bg-white/10 border border-white/20">
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {activeSection === "basic" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter company name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="companyRegistration"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company Registration Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 2022/854581/07" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Your official company registration number
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="vatNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>VAT Registration Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 4123456789" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Your VAT registration number (if applicable)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "contact" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="contactEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Primary Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="info@company.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="alternateEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Alternate Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="support@company.com" {...field} />
                                  </FormControl>
                                  <FormDescription>Optional secondary email</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Primary Phone</FormLabel>
                                  <FormControl>
                                    <Input type="tel" placeholder="+27 11 123 4567" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="alternatePhone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Alternate Phone</FormLabel>
                                  <FormControl>
                                    <Input type="tel" placeholder="+27 11 987 6543" {...field} />
                                  </FormControl>
                                  <FormDescription>Optional secondary phone</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "address" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Address Information</h3>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Physical Address</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="123 Industrial Street, Business Park"
                                    {...field} 
                                    rows={3}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Johannesburg" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="province"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Province</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select province" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {southAfricanProvinces.map((province) => (
                                        <SelectItem key={province} value={province}>
                                          {province}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="postalCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Postal Code</FormLabel>
                                  <FormControl>
                                    <Input placeholder="2001" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="country"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Country</FormLabel>
                                  <FormControl>
                                    <Input placeholder="South Africa" {...field} readOnly />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "business" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Business Details</h3>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="businessType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Business Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select business type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="distributor">Distributor</SelectItem>
                                    <SelectItem value="retailer">Retailer</SelectItem>
                                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="creditLimit"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Credit Limit (ZAR)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="500000" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Current approved credit limit
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="paymentTerms"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Payment Terms</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select payment terms" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="cash">Cash on Delivery</SelectItem>
                                      <SelectItem value="30_days">30 Days</SelectItem>
                                      <SelectItem value="60_days">60 Days</SelectItem>
                                      <SelectItem value="90_days">90 Days</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <Separator />

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={updateSettingsMutation.isPending}
                      className="bg-gradient-to-r from-emerald-500 to-blue-500"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {updateSettingsMutation.isPending ? "Saving Changes..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}