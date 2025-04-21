import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import SearchBox from "@/components/SearchBox";
import ProduitsList from "@/components/ProduitsList";
import { Produit } from "@/types";
import { produitsInitiaux } from "@/data/mockData";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ReglageFirebase } from "@/lib/firebaseReglage";
import { useToast } from "@/hooks/use-toast";

const RecherchePage = () => {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [filteredProduits, setFilteredProduits] = useState<Produit[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        setProduits(produitsInitiaux);
        setFilteredProduits(produitsInitiaux);
        
        const reglagesCollection = collection(db, "reglages");
        const querySnapshot = await getDocs(reglagesCollection);
        
        if (!querySnapshot.empty) {
          const produitsFirebase: Produit[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data() as ReglageFirebase;
            
            const produit: Produit = {
              id: doc.id,
              codeArticle: data.codeArticle,
              numeroLigne: data.numeroLigne,
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
            
            produitsFirebase.push(produit);
          });
          
          if (produitsFirebase.length > 0) {
            setProduits(produitsFirebase);
            setFilteredProduits(produitsFirebase);
            console.log("Produits chargés depuis Firebase:", produitsFirebase);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
        toast({
          variant: "destructive",
          title: "Erreur de chargement",
          description: "Impossible de charger les données depuis Firebase.",
        });
      }
    };

    fetchProduits();
  }, [toast]);

  const handleSearch = async (codeArticle: string, numeroLigne: string, designation: string) => {
    setIsSearching(true);

    try {
      if (codeArticle || numeroLigne || designation) {
        const reglagesCollection = collection(db, "reglages");
        let firebaseQuery = query(reglagesCollection);
        
        if (codeArticle) {
          firebaseQuery = query(firebaseQuery, where("codeArticle", "==", codeArticle));
        }
        
        if (numeroLigne) {
          firebaseQuery = query(firebaseQuery, where("numeroLigne", "==", numeroLigne));
        }
        
        try {
          const querySnapshot = await getDocs(firebaseQuery);
          const produitsFirebase: Produit[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data() as ReglageFirebase;
            
            if (designation && !data.designation?.toLowerCase().includes(designation.toLowerCase())) {
              return;
            }
            
            const produit: Produit = {
              id: doc.id,
              codeArticle: data.codeArticle,
              numeroLigne: data.numeroLigne,
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
            
            produitsFirebase.push(produit);
          });
          
          setFilteredProduits(produitsFirebase);
          console.log("Résultats de recherche Firebase:", produitsFirebase);
        } catch (error) {
          console.error("Erreur lors de la recherche Firebase:", error);
          filterLocalProducts(codeArticle, numeroLigne, designation);
        }
      } else {
        setFilteredProduits(produits);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      filterLocalProducts(codeArticle, numeroLigne, designation);
    } finally {
      setIsSearching(false);
    }
  };
  
  const filterLocalProducts = (codeArticle: string, numeroLigne: string, designation: string) => {
    const filtered = produits.filter((produit) => {
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

    setFilteredProduits(filtered);
  };

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          <span className="text-noir-800">Recherche de</span> <span className="text-jaune-300">réglages</span>
        </h1>

        <div className="space-y-6">
          <SearchBox onSearch={handleSearch} />

          {isSearching ? (
            <div className="text-center p-4">Recherche en cours...</div>
          ) : (
            <ProduitsList produits={filteredProduits} />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default RecherchePage;
