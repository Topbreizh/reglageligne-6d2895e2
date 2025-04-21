
import { Produit } from "@/types";
import { blocsConfiguration } from "@/data/blocConfig";
import { Button } from "@/components/ui/button";
import { FileText, Pencil } from "lucide-react";
import { Link } from "react-router-dom";

interface ProduitFicheProps {
  produit: Produit;
}

const ProduitFiche = ({ produit }: ProduitFicheProps) => {
  const printFiche = () => {
    window.print();
  };

  const estChampVisible = (blocId: string, champId: string) => {
    const bloc = blocsConfiguration.find(b => b.id === blocId);
    if (!bloc || !bloc.visible) return false;
    
    const champ = bloc.champs.find(c => c.id === champId);
    if (!champ || !champ.visible) return false;
    
    // Vérifier si le champ est applicable pour la ligne courante
    if (produit.numeroLigne && champ.lignesApplicables.length > 0) {
      if (champ.lignesApplicables.includes("*")) return true;
      if (champ.lignesApplicables.includes(produit.numeroLigne)) return true;
      return false;
    }
    
    return true;
  };

  const estBlocVisible = (blocId: string) => {
    const bloc = blocsConfiguration.find(b => b.id === blocId);
    if (!bloc || !bloc.visible) return false;
    
    // Vérifier si le bloc est applicable pour la ligne courante
    if (produit.numeroLigne && bloc.lignesApplicables.length > 0) {
      if (bloc.lignesApplicables.includes("*")) return true;
      if (bloc.lignesApplicables.includes(produit.numeroLigne)) return true;
      return false;
    }
    
    return true;
  };

  const getChampValeur = (champTechnique: string) => {
    return produit[champTechnique as keyof Produit] || "-";
  };

  const renderChamp = (blocId: string, champId: string) => {
    const bloc = blocsConfiguration.find(b => b.id === blocId);
    if (!bloc) return null;
    
    const champ = bloc.champs.find(c => c.id === champId);
    if (!champ) return null;
    
    if (!estChampVisible(blocId, champId)) return null;
    
    return (
      <div className="flex flex-col md:flex-row md:items-center mb-2">
        <div className="font-semibold w-40">{champ.nom}:</div>
        <div>{getChampValeur(champ.nomTechnique)}</div>
      </div>
    );
  };

  const renderBlocs = () => {
    return blocsConfiguration
      .filter(bloc => estBlocVisible(bloc.id))
      .sort((a, b) => a.ordre - b.ordre)
      .map(bloc => {
        // Pour les blocs spécifiques aux lignes, vérifier explicitement
        if (bloc.id === "faconnage146" && 
            !["1", "4", "6"].includes(produit.numeroLigne)) {
          return null;
        }
        
        if (bloc.id === "faconnage25" && 
            !["2", "5"].includes(produit.numeroLigne)) {
          return null;
        }
        
        return (
          <div key={bloc.id} className="printable-block">
            <h2 className="text-lg font-bold mb-3 text-jaune-500">{bloc.nom}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              {bloc.champs
                .filter(champ => {
                  // Filtrer les champs applicables à la ligne courante
                  if (champ.lignesApplicables.length > 0) {
                    if (champ.lignesApplicables.includes("*")) return true;
                    if (champ.lignesApplicables.includes(produit.numeroLigne)) return true;
                    return false;
                  }
                  return true;
                })
                .sort((a, b) => a.ordre - b.ordre)
                .map(champ => renderChamp(bloc.id, champ.id))
              }
            </div>
            
            {/* Cas spécial pour le commentaire dans le bloc cadencePersonnel */}
            {bloc.id === "cadencePersonnel" && estChampVisible("cadencePersonnel", "commentaire") && (
              <div className="mt-4">
                <h3 className="font-semibold">Commentaire:</h3>
                <p className="whitespace-pre-line">{produit.commentaire || "-"}</p>
              </div>
            )}
          </div>
        );
      });
  };

  return (
    <div className="printable-page">
      <div className="printable-header">
        <h1 className="text-2xl font-bold">
          Fiche Produit: {produit.designation} ({produit.codeArticle})
        </h1>
        <div className="no-print flex gap-2">
          <Link to={`/modifier/${produit.id}`}>
            <Button className="bg-jaune-300 text-noir-800 hover:bg-jaune-400">
              <Pencil className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </Link>
          <Button onClick={printFiche} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
        </div>
      </div>

      {renderBlocs()}

      <div className="mt-6 text-center text-sm text-gray-500 no-print">
        Document généré le {new Date().toLocaleDateString('fr-FR')}
      </div>
    </div>
  );
};

export default ProduitFiche;
