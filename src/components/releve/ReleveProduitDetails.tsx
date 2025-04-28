
import { Produit } from "@/types";
import { blocsConfiguration } from "@/data/blocConfig";

interface ReleveProduitDetailsProps {
  produit: Produit;
}

export const ReleveProduitDetails = ({ produit }: ReleveProduitDetailsProps) => {
  const renderBlocs = () => {
    return blocsConfiguration.map((bloc) => {
      const champsVisibles = bloc.champs.filter(champ => {
        return champ.visible && 
               (champ.lignesApplicables.includes('*') || 
                champ.lignesApplicables.includes(produit.numeroLigne));
      });

      if (champsVisibles.length === 0) return null;

      return (
        <div key={bloc.id} className="border-t pt-2 mt-2">
          <div className="font-semibold mb-1 text-xs">{bloc.nom}</div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
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
    }).filter(Boolean);
  };

  const renderChampsSupplémentaires = () => {
    const champsConnus = new Set();
    
    blocsConfiguration.forEach(bloc => {
      bloc.champs.forEach(champ => {
        champsConnus.add(champ.nomTechnique);
      });
    });
    
    const champsSupplémentaires = Object.entries(produit)
      .filter(([key, value]) => {
        return !champsConnus.has(key) && 
               key !== "id" && 
               value && 
               typeof value === 'string' && 
               value.trim() !== "";
      });
    
    if (champsSupplémentaires.length === 0) return null;
    
    return (
      <div className="border-t pt-2 mt-2">
        <div className="font-semibold mb-1 text-xs">Autres informations</div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
          {champsSupplémentaires.map(([key, value]) => (
            <div key={key} className="overflow-hidden text-ellipsis">
              <span className="font-medium">{key}:</span> {value}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-1 mt-2 print:mt-0">
      <div className="grid grid-cols-2 gap-2 text-xs">
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
      {renderChampsSupplémentaires()}
      
      {produit.commentaire && (
        <div className="border-t pt-2">
          <div className="font-medium text-xs">Commentaire</div>
          <p className="text-xs">{produit.commentaire}</p>
        </div>
      )}
    </div>
  );
};
