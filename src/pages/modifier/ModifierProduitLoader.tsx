
import ProduitForm from "@/components/ProduitForm";
import { Produit } from "@/types";
import ProduitLoadingSkeleton from "./ProduitLoadingSkeleton";
import ProduitNotFound from "./ProduitNotFound";
import useFetchProduit from "./useFetchProduit";
import ProduitModifierHeader from "./ProduitModifierHeader";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { sauvegarderProduitComplet } from "@/lib/firebaseReglage";

interface ModifierProduitLoaderProps {
  mode: "edit";
}

const ModifierProduitLoader = ({ mode }: ModifierProduitLoaderProps) => {
  const { produit, loading, id } = useFetchProduit();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (produitModifie: Produit) => {
    try {
      if (!produitModifie.codeArticle || !produitModifie.numeroLigne) {
        throw new Error("Le code article et le numéro de ligne sont requis pour enregistrer un produit");
      }
      const produitAEnregistrer: Record<string, string> = {};
      Object.entries(produitModifie).forEach(([key, value]) => {
        if (key !== 'id') {
          produitAEnregistrer[key] = String(value);
        }
      });
      await sauvegarderProduitComplet(produitAEnregistrer);
      toast({
        title: "Produit modifié",
        description: `Le produit ${produitModifie.designation} a été modifié avec succès et enregistré dans la base de données.`,
      });
      if (id) navigate(`/fiche/${id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'enregistrement des modifications: " +
          (error instanceof Error ? error.message : "Erreur inconnue"),
      });
    }
  };

  if (loading) return <ProduitLoadingSkeleton />;
  if (!produit) return <ProduitNotFound />;
  return (
    <div className="max-w-5xl mx-auto">
      <ProduitModifierHeader designation={produit.designation} />
      <ProduitForm produit={produit} onSubmit={handleSubmit} mode="edit" />
    </div>
  );
};

export default ModifierProduitLoader;
