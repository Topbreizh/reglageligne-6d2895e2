
import React from "react";
import { Produit, BlocConfiguration } from "@/types";

interface ProduitFicheBlocProps {
  bloc: BlocConfiguration;
  produit: Produit;
  estChampVisible: (blocId: string, champId: string) => boolean;
  getChampValeur: (champTechnique: string) => string;
}

const ProduitFicheBloc = ({ bloc, produit, estChampVisible, getChampValeur }: ProduitFicheBlocProps) => {
  // Get visible fields for this block
  const champsVisibles = bloc.champs.filter(champ => estChampVisible(bloc.id, champ.id));
  
  if (champsVisibles.length === 0) {
    return null;
  }

  return (
    <div className="printable-block mb-1 p-1 border border-gray-200 rounded-sm print:p-0.5 print:text-xs print:border-[0.5px] print:mb-0.5 print:break-inside-avoid">
      <h2 className="text-sm font-bold mb-1 text-jaune-500 print:mb-0.5 print:text-[10px]">{bloc.nom}</h2>
      <div className="flex flex-wrap gap-x-2 gap-y-0.5 print:gap-x-1.5 print:gap-y-1">
        {champsVisibles
          .sort((a, b) => a.ordre - b.ordre)
          .map(champ => {
            const valeur = getChampValeur(champ.nomTechnique);
            return (
              <div key={champ.id} className="inline-flex items-baseline print:items-baseline gap-1 print:gap-1">
                <span className="font-semibold text-xs print:text-[8px] whitespace-nowrap">{champ.nom}:</span>
                <span className="text-xs print:text-[8px]">{valeur}</span>
              </div>
            );
          })
        }
      </div>
      
      {bloc.id === "cadencePersonnel" && estChampVisible("cadencePersonnel", "commentaire") && (
        <div className="mt-1 print:mt-0.5">
          <h3 className="font-semibold text-xs print:text-[8px]">Commentaire:</h3>
          <p className="whitespace-pre-line text-xs print:text-[8px] break-words max-w-full">{produit.commentaire || "-"}</p>
        </div>
      )}
    </div>
  );
};

export default ProduitFicheBloc;
