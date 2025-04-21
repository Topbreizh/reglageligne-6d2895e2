
// Utilitaires pour lire/écrire des réglages dans Firestore
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface ReglageFirebase {
  codeArticle: string;
  numeroLigne: string;
  // champReglage: la clé du champ, et sa valeur dynamique (ex : { calibreur1: "valeur" })
  [champReglage: string]: string;
}

const REGLES_COLLECTION = "reglages";

// Sauvegarde ou mise à jour d’un champ réglage pour un codeArticle/numeroLigne
export async function setReglage(
  codeArticle: string,
  numeroLigne: string,
  champReglage: string,
  valeur: string
) {
  const id = `${codeArticle}_${numeroLigne}`;
  const ref = doc(db, REGLES_COLLECTION, id);
  // Utilise setDoc avec merge:true pour ne MAJ qu’un champ et garder les autres intacts
  await setDoc(ref, { codeArticle, numeroLigne, [champReglage]: valeur }, { merge: true });
}

// Récupère tous les réglages pour un codeArticle/numeroLigne
export async function getReglage(
  codeArticle: string,
  numeroLigne: string
): Promise<ReglageFirebase | null> {
  const id = `${codeArticle}_${numeroLigne}`;
  const ref = doc(db, REGLES_COLLECTION, id);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data() as ReglageFirebase;
  }
  return null;
}
