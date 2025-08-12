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
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { TransitionHints, useTransitionHints, HINT_SEQUENCES } from "@/components/TransitionHints";

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
  const [showWelcomeHints, setShowWelcomeHints] = useState(true);
  
  // Transition hints system
  const { 
    activeHints, 
    isVisible: hintsVisible, 
    currentStep, 
    showHints, 
    hideHints, 
    completeHints 
  } = useTransitionHints();
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedSessionDetails, setSelectedSessionDetails] = useState<ImportSession | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

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
      
      const response = await fetch("/api/bulk-import/upload", {
        method: "POST",
        body: formData,
      });
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Upload success:", data);
      toast({
        title: "Upload Successful!",
        description: `Successfully processed ${data.processedFiles?.length || importFiles.length} files. ${data.message || 'Import completed successfully.'}`,
      });
      
      // Start polling session status if we have a session ID
      if (data.sessionId) {
        startProgressPolling(data.sessionId);
      }
      
      // Update hardware stores data to reflect new imports
      queryClient.invalidateQueries({ queryKey: ["/api/bulk-import/history"] });
      queryClient.invalidateQueries({ queryKey: ["/api/hardware-stores"] });
      
      // Clear files from UI after successful upload
      setImportFiles([]);
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
        if (!response.ok) {
          throw new Error('Session not found');
        }
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

  // Clear all files
  const clearAll = async () => {
    try {
      await fetch("/api/bulk-import/clear", { method: "POST" });
      setImportFiles([]);
      setCurrentSession(null);
      toast({
        title: "Files Cleared",
        description: "All files have been cleared from the import queue.",
      });
    } catch (error) {
      toast({
        title: "Clear Failed",
        description: "Failed to clear files. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Start import process
  const startImport = () => {
    if (importFiles.length > 0) {
      const files = importFiles.map(f => f.file);
      processFilesMutation.mutate(files);
    }
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

  const clearAllLocal = () => {
    setImportFiles([]);
    setCurrentSession(null);
  };

  // Show welcome hints on first visit
  const startWelcomeTour = () => {
    showHints(HINT_SEQUENCES.bulkImport);
  };

  const skipWelcomeTour = () => {
    setShowWelcomeHints(false);
    hideHints();
  };

  const viewSessionDetails = (session: ImportSession) => {
    setSelectedSessionDetails(session);
    setShowDetailsDialog(true);
  };

  const exportSessionReport = (session: ImportSession) => {
    // Create CSV report data
    const csvData = [
      ['Import Session Report'],
      ['Session ID:', session.id],
      ['Session Name:', session.name],
      ['Created:', new Date(session.createdAt).toLocaleString()],
      ['Status:', session.status],
      ['Total Files:', session.totalFiles.toString()],
      ['Processed Files:', session.processedFiles.toString()],
      [''],
      ['File Details:'],
      ['File Name', 'Status', 'Progress', 'Total Rows', 'Valid Rows', 'Errors']
    ];

    session.files.forEach(file => {
      csvData.push([
        file.file.name || 'Unknown',
        file.status,
        `${file.progress}%`,
        file.result?.totalRows?.toString() || '0',
        file.result?.validRows?.toString() || '0',
        file.result?.errors?.length?.toString() || '0'
      ]);
    });

    // Convert to CSV string
    const csvContent = csvData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `import-report-${session.id}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Report Exported",
      description: `Downloaded report for session: ${session.name}`,
    });
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
          <div className="flex gap-2">
            {showWelcomeHints && (
              <Button 
                variant="outline" 
                onClick={startWelcomeTour}
                className="bg-gradient-to-r from-emerald-50 to-blue-50 hover:from-emerald-100 hover:to-blue-100"
              >
                💡 Take Tour
              </Button>
            )}
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

        <Tabs defaultValue="upload" className="space-y-6" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">File Upload</TabsTrigger>
            <TabsTrigger value="progress">Import Progress</TabsTrigger>
            <TabsTrigger value="details">Import Details</TabsTrigger>
            <TabsTrigger value="history">Import History</TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            {/* Drag & Drop Zone */}
            <Card className="relative overflow-hidden backdrop-blur-sm bg-white/10 border border-white/20">
              <div
                {...getRootProps()}
                data-hint="file-drop-zone"
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

          {/* Import Details Tab */}
          <TabsContent value="details" className="space-y-6">
            {currentSession ? (
              <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Current Import Details</span>
                    <Badge 
                      variant={currentSession.status === "completed" ? "default" : "secondary"}
                      className={getStatusColor(currentSession.status)}
                    >
                      {currentSession.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Detailed breakdown of the current import session
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Session Summary */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="backdrop-blur-sm bg-white/5 border border-white/10">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{currentSession.totalFiles}</div>
                        <div className="text-sm text-muted-foreground">Total Files</div>
                      </CardContent>
                    </Card>
                    <Card className="backdrop-blur-sm bg-white/5 border border-white/10">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{currentSession.processedFiles}</div>
                        <div className="text-sm text-muted-foreground">Processed</div>
                      </CardContent>
                    </Card>
                    <Card className="backdrop-blur-sm bg-white/5 border border-white/10">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {currentSession.files.reduce((sum, file) => sum + (file.result?.validRows || 0), 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Imported Records</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* File Processing Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">File Processing Details</h3>
                    <ScrollArea className="h-96">
                      <div className="space-y-3">
                        {currentSession.files.map((file, index) => (
                          <Card key={file.id || index} className="backdrop-blur-sm bg-white/5 border border-white/10">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(file.status)}
                                  <span className="font-medium">{file.file.name || `File ${index + 1}`}</span>
                                </div>
                                <Badge variant="outline">{file.status}</Badge>
                              </div>

                              {file.progress > 0 && (
                                <div className="mb-3">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Progress</span>
                                    <span>{file.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-300" 
                                      style={{ width: `${file.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}

                              {file.result && (
                                <div className="space-y-2">
                                  <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                                      <div className="font-bold text-blue-600">{file.result.totalRows}</div>
                                      <div className="text-xs text-muted-foreground">Total Rows</div>
                                    </div>
                                    <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                      <div className="font-bold text-green-600">{file.result.validRows}</div>
                                      <div className="text-xs text-muted-foreground">Valid Rows</div>
                                    </div>
                                    <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                                      <div className="font-bold text-red-600">{file.result.errors.length}</div>
                                      <div className="text-xs text-muted-foreground">Errors</div>
                                    </div>
                                  </div>

                                  {file.result.errors.length > 0 && (
                                    <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                                      <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                                        Processing Errors ({file.result.errors.length}):
                                      </p>
                                      <ScrollArea className="h-24">
                                        <ul className="text-sm text-red-600 dark:text-red-300 space-y-1">
                                          {file.result.errors.map((error, errorIndex) => (
                                            <li key={errorIndex} className="flex items-start gap-2">
                                              <span className="text-red-500 mt-0.5">•</span>
                                              <span>{error}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </ScrollArea>
                                    </div>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="backdrop-blur-sm bg-white/10 border border-white/20">
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <FileSpreadsheet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No active import session</p>
                    <p className="text-sm text-muted-foreground mt-2">Start an import to view detailed progress</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div className="grid gap-4" data-hint="import-history">
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => viewSessionDetails(session)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => exportSessionReport(session)}
                          >
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

        {/* Details Dialog */}
        {showDetailsDialog && selectedSessionDetails && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Import Session Details</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowDetailsDialog(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2">Session Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">ID:</span> {selectedSessionDetails.id}</p>
                      <p><span className="font-medium">Name:</span> {selectedSessionDetails.name}</p>
                      <p><span className="font-medium">Created:</span> {new Date(selectedSessionDetails.createdAt).toLocaleString()}</p>
                      <p><span className="font-medium">Status:</span> 
                        <Badge className={`ml-2 ${getStatusColor(selectedSessionDetails.status)}`}>
                          {selectedSessionDetails.status}
                        </Badge>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Processing Summary</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Total Files:</span> {selectedSessionDetails.totalFiles}</p>
                      <p><span className="font-medium">Processed:</span> {selectedSessionDetails.processedFiles}</p>
                      <p><span className="font-medium">Success Rate:</span> {Math.round((selectedSessionDetails.processedFiles / selectedSessionDetails.totalFiles) * 100)}%</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">File Details</h3>
                  <div className="space-y-3">
                    {selectedSessionDetails.files.map((file, index) => (
                      <div key={file.id || index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{file.file.name || `File ${index + 1}`}</span>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(file.status)}
                            <Badge variant="outline">{file.status}</Badge>
                          </div>
                        </div>
                        
                        {file.progress > 0 && (
                          <div className="mb-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{file.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${file.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        {file.result && (
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Total Rows:</span> {file.result.totalRows}
                            </div>
                            <div>
                              <span className="font-medium">Valid Rows:</span> {file.result.validRows}
                            </div>
                            <div>
                              <span className="font-medium">Errors:</span> 
                              <span className={file.result.errors.length > 0 ? "text-red-500 ml-1" : "ml-1"}>
                                {file.result.errors.length}
                              </span>
                            </div>
                          </div>
                        )}

                        {file.result?.errors && file.result.errors.length > 0 && (
                          <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                            <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">Errors:</p>
                            <ul className="text-sm text-red-600 dark:text-red-300 list-disc list-inside">
                              {file.result.errors.slice(0, 3).map((error, errorIndex) => (
                                <li key={errorIndex}>{error}</li>
                              ))}
                              {file.result.errors.length > 3 && (
                                <li>...and {file.result.errors.length - 3} more errors</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
                <Button 
                  variant="outline"
                  onClick={() => exportSessionReport(selectedSessionDetails)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Transition Hints Component */}
        <AnimatePresence>
          {hintsVisible && (
            <TransitionHints
              steps={activeHints}
              isVisible={hintsVisible}
              onComplete={completeHints}
              onSkip={skipWelcomeTour}
              currentStep={currentStep}
            />
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}