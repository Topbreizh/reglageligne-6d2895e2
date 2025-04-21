
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import ProduitForm from "@/components/ProduitForm";
import { Produit } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { setReglage } from "@/lib/firebaseReglage";

const NouveauProduitPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (produit: Produit) => {
    try {
      console.log("Nouveau produit ajouté:", produit);
      
      // Sauvegarde chaque champ du produit dans Firebase
      const champsProduit = Object.entries(produit);
      for (const [champ, valeur] of champsProduit) {
        // Skip id field
        if (champ === 'id') continue;
        
        // Assurer que les valeurs sont des strings
        const valeurString = String(valeur);
        
        // Enregistrer chaque champ dans Firebase
        await setReglage(
          produit.codeArticle,
          produit.numeroLigne,
          champ,
          valeurString
        );
      }

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
        description: "Une erreur est survenue lors de l'enregistrement du produit.",
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
