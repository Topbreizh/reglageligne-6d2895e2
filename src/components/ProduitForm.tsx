import { useState, useEffect } from "react";
import { Produit, BlocConfiguration } from "@/types";
import { blocsConfiguration as defaultBlocsConfig } from "@/data/blocConfig";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getBlocsConfiguration } from "@/lib/firebaseReglage";

interface ProduitFormProps {
  produit?: Produit;
  onSubmit: (produit: Produit) => void;
  mode: "create" | "edit";
}

const EMPTY_PRODUIT: Produit = {
  codeArticle: "",
  numeroLigne: "",
  designation: "",
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

  useEffect(() => {
    const fetchBlocsConfig = async () => {
      try {
        setLoading(true);
        const savedConfig = await getBlocsConfiguration();
        
        if (savedConfig && savedConfig.length > 0) {
          console.log("Configuration des blocs chargée pour le formulaire:", savedConfig);
          setBlocsConfig(savedConfig);
        } else {
          console.log("Aucune configuration personnalisée trouvée, utilisation de la configuration par défaut");
          setBlocsConfig(defaultBlocsConfig);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la configuration des blocs:", error);
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

  const estChampVisible = (blocId: string, champId: string) => {
    const bloc = blocsConfig.find(b => b.id === blocId);
    if (!bloc || !bloc.visible) return false;
    
    const champ = bloc.champs.find(c => c.id === champId);
    if (!champ || !champ.visible) return false;
    
    if (formData.numeroLigne && champ.lignesApplicables.length > 0) {
      if (champ.lignesApplicables.includes("*")) return true;
      if (champ.lignesApplicables.includes(formData.numeroLigne)) return true;
      return false;
    }
    
    return true;
  };

  const estBlocVisible = (blocId: string) => {
    const bloc = blocsConfig.find(b => b.id === blocId);
    if (!bloc || !bloc.visible) return false;
    
    if (formData.numeroLigne && bloc.lignesApplicables.length > 0) {
      if (bloc.lignesApplicables.includes("*")) return true;
      if (bloc.lignesApplicables.includes(formData.numeroLigne)) return true;
      return false;
    }
    
    return true;
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jaune-300"></div>
      </div>
    );
  }

  const blocsTries = [...blocsConfig].sort((a, b) => a.ordre - b.ordre);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {blocsTries.map(bloc => {
        if (!estBlocVisible(bloc.id)) return null;
        
        const champsTries = [...bloc.champs].sort((a, b) => a.ordre - b.ordre);
        
        return (
          <Card key={bloc.id}>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-noir-800 border-b-2 border-jaune-300 pb-2">
                {bloc.nom}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {champsTries.map(champ => {
                if (!estChampVisible(bloc.id, champ.id)) return null;
                
                const isFullWidth = champ.nomTechnique === "designation" || champ.nomTechnique === "commentaire";
                
                return (
                  <div key={champ.id} className={isFullWidth ? "md:col-span-3" : ""}>
                    <Label htmlFor={champ.nomTechnique} className="field-label">
                      {champ.nom}
                      {isRequiredField(champ.nomTechnique) ? " *" : ""}
                    </Label>
                    {champ.nomTechnique === "commentaire" ? (
                      <Textarea
                        id={champ.nomTechnique}
                        name={champ.nomTechnique}
                        value={formData[champ.nomTechnique as keyof Produit] as string}
                        onChange={handleChange}
                        className="min-h-20 border-noir-300"
                        required={isRequiredField(champ.nomTechnique)}
                      />
                    ) : (
                      <Input
                        id={champ.nomTechnique}
                        name={champ.nomTechnique}
                        value={formData[champ.nomTechnique as keyof Produit] as string}
                        onChange={handleChange}
                        className="border-noir-300"
                        required={isRequiredField(champ.nomTechnique)}
                      />
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}

      <div className="flex justify-end mt-6 gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Annuler
        </Button>
        <Button type="submit" className="bg-jaune-300 text-noir-800 hover:bg-jaune-400">
          {mode === "create" ? "Créer" : "Enregistrer les modifications"}
        </Button>
      </div>
    </form>
  );
};

function isRequiredField(fieldName: string): boolean {
  return fieldName === "codeArticle" || fieldName === "numeroLigne" || fieldName === "designation";
}

export default ProduitForm;
