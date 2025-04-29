
import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import SearchBox from "@/components/SearchBox";
import ProduitsList from "@/components/ProduitsList";
import { Produit } from "@/types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ReglageFirebase, getReglage } from "@/lib/firebaseReglage";
import { useToast } from "@/hooks/use-toast";

const RecherchePage = () => {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [filteredProduits, setFilteredProduits] = useState<Produit[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        setIsSearching(true);
        
        const reglagesCollection = collection(db, "reglages");
        const querySnapshot = await getDocs(reglagesCollection);
        
        if (!querySnapshot.empty) {
          const produitsFirebase: Produit[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data() as ReglageFirebase;
            
            if (data.codeArticle && data.numeroLigne) {
              const produit: Produit = {
                id: doc.id,
                codeArticle: data.codeArticle || "",
                numeroLigne: data.numeroLigne || "",
                designation: data.designation || "Sans designation",
                poidsPate: data.poidsPate || "",
                poidsArticle: data.poidsArticle || "",
                quantitePate: data.quantitePate || "",
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
                commentaire: data.commentaire || ""
              };
              
              Object.entries(data).forEach(([key, value]) => {
                if (key !== 'id') {
                  (produit as any)[key] = value || "";
                }
              });
              
              produitsFirebase.push(produit);
            }
          });
          
          setProduits(produitsFirebase);
          setFilteredProduits(produitsFirebase);
          console.log("Produits chargés depuis Firebase:", produitsFirebase);
        } else {
          console.log("Aucun produit trouvé dans Firebase");
          toast({
            variant: "destructive",
            title: "Aucun produit",
            description: "Aucun produit n'a été trouvé dans la base de données.",
          });
          setProduits([]);
          setFilteredProduits([]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
        toast({
          variant: "destructive",
          title: "Erreur de chargement",
          description: "Impossible de charger les données depuis Firebase.",
        });
        setProduits([]);
        setFilteredProduits([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchProduits();
  }, [toast]);

  const handleSearch = async (codeArticle: string, numeroLigne: string, designation: string) => {
    setIsSearching(true);

    try {
      if (!codeArticle && !numeroLigne && !designation) {
        setFilteredProduits(produits);
        setIsSearching(false);
        return;
      }

      const results = produits.filter((produit) => {
        const matchCodeArticle = codeArticle
          ? produit.codeArticle.toLowerCase().includes(codeArticle.toLowerCase())
          : true;
        const matchNumeroLigne = numeroLigne
          ? produit.numeroLigne.toLowerCase().includes(numeroLigne.toLowerCase())
          : true;
        const matchDesignation = designation
          ? produit.designation.toLowerCase().includes(designation.toLowerCase())
          : true;

        return matchCodeArticle && matchNumeroLigne && matchDesignation;
      });
      
      console.log("Résultats de recherche:", results);
      setFilteredProduits(results);
      
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      toast({
        variant: "destructive",
        title: "Erreur de recherche",
        description: "Une erreur est survenue lors de la recherche.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          <span className="text-noir-800">Fiche de</span> <span className="text-jaune-300">réglage</span>
        </h1>

        <div className="space-y-6">
          <SearchBox onSearch={handleSearch} />

          {isSearching ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jaune-300"></div>
            </div>
          ) : (
            <ProduitsList produits={filteredProduits} />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default RecherchePage;
