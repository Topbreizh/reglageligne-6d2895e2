
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { parseNumberFR, calculQuantite } from "@/lib/calculMatieresUtils";

interface BlocCalculMatieresProps {
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
}

const BlocCalculMatieres = ({
  title,
  withRognure = false,
  formuleLabel,
  values,
  onFieldChange,
}: BlocCalculMatieresProps) => {
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

export default BlocCalculMatieres;
