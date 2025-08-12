import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X, Download, Eye } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ImportFile {
  id: string;
  file: File;
  status: "pending" | "processing" | "completed" | "error";
  progress: number;
  result?: {
    totalRows: number;
    validRows: number;
    errors: string[];
    preview: any[];
  };
}

interface ImportSession {
  id: string;
  name: string;
  totalFiles: number;
  processedFiles: number;
  status: "active" | "completed" | "failed";
  createdAt: string;
  files: ImportFile[];
}

export default function BulkImport() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [importFiles, setImportFiles] = useState<ImportFile[]>([]);
  const [currentSession, setCurrentSession] = useState<ImportSession | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");

  // Fetch import history
  const { data: importHistory = [] } = useQuery<ImportSession[]>({
    queryKey: ["/api/bulk-import/history"]
  });

  // Process files mutation
  const processFilesMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });
      
      const response = await fetch("/api/bulk-import/process", {
        method: "POST",
        body: formData,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Import Started",
        description: `Processing ${importFiles.length} files...`,
      });
      
      // Create new session
      const session: ImportSession = {
        id: data.sessionId,
        name: `Import Session ${new Date().toLocaleString()}`,
        totalFiles: importFiles.length,
        processedFiles: 0,
        status: "active",
        createdAt: new Date().toISOString(),
        files: importFiles
      };
      setCurrentSession(session);
      
      // Start polling for progress
      startProgressPolling(data.sessionId);
    },
    onError: (error) => {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Start progress polling
  const startProgressPolling = (sessionId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/bulk-import/status/${sessionId}`);
        const data = await response.json();
        
        setImportFiles(prev => prev.map(file => {
          const updatedFile = data.files.find((f: any) => f.id === file.id);
          return updatedFile ? { ...file, ...updatedFile } : file;
        }));

        if (data.status === "completed" || data.status === "failed") {
          clearInterval(interval);
          setCurrentSession(prev => prev ? { ...prev, status: data.status } : null);
          queryClient.invalidateQueries({ queryKey: ["/api/bulk-import/history"] });
          queryClient.invalidateQueries({ queryKey: ["/api/hardware-stores"] });
        }
      } catch (error) {
        clearInterval(interval);
      }
    }, 2000);
  };

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: ImportFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: "pending",
      progress: 0,
    }));

    setImportFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: true,
    maxFiles: 50,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const removeFile = (fileId: string) => {
    setImportFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const startImport = () => {
    if (importFiles.length === 0) return;
    processFilesMutation.mutate(importFiles.map(f => f.file));
  };

  const clearAll = () => {
    setImportFiles([]);
    setCurrentSession(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "processing": return "bg-blue-500";
      case "error": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error": return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <FileSpreadsheet className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <PageTransition>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              📊 Bulk Excel Import
            </h1>
            <p className="text-muted-foreground mt-2">
              Import unstructured Excel files to add hardware stores to the system
            </p>
          </div>
          {importFiles.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearAll}>
                Clear All
              </Button>
              <Button 
                onClick={startImport} 
                disabled={processFilesMutation.isPending}
                className="bg-gradient-to-r from-emerald-500 to-blue-500"
              >
                {processFilesMutation.isPending ? "Processing..." : `Import ${importFiles.length} Files`}
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">File Upload</TabsTrigger>
            <TabsTrigger value="progress">Import Progress</TabsTrigger>
            <TabsTrigger value="history">Import History</TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            {/* Drag & Drop Zone */}
            <Card className="relative overflow-hidden backdrop-blur-sm bg-white/10 border border-white/20">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive || dragActive
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Drop Excel files here or click to browse
                    </h3>
                    <p className="text-muted-foreground">
                      Support for .xlsx, .xls, and .csv files • Up to 50 files at once
                    </p>
                  </div>
                  <Badge variant="outline" className="mt-2">
                    Drag & Drop Enabled
                  </Badge>
                </div>
              </div>
            </Card>

            {/* File List */}
            {importFiles.length > 0 && (
              <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5" />
                    Queued Files ({importFiles.length})
                  </CardTitle>
                  <CardDescription>
                    Files ready for processing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {importFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(file.status)}
                            <div>
                              <p className="font-medium">{file.file.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(file.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={file.status === "error" ? "destructive" : "secondary"}>
                              {file.status}
                            </Badge>
                            {file.status === "pending" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(file.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            {currentSession ? (
              <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{currentSession.name}</span>
                    <Badge 
                      variant={currentSession.status === "completed" ? "default" : "secondary"}
                      className={getStatusColor(currentSession.status)}
                    >
                      {currentSession.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Processing {currentSession.totalFiles} files
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{currentSession.processedFiles}/{currentSession.totalFiles}</span>
                    </div>
                    <Progress 
                      value={(currentSession.processedFiles / currentSession.totalFiles) * 100} 
                      className="h-2"
                    />
                  </div>

                  <Separator />

                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {currentSession.files.map((file) => (
                        <div key={file.id} className="p-3 rounded-lg border border-white/10 bg-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{file.file.name}</span>
                            {getStatusIcon(file.status)}
                          </div>
                          {file.status === "processing" && (
                            <Progress value={file.progress} className="h-1 mb-2" />
                          )}
                          {file.result && (
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>Total rows: {file.result.totalRows}</p>
                              <p>Valid rows: {file.result.validRows}</p>
                              {file.result.errors.length > 0 && (
                                <p className="text-red-500">Errors: {file.result.errors.length}</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ) : (
              <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <FileSpreadsheet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No active import session</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div className="grid gap-4">
              {importHistory.length > 0 ? (
                importHistory.map((session: ImportSession) => (
                  <Card key={session.id} className="backdrop-blur-sm bg-white/10 border border-white/20">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{session.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {session.totalFiles} files
                          </Badge>
                          <Badge className={getStatusColor(session.status)}>
                            {session.status}
                          </Badge>
                        </div>
                      </CardTitle>
                      <CardDescription>
                        {new Date(session.createdAt).toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {session.processedFiles}/{session.totalFiles} files processed
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export Report
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
                  <CardContent className="flex items-center justify-center h-48">
                    <div className="text-center">
                      <FileSpreadsheet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No import history available</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <FileSpreadsheet className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Smart Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically detects store data in any Excel format
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Data Validation</h3>
                  <p className="text-sm text-muted-foreground">
                    Validates and cleans data before importing
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Upload className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Bulk Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    Handle up to 50 files simultaneously
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}