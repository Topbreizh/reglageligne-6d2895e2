
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { BlocConfiguration } from "@/types";

// Sauvegarde la configuration des blocs
export async function sauvegarderBlocsConfiguration(blocs: BlocConfiguration[]) {
  try {
    console.log(`Firebase: sauvegarderBlocsConfiguration - Enregistrement de ${blocs.length} blocs`);
    console.log(`Contenu des blocs à sauvegarder:`, JSON.stringify(blocs, null, 2));
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

    const ref = doc(db, "blocsConfig", "configuration");
    await setDoc(ref, { blocs }, { merge: true });
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
      console.log(`Firebase: getBlocsConfiguration - Configuration trouvée`, snap.data().blocs);
      return snap.data().blocs as BlocConfiguration[];
    }
    console.log(`Firebase: getBlocsConfiguration - Aucune configuration trouvée`);
    return null;
  } catch (error) {
    console.error("Firebase: Erreur lors de la récupération de la configuration des blocs:", error);
    return null;
  }
}
