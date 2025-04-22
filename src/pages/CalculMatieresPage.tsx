
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import PageLayout from "@/components/layout/PageLayout";
import { ReglageFirebase, getReglage } from "@/lib/firebaseReglage";

function calculQuantite(
  poids: number,
  nbBandes: number,
  cadence: number,
  rognure: number | null = null
) {
  let result = poids * nbBandes * cadence * 60 / 1000;
  if (rognure !== null) {
    result = result * (rognure / 100);
  }
  return isNaN(result) ? "" : result.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
}

const BlocCalculMatieres = ({
  title,
  withRognure = false,
  formuleLabel,
  values,
  onFieldChange,
}: {
  title: string;
  withRognure?: boolean;
  formuleLabel: string;
  values: {
    poids: string;
    nbBandes: string;
    cadence: string;
    rognure?: string;
  };
  onFieldChange: (field: string, value: string) => void;
}) => {
  const [localRognure, setLocalRognure] = useState(values.rognure ?? "");

  React.useEffect(() => {
    setLocalRognure(values.rognure ?? "");
  }, [values.rognure]);

  const quantite = withRognure
    ? calculQuantite(
        parseFloat(values.poids || "0"),
        parseFloat(values.nbBandes || "0"),
        parseFloat(values.cadence || "0"),
        localRognure !== "" ? parseFloat(localRognure) : 0
      )
    : calculQuantite(
        parseFloat(values.poids || "0"),
        parseFloat(values.nbBandes || "0"),
        parseFloat(values.cadence || "0"),
        null
      );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="text-xs text-muted-foreground">{formuleLabel}</div>
      </CardHeader>
      <CardContent>
        <form
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <Label>Poids (kg)</Label>
            <Input
              type="number"
              value={values.poids}
              min="0"
              onChange={(e) => onFieldChange("poids", e.target.value)}
              placeholder="ex: 5.0"
              required
            />
          </div>
          <div>
            <Label>Nombre de bandes</Label>
            <Input
              type="number"
              value={values.nbBandes}
              min="0"
              onChange={(e) => onFieldChange("nbBandes", e.target.value)}
              placeholder="ex: 6"
              required
            />
          </div>
          <div>
            <Label>Cadence</Label>
            <Input
              type="number"
              value={values.cadence}
              min="0"
              onChange={(e) => onFieldChange("cadence", e.target.value)}
              placeholder="ex: 50"
              required
            />
          </div>
          {withRognure && (
            <div>
              <Label>% Rognure</Label>
              <Input
                type="number"
                value={localRognure}
                min="0"
                max="100"
                onChange={(e) => {
                  setLocalRognure(e.target.value);
                  onFieldChange("rognure", e.target.value);
                }}
                placeholder="ex: 3"
                required
              />
            </div>
          )}
        </form>
        <div className="text-right text-lg font-semibold text-noir-700">
          Quantité à l’heure : {quantite} kg
        </div>
      </CardContent>
    </Card>
  );
};

// Composant pour la recherche en haut de page
const RechercheReglageBloc = ({
  onResult,
  loading,
}: {
  onResult: (result: ReglageFirebase | null) => void;
  loading: boolean;
}) => {
  const [codeArticle, setCodeArticle] = useState("");
  const [numeroLigne, setNumeroLigne] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Pour le feedback, on peut ajouter un loader
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeArticle || !numeroLigne) return;
    setIsLoading(true);
    const reglage = await getReglage(codeArticle.trim(), numeroLigne.trim());
    onResult(reglage);
    setIsLoading(false);
  };

  return (
    <form className="flex flex-col md:flex-row items-end gap-4 mb-8" onSubmit={handleSearch}>
      <div>
        <Label>Code article</Label>
        <Input
          value={codeArticle}
          onChange={(e) => setCodeArticle(e.target.value)}
          placeholder="ex : 123456"
        />
      </div>
      <div>
        <Label>Numéro de ligne</Label>
        <Input
          value={numeroLigne}
          onChange={(e) => setNumeroLigne(e.target.value)}
          placeholder="ex : 1"
        />
      </div>
      <button
        type="submit"
        className="bg-jaune-300 hover:bg-jaune-400 text-noir-800 font-medium py-2 px-4 rounded"
        disabled={isLoading || loading}
      >
        {isLoading || loading ? "Recherche..." : "Pré-remplir"}
      </button>
    </form>
  );
};

const CalculMatieresPage = () => {
  // États partagés pour les 3 blocs (Pâte, Fourrage, Marquant)
  const [fields, setFields] = useState({
    pate: { poids: "", nbBandes: "", cadence: "", rognure: "" },
    fourrage: { poids: "", nbBandes: "", cadence: "" },
    marquant: { poids: "", nbBandes: "", cadence: "" },
  });
  const [loading, setLoading] = useState(false);

  // Lors d'une recherche, remplir les états selon la base (si trouvé)
  const handleReglageResult = (result: ReglageFirebase | null) => {
    if (result) {
      setFields({
        pate: {
          poids: result.poidsPate ?? result.poidPatequalistat ?? "",
          nbBandes: result.nbrDeBandes ?? "",
          cadence: result.cadence ?? "",
          rognure: result.rognure ?? "",
        },
        fourrage: {
          poids: result.poidsFourrage ?? result.poidFourragequalistat ?? "",
          nbBandes: result.nbrDeBandes ?? "",
          cadence: result.cadence ?? "",
        },
        marquant: {
          poids: result.poidsMarquant ?? result.poidMarquantqualistat ?? "",
          nbBandes: result.nbrDeBandes ?? "",
          cadence: result.cadence ?? "",
        },
      });
    }
  };

  // Pour la modification des champs dans chaque bloc
  const handleFieldChange = (bloc: "pate" | "fourrage" | "marquant", key: string, value: string) => {
    setFields((prev) => ({
      ...prev,
      [bloc]: { ...prev[bloc], [key]: value },
    }));
  };

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Calcul des matières premières</h1>

        <RechercheReglageBloc loading={loading} onResult={handleReglageResult} />

        <BlocCalculMatieres
          title="Calcul de pâte"
          withRognure
          formuleLabel="Formule : Poids de pâte × Nombre de bandes × Cadence × 60 ÷ 1000 × % Rognure"
          values={fields.pate}
          onFieldChange={(key, value) => handleFieldChange("pate", key, value)}
        />
        <BlocCalculMatieres
          title="Calcul fourrage"
          formuleLabel="Formule : Poids de fourrage × Nombre de bandes × Cadence × 60 ÷ 1000"
          values={fields.fourrage}
          onFieldChange={(key, value) => handleFieldChange("fourrage", key, value)}
        />
        <BlocCalculMatieres
          title="Calcul marquant"
          formuleLabel="Formule : Poids de marquant × Nombre de bandes × Cadence × 60 ÷ 1000"
          values={fields.marquant}
          onFieldChange={(key, value) => handleFieldChange("marquant", key, value)}
        />
      </div>
    </PageLayout>
  );
};

export default CalculMatieresPage;
