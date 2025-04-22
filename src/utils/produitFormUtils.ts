
import { Produit } from "@/types";

export function isRequiredField(fieldName: string): boolean {
  return (
    fieldName === "codeArticle" ||
    fieldName === "numeroLigne" ||
    fieldName === "designation"
  );
}

// Vérifie si un champ est visible en fonction de la configuration
export function estChampVisible(blocId: string, champId: string, blocsConfig: any[], numeroLigne?: string) {
  const bloc = blocsConfig.find(b => b.id === blocId);
  if (!bloc || !bloc.visible) return false;
  
  const champ = bloc.champs.find((c: any) => c.id === champId);
  if (!champ || !champ.visible) return false;
  
  // Vérifier si le champ est applicable pour la ligne courante
  if (numeroLigne && champ.lignesApplicables && champ.lignesApplicables.length > 0) {
    if (champ.lignesApplicables.includes("*")) return true;
    if (champ.lignesApplicables.includes(numeroLigne)) return true;
    return false;
  }
  
  return true;
}

// Vérifie si un bloc est visible en fonction de la configuration
export function estBlocVisible(blocId: string, blocsConfig: any[], numeroLigne?: string) {
  const bloc = blocsConfig.find(b => b.id === blocId);
  if (!bloc || !bloc.visible) return false;
  
  if (numeroLigne && bloc.lignesApplicables && bloc.lignesApplicables.length > 0) {
    if (bloc.lignesApplicables.includes("*")) return true;
    if (bloc.lignesApplicables.includes(numeroLigne)) return true;
    return false;
  }
  
  return true;
}
