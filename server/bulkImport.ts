import * as XLSX from 'xlsx';
import { storage } from './storage';
import { nanoid } from 'nanoid';

export interface ProcessedFile {
  fileName: string;
  totalRows: number;
  validRows: number;
  importedRows: number;
  status: 'success' | 'error';
  error?: string;
  preview: any[];
}

export async function processBulkFiles(files: Express.Multer.File[]): Promise<{
  sessionId: string;
  results: ProcessedFile[];
  totalImported: number;
}> {
  const sessionId = `session_${Date.now()}_${nanoid(8)}`;
  const results: ProcessedFile[] = [];
  let totalImported = 0;

  console.log(`Processing ${files.length} files for session ${sessionId}`);

  for (const file of files) {
    try {
      console.log(`Processing file: ${file.originalname}`);
      
      // Read Excel/CSV file
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON with headers
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: "",
        raw: false
      });

      console.log(`Found ${jsonData.length} rows in ${file.originalname}`);

      let validRows = 0;
      let importedRows = 0;
      const preview = [];

      // Process each row (skip header)
      for (let i = 1; i < jsonData.length; i++) { // Process all rows
        const row = jsonData[i] as string[];
        
        if (row && row.length > 0 && row[0] && String(row[0]).trim()) {
          const storeName = String(row[0]).trim();
          
          // Skip header rows
          if (storeName.toLowerCase().includes('store') || 
              storeName.toLowerCase().includes('name') ||
              storeName.toLowerCase().includes('company')) {
            continue;
          }

          validRows++;

          try {
            // Create store entry
            const storeData = {
              storeCode: `BULK_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
              storeName: storeName,
              address: (row[2] && String(row[2]).trim()) || '',
              contactPerson: (row[4] && String(row[4]).trim()) || null,
              phone: (row[5] && String(row[5]).trim()) || null,
              email: (row[6] && String(row[6]).trim()) || null,
              province: (row[1] && String(row[1]).trim()) || 'Unknown',
              city: (row[3] && String(row[3]).trim()) || 'Unknown',
              creditLimit: '0.00',
              storeType: 'hardware',
              isActive: true
            };

            await storage.createHardwareStore(storeData);
            importedRows++;
            totalImported++;

            // Add to preview (first 5 rows)
            if (preview.length < 5) {
              preview.push({
                storeName: storeData.storeName,
                province: storeData.province,
                city: storeData.city,
                status: 'imported'
              });
            }

            console.log(`✅ Imported: ${storeData.storeName}`);
          } catch (error) {
            console.error(`Error importing row ${i}:`, error);
          }
        }
      }

      results.push({
        fileName: file.originalname,
        totalRows: jsonData.length - 1, // Exclude header
        validRows,
        importedRows,
        status: 'success',
        preview
      });

      console.log(`✅ File processed: ${file.originalname} - ${importedRows} stores imported`);

    } catch (error) {
      console.error(`Error processing file ${file.originalname}:`, error);
      results.push({
        fileName: file.originalname,
        totalRows: 0,
        validRows: 0,
        importedRows: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        preview: []
      });
    }
  }

  console.log(`Bulk import completed: ${totalImported} total stores imported`);
  return { sessionId, results, totalImported };
}