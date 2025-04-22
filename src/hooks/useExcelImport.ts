
import { useImportState } from "./useImportState";
import { parseExcelFile } from "@/utils/excelParser";
import { generateInitialMappings } from "@/utils/fieldMapping";
import { useToast } from "@/hooks/use-toast";
import { sauvegarderProduitComplet } from "@/lib/firebaseReglage";
import { useState } from "react";
import { getBlocsConfiguration } from "@/lib/firebaseReglage";

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
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const selectedFile = files[0];
    console.log("Fichier sélectionné:", selectedFile.name, selectedFile.type);
    
    // Reset any previous error state
    setErrorMessage(undefined);
    
    if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      setErrorMessage("Format non supporté. Veuillez sélectionner un fichier Excel (.xlsx, .xls) ou CSV (.csv)");
      toast({
        title: "Format non supporté",
        description: "Veuillez sélectionner un fichier Excel (.xlsx, .xls) ou CSV (.csv)",
        variant: "destructive",
      });
      return;
    }
    
    setFile(selectedFile);
    setIsProcessing(true);
    
    try {
      console.log("Début de l'analyse du fichier");
      
      // Add timeout to let UI update before heavy processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { headers: parsedHeaders, data } = await parseExcelFile(selectedFile);
      console.log("Fichier analysé avec succès");
      
      // Ensure no empty headers (replace with generated titles if needed)
      const cleanedHeaders = parsedHeaders.map((header, index) => 
        (header && header.trim()) ? header.trim() : `Colonne ${index + 1}`
      );
      
      if (cleanedHeaders.length === 0) {
        setErrorMessage("Aucune colonne détectée dans le fichier");
        toast({
          title: "Fichier invalide",
          description: "Aucune colonne détectée dans le fichier",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
      
      if (data.length === 0) {
        setErrorMessage("Aucune donnée détectée dans le fichier");
        toast({
          title: "Fichier vide",
          description: "Aucune donnée détectée dans le fichier",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
      
      console.log("Données récupérées:", { headers: cleanedHeaders.length, data: data.length });
      setHeaders(cleanedHeaders);
      setPreviewData(data);
      
      const initialMappings = generateInitialMappings(cleanedHeaders);
      console.log("Mappings initiaux générés:", initialMappings);
      setMappings(initialMappings);
      setStep(2);
    } catch (error) {
      console.error("Erreur lors de l'importation du fichier:", error);
      const errorMsg = error instanceof Error 
        ? error.message 
        : "Impossible de lire le fichier. Vérifiez le format et réessayez.";
      
      setErrorMessage(errorMsg);
      toast({
        title: "Erreur lors de l'importation",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMappingChange = (champDestination: string, champSource: string) => {
    console.log(`Mise à jour du mapping: ${champDestination} => ${champSource}`);
    
    // Vérifier si le mapping existe déjà
    const existingMappingIndex = mappings.findIndex(
      (mapping) => mapping.champDestination === champDestination
    );

    // Créer une copie du tableau de mappings
    const updatedMappings = [...mappings];

    if (existingMappingIndex !== -1) {
      // Mettre à jour le mapping existant
      updatedMappings[existingMappingIndex] = { 
        ...updatedMappings[existingMappingIndex], 
        champSource 
      };
    } else {
      // Ajouter un nouveau mapping
      updatedMappings.push({ champDestination, champSource });
    }

    console.log("Nouveaux mappings:", updatedMappings);
    setMappings(updatedMappings);
  };

  const processMappingAndImport = async () => {
    try {
      setIsImporting(true);
      console.log("Début de l'importation avec les mappings suivants:", mappings);

      // Charger la configuration des blocs pour vérifier la visibilité
      const blocsConfig = await getBlocsConfiguration();
      if (!blocsConfig) {
        throw new Error("Impossible de charger la configuration des blocs");
      }

      // Récupérer les champs requis qui sont visibles
      const visibleRequiredFields = blocsConfig
        .filter(bloc => bloc.visible)
        .flatMap(bloc => 
          bloc.champs
            .filter(champ => champ.visible && ["codeArticle", "numeroLigne", "designation"].includes(champ.nomTechnique))
            .map(champ => champ.nomTechnique)
        );

      const missingRequired = visibleRequiredFields.filter(field =>
        !mappings.find(m => m.champDestination === field && m.champSource !== "none")
      );

      if (missingRequired.length > 0) {
        toast({
          title: "Mapping incomplet",
          description: `Veuillez mapper les champs obligatoires visibles: ${missingRequired.join(", ")}`,
          variant: "destructive",
        });
        setIsImporting(false);
        return;
      }

      // Filtrer les mappings pour ne garder que ceux avec une valeur source != "none"
      const activeMappings = mappings.filter(mapping => mapping.champSource !== "none");
      console.log("Mappings actifs pour l'importation:", activeMappings);

      // Filtrer les mappings pour ne garder que les champs visibles
      const visibleMappings = activeMappings.filter(mapping => {
        const [blocFound] = blocsConfig.filter(bloc => 
          bloc.visible && bloc.champs.some(champ => 
            champ.visible && champ.nomTechnique === mapping.champDestination
          )
        );
        return blocFound !== undefined;
      });

      console.log("Mappings visibles filtrés:", visibleMappings);

      const produitsToSave = previewData.map(row => {
        const produit: Record<string, string> = {};

        visibleMappings.forEach(mapping => {
          if (mapping.champSource !== "none") {
            produit[mapping.champDestination] = row[mapping.champSource] || "";
          }
        });

        return produit;
      });

      console.log(`${produitsToSave.length} produits à sauvegarder`);

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
    isProcessing,
    errorMessage,
    handleFileChange,
    handleMappingChange,
    processMappingAndImport,
    resetForm
  };
};
