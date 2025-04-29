
import React from "react";
import { Produit } from "@/types";
import { parseNumberFR } from "@/lib/calculMatieresUtils";

interface CalculMatieresProps {
  produit: Produit;
}

const CalculMatieresBloc = ({ produit }: CalculMatieresProps) => {
  // Parse values from product data
  const poidsPate = parseNumberFR(produit.poidPatequalistat || "0");
  const poidsFourrage = parseNumberFR(produit.poidFourragequalistat || "0");
  const poidsMarquant = parseNumberFR(produit.poidMarquantqualistat || "0");
  const nbBandes = parseFloat(produit.nbrDeBandes || "0");
  const cadence = parseFloat(produit.cadence || "0");
  const rognure = produit.rognure ? parseFloat(produit.rognure) : 0;

  // Calculate quantities
  const calculateQuantitePate = () => {
    if (!poidsPate || !nbBandes || !cadence) return "0";
    const base = poidsPate * nbBandes * cadence * 60 / 1000;
    const withRognure = base * (1 - rognure/100); // Apply rognure percentage
    return withRognure.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
  };

  const calculateQuantiteFourrage = () => {
    if (!poidsFourrage || !nbBandes || !cadence) return "0";
    const result = poidsFourrage * nbBandes * cadence * 60 / 1000;
    return result.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
  };

  const calculateQuantiteMarquant = () => {
    if (!poidsMarquant || !nbBandes || !cadence) return "0";
    const result = poidsMarquant * nbBandes * cadence * 60 / 1000;
    return result.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
  };

  const quantitePate = calculateQuantitePate();
  const quantiteFourrage = calculateQuantiteFourrage();
  const quantiteMarquant = calculateQuantiteMarquant();

  return (
    <div className="printable-block mb-6 space-y-6">
      {/* Bloc Calcul de pâte */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <h2 className="text-lg font-bold mb-2 text-jaune-500">Calcul de pâte</h2>
        <p className="text-sm mb-3">
          Formule : Poids de pâte × Nombre de bandes × Cadence × 60 ÷ 1000 × (100 - % Rognure) ÷ 100
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <div className="font-semibold mb-1">Poids (kg)</div>
            <div className="p-2 bg-gray-50 border border-gray-200 rounded">
              {produit.poidPatequalistat || "-"}
            </div>
          </div>
          <div>
            <div className="font-semibold mb-1">Nombre de bandes</div>
            <div className="p-2 bg-gray-50 border border-gray-200 rounded">
              {produit.nbrDeBandes || "-"}
            </div>
          </div>
          <div>
            <div className="font-semibold mb-1">Cadence</div>
            <div className="p-2 bg-gray-50 border border-gray-200 rounded">
              {produit.cadence || "-"}
            </div>
          </div>
          <div>
            <div className="font-semibold mb-1">% Rognure</div>
            <div className="p-2 bg-gray-50 border border-gray-200 rounded">
              {produit.rognure || "-"}
            </div>
          </div>
        </div>
        
        <div className="text-right text-lg font-semibold">
          Quantité à l'heure : {quantitePate} kg
        </div>
      </div>

      {/* Bloc Calcul fourrage */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <h2 className="text-lg font-bold mb-2 text-jaune-500">Calcul fourrage</h2>
        <p className="text-sm mb-3">
          Formule : Poids de fourrage × Nombre de bandes × Cadence × 60 ÷ 1000
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="font-semibold mb-1">Poids (kg)</div>
            <div className="p-2 bg-gray-50 border border-gray-200 rounded">
              {produit.poidFourragequalistat || "-"}
            </div>
          </div>
          <div>
            <div className="font-semibold mb-1">Nombre de bandes</div>
            <div className="p-2 bg-gray-50 border border-gray-200 rounded">
              {produit.nbrDeBandes || "-"}
            </div>
          </div>
          <div>
            <div className="font-semibold mb-1">Cadence</div>
            <div className="p-2 bg-gray-50 border border-gray-200 rounded">
              {produit.cadence || "-"}
            </div>
          </div>
        </div>
        
        <div className="text-right text-lg font-semibold">
          Quantité à l'heure : {quantiteFourrage} kg
        </div>
      </div>

      {/* Bloc Calcul marquant */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <h2 className="text-lg font-bold mb-2 text-jaune-500">Calcul marquant</h2>
        <p className="text-sm mb-3">
          Formule : Poids de marquant × Nombre de bandes × Cadence × 60 ÷ 1000
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="font-semibold mb-1">Poids (kg)</div>
            <div className="p-2 bg-gray-50 border border-gray-200 rounded">
              {produit.poidMarquantqualistat || "-"}
            </div>
          </div>
          <div>
            <div className="font-semibold mb-1">Nombre de bandes</div>
            <div className="p-2 bg-gray-50 border border-gray-200 rounded">
              {produit.nbrDeBandes || "-"}
            </div>
          </div>
          <div>
            <div className="font-semibold mb-1">Cadence</div>
            <div className="p-2 bg-gray-50 border border-gray-200 rounded">
              {produit.cadence || "-"}
            </div>
          </div>
        </div>
        
        <div className="text-right text-lg font-semibold">
          Quantité à l'heure : {quantiteMarquant} kg
        </div>
      </div>
    </div>
  );
};

export default CalculMatieresBloc;
