
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Produit } from "@/types";

export const useReleveSearch = () => {
  const [produit, setProduit] = useState<Produit | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (codeArticle: string, numeroLigne: string) => {
    if (!codeArticle || !numeroLigne) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Le code article et le numéro de ligne sont requis."
      });
      return;
    }

    setLoading(true);
    try {
      const id = `${codeArticle}_${numeroLigne}`;
      const docRef = doc(db, "reglages", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Données brutes récupérées:", data);
        
        const produitData: Record<string, string> = {};
        
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === 'string') {
            produitData[key] = value;
          } else if (value !== null && value !== undefined) {
            produitData[key] = String(value);
          } else {
            produitData[key] = "";
          }
        });
        
        const produitComplet = {
          id: docSnap.id,
          codeArticle: data.codeArticle || "",
          numeroLigne: data.numeroLigne || "",
          designation: data.designation || "Sans designation",
          ...produitData
        } as Produit;
        
        console.log("Produit après traitement:", produitComplet);
        setProduit(produitComplet);
      } else {
        toast({
          variant: "destructive",
          title: "Produit non trouvé",
          description: "Aucun produit ne correspond à ces critères."
        });
        setProduit(null);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la recherche."
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    produit,
    loading,
    handleSearch
  };
};
