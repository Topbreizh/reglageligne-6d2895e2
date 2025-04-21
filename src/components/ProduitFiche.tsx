
import { useState, useEffect } from "react";
import { Produit, BlocConfiguration } from "@/types";
import { blocsConfiguration as defaultBlocsConfig } from "@/data/blocConfig";
import { Button } from "@/components/ui/button";
import { FileText, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { getBlocsConfiguration } from "@/lib/firebaseReglage";

interface ProduitFicheProps {
  produit: Produit;
}

const ProduitFiche = ({ produit }: ProduitFicheProps) => {
  const [blocsConfig, setBlocsConfig] = useState<BlocConfiguration[]>(defaultBlocsConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlocsConfig = async () => {
      try {
        setLoading(true);
        const savedConfig = await getBlocsConfiguration();
        
        if (savedConfig && savedConfig.length > 0) {
          console.log("Configuration des blocs chargée pour la fiche:", savedConfig);
          setBlocsConfig(savedConfig);
        } else {
          console.log("Aucune configuration personnalisée trouvée, utilisation de la configuration par défaut");
          setBlocsConfig(defaultBlocsConfig);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la configuration des blocs:", error);
        setBlocsConfig(defaultBlocsConfig);
      } finally {
        setLoading(false);
      }
    };

    fetchBlocsConfig();
  }, []);

  const printFiche = () => {
    window.print();
  };

  const estChampVisible = (blocId: string, champId: string) => {
    const bloc = blocsConfig.find(b => b.id === blocId);
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
    const bloc = blocsConfig.find(b => b.id === blocId);
    if (!bloc || !bloc.visible) return false;
    
    // Vérifier si le bloc est applicable pour la ligne courante
    if (produit.numeroLigne && bloc.lignesApplicables.length > 0) {
      // Si le bloc n'est pas applicable à toutes les lignes (*) et qu'il a des lignes spécifiques
      if (!bloc.lignesApplicables.includes("*")) {
        // Vérifier si la ligne courante est dans la liste des lignes applicables
        return bloc.lignesApplicables.includes(produit.numeroLigne);
      }
    }
    
    // Traitement spécifique pour les blocs "guillotine" et "distributeurCreme"
    // Ces blocs ne doivent pas s'afficher pour les lignes 2 et 5
    if ((blocId === "guillotine" || blocId === "distributeurCreme") && produit.numeroLigne) {
      return !["2", "5"].includes(produit.numeroLigne);
    }
    
    return true;
  };

  const getChampValeur = (champTechnique: string) => {
    return produit[champTechnique as keyof Produit] || "-";
  };

  const renderChamp = (blocId: string, champId: string) => {
    const bloc = blocsConfig.find(b => b.id === blocId);
    if (!bloc) return null;
    
    const champ = bloc.champs.find(c => c.id === champId);
    if (!champ) return null;
    
    if (!estChampVisible(blocId, champId)) return null;
    
    return (
      <div key={champ.id} className="flex flex-col md:flex-row md:items-center mb-2">
        <div className="font-semibold w-40">{champ.nom}:</div>
        <div>{getChampValeur(champ.nomTechnique)}</div>
      </div>
    );
  };

  const renderBlocs = () => {
    return blocsConfig
      .filter(bloc => {
        // Vérifier si le bloc doit être affiché selon sa configuration et la ligne du produit
        const blocVisible = estBlocVisible(bloc.id);
        
        // Pour les blocs spécifiques, vérification supplémentaire explicite
        if (blocVisible) {
          // Ne pas afficher le bloc façonnage 1-4-6 si on est sur ligne 2 ou 5
          if (bloc.id === "faconnage146" && produit.numeroLigne) {
            return ["1", "4", "6"].includes(produit.numeroLigne);
          }
          
          // Ne pas afficher le bloc façonnage 2-5 si on n'est pas sur ligne 2 ou 5
          if (bloc.id === "faconnage25" && produit.numeroLigne) {
            return ["2", "5"].includes(produit.numeroLigne);
          }
          
          // Traitement spécial pour Guillotine et Distributeur crème
          if ((bloc.id === "guillotine" || bloc.id === "distributeurCreme") && produit.numeroLigne) {
            // Ces blocs ne devraient pas s'afficher pour les lignes 2 et 5
            return !["2", "5"].includes(produit.numeroLigne);
          }
        }
        
        return blocVisible;
      })
      .sort((a, b) => a.ordre - b.ordre)
      .map(bloc => {
        return (
          <div key={bloc.id} className="printable-block mb-6 p-4 border border-gray-200 rounded-lg">
            <h2 className="text-lg font-bold mb-3 text-jaune-500">{bloc.nom}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              {bloc.champs
                .filter(champ => {
                  // Si le champ est applicable à toutes les lignes
                  if (champ.lignesApplicables.includes("*")) return true;
                  
                  // Si aucune ligne n'est spécifiée pour le produit, afficher tous les champs
                  if (!produit.numeroLigne) return true;
                  
                  // Si le champ a des lignes applicables, vérifier si la ligne actuelle est incluse
                  if (champ.lignesApplicables.length > 0) {
                    return champ.lignesApplicables.includes(produit.numeroLigne);
                  }
                  
                  // Par défaut, afficher le champ
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

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jaune-300"></div>
      </div>
    );
  }

  return (
    <div className="printable-page">
      <div className="printable-header mb-6">
        <h1 className="text-2xl font-bold">
          Fiche Produit: {produit.designation} ({produit.codeArticle})
        </h1>
        <div className="no-print flex gap-2 mt-2">
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
