import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import ProduitFiche from "@/components/ProduitFiche";
import { Produit } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
// Import the new print styles
import "@/styles/print/index.css";

const FicheProduitPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [produit, setProduit] = useState<Produit | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduit = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Récupération du document depuis Firestore
        const docRef = doc(db, "reglages", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Données brutes du produit:", data);
          
          // Conversion en objet Produit avec support pour champs dynamiques
          const produitData = {
            id: docSnap.id,
            ...data,
            // Propriétés requises avec valeurs par défaut (si absentes)
            codeArticle: data.codeArticle || "",
            numeroLigne: data.numeroLigne || "",
            designation: data.designation || "Sans designation",
          };
          
          console.log("Produit complet récupéré:", produitData);
          setProduit(produitData as Produit);
        } else {
          console.log("Aucun produit trouvé avec l'ID:", id);
          toast({
            variant: "destructive",
            title: "Produit non trouvé",
            description: "Le produit demandé n'existe pas dans la base de données.",
          });
          setProduit(null);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du produit:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les détails du produit.",
        });
        setProduit(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduit();
  }, [id, toast]);

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-5xl mx-auto text-center py-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jaune-300"></div>
          </div>
          <p className="mt-4 text-noir-600">Chargement des données du produit...</p>
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
    <PageLayout className="bg-gray-50 print:bg-white print:p-0 print:m-0">
      <div className="max-w-5xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden print:shadow-none print:rounded-none print:border-0 print:p-0">
        <div className="print:hidden p-4 bg-gray-100 border-b border-gray-200">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
        
        <div className="p-6 print:p-0">
          <ProduitFiche produit={produit} />
        </div>
      </div>
    </PageLayout>
  );
};

export default FicheProduitPage;
