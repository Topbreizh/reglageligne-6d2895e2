
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Produit } from "@/types";
import { parseNumberFR, calculQuantite } from "@/lib/calculMatieresUtils";

interface CalculPateBlockProps {
  formData: Produit;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CalculPateBlock = ({ formData, onChange }: CalculPateBlockProps) => {
  // Calculate pate quantity
  const pateQuantity = calculQuantite(
    parseNumberFR(formData.poidPatequalistat || "0"),
    parseFloat(formData.nbrDeBandes || "0"),
    parseFloat(formData.cadence || "0"),
    formData.rognure ? parseFloat(formData.rognure) : 0
  );
  
  // Calculate fourrage quantity
  const fourrageQuantity = calculQuantite(
    parseNumberFR(formData.poidFourragequalistat || "0"),
    parseFloat(formData.nbrDeBandes || "0"),
    parseFloat(formData.cadence || "0"),
    null
  );
  
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
        <CardTitle>Calcul de pâte</CardTitle>
        <div className="text-xs text-muted-foreground">
          Formule : Poids de pâte × Nombre de bandes × Cadence × 60 ÷ 1000 × (100 - % Rognure) ÷ 100
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
          <div>
            <label className="block text-sm font-medium mb-1">Poids (kg)</label>
            <input
              type="text"
              name="poidPatequalistat"
              value={formData.poidPatequalistat || ""}
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
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">% Rognure</label>
            <input
              type="number"
              name="rognure"
              value={formData.rognure || ""}
              onChange={onChange}
              className="w-full p-2 border rounded"
              placeholder="ex: 3"
            />
          </div>
        </div>
        
        {/* Résumé des quantités à l'heure */}
        <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
          <h3 className="text-md font-semibold mb-2">Quantités à l'heure :</h3>
          <ul className="space-y-1 text-sm">
            <li className="flex justify-between">
              <span>Pâte:</span>
              <span className="font-medium">{pateQuantity} kg</span>
            </li>
            <li className="flex justify-between">
              <span>Fourrage:</span>
              <span className="font-medium">{fourrageQuantity} kg</span>
            </li>
            <li className="flex justify-between">
              <span>Marquant:</span>
              <span className="font-medium">{marquantQuantity} kg</span>
            </li>
          </ul>
        </div>
        
        <div className="text-right text-lg font-semibold text-noir-700 mt-2">
          Quantité à l'heure : {pateQuantity} kg
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculPateBlock;
