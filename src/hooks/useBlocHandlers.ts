
import { BlocConfiguration, ChampConfiguration } from "@/types";

/**
 * Bloc manipulation helpers, to be used within useBlocsManager.
 */
export function uniqueId(prefix: string) {
  return `${prefix}_${Math.floor(Date.now() * Math.random())}`;
}

// Handles moving a bloc up or down in the list and updates ordre
export function moveBloc(blocs: BlocConfiguration[], blocId: string, direction: "up" | "down") {
  const blocIndex = blocs.findIndex((bloc) => bloc.id === blocId);
  if (
    (direction === "up" && blocIndex === 0) ||
    (direction === "down" && blocIndex === blocs.length - 1)
  ) {
    return blocs;
  }
  const newBlocs = [...blocs];
  const targetIndex = direction === "up" ? blocIndex - 1 : blocIndex + 1;
  const tempOrdre = newBlocs[blocIndex].ordre;
  newBlocs[blocIndex].ordre = newBlocs[targetIndex].ordre;
  newBlocs[targetIndex].ordre = tempOrdre;
  [newBlocs[blocIndex], newBlocs[targetIndex]] = [newBlocs[targetIndex], newBlocs[blocIndex]];
  return newBlocs;
}

// Handles deleting a bloc
export function deleteBloc(blocs: BlocConfiguration[], blocId: string) {
  const updatedBlocs = blocs.filter(bloc => bloc.id !== blocId);
  updatedBlocs.forEach((bloc, index) => {
    bloc.ordre = index + 1;
  });
  return updatedBlocs;
}

// Handles changing a bloc field
export function blocChange(blocs: BlocConfiguration[], id: string, field: keyof BlocConfiguration, value: any) {
  const updatedBlocs = blocs.map((bloc) =>
    bloc.id === id ? { ...bloc, [field]: value } : bloc
  );
  return updatedBlocs;
}

// Handles changing lignesApplicables for a bloc
export function blocLignesApplicables(blocs: BlocConfiguration[], blocId: string, value: string) {
  const lignesArray = value
    .split(",")
    .map((ligne) => ligne.trim())
    .filter((ligne) => ligne);

  return blocChange(blocs, blocId, "lignesApplicables", lignesArray);
}
