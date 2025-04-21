
import { useState } from "react";
import { ImportMapping } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Import } from "lucide-react";
import DataPreviewTable from "./DataPreviewTable";
import MappingTable from "./MappingTable";
import ImportActions from "./ImportActions";
import { sauvegarderProduitComplet } from "@/lib/firebaseReglage";
import { blocsConfiguration } from "@/data/blocConfig";
import * as XLSX from 'xlsx';

const ExcelImport = () => {
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
          
          // Convertir la feuille en JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length < 2) {
            reject(new Error("Le fichier ne contient pas assez de données"));
            return;
          }
          
          // La première ligne contient les en-têtes
          const headers = jsonData[0] as string[];
          
          // Les autres lignes sont les données
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
      
      // Lire le fichier comme un tableau binaire
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
      
      console.log("Headers détectés:", headers);
      console.log("Données détectées:", data);
      
      setHeaders(headers);
      setPreviewData(data);
      
      // Création du mapping automatique en fonction des en-têtes détectés
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
          if (!str) return ""; // Handle undefined or empty strings
          return str.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[\s-/]+/g, "");
        };
        
        const findMatchingHeader = () => {
          const champNomNorm = normalize(champApp.nom);
          const champTechNorm = normalize(champApp.nomTechnique || "");
          
          // Look for exact matches first
          let foundHeader = headers.find(header => 
            normalize(header) === champNomNorm || normalize(header) === champTechNorm
          );
          if (foundHeader) return foundHeader;
          
          // Look for partial matches
          foundHeader = headers.find(header => {
            const headerNorm = normalize(header);
            return headerNorm.includes(champNomNorm) || champNomNorm.includes(headerNorm) ||
                   headerNorm.includes(champTechNorm) || champTechNorm.includes(headerNorm);
          });
          if (foundHeader) return foundHeader;
          
          // Special case mappings
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

  const handleMappingChange = (champDestination: string, champSource: string) => {
    setMappings(
      mappings.map((mapping) =>
        mapping.champDestination === champDestination
          ? { ...mapping, champSource }
          : mapping
      )
    );
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

      setFile(null);
      setHeaders([]);
      setPreviewData([]);
      setMappings([]);
      setStep(1);
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

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-noir-200">
        <h2 className="section-title">Import de données depuis Excel</h2>
        <p className="mb-4 text-noir-600">
          Importez vos données de réglages ligne depuis un fichier Excel (.xlsx, .xls) ou CSV (.csv).
        </p>

        {step === 1 && (
          <div className="border-2 border-dashed border-noir-300 rounded-md p-8 text-center">
            <div className="mb-4">
              <Import className="h-12 w-12 mx-auto text-noir-400" />
            </div>
            <p className="mb-4 text-noir-600">
              Sélectionnez un fichier Excel ou CSV contenant vos données de réglages.
            </p>
            <Input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              className="hidden"
              accept=".xlsx,.xls,.csv"
            />
            <Label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-jaune-300 text-noir-800 rounded-md cursor-pointer hover:bg-jaune-400 transition-colors"
            >
              Sélectionner un fichier
            </Label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-noir-100 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Fichier sélectionné: {file?.name}</h3>
              <p className="text-sm text-noir-600">
                {previewData.length} lignes détectées avec {headers.length} colonnes.
              </p>
            </div>
            <DataPreviewTable headers={headers} previewData={previewData} />
            <MappingTable
              headers={headers}
              mappings={mappings}
              onChange={handleMappingChange}
            />
            <ImportActions
              onCancel={() => {
                setFile(null);
                setHeaders([]);
                setPreviewData([]);
                setMappings([]);
                setStep(1);
              }}
              onImport={processMappingAndImport}
              isLoading={isImporting}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelImport;
