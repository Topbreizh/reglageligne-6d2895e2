
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getBlocsConfiguration, sauvegarderProduitComplet } from "@/lib/firebaseReglage";
import { ImportMapping } from "@/types";

export const useImportProcess = () => {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const processMappingAndImport = async (mappings: ImportMapping[], previewData: any[]) => {
    try {
      setIsImporting(true);
      console.log("Début de l'importation avec les mappings suivants:", mappings);

      const blocsConfig = await getBlocsConfiguration();
      if (!blocsConfig) {
        throw new Error("Impossible de charger la configuration des blocs");
      }

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
        return false;
      }

      const activeMappings = mappings.filter(mapping => mapping.champSource !== "none");
      const visibleMappings = activeMappings.filter(mapping => {
        const [blocFound] = blocsConfig.filter(bloc => 
          bloc.visible && bloc.champs.some(champ => 
            champ.visible && champ.nomTechnique === mapping.champDestination
          )
        );
        return blocFound !== undefined;
      });

      const produitsToSave = previewData.map(row => {
        const produit: Record<string, string> = {};
        visibleMappings.forEach(mapping => {
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

      return true;
    } catch (error) {
      console.error("Erreur lors de l'importation", error);
      toast({
        title: "Erreur d'importation",
        description: "Une erreur s'est produite lors de l'importation des données.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isImporting,
    processMappingAndImport
  };
};
