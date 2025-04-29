
import { useState, useEffect, useCallback } from "react";
import { BlocConfiguration, Produit } from "@/types";
import { blocsConfiguration as defaultBlocsConfig } from "@/data/blocConfig";
import { getBlocsConfiguration } from "@/lib/firebaseReglage";

export const useProduitFicheBlocs = (produit: Produit) => {
  const [blocsConfig, setBlocsConfig] = useState<BlocConfiguration[]>(defaultBlocsConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlocsConfig = async () => {
      try {
        setLoading(true);
        const savedConfig = await getBlocsConfiguration();
        
        if (savedConfig && savedConfig.length > 0) {
          console.log("Configuration des blocs chargée pour la fiche:", savedConfig);
          setBlocsConfig(savedConfig);
        } else {
          console.log("Aucune configuration personnalisée trouvée, utilisation de la configuration par défaut");
          setBlocsConfig(defaultBlocsConfig);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la configuration des blocs:", error);
        setBlocsConfig(defaultBlocsConfig);
      } finally {
        setLoading(false);
      }
    };

    fetchBlocsConfig();
  }, []);

  const estChampVisible = useCallback((blocId: string, champId: string) => {
    const bloc = blocsConfig.find(b => b.id === blocId);
    if (!bloc || !bloc.visible) return false;
    
    const champ = bloc.champs.find(c => c.id === champId);
    if (!champ || !champ.visible) return false;
    
    // Si c'est le bloc calculPate, on s'assure que les champs importants sont toujours visibles
    if (blocId === "calculPate") {
      const champsImportants = ["poidsPate", "poidPatequalistat", "poidFourragequalistat", "poidMarquantqualistat", "nbrDeBandes"];
      if (champsImportants.includes(champ.nomTechnique)) return true;
    }
    
    if (produit.numeroLigne && champ.lignesApplicables.length > 0) {
      if (champ.lignesApplicables.includes("*")) return true;
      if (champ.lignesApplicables.includes(produit.numeroLigne)) return true;
      return false;
    }
    
    return true;
  }, [blocsConfig, produit.numeroLigne]);

  const estBlocVisible = useCallback((blocId: string) => {
    const bloc = blocsConfig.find(b => b.id === blocId);
    if (!bloc || !bloc.visible) return false;
    
    // On s'assure que le bloc calculPate est toujours visible
    if (blocId === "calculPate") return true;
    
    if (produit.numeroLigne && bloc.lignesApplicables.length > 0) {
      if (!bloc.lignesApplicables.includes("*")) {
        return bloc.lignesApplicables.includes(produit.numeroLigne);
      }
    }
    
    if ((blocId === "guillotine" || blocId === "distributeurCreme") && produit.numeroLigne) {
      return !["2", "5"].includes(produit.numeroLigne);
    }
    
    if (blocId === "faconnage146" && produit.numeroLigne) {
      return ["1", "4", "6"].includes(produit.numeroLigne);
    }
    
    if (blocId === "faconnage25" && produit.numeroLigne) {
      return ["2", "5"].includes(produit.numeroLigne);
    }
    
    return true;
  }, [blocsConfig, produit.numeroLigne]);

  const getChampValeur = useCallback((champTechnique: string) => {
    if (!produit[champTechnique as keyof Produit]) {
      console.log(`Champ "${champTechnique}" non trouvé dans le produit:`, produit);
    }
    return produit[champTechnique as keyof Produit] || "-";
  }, [produit]);

  const getVisibleBlocs = useCallback(() => {
    return blocsConfig
      .filter(bloc => estBlocVisible(bloc.id))
      .sort((a, b) => a.ordre - b.ordre);
  }, [blocsConfig, estBlocVisible]);

  return { 
    loading, 
    estChampVisible, 
    estBlocVisible, 
    getChampValeur,
    getVisibleBlocs
  };
};
