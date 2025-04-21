
// Utilitaires pour lire/écrire des réglages dans Firestore
import { doc, setDoc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

export interface ReglageFirebase {
  codeArticle: string;
  numeroLigne: string;
  // champReglage: la clé du champ, et sa valeur dynamique (ex : { calibreur1: "valeur" })
  [champReglage: string]: string;
}

const REGLES_COLLECTION = "reglages";

// Sauvegarde ou mise à jour d'un champ réglage pour un codeArticle/numeroLigne
export async function setReglage(
  codeArticle: string,
  numeroLigne: string,
  champReglage: string,
  valeur: string
) {
  try {
    if (!codeArticle || !numeroLigne) {
      console.error("Firebase setReglage: codeArticle ou numeroLigne manquant", { codeArticle, numeroLigne });
      throw new Error("codeArticle et numeroLigne sont requis pour enregistrer un réglage");
    }
    
    const id = `${codeArticle}_${numeroLigne}`;
    console.log(`Firebase: setReglage - Enregistrement de ${champReglage}=${valeur} pour ${id}`);
    
    const ref = doc(db, REGLES_COLLECTION, id);
    // Utilise setDoc avec merge:true pour ne MAJ qu'un champ et garder les autres intacts
    await setDoc(ref, { codeArticle, numeroLigne, [champReglage]: valeur }, { merge: true });
    console.log(`Firebase: setReglage - Succès pour ${champReglage}=${valeur}`);
    return true;
  } catch (error) {
    console.error("Firebase: Erreur lors de l'enregistrement du réglage:", error);
    throw error;
  }
}

// Récupère tous les réglages pour un codeArticle/numeroLigne
export async function getReglage(
  codeArticle: string,
  numeroLigne: string
): Promise<ReglageFirebase | null> {
  try {
    if (!codeArticle || !numeroLigne) {
      console.error("Firebase getReglage: codeArticle ou numeroLigne manquant", { codeArticle, numeroLigne });
      return null;
    }
    
    const id = `${codeArticle}_${numeroLigne}`;
    console.log(`Firebase: getReglage - Récupération des données pour ${id}`);
    
    const ref = doc(db, REGLES_COLLECTION, id);
    const snap = await getDoc(ref);
    
    if (snap.exists()) {
      console.log(`Firebase: getReglage - Données trouvées pour ${id}`, snap.data());
      return snap.data() as ReglageFirebase;
    }
    
    console.log(`Firebase: getReglage - Aucune donnée trouvée pour ${id}`);
    return null;
  } catch (error) {
    console.error("Firebase: Erreur lors de la récupération du réglage:", error);
    return null;
  }
}

// Recherche des réglages par codeArticle
export async function rechercheParCodeArticle(codeArticle: string): Promise<ReglageFirebase[]> {
  try {
    console.log(`Firebase: recherche par codeArticle ${codeArticle}`);
    const reglagesRef = collection(db, REGLES_COLLECTION);
    const q = query(reglagesRef, where("codeArticle", "==", codeArticle));
    const querySnapshot = await getDocs(q);
    
    const resultats: ReglageFirebase[] = [];
    querySnapshot.forEach((doc) => {
      resultats.push(doc.data() as ReglageFirebase);
    });
    
    console.log(`Firebase: ${resultats.length} résultats trouvés pour codeArticle=${codeArticle}`);
    return resultats;
  } catch (error) {
    console.error("Firebase: Erreur lors de la recherche par codeArticle:", error);
    return [];
  }
}
