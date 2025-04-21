
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
        if (!data) {
          reject(new Error("Échec de lecture du fichier"));
          return;
        }
        
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        
        if (!firstSheetName) {
          reject(new Error("Aucune feuille trouvée dans le fichier Excel"));
          return;
        }
        
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Utilisation de sheet_to_json avec { header: 1 } pour obtenir un tableau de tableaux
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
        
        console.log("Parsing réussi:", { headers: headers.length, rows: rows.length });
        resolve({ headers, data: rows });
      } catch (error) {
        console.error("Erreur lors de l'analyse du fichier Excel:", error);
        reject(error);
      }
    };
    
    reader.onerror = (event) => {
      console.error("Erreur de lecture du fichier:", event);
      reject(new Error("Erreur lors de la lecture du fichier"));
    };
    
    // Utilisation de readAsArrayBuffer pour une meilleure compatibilité
    reader.readAsArrayBuffer(file);
  });
};
