
import { useImportState } from "./useImportState";
import { parseExcelFile } from "@/utils/excelParser";
import { generateInitialMappings } from "@/utils/fieldMapping";
import { useToast } from "@/hooks/use-toast";
import { sauvegarderProduitComplet } from "@/lib/firebaseReglage";

export const useExcelImport = () => {
  const {
    file,
    setFile,
    headers,
    setHeaders,
    previewData,
    setPreviewData,
    mappings,
    setMappings,
    step,
    setStep,
    isImporting,
    setIsImporting,
    resetForm
  } = useImportState();
  
  const { toast } = useToast();

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
      const { headers: parsedHeaders, data } = await parseExcelFile(selectedFile);
      
      if (parsedHeaders.length === 0) {
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
      
      setHeaders(parsedHeaders);
      setPreviewData(data);
      
      const initialMappings = generateInitialMappings(parsedHeaders);
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
