
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import ProduitForm from "@/components/ProduitForm";
import { Produit } from "@/types";
import { produitsInitiaux } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { setReglage, getReglage } from "@/lib/firebaseReglage";

const ModifierProduitPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [produit, setProduit] = useState<Produit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dans un vrai système, on chargerait les données depuis une API
    const fetchProduit = () => {
      setLoading(true);
      
      // Simuler un appel API
      setTimeout(() => {
        const found = produitsInitiaux.find(p => p.id === id);
        if (found) {
          setProduit(found);
        }
        setLoading(false);
      }, 300);
    };

    fetchProduit();
  }, [id]);

  const handleSubmit = async (produitModifie: Produit) => {
    try {
      console.log("Produit modifié:", produitModifie);
      
      // Sauvegarde chaque champ du produit modifié dans Firebase
      const champsProduit = Object.entries(produitModifie);
      for (const [champ, valeur] of champsProduit) {
        // Skip id field
        if (champ === 'id') continue;
        
        // Assurer que les valeurs sont des strings
        const valeurString = String(valeur);
        
        // Enregistrer chaque champ dans Firebase
        await setReglage(
          produitModifie.codeArticle,
          produitModifie.numeroLigne,
          champ,
          valeurString
        );
      }

      toast({
        title: "Produit modifié",
        description: `Le produit ${produitModifie.designation} a été modifié avec succès et enregistré dans la base de données.`,
      });

      // Redirection vers la fiche produit
      navigate(`/fiche/${id}`);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement dans Firebase:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des modifications.",
      });
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-5xl mx-auto text-center py-12">
          Chargement des données du produit...
        </div>
      </PageLayout>
    );
  }

  if (!produit) {
    return (
      <PageLayout>
        <div className="max-w-5xl mx-auto text-center py-12">
          <h2 className="text-xl font-bold mb-4">Produit non trouvé</h2>
          <p className="mb-4">Le produit demandé n'existe pas ou a été supprimé.</p>
          <Button onClick={() => navigate("/recherche")} className="bg-jaune-300 text-noir-800 hover:bg-jaune-400">
            Retour à la recherche
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">
            <span className="text-noir-800">Modifier</span> <span className="text-jaune-300">{produit.designation}</span>
          </h1>
        </div>
        
        <ProduitForm produit={produit} onSubmit={handleSubmit} mode="edit" />
      </div>
    </PageLayout>
  );
};

export default ModifierProduitPage;
