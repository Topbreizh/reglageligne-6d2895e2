
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
    <div className="printable-block mb-1 p-1 border border-gray-200 rounded-sm print:p-0.25 print:text-xs print:border-[0.5px] print:mb-0 print:break-inside-avoid">
      <h2 className="text-sm font-bold mb-0.5 text-jaune-500 print:mb-0 print:text-[14px]">{bloc.nom}</h2>
      <div className="space-y-0">
        {champsVisibles
          .sort((a, b) => a.ordre - b.ordre)
          .map(champ => (
            <div key={champ.id} className="flex flex-row items-start gap-0.5 mb-0.5 print:mb-0 print:gap-0.25">
              <div className="font-semibold text-xs print:text-[12px] w-16 print:w-12 min-w-fit whitespace-nowrap">{champ.nom}:</div>
              <div className="text-xs print:text-[12px] print:break-words">{getChampValeur(champ.nomTechnique)}</div>
            </div>
          ))
        }
      </div>
      
      {bloc.id === "cadencePersonnel" && estChampVisible("cadencePersonnel", "commentaire") && (
        <div className="mt-0.5 print:mt-0">
          <h3 className="font-semibold text-xs print:text-[12px]">Commentaire:</h3>
          <p className="whitespace-pre-line text-xs print:text-[12px] print:break-words">{produit.commentaire || "-"}</p>
        </div>
      )}
    </div>
  );
};

export default ProduitFicheBloc;
