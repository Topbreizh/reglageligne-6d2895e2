import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import ProduitForm from "@/components/ProduitForm";
import { Produit } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sauvegarderProduitComplet } from "@/lib/firebaseReglage";

const ModifierProduitPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [produit, setProduit] = useState<Produit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduit = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const docRef = doc(db, "reglages", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          const produitData: Produit = {
            id: docSnap.id,
            codeArticle: data.codeArticle || "",
            numeroLigne: data.numeroLigne || "",
            designation: data.designation || "Sans designation",
            programme: data.programme || "",
            facteur: data.facteur || "",
            regleLaminage: data.regleLaminage || "",
            quick: data.quick || "",
            calibreur1: data.calibreur1 || "",
            calibreur2: data.calibreur2 || "",
            calibreur3: data.calibreur3 || "",
            laminoir: data.laminoir || "",
            vitesseLaminage: data.vitesseLaminage || "",
            farineurHaut1: data.farineurHaut1 || "",
            farineurHaut2: data.farineurHaut2 || "",
            farineurHaut3: data.farineurHaut3 || "",
            farineurBas1: data.farineurBas1 || "",
            farineurBas2: data.farineurBas2 || "",
            farineurBas3: data.farineurBas3 || "",
            queueDeCarpe: data.queueDeCarpe || "",
            numeroDecoupe: data.numeroDecoupe || "",
            buse: data.buse || "",
            distributeurChocoRaisin: data.distributeurChocoRaisin || "",
            humidificateur146: data.humidificateur146 || "",
            vitesseDoreuse: data.vitesseDoreuse || "",
            p1LongueurDecoupe: data.p1LongueurDecoupe || "",
            p2Centrage: data.p2Centrage || "",
            bielle: data.bielle || "",
            lameRacleur: data.lameRacleur || "",
            rademaker: data.rademaker || "",
            aera: data.aera || "",
            fritch: data.fritch || "",
            retourneur: data.retourneur || "",
            aligneur: data.aligneur || "",
            humidificateur25: data.humidificateur25 || "",
            pushPlaque: data.pushPlaque || "",
            rouleauInferieur: data.rouleauInferieur || "",
            rouleauSuperieur: data.rouleauSuperieur || "",
            tapisFaconneuse: data.tapisFaconneuse || "",
            reperePoignee: data.reperePoignee || "",
            rouleauPression: data.rouleauPression || "",
            tapisAvantEtuveSurgel: data.tapisAvantEtuveSurgel || "",
            etuveSurgel: data.etuveSurgel || "",
            cadence: data.cadence || "",
            lamineur: data.lamineur || "",
            surveillant: data.surveillant || "",
            distributeurRaisinChoco: data.distributeurRaisinChoco || "",
            pose: data.pose || "",
            pliageTriage: data.pliageTriage || "",
            topping: data.topping || "",
            sortieEtuve: data.sortieEtuve || "",
            ouvertureMP: data.ouvertureMP || "",
            commentaire: data.commentaire || "",
          };
          
          console.log("Produit à modifier récupéré depuis Firebase:", produitData);
          setProduit(produitData);
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

  const handleSubmit = async (produitModifie: Produit) => {
    try {
      console.log("Produit à modifier:", produitModifie);
      
      if (!produitModifie.codeArticle || !produitModifie.numeroLigne) {
        throw new Error("Le code article et le numéro de ligne sont requis pour enregistrer un produit");
      }
      
      const { id, ...produitSansId } = produitModifie;
      
      await sauvegarderProduitComplet(produitSansId);
      
      toast({
        title: "Produit modifié",
        description: `Le produit ${produitModifie.designation} a été modifié avec succès et enregistré dans la base de données.`,
      });
      
      navigate(`/fiche/${id}`);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement dans Firebase:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des modifications: " + 
          (error instanceof Error ? error.message : "Erreur inconnue"),
      });
    }
  };

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
            <span className="text-noir-800">Modifier</span> <span className="text-jaune-300">{produit?.designation}</span>
          </h1>
        </div>
        
        <ProduitForm produit={produit} onSubmit={handleSubmit} mode="edit" />
      </div>
    </PageLayout>
  );
};

export default ModifierProduitPage;
