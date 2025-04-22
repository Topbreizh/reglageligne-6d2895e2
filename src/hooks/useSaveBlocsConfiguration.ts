
import { BlocConfiguration, ChampConfiguration } from "@/types";
import { sauvegarderBlocsConfiguration } from "@/lib/firebaseReglage";

/** Generates a unique technical name for a bloc or champ */
export function generateUniqueTechnicalName(baseName: string, existingNames: string[]): string {
  let candidate = baseName.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  if (existingNames.includes(candidate)) {
    let counter = 1;
    while (existingNames.includes(`${candidate}${counter}`)) {
      counter++;
    }
    return `${candidate}${counter}`;
  }
  return candidate;
}

/** Validates all blocs and champs, generating missing technical names */
export function ensureTechnicalNames(blocs: BlocConfiguration[]): BlocConfiguration[] {
  return blocs.map(bloc => {
    if (!bloc.nomTechnique) {
      bloc.nomTechnique = generateUniqueTechnicalName(bloc.nom, blocs.filter(b => b.id !== bloc.id).map(b => b.nomTechnique || ''));
    }
    const champsVerifies = bloc.champs.map(champ => {
      if (!champ.nomTechnique) {
        const existingNames = bloc.champs.filter(c => c.id !== champ.id).map(c => c.nomTechnique);
        champ.nomTechnique = generateUniqueTechnicalName(champ.nom, existingNames);
      }
      return champ;
    });
    return {
      ...bloc,
      champs: champsVerifies
    };
  });
}

/** Handles saving to the database */
export async function saveBlocsConfig(blocs: BlocConfiguration[], toast: (opts: any) => void, setIsSaving: (v: boolean) => void) {
  try {
    setIsSaving(true);
    const blocsToSave = ensureTechnicalNames(JSON.parse(JSON.stringify(blocs)));
    await sauvegarderBlocsConfiguration(blocsToSave);
    toast({
      title: "Configuration sauvegardée",
      description: "Les modifications des blocs et champs ont été enregistrées dans la base de données.",
    });
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Impossible de sauvegarder la configuration. Veuillez réessayer.",
    });
    throw error;
  } finally {
    setIsSaving(false);
  }
}
