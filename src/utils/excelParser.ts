
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
        
        // Set a limit on file size to prevent browser freezing
        if (file.size > 20 * 1024 * 1024) { // 20MB limit
          reject(new Error("Le fichier est trop volumineux (max 20MB)"));
          return;
        }
        
        // Parse with timeout to prevent UI blocking
        setTimeout(() => {
          try {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            
            if (!firstSheetName) {
              reject(new Error("Aucune feuille trouvée dans le fichier Excel"));
              return;
            }
            
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Limit rows to prevent browser freezing (max 1000 rows)
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
              header: 1,
              range: 0,
              defval: ""
            });
            
            if (jsonData.length < 2) {
              reject(new Error("Le fichier ne contient pas assez de données"));
              return;
            }
            
            let headers = jsonData[0] as string[];
            
            // Ensure no empty headers by replacing them with generated names
            headers = headers.map((header, index) => {
              const headerStr = String(header || "").trim();
              return headerStr || `Colonne ${index + 1}`;
            });
            
            // Ensure unique header names
            const uniqueHeaders = new Map<string, number>();
            headers = headers.map((header, index) => {
              const count = uniqueHeaders.get(header) || 0;
              uniqueHeaders.set(header, count + 1);
              return count > 0 ? `${header} (${count})` : header;
            });
            
            // Limit to max 1000 rows to prevent performance issues
            const maxRows = Math.min(jsonData.length - 1, 1000);
            
            const rows = jsonData.slice(1, maxRows + 1).map(row => {
              const rowData: Record<string, any> = {};
              (row as any[]).forEach((cell, index) => {
                if (index < headers.length) {
                  const header = headers[index];
                  if (header) { // Vérifier que l'en-tête n'est pas vide
                    rowData[header] = cell !== undefined ? String(cell) : "";
                  }
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
        }, 100); // Small timeout to let UI update
        
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
