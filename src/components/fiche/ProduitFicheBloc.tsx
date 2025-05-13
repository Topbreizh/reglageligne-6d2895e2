
import React from "react";
import { Produit, BlocConfiguration } from "@/types";
import { parseNumberFR, calculQuantite } from "@/lib/calculMatieresUtils";

interface ProduitFicheBlocProps {
  bloc: BlocConfiguration;
  produit: Produit;
  estChampVisible: (blocId: string, champId: string) => boolean;
  getChampValeur: (champTechnique: string) => string;
}

const ProduitFicheBloc = ({ bloc, produit, estChampVisible, getChampValeur }: ProduitFicheBlocProps) => {
  // Get visible fields for this block
  const champsVisibles = bloc.champs.filter(champ => {
    // Filter out all commentaire fields since we'll handle them separately
    if (champ.nomTechnique === "commentaire") {
      return false;
    }
    return estChampVisible(bloc.id, champ.id);
  });
  
  // Separately check if the commentaire field should be visible
  const showCommentaire = bloc.id === "cadencePersonnel" && estChampVisible("cadencePersonnel", "commentaire");
  
  // Check if we need to show quantities summary (only in calculPate bloc)
  const showQuantities = bloc.id === "calculPate";
  
  if (champsVisibles.length === 0 && !showCommentaire && !showQuantities) {
    return null;
  }
  
  // Calculate quantities if needed
  const pateQuantity = showQuantities ? calculQuantite(
    parseNumberFR(produit.poidPatequalistat || "0"),
    parseFloat(produit.nbrDeBandes || "0"),
    parseFloat(produit.cadence || "0"),
    produit.rognure ? parseFloat(produit.rognure as string) : 0
  ) : "";
  
  const fourrageQuantity = showQuantities ? calculQuantite(
    parseNumberFR(produit.poidFourragequalistat || "0"),
    parseFloat(produit.nbrDeBandes || "0"),
    parseFloat(produit.cadence || "0"),
    null
  ) : "";
  
  const marquantQuantity = showQuantities ? calculQuantite(
    parseNumberFR(produit.poidMarquantqualistat || "0"),
    parseFloat(produit.nbrDeBandes || "0"),
    parseFloat(produit.cadence || "0"),
    null
  ) : "";

  return (
    <div className="printable-block mb-1 p-1 border border-gray-200 rounded-sm print:p-0.5 print:text-xs print:border-[0.5px] print:mb-0.5 print:break-inside-avoid">
      <h2 className="text-sm font-bold mb-1 text-jaune-500 print:mb-0.5 print:text-[10px]">{bloc.nom}</h2>
      <div className="space-y-0.5 print:space-y-1">
        {champsVisibles
          .sort((a, b) => a.ordre - b.ordre)
          .map(champ => {
            const valeur = getChampValeur(champ.nomTechnique);
            return (
              <div key={champ.id} className="flex flex-row flex-wrap items-start gap-1 mb-0.5 print:mb-0.5 print:gap-1">
                <div className="font-semibold text-xs print:text-[8px] w-12 print:w-10 min-w-fit whitespace-nowrap print:mr-1">{champ.nom}:</div>
                <div className="text-xs print:text-[8px] break-words max-w-[calc(100%-55px)] print:ml-1">{valeur}</div>
              </div>
            );
          })
        }
        
        {/* Show quantities summary in the calculPate bloc */}
        {showQuantities && (
          <div className="mt-2 print:mt-1 border-t border-gray-100 pt-1 print:pt-0.5">
            <div className="font-semibold text-xs print:text-[8px]">Quantités à l'heure:</div>
            <div className="flex flex-row flex-wrap items-start gap-1 mb-0.5 print:mb-0.5 print:gap-0.5">
              <div className="text-xs print:text-[8px]">Pâte: {pateQuantity} kg,</div>
              <div className="text-xs print:text-[8px]">Fourrage: {fourrageQuantity} kg,</div>
              <div className="text-xs print:text-[8px]">Marquant: {marquantQuantity} kg</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Only show commentaire once and only in the cadencePersonnel bloc */}
      {showCommentaire && (
        <div className="mt-1 print:mt-0.5">
          <h3 className="font-semibold text-xs print:text-[8px]">Commentaire:</h3>
          <p className="whitespace-pre-line text-xs print:text-[8px] break-words max-w-full">{produit.commentaire || "-"}</p>
        </div>
      )}
    </div>
  );
};

export default ProduitFicheBloc;
