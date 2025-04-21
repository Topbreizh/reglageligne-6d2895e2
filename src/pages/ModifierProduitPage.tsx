
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import ProduitForm from "@/components/ProduitForm";
import { Produit } from "@/types";
import { produitsInitiaux } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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

  const handleSubmit = (produitModifie: Produit) => {
    // Dans un vrai système, on enverrait les données à une API
    console.log("Produit modifié:", produitModifie);

    toast({
      title: "Produit modifié",
      description: `Le produit ${produitModifie.designation} a été modifié avec succès.`,
    });

    // Redirection vers la fiche produit
    navigate(`/fiche/${id}`);
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
