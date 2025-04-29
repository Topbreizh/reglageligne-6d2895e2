
import React from "react";
import { Produit } from "@/types";
import ProduitFicheHeader from "./fiche/ProduitFicheHeader";
import ProduitFicheBloc from "./fiche/ProduitFicheBloc";
import ProduitFicheFooter from "./fiche/ProduitFicheFooter";
import CalculMatieresBloc from "./fiche/CalculMatieresBloc";
import { useProduitFicheBlocs } from "@/hooks/useProduitFicheBlocs";

interface ProduitFicheProps {
  produit: Produit;
}

const ProduitFiche = ({ produit }: ProduitFicheProps) => {
  const { loading, estChampVisible, getChampValeur, getVisibleBlocs } = useProduitFicheBlocs(produit);

  const printFiche = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jaune-300"></div>
      </div>
    );
  }

  const visibleBlocs = getVisibleBlocs();

  return (
    <div className="printable-page">
      <ProduitFicheHeader produit={produit} printFiche={printFiche} />

      <div id="printable-content" className="space-y-4">
        {/* Insert the calculation blocks at the top */}
        <CalculMatieresBloc produit={produit} />
        
        {visibleBlocs
          .filter(bloc => bloc.id !== "calculPate") // Filter out the original calculPate block as we now have a dedicated component
          .map(bloc => (
            <ProduitFicheBloc
              key={bloc.id}
              bloc={bloc}
              produit={produit}
              estChampVisible={estChampVisible}
              getChampValeur={getChampValeur}
            />
          ))}
      </div>

      <ProduitFicheFooter />
    </div>
  );
};

export default ProduitFiche;
