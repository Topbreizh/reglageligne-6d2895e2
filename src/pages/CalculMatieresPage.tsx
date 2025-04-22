import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import PageLayout from "@/components/layout/PageLayout";
import { ReglageFirebase, getReglage } from "@/lib/firebaseReglage";
import { toast } from "@/components/ui/use-toast";

function parseNumberFR(value: string): number {
  if (!value) return 0;
  return parseFloat(value.replace(',', '.'));
}

function calculQuantite(
  poids: number,
  nbBandes: number,
  cadence: number,
  rognure: number | null = null
) {
  let principal = poids * nbBandes * cadence * 60 / 1000;
  if (rognure !== null) {
    let pourcentage = (isNaN(rognure) ? 0 : rognure) / 100;
    principal = principal * (1 + pourcentage);
  }
  return isNaN(principal) ? "" : principal.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
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
  const [localRognure, setLocalRognure] = React.useState(values.rognure ?? "");

  React.useEffect(() => {
    setLocalRognure(values.rognure ?? "");
  }, [values.rognure]);

  const quantite = withRognure
    ? calculQuantite(
        parseNumberFR(values.poids || "0"),
        parseFloat(values.nbBandes || "0"),
        parseFloat(values.cadence || "0"),
        localRognure !== "" ? parseFloat(localRognure) : 0
      )
    : calculQuantite(
        parseNumberFR(values.poids || "0"),
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
              type="text"
              value={values.poids}
              onChange={(e) => onFieldChange("poids", e.target.value)}
              placeholder="ex: 5,0"
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
          Quantité à l'heure : {quantite} kg
        </div>
      </CardContent>
    </Card>
  );
};

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeArticle || !numeroLigne) return;
    setIsLoading(true);
    try {
      const reglage = await getReglage(codeArticle.trim(), numeroLigne.trim());
      onResult(reglage);
      if (reglage) {
        toast({
          title: "Données récupérées",
          description: `Données pour l'article ${codeArticle} (ligne ${numeroLigne}) chargées.`,
        });
      } else {
        toast({
          title: "Aucune donnée trouvée",
          description: `Aucune donnée trouvée pour l'article ${codeArticle} (ligne ${numeroLigne}).`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la recherche.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col md:flex-row items-end gap-4 mb-8" onSubmit={handleSearch}>
      <div>
        <Label>Code article</Label>
        <Input
          value={codeArticle}
          onChange={(e) => setCodeArticle(e.target.value)}
          placeholder="ex : 123456"
        />
      </div>
      <div>
        <Label>Numéro de ligne</Label>
        <Input
          value={numeroLigne}
          onChange={(e) => setNumeroLigne(e.target.value)}
          placeholder="ex : 1"
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
  const [fields, setFields] = useState({
    pate: { poids: "", nbBandes: "", cadence: "", rognure: "" },
    fourrage: { poids: "", nbBandes: "", cadence: "" },
    marquant: { poids: "", nbBandes: "", cadence: "" },
  });
  const [loading, setLoading] = useState(false);

  const handleReglageResult = (result: ReglageFirebase | null) => {
    if (result) {
      console.log("Données brutes Firebase:", result);
      
      const nbBandes = result.nbrDeBandes || result.nbrdebandes || "";
      console.log("Nombre de bandes récupéré:", nbBandes);
      
      const poidsPate = result.poidsPate || result.poidpatequalistat || result.poidPatequalistat || "";
      const poidsFourrage = 
        result.poidsFourrage || 
        result.poidfourragequalistat || 
        result.poidFourragequalistat || 
        "";
      const poidsMarquant = 
        result.poidsMarquant || 
        result.poidmarquantqualistat || 
        result.poidMarquantqualistat || 
        "";
      
      console.log("Poids récupérés:", {
        pate: poidsPate,
        fourrage: poidsFourrage,
        marquant: poidsMarquant
      });
      
      const cadence = result.cadence || "";
      const rognure = result.rognure || "";
      
      setFields({
        pate: {
          poids: poidsPate,
          nbBandes: nbBandes,
          cadence: cadence,
          rognure: rognure,
        },
        fourrage: {
          poids: poidsFourrage,
          nbBandes: nbBandes,
          cadence: cadence,
        },
        marquant: {
          poids: poidsMarquant,
          nbBandes: nbBandes,
          cadence: cadence,
        },
      });
    }
  };

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
          formuleLabel="Formule : Poids de pâte × Nombre de bandes × Cadence × 60 ÷ 1000 × (100 - % Rognure) ÷ 100"
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
