import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Upload, Printer, FileText, Eye, Download, Trash2, Settings, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { ProductLabel, Printer as PrinterType, PrintJob, Product, InsertProductLabel, InsertPrinter, InsertPrintJob } from "@shared/schema";
import type { UploadResult } from '@uppy/core';

const labelFormSchema = z.object({
  name: z.string().min(1, "Label name is required"),
  description: z.string().optional(),
  productId: z.string().optional(),
  category: z.enum(["product_label", "insert_card", "packaging_label", "barcode_label", "safety_label"]),
  labelType: z.enum(["standard", "custom", "regulatory", "promotional"]),
  printSize: z.enum(["A4", "A5", "4x6", "custom"]),
  printOrientation: z.enum(["portrait", "landscape"]).default("portrait"),
  printQuality: z.enum(["draft", "normal", "high", "photo"]).default("high"),
  colorMode: z.enum(["bw", "color"]).default("color"),
  copies: z.number().min(1).default(1),
});

const printerFormSchema = z.object({
  name: z.string().min(1, "Printer name is required"),
  model: z.string().optional(),
  manufacturer: z.string().optional(),
  ipAddress: z.string().ip("Valid IP address required"),
  location: z.string().min(1, "Location is required"),
  department: z.string().optional(),
  printerType: z.enum(["laser", "inkjet", "thermal", "dot_matrix"]),
  connectionType: z.enum(["wifi", "ethernet", "usb"]).default("wifi"),
});

const printJobFormSchema = z.object({
  labelId: z.string().min(1, "Label selection is required"),
  printerId: z.string().min(1, "Printer selection is required"),
  jobName: z.string().min(1, "Job name is required"),
  copies: z.number().min(1).default(1),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
});

function ProductLabels() {
  const [activeTab, setActiveTab] = useState("labels");
  const [isLabelDialogOpen, setIsLabelDialogOpen] = useState(false);
  const [isPrinterDialogOpen, setIsPrinterDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [uploadingLabelId, setUploadingLabelId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Queries
  const { data: labels = [], isLoading: labelsLoading } = useQuery<ProductLabel[]>({
    queryKey: ["/api/product-labels"],
  });

  const { data: printers = [], isLoading: printersLoading } = useQuery<PrinterType[]>({
    queryKey: ["/api/printers"],
  });

  const { data: printJobs = [], isLoading: jobsLoading } = useQuery<PrintJob[]>({
    queryKey: ["/api/print-jobs"],
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Forms
  const labelForm = useForm<z.infer<typeof labelFormSchema>>({
    resolver: zodResolver(labelFormSchema),
    defaultValues: {
      category: "product_label",
      labelType: "standard",
      printSize: "A4",
      printOrientation: "portrait",
      printQuality: "high",
      colorMode: "color",
      copies: 1,
    },
  });

  const printerForm = useForm<z.infer<typeof printerFormSchema>>({
    resolver: zodResolver(printerFormSchema),
    defaultValues: {
      printerType: "laser",
      connectionType: "wifi",
    },
  });

  const printJobForm = useForm<z.infer<typeof printJobFormSchema>>({
    resolver: zodResolver(printJobFormSchema),
    defaultValues: {
      copies: 1,
      priority: "normal",
    },
  });

  // Mutations
  const createLabelMutation = useMutation({
    mutationFn: async (data: z.infer<typeof labelFormSchema>) => {
      return apiRequest("/api/product-labels", "POST", data);
    },
    onSuccess: (newLabel) => {
      queryClient.invalidateQueries({ queryKey: ["/api/product-labels"] });
      setUploadingLabelId(newLabel.id);
      toast({
        title: "Success",
        description: "Product label created successfully. You can now upload the PDF file.",
      });
      labelForm.reset();
      setIsLabelDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product label",
        variant: "destructive",
      });
    },
  });

  const createPrinterMutation = useMutation({
    mutationFn: async (data: z.infer<typeof printerFormSchema>) => {
      return apiRequest("/api/printers", "POST", {
        ...data,
        supportedSizes: ["A4", "A5", "4x6"],
        capabilities: { color: true, duplex: true, staple: false },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/printers"] });
      toast({
        title: "Success",
        description: "Printer added successfully",
      });
      printerForm.reset();
      setIsPrinterDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add printer",
        variant: "destructive",
      });
    },
  });

  const createPrintJobMutation = useMutation({
    mutationFn: async (data: z.infer<typeof printJobFormSchema>) => {
      const selectedLabel = labels.find(l => l.id === data.labelId);
      return apiRequest("/api/print-jobs", "POST", {
        ...data,
        printSize: selectedLabel?.printSize || "A4",
        printOrientation: selectedLabel?.printOrientation || "portrait",
        printQuality: selectedLabel?.printQuality || "normal",
        colorMode: selectedLabel?.colorMode || "color",
        userId: "homemart_demo_user", // Demo user ID
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/print-jobs"] });
      toast({
        title: "Success",
        description: "Print job created successfully",
      });
      printJobForm.reset();
      setIsPrintDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create print job",
        variant: "destructive",
      });
    },
  });

  const updateLabelMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertProductLabel> }) => {
      return apiRequest(`/api/product-labels/${id}`, "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/product-labels"] });
      setUploadingLabelId(null);
      toast({
        title: "Success",
        description: "Label updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update label",
        variant: "destructive",
      });
    },
  });

  const deleteLabelMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/product-labels/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/product-labels"] });
      toast({
        title: "Success",
        description: "Label deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete label",
        variant: "destructive",
      });
    },
  });

  const handleGetUploadParameters = async () => {
    const response = await apiRequest("/api/product-labels/upload-url", "POST");
    return {
      method: "PUT" as const,
      url: response.uploadURL,
    };
  };

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful.length > 0 && uploadingLabelId) {
      const uploadedFile = result.successful[0];
      updateLabelMutation.mutate({
        id: uploadingLabelId,
        data: {
          fileUrl: uploadedFile.uploadURL || "",
          fileName: uploadedFile.name || "Unknown",
          fileSize: uploadedFile.size || 0,
        },
      });
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      product_label: "bg-blue-100 text-blue-800",
      insert_card: "bg-green-100 text-green-800",
      packaging_label: "bg-purple-100 text-purple-800",
      barcode_label: "bg-orange-100 text-orange-800",
      safety_label: "bg-red-100 text-red-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "printing":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Labeling & Inserts Library</h1>
          <p className="text-gray-600 mt-1">Manage product labels, inserts, and print-ready files for Homemart Africa</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="labels" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Product Labels
          </TabsTrigger>
          <TabsTrigger value="printers" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            WiFi Printers
          </TabsTrigger>
          <TabsTrigger value="print-jobs" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Print Jobs
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="labels" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Product Labels & Inserts</h2>
            <Dialog open={isLabelDialogOpen} onOpenChange={setIsLabelDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Label
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Product Label</DialogTitle>
                </DialogHeader>
                <Form {...labelForm}>
                  <form onSubmit={labelForm.handleSubmit((data) => createLabelMutation.mutate(data))} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={labelForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Label Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., EPS01 Product Info Label" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={labelForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="product_label">Product Label</SelectItem>
                                <SelectItem value="insert_card">Insert Card</SelectItem>
                                <SelectItem value="packaging_label">Packaging Label</SelectItem>
                                <SelectItem value="barcode_label">Barcode Label</SelectItem>
                                <SelectItem value="safety_label">Safety Label</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={labelForm.control}
                        name="labelType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Label Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                                <SelectItem value="regulatory">Regulatory</SelectItem>
                                <SelectItem value="promotional">Promotional</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={labelForm.control}
                        name="productId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Associated Product (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select product" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {products.map((product) => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={labelForm.control}
                        name="printSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Print Size</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="A4">A4</SelectItem>
                                <SelectItem value="A5">A5</SelectItem>
                                <SelectItem value="4x6">4x6</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={labelForm.control}
                        name="printOrientation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Orientation</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Orientation" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="portrait">Portrait</SelectItem>
                                <SelectItem value="landscape">Landscape</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={labelForm.control}
                        name="printQuality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Print Quality</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Quality" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="photo">Photo</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={labelForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Description of the label and its usage..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsLabelDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createLabelMutation.isPending}>
                        {createLabelMutation.isPending ? "Creating..." : "Create Label"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {labelsLoading ? (
              <div className="col-span-3 text-center py-8">Loading labels...</div>
            ) : labels.length === 0 ? (
              <div className="col-span-3 text-center py-8 text-gray-500">
                No product labels created yet. Create your first label to get started.
              </div>
            ) : (
              labels.map((label) => (
                <Card key={label.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{label.name}</CardTitle>
                      <Badge className={getCategoryBadge(label.category)}>
                        {label.category.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    {label.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{label.description}</p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Type:</span> {label.labelType}
                      </div>
                      <div>
                        <span className="font-medium">Size:</span> {label.printSize}
                      </div>
                      <div>
                        <span className="font-medium">Quality:</span> {label.printQuality}
                      </div>
                      <div>
                        <span className="font-medium">Version:</span> {label.version}
                      </div>
                    </div>
                    
                    {!label.fileUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-2">No PDF file uploaded</p>
                        <ObjectUploader
                          maxNumberOfFiles={1}
                          maxFileSize={10485760}
                          allowedFileTypes={['.pdf']}
                          onGetUploadParameters={handleGetUploadParameters}
                          onComplete={(result) => {
                            setUploadingLabelId(label.id);
                            handleUploadComplete(result);
                          }}
                          buttonClassName="h-8 text-xs"
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          Upload PDF
                        </ObjectUploader>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => window.open(label.fileUrl, '_blank')}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setUploadingLabelId(label.id);
                          }}
                        >
                          <Upload className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteLabelMutation.mutate(label.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    {uploadingLabelId === label.id && !label.fileUrl && (
                      <ObjectUploader
                        maxNumberOfFiles={1}
                        maxFileSize={10485760}
                        allowedFileTypes={['.pdf']}
                        onGetUploadParameters={handleGetUploadParameters}
                        onComplete={handleUploadComplete}
                        buttonClassName="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload PDF File
                      </ObjectUploader>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="printers" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">WiFi Printers</h2>
            <Dialog open={isPrinterDialogOpen} onOpenChange={setIsPrinterDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add WiFi Printer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add WiFi Printer</DialogTitle>
                </DialogHeader>
                <Form {...printerForm}>
                  <form onSubmit={printerForm.handleSubmit((data) => createPrinterMutation.mutate(data))} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={printerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Printer Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Office Laser Printer" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={printerForm.control}
                        name="ipAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>IP Address</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="192.168.1.100" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={printerForm.control}
                        name="manufacturer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Manufacturer</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="HP, Canon, Brother, etc." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={printerForm.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="LaserJet Pro M404n" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={printerForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Main Office, Warehouse, etc." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={printerForm.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Production, Sales, etc." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={printerForm.control}
                        name="printerType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Printer Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="laser">Laser</SelectItem>
                                <SelectItem value="inkjet">Inkjet</SelectItem>
                                <SelectItem value="thermal">Thermal</SelectItem>
                                <SelectItem value="dot_matrix">Dot Matrix</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={printerForm.control}
                        name="connectionType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Connection Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select connection" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="wifi">WiFi</SelectItem>
                                <SelectItem value="ethernet">Ethernet</SelectItem>
                                <SelectItem value="usb">USB</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsPrinterDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createPrinterMutation.isPending}>
                        {createPrinterMutation.isPending ? "Adding..." : "Add Printer"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {printersLoading ? (
              <div className="col-span-3 text-center py-8">Loading printers...</div>
            ) : printers.length === 0 ? (
              <div className="col-span-3 text-center py-8 text-gray-500">
                No printers configured yet. Add your first WiFi printer to get started.
              </div>
            ) : (
              printers.map((printer) => (
                <Card key={printer.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{printer.name}</CardTitle>
                      <Badge variant={printer.status === "online" ? "default" : "secondary"}>
                        {printer.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{printer.location}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Type:</span> {printer.printerType}
                      </div>
                      <div>
                        <span className="font-medium">IP:</span> {printer.ipAddress}
                      </div>
                      <div>
                        <span className="font-medium">Connection:</span> {printer.connectionType}
                      </div>
                      <div>
                        <span className="font-medium">Paper:</span> {printer.paperLevel}%
                      </div>
                    </div>
                    
                    {printer.manufacturer && printer.model && (
                      <p className="text-sm">
                        <span className="font-medium">Model:</span> {printer.manufacturer} {printer.model}
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="h-3 w-3 mr-1" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm">
                        Test Print
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="print-jobs" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Print Jobs</h2>
            <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Print Job
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Print Job</DialogTitle>
                </DialogHeader>
                <Form {...printJobForm}>
                  <form onSubmit={printJobForm.handleSubmit((data) => createPrintJobMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={printJobForm.control}
                      name="jobName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., EPS01 Labels - Batch 001" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={printJobForm.control}
                        name="labelId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Label</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose label" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {labels.filter(l => l.fileUrl).map((label) => (
                                  <SelectItem key={label.id} value={label.id}>
                                    {label.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={printJobForm.control}
                        name="printerId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Printer</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose printer" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {printers.filter(p => p.status === "online").map((printer) => (
                                  <SelectItem key={printer.id} value={printer.id}>
                                    {printer.name} ({printer.location})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={printJobForm.control}
                        name="copies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Copies</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min={1}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={printJobForm.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsPrintDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createPrintJobMutation.isPending}>
                        {createPrintJobMutation.isPending ? "Creating..." : "Create Job"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {jobsLoading ? (
              <div className="text-center py-8">Loading print jobs...</div>
            ) : printJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No print jobs created yet. Create your first print job to get started.
              </div>
            ) : (
              printJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(job.status)}
                          <h3 className="font-semibold text-lg">{job.jobName}</h3>
                          <Badge variant={job.priority === "urgent" ? "destructive" : "secondary"}>
                            {job.priority}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Copies:</span> {job.copies}
                          </div>
                          <div>
                            <span className="font-medium">Size:</span> {job.printSize}
                          </div>
                          <div>
                            <span className="font-medium">Quality:</span> {job.printQuality}
                          </div>
                          <div>
                            <span className="font-medium">Status:</span> {job.status}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        Created: {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Label Templates</h2>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Template
            </Button>
          </div>
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Label templates coming soon...</p>
            <p className="text-sm">Create reusable templates for common label designs</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ProductLabels;