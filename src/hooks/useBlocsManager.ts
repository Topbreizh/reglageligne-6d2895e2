
import { useState, useEffect } from "react";
import { BlocConfiguration, ChampConfiguration } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useBlocStateManager } from "./useBlocStateManager";
import { useEditingStateManager } from "./useEditingStateManager";
import { saveBlocsConfig } from "./useSaveBlocsConfiguration";

/** Hook principal orchestrant les tâches, délègue les sous-tâches aux aides */
export const useBlocsManager = (initialConfiguration: BlocConfiguration[], onConfigurationChange?: (blocs: BlocConfiguration[]) => void) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  // Use specialized hooks for each aspect of state management
  const { 
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
  } = useBlocStateManager(initialConfiguration, onConfigurationChange, toast);
  
  const {
    editingBloc,
    editingChamp,
    setEditingBloc,
    setEditingChamp
  } = useEditingStateManager();

  useEffect(() => {
    if (initialConfiguration && initialConfiguration.length > 0) {
      console.log("Setting initial blocs configuration:", initialConfiguration);
      setBlocs(JSON.parse(JSON.stringify(initialConfiguration)));
    }
  }, [initialConfiguration, setBlocs]);

  const saveConfiguration = async () => {
    console.log("Saving configuration with blocs:", blocs);
    await saveBlocsConfig(blocs, toast, setIsSaving);
  };

  return {
    blocs,
    isSaving,
    editingBloc,
    editingChamp,
    setEditingBloc,
    setEditingChamp,
    handleBlocChange,
    handleChampChange,
    handleLignesApplicablesChange,
    moveBloc: moveBlocHandler,
    moveChamp: moveChampHandler,
    handleAddBloc,
    handleAddChamp,
    handleDeleteBloc,
    handleDeleteChamp,
    saveConfiguration
  };
};
