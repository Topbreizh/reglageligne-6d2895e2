
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Produit } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProduitLoadingSkeleton from "./ProduitLoadingSkeleton";
import ProduitNotFound from "./ProduitNotFound";
import ProduitForm from "@/components/ProduitForm";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { sauvegarderProduitComplet } from "@/lib/firebaseReglage";

interface ModifierProduitLoaderProps {
  mode: "edit";
}

const ModifierProduitLoader = ({ mode }: ModifierProduitLoaderProps) => {
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
          // S'assurer que tous les noms de champs utilisent la bonne casse
          const produitData: Produit = {
            id: docSnap.id,
            codeArticle: data.codeArticle || "",
            numeroLigne: data.numeroLigne || "",
            designation: data.designation || "Sans designation",
            poidsPate: data.poidsPate || "",
            poidsArticle: data.poidsArticle || "",
            quantitePate: data.quantitePate || "",
            // Respecter exactement la casse définie dans l'interface Produit
            poidPatequalistat: data.poidPatequalistat || "",
            poidFourragequalistat: data.poidFourragequalistat || "",
            poidMarquantqualistat: data.poidMarquantqualistat || "",
            nbrDeBandes: data.nbrDeBandes || "",
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
          
          console.log("Data loaded from Firebase:", {
            calculPate: {
              poidsPate: produitData.poidsPate,
              poidsArticle: produitData.poidsArticle,
              quantitePate: produitData.quantitePate,
              poidPatequalistat: produitData.poidPatequalistat,
              poidFourragequalistat: produitData.poidFourragequalistat,
              poidMarquantqualistat: produitData.poidMarquantqualistat,
              nbrDeBandes: produitData.nbrDeBandes
            }
          });
          
          setProduit(produitData);
        } else {
          toast({
            variant: "destructive",
            title: "Produit non trouvé",
            description: "Le produit demandé n'existe pas dans la base de données.",
          });
          setProduit(null);
        }
      } catch (error) {
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
        description: "Une erreur est survenue lors de l'enregistrement des modifications: " + 
          (error instanceof Error ? error.message : "Erreur inconnue"),
      });
    }
  };

  if (loading) return <ProduitLoadingSkeleton />;
  if (!produit) return <ProduitNotFound />;

  return (
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
  );
};

export default ModifierProduitLoader;
