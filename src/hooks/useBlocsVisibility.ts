
import { useCallback } from "react";
import { BlocConfiguration, Produit } from "@/types";

/**
 * Manage bloc and champ visibility for ProduitForm.
 */
export const useBlocsVisibility = (
  blocsConfig: BlocConfiguration[],
  formData: Produit
) => {
  const estChampVisible = useCallback(
    (blocId: string, champId: string) => {
      const bloc = blocsConfig.find((b) => b.id === blocId);
      if (!bloc || !bloc.visible) return false;
      const champ = bloc.champs.find((c) => c.id === champId);
      if (!champ || !champ.visible) return false;
      if (formData.numeroLigne && champ.lignesApplicables.length > 0) {
        if (champ.lignesApplicables.includes("*")) return true;
        if (champ.lignesApplicables.includes(formData.numeroLigne)) return true;
        return false;
      }
      return true;
    },
    [blocsConfig, formData.numeroLigne]
  );

  const estBlocVisible = useCallback(
    (blocId: string) => {
      const bloc = blocsConfig.find((b) => b.id === blocId);
      if (!bloc || !bloc.visible) return false;
      if (formData.numeroLigne && bloc.lignesApplicables.length > 0) {
        if (bloc.lignesApplicables.includes("*")) return true;
        if (bloc.lignesApplicables.includes(formData.numeroLigne)) return true;
        return false;
      }
      return true;
    },
    [blocsConfig, formData.numeroLigne]
  );

  return { estChampVisible, estBlocVisible };
};
