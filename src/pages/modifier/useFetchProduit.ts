
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Produit } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function useFetchProduit() {
  const { id } = useParams<{ id: string }>();
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
            poidsPate: data.poidsPate || "",
            poidsArticle: data.poidsArticle || "",
            quantitePate: data.quantitePate || "",
            poidPatequalistat: data.poidPatequalistat || data.poidpatequalistat || data.PoidPatequalistat || "",
            poidFourragequalistat: data.poidFourragequalistat || data.poidfourragequalistat || data.PoidFourragequalistat || "",
            poidMarquantqualistat: data.poidMarquantqualistat || data.poidmarquantqualistat || data.PoidMarquantqualistat || "",
            nbrDeBandes: data.nbrDeBandes || data.nbrdebandes || data.NbrDeBandes || "",
            rognure: data.rognure || "",
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
          Object.keys(data).forEach(key => {
            if (!(key in produitData) && data[key]) {
              (produitData as any)[key] = data[key];
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

  return { produit, loading, id };
}
