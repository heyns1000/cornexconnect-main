import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface UploadedFile {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  message?: string;
  mappedName?: string;
}

export default function ExcelUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  // Map file names to Cornex references
  const mapFileNameToCornex = (fileName: string): string => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('zollie')) return 'Cornex Zollie District Routes';
    if (lowerName.includes('homemart')) return 'Cornex Homemart Store Network';
    if (lowerName.includes('tripot')) return 'Cornex Tripot Distribution Points';
    if (lowerName.includes('cornice maker')) return 'Cornex Cornice Maker Retailers';
    return `Cornex ${fileName}`;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map((file, index) => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive",
        });
        return null;
      }

      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} must be an Excel file (.xlsx or .xls)`,
          variant: "destructive",
        });
        return null;
      }

      return {
        file,
        id: `${Date.now()}-${index}`,
        status: 'pending' as const,
        progress: 0,
        mappedName: mapFileNameToCornex(file.name)
      };
    }).filter(Boolean) as UploadedFile[];

    if (uploadedFiles.length + newFiles.length > 120) {
      toast({
        title: "Too many files",
        description: "Maximum 120 Excel files allowed",
        variant: "destructive",
      });
      return;
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const uploadFile = async (fileData: UploadedFile) => {
    setUploadedFiles(prev => 
      prev.map(f => f.id === fileData.id ? { ...f, status: 'uploading' } : f)
    );

    try {
      const formData = new FormData();
      formData.append('file', fileData.file);
      formData.append('mappedName', fileData.mappedName || '');

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(f => f.id === fileData.id ? { 
            ...f, 
            progress: Math.min(f.progress + Math.random() * 20, 90) 
          } : f)
        );
      }, 200);

      const response = await fetch('/api/excel-upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (response.ok) {
        const result = await response.json();
        setUploadedFiles(prev => 
          prev.map(f => f.id === fileData.id ? { 
            ...f, 
            status: 'success', 
            progress: 100,
            message: `Processed ${result.storesCount || 0} stores, ${result.routesCount || 0} routes`
          } : f)
        );
        toast({
          title: "Upload successful",
          description: `${fileData.mappedName} processed successfully`,
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileData.id ? { 
          ...f, 
          status: 'error', 
          progress: 0,
          message: 'Upload failed'
        } : f)
      );
      toast({
        title: "Upload failed",
        description: `Failed to upload ${fileData.file.name}`,
        variant: "destructive",
      });
    }
  };

  const uploadAllFiles = async () => {
    const pendingFiles = uploadedFiles.filter(f => f.status === 'pending');
    for (const file of pendingFiles) {
      await uploadFile(file);
      // Add small delay between uploads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'uploading':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <FileSpreadsheet className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'uploading':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <Upload className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🍎 Fruitful Assist - Upload Route Excel Files</h1>
          <p className="text-gray-600">Drop your Excel files here</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Excel File Upload</CardTitle>
          <CardDescription>
            Upload up to 120 Excel sheets with sales rep routes and hardware store lists
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                Drop Excel files here or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports .xlsx, .xls files up to 10MB each
              </p>
              <input
                type="file"
                multiple
                accept=".xlsx,.xls"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="mt-4" asChild>
                  <span>Choose Files</span>
                </Button>
              </label>
            </div>
          </div>

          {/* File Requirements */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Required Excel Columns:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
              <div>• Store Name</div>
              <div>• Store Address</div>
              <div>• City/Town</div>
              <div>• Province</div>
              <div>• Contact Person</div>
              <div>• Phone Number</div>
              <div>• Rep Name</div>
              <div>• Visit Frequency</div>
            </div>
          </div>

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">
                  Uploaded Files ({uploadedFiles.length}/120)
                </h3>
                {uploadedFiles.some(f => f.status === 'pending') && (
                  <Button onClick={uploadAllFiles} className="bg-green-600 hover:bg-green-700">
                    Upload All Files
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {uploadedFiles.map((fileData) => (
                  <div key={fileData.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(fileData.status)}
                        <div>
                          <p className="font-medium text-gray-900">{fileData.file.name}</p>
                          <p className="text-sm text-green-600 font-medium">{fileData.mappedName}</p>
                          <p className="text-xs text-gray-500">
                            {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(fileData.status)}>
                          {fileData.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(fileData.id)}
                          disabled={fileData.status === 'uploading'}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {fileData.status === 'uploading' && (
                      <Progress value={fileData.progress} className="h-2" />
                    )}

                    {fileData.message && (
                      <p className="text-sm text-gray-600">{fileData.message}</p>
                    )}

                    {fileData.status === 'pending' && (
                      <Button
                        onClick={() => uploadFile(fileData)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Upload File
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}