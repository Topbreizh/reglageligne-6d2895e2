
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Produit } from "@/types";
import { parseNumberFR, calculQuantite } from "@/lib/calculMatieresUtils";

interface CalculMarquantBlockProps {
  formData: Produit;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CalculMarquantBlock = ({ formData, onChange }: CalculMarquantBlockProps) => {
  // Calculate marquant quantity
  const marquantQuantity = calculQuantite(
    parseNumberFR(formData.poidMarquantqualistat || "0"),
    parseFloat(formData.nbrDeBandes || "0"),
    parseFloat(formData.cadence || "0"),
    null
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calcul marquant</CardTitle>
        <div className="text-xs text-muted-foreground">
          Formule : Poids de marquant × Nombre de bandes × Cadence × 60 ÷ 1000
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          <div>
            <label className="block text-sm font-medium mb-1">Poids (kg)</label>
            <input
              type="text"
              name="poidMarquantqualistat"
              value={formData.poidMarquantqualistat || ""}
              onChange={onChange}
              className="w-full p-2 border rounded"
              placeholder="ex: 5,0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nombre de bandes</label>
            <input
              type="number"
              name="nbrDeBandes"
              value={formData.nbrDeBandes || ""}
              onChange={onChange}
              className="w-full p-2 border rounded"
              placeholder="ex: 6"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cadence</label>
            <input
              type="number"
              name="cadence"
              value={formData.cadence || ""}
              onChange={onChange}
              className="w-full p-2 border rounded"
              placeholder="ex: 50"
              disabled
            />
          </div>
        </div>
        <div className="text-right text-lg font-semibold text-noir-700">
          Quantité à l'heure : {marquantQuantity} kg
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculMarquantBlock;
