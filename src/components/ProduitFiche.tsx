
import React from "react";
import { Produit } from "@/types";
import ProduitFicheHeader from "./fiche/ProduitFicheHeader";
import ProduitFicheBloc from "./fiche/ProduitFicheBloc";
import ProduitFicheFooter from "./fiche/ProduitFicheFooter";
import { useProduitFicheBlocs } from "@/hooks/useProduitFicheBlocs";

interface ProduitFicheProps {
  produit: Produit;
}

const ProduitFiche = ({ produit }: ProduitFicheProps) => {
  const { loading, estChampVisible, getChampValeur, getVisibleBlocs } = useProduitFicheBlocs(produit);

  const printFiche = () => {
    // Add print-specific class to the body before printing
    document.body.classList.add('print-mode');
    window.print();
    // Remove the class after printing
    setTimeout(() => {
      document.body.classList.remove('print-mode');
    }, 500);
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
      {/* All header elements marked as print:hidden */}
      <div className="print:hidden">
        <div className="text-xs text-right text-gray-500 mb-2">
          {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="print:hidden">
        <ProduitFicheHeader produit={produit} printFiche={printFiche} />
      </div>

      {/* This is the only content that will be visible during printing */}
      <div id="printable-content" className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-3 gap-2 print:gap-0.5">
        {visibleBlocs.map(bloc => (
          <ProduitFicheBloc
            key={bloc.id}
            bloc={bloc}
            produit={produit}
            estChampVisible={estChampVisible}
            getChampValeur={getChampValeur}
          />
        ))}
      </div>

      {/* All footer elements marked as print:hidden */}
      <div className="print:hidden">
        <ProduitFicheFooter />
      </div>
      
      <div className="print:hidden">
        <div className="text-xs text-center text-gray-500 mt-4">
          Document généré le {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ProduitFiche;
