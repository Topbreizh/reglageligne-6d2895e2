
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";

const ProduitNotFound = () => {
  const navigate = useNavigate();
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
};

export default ProduitNotFound;
