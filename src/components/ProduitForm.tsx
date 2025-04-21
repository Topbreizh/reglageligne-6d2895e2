
import { useState, useEffect } from "react";
import { Produit } from "@/types";
import { blocsConfiguration } from "@/data/blocConfig";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

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
    
    // Validation basique
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
    const bloc = blocsConfiguration.find(b => b.id === blocId);
    if (!bloc || !bloc.visible) return false;
    
    const champ = bloc.champs.find(c => c.id === champId);
    if (!champ || !champ.visible) return false;
    
    // Vérifier si le champ est applicable pour la ligne courante
    if (formData.numeroLigne && champ.lignesApplicables.length > 0) {
      if (champ.lignesApplicables.includes("*")) return true;
      if (champ.lignesApplicables.includes(formData.numeroLigne)) return true;
      return false;
    }
    
    return true;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Bloc Article */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-noir-800 border-b-2 border-jaune-300 pb-2">
            Article
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {estChampVisible("article", "codeArticle") && (
            <div>
              <Label htmlFor="codeArticle" className="field-label">Code article *</Label>
              <Input
                id="codeArticle"
                name="codeArticle"
                value={formData.codeArticle}
                onChange={handleChange}
                className="border-noir-300"
                required
              />
            </div>
          )}
          {estChampVisible("article", "numeroLigne") && (
            <div>
              <Label htmlFor="numeroLigne" className="field-label">Numéro de ligne *</Label>
              <Input
                id="numeroLigne"
                name="numeroLigne"
                value={formData.numeroLigne}
                onChange={handleChange}
                className="border-noir-300"
                required
              />
            </div>
          )}
          {estChampVisible("article", "designation") && (
            <div className="md:col-span-3">
              <Label htmlFor="designation" className="field-label">Désignation *</Label>
              <Input
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="border-noir-300"
                required
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bloc Laminage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-noir-800 border-b-2 border-jaune-300 pb-2">
            Laminage
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {estChampVisible("laminage", "programme") && (
            <div>
              <Label htmlFor="programme" className="field-label">Programme</Label>
              <Input
                id="programme"
                name="programme"
                value={formData.programme}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("laminage", "facteur") && (
            <div>
              <Label htmlFor="facteur" className="field-label">Facteur</Label>
              <Input
                id="facteur"
                name="facteur"
                value={formData.facteur}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("laminage", "regleLaminage") && (
            <div>
              <Label htmlFor="regleLaminage" className="field-label">Règle laminage</Label>
              <Input
                id="regleLaminage"
                name="regleLaminage"
                value={formData.regleLaminage}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("laminage", "quick") && (
            <div>
              <Label htmlFor="quick" className="field-label">Quick</Label>
              <Input
                id="quick"
                name="quick"
                value={formData.quick}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("laminage", "calibreur1") && (
            <div>
              <Label htmlFor="calibreur1" className="field-label">Calibreur 1</Label>
              <Input
                id="calibreur1"
                name="calibreur1"
                value={formData.calibreur1}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("laminage", "calibreur2") && (
            <div>
              <Label htmlFor="calibreur2" className="field-label">Calibreur 2</Label>
              <Input
                id="calibreur2"
                name="calibreur2"
                value={formData.calibreur2}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("laminage", "calibreur3") && (
            <div>
              <Label htmlFor="calibreur3" className="field-label">Calibreur 3</Label>
              <Input
                id="calibreur3"
                name="calibreur3"
                value={formData.calibreur3}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("laminage", "laminoir") && (
            <div>
              <Label htmlFor="laminoir" className="field-label">Laminoir</Label>
              <Input
                id="laminoir"
                name="laminoir"
                value={formData.laminoir}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("laminage", "vitesseLaminage") && (
            <div>
              <Label htmlFor="vitesseLaminage" className="field-label">Vitesse Laminage</Label>
              <Input
                id="vitesseLaminage"
                name="vitesseLaminage"
                value={formData.vitesseLaminage}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("laminage", "farineurHaut1") && (
            <div>
              <Label htmlFor="farineurHaut1" className="field-label">Farineur Haut 1</Label>
              <Input
                id="farineurHaut1"
                name="farineurHaut1"
                value={formData.farineurHaut1}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("laminage", "farineurHaut2") && (
            <div>
              <Label htmlFor="farineurHaut2" className="field-label">Farineur Haut 2</Label>
              <Input
                id="farineurHaut2"
                name="farineurHaut2"
                value={formData.farineurHaut2}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("laminage", "farineurHaut3") && (
            <div>
              <Label htmlFor="farineurHaut3" className="field-label">Farineur Haut 3</Label>
              <Input
                id="farineurHaut3"
                name="farineurHaut3"
                value={formData.farineurHaut3}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("laminage", "farineurBas1") && (
            <div>
              <Label htmlFor="farineurBas1" className="field-label">Farineur Bas 1</Label>
              <Input
                id="farineurBas1"
                name="farineurBas1"
                value={formData.farineurBas1}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("laminage", "farineurBas2") && (
            <div>
              <Label htmlFor="farineurBas2" className="field-label">Farineur Bas 2</Label>
              <Input
                id="farineurBas2"
                name="farineurBas2"
                value={formData.farineurBas2}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("laminage", "farineurBas3") && (
            <div>
              <Label htmlFor="farineurBas3" className="field-label">Farineur Bas 3</Label>
              <Input
                id="farineurBas3"
                name="farineurBas3"
                value={formData.farineurBas3}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bloc Façonnage 1-4-6 - conditionnellement affiché selon le numéro de ligne */}
      {(formData.numeroLigne === "1" || formData.numeroLigne === "4" || formData.numeroLigne === "6") && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-noir-800 border-b-2 border-jaune-300 pb-2">
              Façonnage 1-4-6
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {estChampVisible("faconnage146", "queueDeCarpe") && (
              <div>
                <Label htmlFor="queueDeCarpe" className="field-label">Queue de carpe</Label>
                <Input
                  id="queueDeCarpe"
                  name="queueDeCarpe"
                  value={formData.queueDeCarpe}
                  onChange={handleChange}
                  className="border-noir-300"
                />
              </div>
            )}
            {estChampVisible("faconnage146", "numeroDecoupe") && (
              <div>
                <Label htmlFor="numeroDecoupe" className="field-label">N° découpe</Label>
                <Input
                  id="numeroDecoupe"
                  name="numeroDecoupe"
                  value={formData.numeroDecoupe}
                  onChange={handleChange}
                  className="border-noir-300"
                />
              </div>
            )}
            {estChampVisible("faconnage146", "buse") && (
              <div>
                <Label htmlFor="buse" className="field-label">Buse</Label>
                <Input
                  id="buse"
                  name="buse"
                  value={formData.buse}
                  onChange={handleChange}
                  className="border-noir-300"
                />
              </div>
            )}
            {estChampVisible("faconnage146", "distributeurChocoRaisin") && (
              <div>
                <Label htmlFor="distributeurChocoRaisin" className="field-label">Distributeur choco raisin</Label>
                <Input
                  id="distributeurChocoRaisin"
                  name="distributeurChocoRaisin"
                  value={formData.distributeurChocoRaisin}
                  onChange={handleChange}
                  className="border-noir-300"
                />
              </div>
            )}
            {estChampVisible("faconnage146", "humidificateur146") && (
              <div>
                <Label htmlFor="humidificateur146" className="field-label">Humidificateur</Label>
                <Input
                  id="humidificateur146"
                  name="humidificateur146"
                  value={formData.humidificateur146}
                  onChange={handleChange}
                  className="border-noir-300"
                />
              </div>
            )}
            {estChampVisible("faconnage146", "vitesseDoreuse") && (
              <div>
                <Label htmlFor="vitesseDoreuse" className="field-label">Vitesse doreuse</Label>
                <Input
                  id="vitesseDoreuse"
                  name="vitesseDoreuse"
                  value={formData.vitesseDoreuse}
                  onChange={handleChange}
                  className="border-noir-300"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Bloc Guillotine */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-noir-800 border-b-2 border-jaune-300 pb-2">
            Guillotine
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {estChampVisible("guillotine", "p1LongueurDecoupe") && (
            <div>
              <Label htmlFor="p1LongueurDecoupe" className="field-label">P1 ou longueur découpe</Label>
              <Input
                id="p1LongueurDecoupe"
                name="p1LongueurDecoupe"
                value={formData.p1LongueurDecoupe}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("guillotine", "p2Centrage") && (
            <div>
              <Label htmlFor="p2Centrage" className="field-label">P2 ou centrage</Label>
              <Input
                id="p2Centrage"
                name="p2Centrage"
                value={formData.p2Centrage}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("guillotine", "bielle") && (
            <div>
              <Label htmlFor="bielle" className="field-label">Bielle</Label>
              <Input
                id="bielle"
                name="bielle"
                value={formData.bielle}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("guillotine", "lameRacleur") && (
            <div>
              <Label htmlFor="lameRacleur" className="field-label">Lame racleur</Label>
              <Input
                id="lameRacleur"
                name="lameRacleur"
                value={formData.lameRacleur}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bloc Distributeur crème */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-noir-800 border-b-2 border-jaune-300 pb-2">
            Distributeur crème
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {estChampVisible("distributeurCreme", "rademaker") && (
            <div>
              <Label htmlFor="rademaker" className="field-label">Rademaker</Label>
              <Input
                id="rademaker"
                name="rademaker"
                value={formData.rademaker}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("distributeurCreme", "aera") && (
            <div>
              <Label htmlFor="aera" className="field-label">Aera</Label>
              <Input
                id="aera"
                name="aera"
                value={formData.aera}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("distributeurCreme", "fritch") && (
            <div>
              <Label htmlFor="fritch" className="field-label">Fritch</Label>
              <Input
                id="fritch"
                name="fritch"
                value={formData.fritch}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bloc Façonnage 2-5 - conditionnellement affiché selon le numéro de ligne */}
      {(formData.numeroLigne === "2" || formData.numeroLigne === "5") && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-noir-800 border-b-2 border-jaune-300 pb-2">
              Façonnage 2-5
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {estChampVisible("faconnage25", "retourneur") && (
              <div>
                <Label htmlFor="retourneur" className="field-label">Retourneur</Label>
                <Input
                  id="retourneur"
                  name="retourneur"
                  value={formData.retourneur}
                  onChange={handleChange}
                  className="border-noir-300"
                />
              </div>
            )}
            {estChampVisible("faconnage25", "aligneur") && (
              <div>
                <Label htmlFor="aligneur" className="field-label">Aligneur</Label>
                <Input
                  id="aligneur"
                  name="aligneur"
                  value={formData.aligneur}
                  onChange={handleChange}
                  className="border-noir-300"
                />
              </div>
            )}
            {estChampVisible("faconnage25", "humidificateur25") && (
              <div>
                <Label htmlFor="humidificateur25" className="field-label">Humidificateur</Label>
                <Input
                  id="humidificateur25"
                  name="humidificateur25"
                  value={formData.humidificateur25}
                  onChange={handleChange}
                  className="border-noir-300"
                />
              </div>
            )}
            {estChampVisible("faconnage25", "pushPlaque") && (
              <div>
                <Label htmlFor="pushPlaque" className="field-label">Push Plaque</Label>
                <Input
                  id="pushPlaque"
                  name="pushPlaque"
                  value={formData.pushPlaque}
                  onChange={handleChange}
                  className="border-noir-300"
                />
              </div>
            )}
            {estChampVisible("faconnage25", "rouleauInferieur") && (
              <div>
                <Label htmlFor="rouleauInferieur" className="field-label">Rouleau inferieur</Label>
                <Input
                  id="rouleauInferieur"
                  name="rouleauInferieur"
                  value={formData.rouleauInferieur}
                  onChange={handleChange}
                  className="border-noir-300"
                />
              </div>
            )}
            {estChampVisible("faconnage25", "rouleauSuperieur") && (
              <div>
                <Label htmlFor="rouleauSuperieur" className="field-label">Rouleau supérieur</Label>
                <Input
                  id="rouleauSuperieur"
                  name="rouleauSuperieur"
                  value={formData.rouleauSuperieur}
                  onChange={handleChange}
                  className="border-noir-300"
                />
              </div>
            )}
            {estChampVisible("faconnage25", "tapisFaconneuse") && (
              <div>
                <Label htmlFor="tapisFaconneuse" className="field-label">Tapis façonneuse</Label>
                <Input
                  id="tapisFaconneuse"
                  name="tapisFaconneuse"
                  value={formData.tapisFaconneuse}
                  onChange={handleChange}
                  className="border-noir-300"
                />
              </div>
            )}
            {estChampVisible("faconnage25", "reperePoignee") && (
              <div>
                <Label htmlFor="reperePoignee" className="field-label">Repère poignée</Label>
                <Input
                  id="reperePoignee"
                  name="reperePoignee"
                  value={formData.reperePoignee}
                  onChange={handleChange}
                  className="border-noir-300"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Bloc Fin de ligne */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-noir-800 border-b-2 border-jaune-300 pb-2">
            Fin de ligne
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {estChampVisible("finDeLigne", "rouleauPression") && (
            <div>
              <Label htmlFor="rouleauPression" className="field-label">Rouleau pression</Label>
              <Input
                id="rouleauPression"
                name="rouleauPression"
                value={formData.rouleauPression}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("finDeLigne", "tapisAvantEtuveSurgel") && (
            <div>
              <Label htmlFor="tapisAvantEtuveSurgel" className="field-label">Tapis avant Etuve Surgel</Label>
              <Input
                id="tapisAvantEtuveSurgel"
                name="tapisAvantEtuveSurgel"
                value={formData.tapisAvantEtuveSurgel}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("finDeLigne", "etuveSurgel") && (
            <div>
              <Label htmlFor="etuveSurgel" className="field-label">Etuve Surgel</Label>
              <Input
                id="etuveSurgel"
                name="etuveSurgel"
                value={formData.etuveSurgel}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bloc Cadence, Personnel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-noir-800 border-b-2 border-jaune-300 pb-2">
            Cadence, Personnel
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {estChampVisible("cadencePersonnel", "cadence") && (
            <div>
              <Label htmlFor="cadence" className="field-label">Cadence</Label>
              <Input
                id="cadence"
                name="cadence"
                value={formData.cadence}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("cadencePersonnel", "lamineur") && (
            <div>
              <Label htmlFor="lamineur" className="field-label">Lamineur</Label>
              <Input
                id="lamineur"
                name="lamineur"
                value={formData.lamineur}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("cadencePersonnel", "surveillant") && (
            <div>
              <Label htmlFor="surveillant" className="field-label">Surveillant</Label>
              <Input
                id="surveillant"
                name="surveillant"
                value={formData.surveillant}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("cadencePersonnel", "distributeurRaisinChoco") && (
            <div>
              <Label htmlFor="distributeurRaisinChoco" className="field-label">Distributeur raisin choco</Label>
              <Input
                id="distributeurRaisinChoco"
                name="distributeurRaisinChoco"
                value={formData.distributeurRaisinChoco}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("cadencePersonnel", "pose") && (
            <div>
              <Label htmlFor="pose" className="field-label">Pose</Label>
              <Input
                id="pose"
                name="pose"
                value={formData.pose}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("cadencePersonnel", "pliageTriage") && (
            <div>
              <Label htmlFor="pliageTriage" className="field-label">Pliage / Triage</Label>
              <Input
                id="pliageTriage"
                name="pliageTriage"
                value={formData.pliageTriage}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("cadencePersonnel", "topping") && (
            <div>
              <Label htmlFor="topping" className="field-label">Topping</Label>
              <Input
                id="topping"
                name="topping"
                value={formData.topping}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("cadencePersonnel", "sortieEtuve") && (
            <div>
              <Label htmlFor="sortieEtuve" className="field-label">Sortie Etuve</Label>
              <Input
                id="sortieEtuve"
                name="sortieEtuve"
                value={formData.sortieEtuve}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("cadencePersonnel", "ouvertureMP") && (
            <div>
              <Label htmlFor="ouvertureMP" className="field-label">Ouverture MP</Label>
              <Input
                id="ouvertureMP"
                name="ouvertureMP"
                value={formData.ouvertureMP}
                onChange={handleChange}
                className="border-noir-300"
              />
            </div>
          )}
          {estChampVisible("cadencePersonnel", "commentaire") && (
            <div className="md:col-span-3">
              <Label htmlFor="commentaire" className="field-label">Commentaire</Label>
              <Textarea
                id="commentaire"
                name="commentaire"
                value={formData.commentaire}
                onChange={handleChange}
                className="min-h-20 border-noir-300"
              />
            </div>
          )}
        </CardContent>
      </Card>

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

export default ProduitForm;
