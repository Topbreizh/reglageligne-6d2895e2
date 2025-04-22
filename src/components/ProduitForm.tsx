import { useState, useEffect } from "react";
import { Produit, BlocConfiguration } from "@/types";
import { blocsConfiguration as defaultBlocsConfig } from "@/data/blocConfig";
import { useToast } from "@/hooks/use-toast";
import { getBlocsConfiguration } from "@/lib/firebaseReglage";
import ProduitFormSection from "./ProduitFormSection";
import ProduitFormLoadingSpinner from "./ProduitFormLoadingSpinner";
import ProduitFormFooter from "./ProduitFormFooter";
import { useBlocsVisibility } from "@/hooks/useBlocsVisibility";

interface ProduitFormProps {
  produit?: Produit;
  onSubmit: (produit: Produit) => void;
  mode: "create" | "edit";
}

const EMPTY_PRODUIT: Produit = {
  codeArticle: "",
  numeroLigne: "",
  designation: "",
  poidsPate: "",
  poidsArticle: "",
  quantitePate: "",
  poidPatequalistat: "",
  poidFourragequalistat: "",
  poidMarquantqualistat: "",
  nbrDeBandes: "",
  programme: "",
  facteur: "",
  regleLaminage: "",
  quick: "",
  calibreur1: "",
  calibreur2: "",
  calibreur3: "",
  laminoir: "",
  vitesseLaminage: "",
  farineurHaut1: "",
  farineurHaut2: "",
  farineurHaut3: "",
  farineurBas1: "",
  farineurBas2: "",
  farineurBas3: "",
  queueDeCarpe: "",
  numeroDecoupe: "",
  buse: "",
  distributeurChocoRaisin: "",
  humidificateur146: "",
  vitesseDoreuse: "",
  p1LongueurDecoupe: "",
  p2Centrage: "",
  bielle: "",
  lameRacleur: "",
  rademaker: "",
  aera: "",
  fritch: "",
  retourneur: "",
  aligneur: "",
  humidificateur25: "",
  pushPlaque: "",
  rouleauInferieur: "",
  rouleauSuperieur: "",
  tapisFaconneuse: "",
  reperePoignee: "",
  rouleauPression: "",
  tapisAvantEtuveSurgel: "",
  etuveSurgel: "",
  cadence: "",
  lamineur: "",
  surveillant: "",
  distributeurRaisinChoco: "",
  pose: "",
  pliageTriage: "",
  topping: "",
  sortieEtuve: "",
  ouvertureMP: "",
  commentaire: ""
};

const ProduitForm = ({ produit, onSubmit, mode }: ProduitFormProps) => {
  const [formData, setFormData] = useState<Produit>(produit || EMPTY_PRODUIT);
  const [blocsConfig, setBlocsConfig] = useState<BlocConfiguration[]>(defaultBlocsConfig);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { estChampVisible, estBlocVisible } = useBlocsVisibility(blocsConfig, formData);

  useEffect(() => {
    const fetchBlocsConfig = async () => {
      try {
        setLoading(true);
        const savedConfig = await getBlocsConfiguration();

        if (savedConfig && savedConfig.length > 0) {
          setBlocsConfig(savedConfig);
        } else {
          setBlocsConfig(defaultBlocsConfig);
        }
      } catch (error) {
        setBlocsConfig(defaultBlocsConfig);
      } finally {
        setLoading(false);
      }
    };

    fetchBlocsConfig();
  }, []);

  useEffect(() => {
    if (produit) {
      setFormData(produit);
    }
  }, [produit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.codeArticle || !formData.numeroLigne || !formData.designation) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires (Code article, Numéro de ligne, Désignation)",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formData);
  };

  if (loading) return <ProduitFormLoadingSpinner />;

  const blocsTries = [...blocsConfig].sort((a, b) => a.ordre - b.ordre);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {blocsTries.map((bloc) => {
        if (!estBlocVisible(bloc.id)) return null;
        const champsTries = [...bloc.champs].sort((a, b) => a.ordre - b.ordre);
        const champsVisibles = champsTries.filter((champ) => estChampVisible(bloc.id, champ.id));
        if (champsVisibles.length === 0) return null;
        return (
          <ProduitFormSection
            key={bloc.id}
            bloc={bloc}
            champsVisibles={champsVisibles}
            formData={formData}
            onChange={handleChange}
          />
        );
      })}
      <ProduitFormFooter mode={mode} />
    </form>
  );
};

export default ProduitForm;
