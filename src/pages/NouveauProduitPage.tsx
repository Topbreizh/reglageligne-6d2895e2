
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import ProduitForm from "@/components/ProduitForm";
import { Produit } from "@/types";
import { useToast } from "@/hooks/use-toast";

const NouveauProduitPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (produit: Produit) => {
    // Dans un vrai système, on enverrait les données à une API
    console.log("Nouveau produit ajouté:", produit);

    toast({
      title: "Produit créé",
      description: `Le produit ${produit.designation} a été créé avec succès.`,
    });

    // Redirection vers la page de recherche
    navigate("/recherche");
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
