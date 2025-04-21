
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import ProduitForm from "@/components/ProduitForm";
import { Produit } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { sauvegarderProduitComplet } from "@/lib/firebaseReglage";

const NouveauProduitPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (produit: Produit) => {
    try {
      console.log("Nouveau produit à ajouter:", produit);
      
      if (!produit.codeArticle || !produit.numeroLigne) {
        throw new Error("Le code article et le numéro de ligne sont requis pour enregistrer un produit");
      }
      
      // Convertir le produit en objet simple (Record<string, string>)
      const produitSimple: Record<string, string> = {};
      
      // Copier toutes les propriétés
      Object.entries(produit).forEach(([key, value]) => {
        // Skip id field si présent
        if (key === 'id') return;
        
        // Assurer que les valeurs sont des strings
        produitSimple[key] = String(value);
      });
      
      // Sauvegarder le produit complet
      await sauvegarderProduitComplet(produitSimple);
      
      toast({
        title: "Produit créé",
        description: `Le produit ${produit.designation} a été créé avec succès et enregistré dans la base de données.`,
      });
      
      // Redirection vers la page de recherche
      navigate("/recherche");
      
    } catch (error) {
      console.error("Erreur lors de l'enregistrement dans Firebase:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du produit: " + 
          (error instanceof Error ? error.message : "Erreur inconnue"),
      });
    }
  };

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          <span className="text-noir-800">Nouveau</span> <span className="text-jaune-300">produit</span>
        </h1>
        <ProduitForm onSubmit={handleSubmit} mode="create" />
      </div>
    </PageLayout>
  );
};

export default NouveauProduitPage;
