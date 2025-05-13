
import { Produit } from "@/types";
import { blocsConfiguration } from "@/data/blocConfig";

interface ReleveProduitDetailsProps {
  produit: Produit;
}

export const ReleveProduitDetails = ({ produit }: ReleveProduitDetailsProps) => {
  const renderBlocs = () => {
    return blocsConfiguration
      .filter(bloc => bloc.id !== "Article") // Filter out the Article block completely
      .map((bloc) => {
        // Special rendering for calculPate bloc
        if (bloc.id === "calculPate") {
          // Create an ordered list of fields we want to display
          const fieldMap: Record<string, string> = {
            "poidPatequalistat": "Poids pâte Qualistat",
            "poidFourragequalistat": "Poids fourrage qualistat",
            "poidMarquantqualistat": "Poids marquant Qualistat",
            "nbrDeBandes": "Nombre de bandes",
            "rognure": "% Rognure"
          };
          
          const fieldOrder = ["poidPatequalistat", "poidFourragequalistat", "poidMarquantqualistat", "nbrDeBandes", "rognure"];
          
          return (
            <div key={bloc.id} className="border-t pt-1 mt-1 print:pt-0.5 print:mt-0.5">
              <div className="font-semibold mb-0.5 text-xs print:text-[8px]">{bloc.nom}</div>
              <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 text-xs print:text-[7px]">
                {fieldOrder.map(fieldName => {
                  const value = produit[fieldName as keyof Produit] || '';
                  if (value) {
                    return (
                      <div key={fieldName} className="overflow-hidden text-ellipsis">
                        <span className="font-medium">{fieldMap[fieldName]}:</span>{" "}
                        {value}
                      </div>
                    );
                  }
                  return null;
                }).filter(Boolean)}
              </div>
            </div>
          );
        }
        
        // Standard rendering for other blocs
        const champsVisibles = bloc.champs.filter(champ => {
          return champ.visible && 
                 (champ.lignesApplicables.includes('*') || 
                  champ.lignesApplicables.includes(produit.numeroLigne));
        });

        if (champsVisibles.length === 0) return null;

        return (
          <div key={bloc.id} className="border-t pt-1 mt-1 print:pt-0.5 print:mt-0.5">
            <div className="font-semibold mb-0.5 text-xs print:text-[8px]">{bloc.nom}</div>
            <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 text-xs print:text-[7px]">
              {champsVisibles.map((champ) => {
                const valeur = produit[champ.nomTechnique as keyof Produit] || "";
                
                if (valeur) {
                  return (
                    <div key={champ.id} className="overflow-hidden text-ellipsis">
                      <span className="font-medium">{champ.nom}:</span>{" "}
                      {valeur}
                    </div>
                  );
                }
                return null;
              }).filter(Boolean)}
            </div>
          </div>
        );
      }).filter(Boolean); // Filter out any null returns
  };

  return (
    <div className="space-y-0.5 mt-2 print:mt-0.5 print:space-y-0.5">
      <div className="grid grid-cols-2 gap-1 text-xs print:text-[7px] print:gap-0.5">
        <div>
          <span className="font-medium">Code Article:</span> {produit.codeArticle}
        </div>
        <div>
          <span className="font-medium">N° Ligne:</span> {produit.numeroLigne}
        </div>
        <div className="col-span-2">
          <span className="font-medium">Désignation:</span> {produit.designation}
        </div>
      </div>
      
      {renderBlocs()}
      
      {produit.commentaire && (
        <div className="border-t pt-1 print:pt-0.5">
          <div className="font-medium text-xs print:text-[8px]">Commentaire</div>
          <p className="text-xs print:text-[7px]">{produit.commentaire}</p>
        </div>
      )}
    </div>
  );
};
