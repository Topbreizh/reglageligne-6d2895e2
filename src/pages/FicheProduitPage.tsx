
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import ProduitFiche from "@/components/ProduitFiche";
import { Produit } from "@/types";
import { produitsInitiaux } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const FicheProduitPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
    <PageLayout className="bg-gray-50 print:bg-white print:p-0">
      <div className="max-w-5xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden print:shadow-none print:rounded-none">
        <div className="no-print p-4 bg-gray-100 border-b border-gray-200">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
        
        <div className="p-6">
          <ProduitFiche produit={produit} />
        </div>
      </div>
    </PageLayout>
  );
};

export default FicheProduitPage;
