
import { BlocConfiguration, ChampConfiguration } from "@/types";

export function moveChamp(blocs: BlocConfiguration[], blocId: string, champId: string, direction: "up" | "down") {
  const blocIndex = blocs.findIndex((bloc) => bloc.id === blocId);
  if (blocIndex < 0) return blocs;
  const champs = [...blocs[blocIndex].champs];
  const champIndex = champs.findIndex((champ) => champ.id === champId);
  if (
    (direction === "up" && champIndex === 0) ||
    (direction === "down" && champIndex === champs.length - 1)
  ) {
    return blocs;
  }
  const targetIndex = direction === "up" ? champIndex - 1 : champIndex + 1;
  const tempOrdre = champs[champIndex].ordre;
  champs[champIndex].ordre = champs[targetIndex].ordre;
  champs[targetIndex].ordre = tempOrdre;
  [champs[champIndex], champs[targetIndex]] = [champs[targetIndex], champs[champIndex]];
  const updatedBlocs = [...blocs];
  updatedBlocs[blocIndex].champs = champs;
  return updatedBlocs;
}

export function deleteChamp(blocs: BlocConfiguration[], blocId: string, champId: string) {
  return blocs.map(bloc => {
    if (bloc.id === blocId) {
      const filteredChamps = bloc.champs.filter(champ => champ.id !== champId);
      filteredChamps.forEach((champ, index) => {
        champ.ordre = index + 1;
      });
      return { ...bloc, champs: filteredChamps };
    }
    return bloc;
  });
}

// Handles changing a champ field
export function champChange(blocs: BlocConfiguration[], blocId: string, champId: string, field: keyof ChampConfiguration, value: any) {
  return blocs.map((bloc) => {
    if (bloc.id === blocId) {
      return {
        ...bloc,
        champs: bloc.champs.map((champ) =>
          champ.id === champId ? { ...champ, [field]: value } : champ
        ),
      };
    }
    return bloc;
  });
}

// Handles changing lignesApplicables for a champ
export function champLignesApplicables(blocs: BlocConfiguration[], blocId: string, champId: string, value: string) {
  const lignesArray = value
    .split(",")
    .map((ligne) => ligne.trim())
    .filter((ligne) => ligne);

  return champChange(blocs, blocId, champId, "lignesApplicables", lignesArray);
}
