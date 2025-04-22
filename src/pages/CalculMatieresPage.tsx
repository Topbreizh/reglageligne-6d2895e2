
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import PageLayout from "@/components/layout/PageLayout";

/**
 * Petite fonction utilitaire pour faire le calcul.
 */
function calculQuantite(
  poids: number,
  nbBandes: number,
  cadence: number,
  rognure: number | null = null
) {
  // Formule : Poids * Nombre de bandes * Cadence * 60 / 1000
  let result = poids * nbBandes * cadence * 60 / 1000;
  if (rognure !== null) {
    // Appliquer le % rognure
    result = result * (rognure / 100);
  }
  return isNaN(result) ? "" : result.toLocaleString("fr-FR", {maximumFractionDigits: 2});
}

const BlocCalculMatieres = ({
  title,
  withRognure = false,
  formuleLabel,
}: {
  title: string;
  withRognure?: boolean;
  formuleLabel: string;
}) => {
  const [poids, setPoids] = useState("");
  const [nbBandes, setNbBandes] = useState("");
  const [cadence, setCadence] = useState("");
  const [rognure, setRognure] = useState("");
  
  const quantite = withRognure
    ? calculQuantite(
        parseFloat(poids || "0"),
        parseFloat(nbBandes || "0"),
        parseFloat(cadence || "0"),
        rognure !== "" ? parseFloat(rognure) : 0
      )
    : calculQuantite(
        parseFloat(poids || "0"),
        parseFloat(nbBandes || "0"),
        parseFloat(cadence || "0"),
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
              value={poids}
              min="0"
              onChange={(e) => setPoids(e.target.value)}
              placeholder="ex: 5.0"
              required
            />
          </div>
          <div>
            <Label>Nombre de bandes</Label>
            <Input
              type="number"
              value={nbBandes}
              min="0"
              onChange={(e) => setNbBandes(e.target.value)}
              placeholder="ex: 6"
              required
            />
          </div>
          <div>
            <Label>Cadence</Label>
            <Input
              type="number"
              value={cadence}
              min="0"
              onChange={(e) => setCadence(e.target.value)}
              placeholder="ex: 50"
              required
            />
          </div>
          {withRognure && (
            <div>
              <Label>% Rognure</Label>
              <Input
                type="number"
                value={rognure}
                min="0"
                max="100"
                onChange={(e) => setRognure(e.target.value)}
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

const CalculMatieresPage = () => (
  <PageLayout>
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Calcul des matières premières</h1>
      {/* Bloc Calcul de pâte */}
      <BlocCalculMatieres
        title="Calcul de pâte"
        withRognure
        formuleLabel="Formule : Poids de pâte × Nombre de bandes × Cadence × 60 ÷ 1000 × % Rognure"
      />
      {/* Bloc Calcul fourrage */}
      <BlocCalculMatieres
        title="Calcul fourrage"
        formuleLabel="Formule : Poids de fourrage × Nombre de bandes × Cadence × 60 ÷ 1000"
      />
      {/* Bloc Calcul marquant */}
      <BlocCalculMatieres
        title="Calcul marquant"
        formuleLabel="Formule : Poids de marquant × Nombre de bandes × Cadence × 60 ÷ 1000"
      />
    </div>
  </PageLayout>
);

export default CalculMatieresPage;
