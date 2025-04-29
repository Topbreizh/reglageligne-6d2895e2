
import { useState } from "react";
import { BlocConfiguration, ChampConfiguration } from "@/types";

/**
 * Hook to manage editing state for blocs and champs
 */
export const useEditingStateManager = () => {
  const [editingBloc, setEditingBloc] = useState<BlocConfiguration | null>(null);
  const [editingChamp, setEditingChamp] = useState<{champ: ChampConfiguration, blocId: string} | null>(null);

  return {
    editingBloc,
    editingChamp,
    setEditingBloc,
    setEditingChamp
  };
};
