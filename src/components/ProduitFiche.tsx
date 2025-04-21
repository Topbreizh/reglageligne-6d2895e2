
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

      {/* Bloc Article */}
      {estBlocVisible("article") && (
        <div className="printable-block">
          <h2 className="text-lg font-bold mb-3 text-jaune-500">Article</h2>
          {renderChamp("article", "codeArticle")}
          {renderChamp("article", "numeroLigne")}
          {renderChamp("article", "designation")}
        </div>
      )}

      {/* Bloc Laminage */}
      {estBlocVisible("laminage") && (
        <div className="printable-block">
          <h2 className="text-lg font-bold mb-3 text-jaune-500">Laminage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {renderChamp("laminage", "programme")}
            {renderChamp("laminage", "facteur")}
            {renderChamp("laminage", "regleLaminage")}
            {renderChamp("laminage", "quick")}
            {renderChamp("laminage", "calibreur1")}
            {renderChamp("laminage", "calibreur2")}
            {renderChamp("laminage", "calibreur3")}
            {renderChamp("laminage", "laminoir")}
            {renderChamp("laminage", "vitesseLaminage")}
            {renderChamp("laminage", "farineurHaut1")}
            {renderChamp("laminage", "farineurHaut2")}
            {renderChamp("laminage", "farineurHaut3")}
            {renderChamp("laminage", "farineurBas1")}
            {renderChamp("laminage", "farineurBas2")}
            {renderChamp("laminage", "farineurBas3")}
          </div>
        </div>
      )}

      {/* Bloc Façonnage 1-4-6 */}
      {estBlocVisible("faconnage146") && 
       (produit.numeroLigne === "1" || produit.numeroLigne === "4" || produit.numeroLigne === "6") && (
        <div className="printable-block">
          <h2 className="text-lg font-bold mb-3 text-jaune-500">Façonnage 1-4-6</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {renderChamp("faconnage146", "queueDeCarpe")}
            {renderChamp("faconnage146", "numeroDecoupe")}
            {renderChamp("faconnage146", "buse")}
            {renderChamp("faconnage146", "distributeurChocoRaisin")}
            {renderChamp("faconnage146", "humidificateur146")}
            {renderChamp("faconnage146", "vitesseDoreuse")}
          </div>
        </div>
      )}

      {/* Bloc Guillotine */}
      {estBlocVisible("guillotine") && (
        <div className="printable-block">
          <h2 className="text-lg font-bold mb-3 text-jaune-500">Guillotine</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {renderChamp("guillotine", "p1LongueurDecoupe")}
            {renderChamp("guillotine", "p2Centrage")}
            {renderChamp("guillotine", "bielle")}
            {renderChamp("guillotine", "lameRacleur")}
          </div>
        </div>
      )}

      {/* Bloc Distributeur crème */}
      {estBlocVisible("distributeurCreme") && (
        <div className="printable-block">
          <h2 className="text-lg font-bold mb-3 text-jaune-500">Distributeur crème</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {renderChamp("distributeurCreme", "rademaker")}
            {renderChamp("distributeurCreme", "aera")}
            {renderChamp("distributeurCreme", "fritch")}
          </div>
        </div>
      )}

      {/* Bloc Façonnage 2-5 */}
      {estBlocVisible("faconnage25") && 
       (produit.numeroLigne === "2" || produit.numeroLigne === "5") && (
        <div className="printable-block">
          <h2 className="text-lg font-bold mb-3 text-jaune-500">Façonnage 2-5</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {renderChamp("faconnage25", "retourneur")}
            {renderChamp("faconnage25", "aligneur")}
            {renderChamp("faconnage25", "humidificateur25")}
            {renderChamp("faconnage25", "pushPlaque")}
            {renderChamp("faconnage25", "rouleauInferieur")}
            {renderChamp("faconnage25", "rouleauSuperieur")}
            {renderChamp("faconnage25", "tapisFaconneuse")}
            {renderChamp("faconnage25", "reperePoignee")}
          </div>
        </div>
      )}

      {/* Bloc Fin de ligne */}
      {estBlocVisible("finDeLigne") && (
        <div className="printable-block">
          <h2 className="text-lg font-bold mb-3 text-jaune-500">Fin de ligne</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {renderChamp("finDeLigne", "rouleauPression")}
            {renderChamp("finDeLigne", "tapisAvantEtuveSurgel")}
            {renderChamp("finDeLigne", "etuveSurgel")}
          </div>
        </div>
      )}

      {/* Bloc Cadence, Personnel */}
      {estBlocVisible("cadencePersonnel") && (
        <div className="printable-block">
          <h2 className="text-lg font-bold mb-3 text-jaune-500">Cadence, Personnel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {renderChamp("cadencePersonnel", "cadence")}
            {renderChamp("cadencePersonnel", "lamineur")}
            {renderChamp("cadencePersonnel", "surveillant")}
            {renderChamp("cadencePersonnel", "distributeurRaisinChoco")}
            {renderChamp("cadencePersonnel", "pose")}
            {renderChamp("cadencePersonnel", "pliageTriage")}
            {renderChamp("cadencePersonnel", "topping")}
            {renderChamp("cadencePersonnel", "sortieEtuve")}
            {renderChamp("cadencePersonnel", "ouvertureMP")}
          </div>

          {estChampVisible("cadencePersonnel", "commentaire") && (
            <div className="mt-4">
              <h3 className="font-semibold">Commentaire:</h3>
              <p className="whitespace-pre-line">{produit.commentaire || "-"}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-500 no-print">
        Document généré le {new Date().toLocaleDateString('fr-FR')}
      </div>
    </div>
  );
};

export default ProduitFiche;
