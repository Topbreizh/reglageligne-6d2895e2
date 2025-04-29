
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
  
  // Handle special case for calculPate bloc
  const isCalculPateBloc = bloc.id === "calculPate";
  
  if (champsVisibles.length === 0 && !isCalculPateBloc) {
    return null;
  }
  
  // S'assurer que les champs importants des calcul matières sont toujours traités
  if (isCalculPateBloc) {
    console.log("Rendering calculPate bloc with fields:", 
      produit.poidPatequalistat,
      produit.poidFourragequalistat,
      produit.poidMarquantqualistat,
      produit.nbrDeBandes
    );
  }

  return (
    <div className="printable-block mb-6 p-4 border border-gray-200 rounded-lg">
      <h2 className="text-lg font-bold mb-3 text-jaune-500">{bloc.nom}</h2>
      <div className="space-y-2">
        {champsVisibles
          .sort((a, b) => a.ordre - b.ordre)
          .map(champ => (
            <div key={champ.id} className="flex flex-col md:flex-row md:items-center mb-2">
              <div className="font-semibold w-40">{champ.nom}:</div>
              <div>{getChampValeur(champ.nomTechnique)}</div>
            </div>
          ))
        }
        
        {/* Afficher explicitement les champs importants pour le bloc calculPate si c'est ce bloc */}
        {isCalculPateBloc && (
          <>
            {produit.poidPatequalistat && (
              <div className="flex flex-col md:flex-row md:items-center mb-2">
                <div className="font-semibold w-40">Poids pâte Qualistat:</div>
                <div>{produit.poidPatequalistat}</div>
              </div>
            )}
            {produit.poidFourragequalistat && (
              <div className="flex flex-col md:flex-row md:items-center mb-2">
                <div className="font-semibold w-40">Poids fourrage qualistat:</div>
                <div>{produit.poidFourragequalistat}</div>
              </div>
            )}
            {produit.poidMarquantqualistat && (
              <div className="flex flex-col md:flex-row md:items-center mb-2">
                <div className="font-semibold w-40">Poids marquant qualistat:</div>
                <div>{produit.poidMarquantqualistat}</div>
              </div>
            )}
            {produit.nbrDeBandes && (
              <div className="flex flex-col md:flex-row md:items-center mb-2">
                <div className="font-semibold w-40">Nombre de bandes:</div>
                <div>{produit.nbrDeBandes}</div>
              </div>
            )}
            {produit.rognure && (
              <div className="flex flex-col md:flex-row md:items-center mb-2">
                <div className="font-semibold w-40">% Rognure:</div>
                <div>{produit.rognure}</div>
              </div>
            )}
          </>
        )}
      </div>
      
      {bloc.id === "cadencePersonnel" && estChampVisible("cadencePersonnel", "commentaire") && (
        <div className="mt-4">
          <h3 className="font-semibold">Commentaire:</h3>
          <p className="whitespace-pre-line">{produit.commentaire || "-"}</p>
        </div>
      )}
    </div>
  );
};

export default ProduitFicheBloc;
