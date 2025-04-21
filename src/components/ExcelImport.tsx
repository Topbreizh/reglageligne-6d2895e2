import { useState, useEffect } from "react";
import { ImportMapping, Produit } from "@/types";
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

const ExcelImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [mappings, setMappings] = useState<ImportMapping[]>([]);
  const [step, setStep] = useState(1);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
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
      
      setTimeout(() => {
        const mockHeaders = [
          "Code Article",
          "Numéro de ligne",
          "Désignation",
          "Programme",
          "Facteur",
          "Calibrage",
          "Vitesse",
          "Laminoir",
          "Farineur Haut 1",
          "Farineur Haut 2",
          "Farineur Haut 3",
          "Farineur Bas 1",
          "Farineur Bas 2",
          "Farineur Bas 3",
          "Queue de Carpe",
          "Numéro Découpe",
          "Buse",
          "Humidificateur 1-4-6",
          "Distributeur Choco/Raisin",
          "Vitesse Doreuse",
          "P1 Longueur Découpe",
          "P2 Centrage",
          "Bielle",
          "Lame Racleur",
          "Rademaker",
          "Aera",
          "Fritch",
          "Retourneur",
          "Aligneur",
          "Humidificateur 2-5",
          "Push Plaque",
          "Rouleau Inférieur",
          "Rouleau Supérieur",
          "Tapis Façonneuse",
          "Repère Poignée",
          "Rouleau Pression",
          "Tapis Avant Étuve Surgel",
          "Étuve Surgel",
          "Cadence",
          "Lamineur",
          "Surveillant",
          "Distributeur Raisin/Choco",
          "Pose",
          "Pliage/Triage",
          "Topping",
          "Sortie Étuve",
          "Ouverture MP",
          "Commentaire",
          "Règle Laminage",
          "Quick"
        ];
        
        const generateMockData = (count: number) => {
          const baseData = [
            {
              "Code Article": "P004",
              "Numéro de ligne": "3",
              "Désignation": "Chausson aux pommes",
              "Programme": "P40",
              "Facteur": "1.2",
              "Calibrage": "2.5",
              "Vitesse": "45",
              "Laminoir": "L1",
              "Farineur Haut 1": "3.2",
              "Farineur Haut 2": "2.2",
              "Farineur Haut 3": "1.2",
              "Farineur Bas 1": "2.4",
              "Farineur Bas 2": "2.1",
              "Farineur Bas 3": "1.9",
              "Queue de Carpe": "Oui",
              "Numéro Découpe": "7",
              "Buse": "B3",
              "Humidificateur 1-4-6": "H2",
              "Distributeur Choco/Raisin": "D1",
              "Vitesse Doreuse": "35",
              "P1 Longueur Découpe": "15",
              "P2 Centrage": "Centre",
              "Bielle": "B2",
              "Lame Racleur": "L3",
              "Rademaker": "R1",
              "Aera": "A2",
              "Fritch": "F3",
              "Retourneur": "On",
              "Aligneur": "3",
              "Humidificateur 2-5": "H1",
              "Push Plaque": "P2",
              "Rouleau Inférieur": "4",
              "Rouleau Supérieur": "5",
              "Tapis Façonneuse": "T3",
              "Repère Poignée": "2",
              "Rouleau Pression": "3",
              "Tapis Avant Étuve Surgel": "On",
              "Étuve Surgel": "220°C",
              "Cadence": "60",
              "Lamineur": "Dupont",
              "Surveillant": "Martin",
              "Distributeur Raisin/Choco": "Durand",
              "Pose": "Laurent",
              "Pliage/Triage": "Robert",
              "Topping": "Petit",
              "Sortie Étuve": "Simon",
              "Ouverture MP": "Bernard",
              "Commentaire": "RAS",
              "Règle Laminage": "Standard",
              "Quick": "Non"
            },
            {
              "Code Article": "P005",
              "Numéro de ligne": "1",
              "Désignation": "Croissant aux amandes",
              "Programme": "P32",
              "Facteur": "1.3",
              "Calibrage": "2.3",
              "Vitesse": "50",
              "Laminoir": "L2",
              "Farineur Haut 1": "3.0",
              "Farineur Haut 2": "2.0",
              "Farineur Haut 3": "1.0",
              "Farineur Bas 1": "2.5",
              "Farineur Bas 2": "2.0",
              "Farineur Bas 3": "1.5",
              "Queue de Carpe": "Non",
              "Numéro Découpe": "5",
              "Buse": "B2",
              "Humidificateur 1-4-6": "H1",
              "Distributeur Choco/Raisin": "D2",
              "Vitesse Doreuse": "40",
              "P1 Longueur Découpe": "12",
              "P2 Centrage": "Gauche",
              "Bielle": "B1",
              "Lame Racleur": "L2",
              "Rademaker": "R2",
              "Aera": "A1",
              "Fritch": "F2",
              "Retourneur": "Off",
              "Aligneur": "2",
              "Humidificateur 2-5": "H2",
              "Push Plaque": "P1",
              "Rouleau Inférieur": "3",
              "Rouleau Supérieur": "4",
              "Tapis Façonneuse": "T2",
              "Repère Poignée": "1",
              "Rouleau Pression": "2",
              "Tapis Avant Étuve Surgel": "Off",
              "Étuve Surgel": "200°C",
              "Cadence": "55",
              "Lamineur": "Lefèvre",
              "Surveillant": "Moreau",
              "Distributeur Raisin/Choco": "Dubois",
              "Pose": "Richard",
              "Pliage/Triage": "Thomas",
              "Topping": "Girard",
              "Sortie Étuve": "Morel",
              "Ouverture MP": "David",
              "Commentaire": "Ajuster température",
              "Règle Laminage": "Spécial",
              "Quick": "Oui"
            }
          ];
          
          const result = [...baseData];
          
          const mockData = generateMockData(10);
          
          setHeaders(mockHeaders);
          setPreviewData(mockData);

          const champsCibles = blocsConfiguration.flatMap((bloc) =>
            bloc.champs.map((champ) => ({
              id: champ.id,
              nom: champ.nom,
              blocNom: bloc.nom,
              nomTechnique: champ.nomTechnique,
            }))
          );
          
          const initialMappings = champsCibles.map(champApp => {
            const normalize = (str: string) => str.toLowerCase()
              .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
              .replace(/[\s-/]+/g, "");
            
            const findMatchingHeader = () => {
              const champNomNorm = normalize(champApp.nom);
              const champTechNorm = normalize(champApp.nomTechnique);
              
              let foundHeader = mockHeaders.find(header => normalize(header) === champNomNorm || normalize(header) === champTechNorm);
              if (foundHeader) return foundHeader;
              
              foundHeader = mockHeaders.find(header => {
                const headerNorm = normalize(header);
                return headerNorm.includes(champNomNorm) || champNomNorm.includes(headerNorm) ||
                       headerNorm.includes(champTechNorm) || champTechNorm.includes(headerNorm);
              });
              if (foundHeader) return foundHeader;
              
              switch(champApp.nomTechnique) {
                case "codeArticle":
                  return mockHeaders.find(h => normalize(h).includes("code") && normalize(h).includes("article"));
                case "numeroLigne":
                  return mockHeaders.find(h => normalize(h).includes("numero") && normalize(h).includes("ligne"));
                case "designation":
                  return mockHeaders.find(h => normalize(h).includes("designation") || normalize(h).includes("nom"));
                case "farineurHaut1":
                  return mockHeaders.find(h => normalize(h).includes("farineur") && normalize(h).includes("haut") && normalize(h).includes("1"));
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
        });
      }, 500);
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
