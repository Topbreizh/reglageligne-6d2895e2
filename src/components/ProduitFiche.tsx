
import React from "react";
import { Produit } from "@/types";
import ProduitFicheHeader from "./fiche/ProduitFicheHeader";
import ProduitFicheBloc from "./fiche/ProduitFicheBloc";
import ProduitFicheFooter from "./fiche/ProduitFicheFooter";
import { useProduitFicheBlocs } from "@/hooks/useProduitFicheBlocs";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProduitFicheProps {
  produit: Produit;
}

const ProduitFiche = ({ produit }: ProduitFicheProps) => {
  const { loading, estChampVisible, getChampValeur, getVisibleBlocs } = useProduitFicheBlocs(produit);
  const isMobile = useIsMobile();

  const printFiche = () => {
    // Add print-specific class to the body before printing
    document.body.classList.add('print-mode');
    
    // Force proper styling on mobile before printing
    if (isMobile) {
      const printableContent = document.getElementById('printable-content');
      if (printableContent) {
        // Save original styles to restore later
        const originalStyles = {
          display: printableContent.style.display,
          gridTemplateColumns: printableContent.style.gridTemplateColumns,
          gap: printableContent.style.gap
        };
        
        // Force 3-column grid for printing on mobile
        printableContent.style.display = 'grid';
        printableContent.style.gridTemplateColumns = 'repeat(3, 1fr)';
        printableContent.style.gap = '0.5mm';
        
        // Restore after printing
        setTimeout(() => {
          printableContent.style.display = originalStyles.display || '';
          printableContent.style.gridTemplateColumns = originalStyles.gridTemplateColumns || '';
          printableContent.style.gap = originalStyles.gap || '';
        }, 1000);
      }
    }
    
    // Override browser print styles to hide URL and page info
    const style = document.createElement('style');
    style.id = 'print-override-style';
    style.innerHTML = `
      @page {
        margin: 2mm 2mm 0mm 2mm !important;
        size: portrait;
      }
      @page :footer {
        display: none !important;
        height: 0;
      }
      @page :header {
        display: none !important;
        height: 0;
      }
    `;
    document.head.appendChild(style);
    
    window.print();
    
    // Remove the class and style element after printing
    setTimeout(() => {
      document.body.classList.remove('print-mode');
      const styleElem = document.getElementById('print-override-style');
      if (styleElem) styleElem.remove();
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
    <div className="printable-page w-full">
      {/* All header elements marked as print:hidden */}
      <div className="print:hidden">
        <div className="text-xs text-right text-gray-500 mb-1">
          {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="print:hidden">
        <ProduitFicheHeader produit={produit} printFiche={printFiche} />
      </div>

      {/* This is the only content that will be visible during printing */}
      <div 
        id="printable-content" 
        className={`grid grid-cols-1 ${!isMobile ? 'md:grid-cols-2 lg:grid-cols-3' : ''} print:grid-cols-3 gap-1 print:gap-0`}
        style={{ width: '100%' }}
      >
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
