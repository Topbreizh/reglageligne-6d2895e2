
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { BlocConfiguration } from "@/types";

// Sauvegarde la configuration des blocs
export async function sauvegarderBlocsConfiguration(blocs: BlocConfiguration[]) {
  try {
    console.log(`Firebase: sauvegarderBlocsConfiguration - Enregistrement de ${blocs.length} blocs`);
    console.log(`Contenu des blocs à sauvegarder:`, JSON.stringify(blocs, null, 2));
    
    // Vérifier et signaler les problèmes potentiels avec la configuration
    blocs.forEach((bloc, i) => {
      if (!bloc.nomTechnique) {
        console.warn(`Attention: le bloc #${i} (${bloc.nom}) n'a pas de nomTechnique`);
      }
      bloc.champs.forEach((champ, j) => {
        if (!champ.nomTechnique) {
          console.warn(`Attention: dans bloc "${bloc.nom}", le champ #${j} (${champ.nom}) n'a pas de nomTechnique`);
        }
      });
    });

    // S'assurer que tous les champs ont les propriétés requises avant l'enregistrement
    const blocsValidated = blocs.map(bloc => ({
      ...bloc,
      champs: bloc.champs.map(champ => ({
        ...champ,
        // S'assurer que ces propriétés existent pour chaque champ
        id: champ.id,
        nom: champ.nom,
        nomTechnique: champ.nomTechnique,
        ordre: champ.ordre,
        visible: typeof champ.visible === 'boolean' ? champ.visible : true,
        lignesApplicables: Array.isArray(champ.lignesApplicables) ? champ.lignesApplicables : ["*"]
      }))
    }));

    const ref = doc(db, "blocsConfig", "configuration");
    await setDoc(ref, { blocs: blocsValidated }, { merge: true });
    console.log(`Firebase: sauvegarderBlocsConfiguration - Succès`);
    return true;
  } catch (error) {
    console.error("Firebase: Erreur lors de l'enregistrement de la configuration des blocs:", error);
    throw error;
  }
}

// Récupère la configuration des blocs
export async function getBlocsConfiguration(): Promise<BlocConfiguration[] | null> {
  try {
    console.log(`Firebase: getBlocsConfiguration - Récupération de la configuration des blocs`);
    const ref = doc(db, "blocsConfig", "configuration");
    const snap = await getDoc(ref);

    if (snap.exists() && snap.data().blocs) {
      const blocsData = snap.data().blocs;
      console.log(`Firebase: getBlocsConfiguration - Configuration trouvée`, blocsData);
      
      // S'assurer que tous les blocs ont la structure correcte
      const blocsValidated = blocsData.map((bloc: any) => ({
        ...bloc,
        id: bloc.id || `bloc_${Date.now()}`,
        nom: bloc.nom || "Bloc sans nom",
        nomTechnique: bloc.nomTechnique || bloc.nom?.toLowerCase().replace(/[^a-z0-9]/g, '_') || `bloc_${Date.now()}`,
        ordre: typeof bloc.ordre === 'number' ? bloc.ordre : 0,
        visible: typeof bloc.visible === 'boolean' ? bloc.visible : true,
        lignesApplicables: Array.isArray(bloc.lignesApplicables) ? bloc.lignesApplicables : ["*"],
        champs: Array.isArray(bloc.champs) ? bloc.champs.map((champ: any) => ({
          ...champ,
          id: champ.id || `champ_${Date.now()}`,
          nom: champ.nom || "Champ sans nom",
          nomTechnique: champ.nomTechnique || champ.nom?.toLowerCase().replace(/[^a-z0-9]/g, '_') || `champ_${Date.now()}`,
          ordre: typeof champ.ordre === 'number' ? champ.ordre : 0,
          visible: typeof champ.visible === 'boolean' ? champ.visible : true,
          lignesApplicables: Array.isArray(champ.lignesApplicables) ? champ.lignesApplicables : ["*"]
        })) : []
      }));
      
      return blocsValidated as BlocConfiguration[];
    }
    console.log(`Firebase: getBlocsConfiguration - Aucune configuration trouvée`);
    return null;
  } catch (error) {
    console.error("Firebase: Erreur lors de la récupération de la configuration des blocs:", error);
    return null;
  }
}
