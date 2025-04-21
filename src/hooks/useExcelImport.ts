
import { useState } from "react";
import { ImportMapping } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sauvegarderProduitComplet } from "@/lib/firebaseReglage";
import { blocsConfiguration } from "@/data/blocConfig";
import * as XLSX from 'xlsx';

export const useExcelImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [mappings, setMappings] = useState<ImportMapping[]>([]);
  const [step, setStep] = useState(1);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const parseExcelFile = (file: File): Promise<{ headers: string[], data: any[] }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
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
      
      reader.readAsBinaryString(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const selectedFile = files[0];
    
    if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      toast({
        title: "Format non supporté",
        description: "Veuillez sélectionner un fichier Excel (.xlsx, .xls) ou CSV (.csv)",
        variant: "destructive",
      });
      return;
    }
    
    setFile(selectedFile);
    
    try {
      const { headers, data } = await parseExcelFile(selectedFile);
      
      if (headers.length === 0) {
        toast({
          title: "Fichier invalide",
          description: "Aucune colonne détectée dans le fichier",
          variant: "destructive",
        });
        return;
      }
      
      if (data.length === 0) {
        toast({
          title: "Fichier vide",
          description: "Aucune donnée détectée dans le fichier",
          variant: "destructive",
        });
        return;
      }
      
      setHeaders(headers);
      setPreviewData(data);
      
      const champsCibles = blocsConfiguration.flatMap((bloc) =>
        bloc.champs.map((champ) => ({
          id: champ.id,
          nom: champ.nom,
          blocNom: bloc.nom,
          nomTechnique: champ.nomTechnique,
        }))
      );
      
      const initialMappings = champsCibles.map(champApp => {
        const normalize = (str: string) => {
          if (!str) return "";
          return str.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[\s-/]+/g, "");
        };
        
        const findMatchingHeader = () => {
          const champNomNorm = normalize(champApp.nom);
          const champTechNorm = normalize(champApp.nomTechnique || "");
          
          let foundHeader = headers.find(header => 
            normalize(header) === champNomNorm || normalize(header) === champTechNorm
          );
          if (foundHeader) return foundHeader;
          
          foundHeader = headers.find(header => {
            const headerNorm = normalize(header);
            return headerNorm.includes(champNomNorm) || champNomNorm.includes(headerNorm) ||
                   headerNorm.includes(champTechNorm) || champTechNorm.includes(headerNorm);
          });
          if (foundHeader) return foundHeader;
          
          switch(champApp.nomTechnique) {
            case "codeArticle":
              return headers.find(h => normalize(h).includes("code") && normalize(h).includes("article"));
            case "numeroLigne":
              return headers.find(h => normalize(h).includes("numero") && normalize(h).includes("ligne"));
            case "designation":
              return headers.find(h => normalize(h).includes("designation") || normalize(h).includes("nom"));
            case "farineurHaut1":
              return headers.find(h => normalize(h).includes("farineur") && normalize(h).includes("haut") && normalize(h).includes("1"));
          }
          
          return null;
        };
        
        const matchedHeader = findMatchingHeader();
        
        return {
          champSource: matchedHeader || "none",
          champDestination: champApp.nomTechnique
        };
      });
      
      setMappings(initialMappings);
      setStep(2);
    } catch (error) {
      console.error("Erreur lors de l'importation du fichier:", error);
      toast({
        title: "Erreur lors de l'importation",
        description: "Impossible de lire le fichier. Vérifiez le format et réessayez.",
        variant: "destructive",
      });
    }
  };

  const processMappingAndImport = async () => {
    try {
      setIsImporting(true);

      const requiredFields = ["codeArticle", "numeroLigne", "designation"];
      const missingRequired = requiredFields.filter(field =>
        !mappings.find(m => m.champDestination === field && m.champSource !== "none")
      );

      if (missingRequired.length > 0) {
        toast({
          title: "Mapping incomplet",
          description: `Veuillez mapper les champs obligatoires: ${missingRequired.join(", ")}`,
          variant: "destructive",
        });
        setIsImporting(false);
        return;
      }

      const produitsToSave = previewData.map(row => {
        const produit: Record<string, string> = {};

        mappings.forEach(mapping => {
          if (mapping.champSource !== "none") {
            produit[mapping.champDestination] = row[mapping.champSource] || "";
          }
        });

        return produit;
      });

      const savePromises = produitsToSave.map(produit => {
        if (!produit.codeArticle || !produit.numeroLigne) {
          console.error("Produit sans identifiant complet", produit);
          return Promise.resolve(false);
        }

        return sauvegarderProduitComplet(produit)
          .then(() => true)
          .catch(err => {
            console.error("Erreur lors de l'enregistrement", err, produit);
            return false;
          });
      });

      const results = await Promise.all(savePromises);
      const successCount = results.filter(r => r).length;

      if (successCount === produitsToSave.length) {
        toast({
          title: "Importation réussie",
          description: `${successCount} produits ont été importés avec succès.`,
        });
      } else {
        toast({
          title: "Importation partielle",
          description: `${successCount}/${produitsToSave.length} produits ont été importés. Vérifiez les erreurs dans la console.`,
          variant: "destructive",
        });
      }

      resetForm();
    } catch (error) {
      console.error("Erreur lors de l'importation", error);
      toast({
        title: "Erreur d'importation",
        description: "Une erreur s'est produite lors de l'importation des données.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setHeaders([]);
    setPreviewData([]);
    setMappings([]);
    setStep(1);
  };

  const handleMappingChange = (champDestination: string, champSource: string) => {
    setMappings(
      mappings.map((mapping) =>
        mapping.champDestination === champDestination
          ? { ...mapping, champSource }
          : mapping
      )
    );
  };

  return {
    file,
    headers,
    previewData,
    mappings,
    step,
    isImporting,
    handleFileChange,
    handleMappingChange,
    processMappingAndImport,
    resetForm
  };
};
