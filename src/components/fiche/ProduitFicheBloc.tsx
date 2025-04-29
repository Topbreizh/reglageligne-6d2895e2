
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
    <div className="printable-block mb-3 p-2 border border-gray-200 rounded-lg print:p-1.5 print:text-xs">
      <h2 className="text-base font-bold mb-1.5 text-jaune-500 print:mb-1 print:text-sm">{bloc.nom}</h2>
      <div className="space-y-1">
        {champsVisibles
          .sort((a, b) => a.ordre - b.ordre)
          .map(champ => (
            <div key={champ.id} className="flex flex-row items-start gap-1 mb-1 print:mb-0.5">
              <div className="font-semibold text-sm print:text-xs w-28">{champ.nom}:</div>
              <div className="text-sm print:text-xs">{getChampValeur(champ.nomTechnique)}</div>
            </div>
          ))
        }
      </div>
      
      {bloc.id === "cadencePersonnel" && estChampVisible("cadencePersonnel", "commentaire") && (
        <div className="mt-2 print:mt-1">
          <h3 className="font-semibold text-sm print:text-xs">Commentaire:</h3>
          <p className="whitespace-pre-line text-sm print:text-xs">{produit.commentaire || "-"}</p>
        </div>
      )}
    </div>
  );
};

export default ProduitFicheBloc;
