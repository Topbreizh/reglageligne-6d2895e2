
import * as XLSX from 'xlsx';

export interface ParsedExcelData {
  headers: string[];
  data: any[];
}

export const parseExcelFile = (file: File): Promise<ParsedExcelData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          reject(new Error("Le fichier ne contient pas assez de données"));
          return;
        }
        
        const headers = jsonData[0] as string[];
        
        const rows = jsonData.slice(1).map(row => {
          const rowData: Record<string, any> = {};
          (row as any[]).forEach((cell, index) => {
            if (index < headers.length) {
              rowData[headers[index]] = cell !== undefined ? String(cell) : "";
            }
          });
          return rowData;
        });
        
        resolve({ headers, data: rows });
      } catch (error) {
        console.error("Erreur lors de l'analyse du fichier Excel:", error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Erreur lors de la lecture du fichier"));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
