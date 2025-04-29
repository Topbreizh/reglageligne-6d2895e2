
import { useState } from "react";
import { BlocConfiguration, ChampConfiguration } from "@/types";
import {
  uniqueId,
  moveBloc,
  deleteBloc,
  blocChange,
  blocLignesApplicables
} from "./useBlocHandlers";
import {
  moveChamp,
  deleteChamp,
  champChange,
  champLignesApplicables
} from "./useChampHandlers";
import { generateUniqueTechnicalName } from "./useSaveBlocsConfiguration";

/**
 * Hook to manage bloc state and operations
 */
export const useBlocStateManager = (
  initialConfiguration: BlocConfiguration[],
  onConfigurationChange?: (blocs: BlocConfiguration[]) => void,
  toast?: any
) => {
  const [blocs, setBlocs] = useState<BlocConfiguration[]>([]);

  // Changement au niveau bloc
  const handleBlocChange = (id: string, field: keyof BlocConfiguration, value: any) => {
    console.log(`handleBlocChange: Updating bloc ${id}, field ${String(field)} to:`, value);
    const updatedBlocs = blocChange(blocs, id, field, value);
    setBlocs(updatedBlocs);
    if (onConfigurationChange) {
      console.log("Calling onConfigurationChange with updated blocs");
      onConfigurationChange(updatedBlocs);
    }
  };

  // Changement au niveau champ
  const handleChampChange = (
    blocId: string,
    champId: string,
    field: keyof ChampConfiguration,
    value: any
  ) => {
    console.log(`handleChampChange: Updating champ ${champId} in bloc ${blocId}, field ${String(field)} to:`, value);
    const updatedBlocs = champChange(blocs, blocId, champId, field, value);
    console.log("Updated blocs after champ change:", updatedBlocs);
    setBlocs(updatedBlocs);
    if (onConfigurationChange) {
      console.log("Calling onConfigurationChange with updated blocs after champ change");
      onConfigurationChange(updatedBlocs);
    }
  };

  // Lignes applicables
  const handleLignesApplicablesChange = (
    blocId: string,
    champId: string | null,
    value: string
  ) => {
    console.log(`handleLignesApplicablesChange: Updating ${champId ? 'champ '+champId : 'bloc'} in bloc ${blocId} to:`, value);
    let updatedBlocs = blocs;
    if (champId) {
      updatedBlocs = champLignesApplicables(blocs, blocId, champId, value);
    } else {
      updatedBlocs = blocLignesApplicables(blocs, blocId, value);
    }
    setBlocs(updatedBlocs);
    if (onConfigurationChange) {
      console.log("Calling onConfigurationChange with updated blocs after lignes applicables change");
      onConfigurationChange(updatedBlocs);
    }
  };

  // Déplacer bloc
  const moveBlocHandler = (blocId: string, direction: "up" | "down") => {
    const updatedBlocs = moveBloc(blocs, blocId, direction);
    setBlocs(updatedBlocs);
    if (onConfigurationChange) {
      console.log("Calling onConfigurationChange after moving bloc");
      onConfigurationChange(updatedBlocs);
    }
  };

  // Déplacer champ
  const moveChampHandler = (blocId: string, champId: string, direction: "up" | "down") => {
    const updatedBlocs = moveChamp(blocs, blocId, champId, direction);
    setBlocs(updatedBlocs);
    if (onConfigurationChange) {
      console.log("Calling onConfigurationChange after moving champ");
      onConfigurationChange(updatedBlocs);
    }
  };

  // Ajouter un bloc
  const handleAddBloc = () => {
    const newOrder = blocs.length > 0 ? Math.max(...blocs.map(b => b.ordre)) + 1 : 1;
    const newId = uniqueId("bloc");
    const existingNomsTechniques = blocs.map(b => b.nomTechnique || '');
    const newNomTechnique = generateUniqueTechnicalName("nouveauBloc", existingNomsTechniques);
    const newBloc: BlocConfiguration = {
      id: newId,
      nom: "Nouveau bloc",
      nomTechnique: newNomTechnique,
      ordre: newOrder,
      lignesApplicables: ["*"],
      visible: true,
      champs: []
    };
    const newBlocs = [...blocs, newBloc];
    setBlocs(newBlocs);
    if (onConfigurationChange) {
      console.log("Calling onConfigurationChange after adding bloc");
      onConfigurationChange(newBlocs);
    }
    if (toast) {
      toast({
        title: "Bloc ajouté",
        description: "Un bloc vierge a été ajouté. Complétez ses informations.",
        duration: 3000
      });
    }
    return newBloc;
  };

  // Ajouter un champ
  const handleAddChamp = (blocId: string) => {
    const bloc = blocs.find(b => b.id === blocId);
    if (!bloc) return null;
    
    const newChampsOrder = bloc.champs.length > 0 ? Math.max(...bloc.champs.map(c => c.ordre)) + 1 : 1;
    const newId = uniqueId("champ");
    const existingNomsTechniques = bloc.champs.map(c => c.nomTechnique);
    const newNomTechnique = generateUniqueTechnicalName(`nouveauChamp${newChampsOrder}`, existingNomsTechniques);
    const newChamp: ChampConfiguration = {
      id: newId,
      nom: "Nouveau champ",
      nomTechnique: newNomTechnique,
      ordre: newChampsOrder,
      visible: true,
      lignesApplicables: ["*"]
    };
    
    const updatedBlocs = blocs.map(b => {
      if (b.id === blocId) {
        return { ...b, champs: [...b.champs, newChamp] };
      }
      return b;
    });
    
    setBlocs(updatedBlocs);
    if (onConfigurationChange) {
      console.log("Calling onConfigurationChange after adding champ");
      onConfigurationChange(updatedBlocs);
    }
    
    if (toast) {
      toast({
        title: "Champ ajouté",
        description: "Un nouveau champ a été ajouté au bloc.",
        duration: 3000
      });
    }
    
    return { champ: newChamp, blocId };
  };

  // Supprimer bloc
  const handleDeleteBloc = (blocId: string) => {
    const updatedBlocs = deleteBloc(blocs, blocId);
    setBlocs(updatedBlocs);
    if (onConfigurationChange) {
      console.log("Calling onConfigurationChange after deleting bloc");
      onConfigurationChange(updatedBlocs);
    }
    if (toast) {
      toast({
        title: "Bloc supprimé",
        description: "Le bloc a été supprimé avec succès.",
        duration: 3000
      });
    }
  };

  // Supprimer champ
  const handleDeleteChamp = (blocId: string, champId: string) => {
    const updatedBlocs = deleteChamp(blocs, blocId, champId);
    setBlocs(updatedBlocs);
    if (onConfigurationChange) {
      console.log("Calling onConfigurationChange after deleting champ");
      onConfigurationChange(updatedBlocs);
    }
    if (toast) {
      toast({
        title: "Champ supprimé",
        description: "Le champ a été supprimé avec succès.",
        duration: 3000
      });
    }
  };

  return {
    blocs,
    setBlocs,
    handleBlocChange,
    handleChampChange,
    handleLignesApplicablesChange,
    moveBlocHandler,
    moveChampHandler,
    handleAddBloc,
    handleAddChamp,
    handleDeleteBloc,
    handleDeleteChamp
  };
};
