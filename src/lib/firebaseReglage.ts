
// Utilitaires pour lire/écrire des réglages dans Firestore
import { doc, setDoc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { BlocConfiguration, Produit } from "@/types";

export interface ReglageFirebase {
  codeArticle: string;
  numeroLigne: string;
  // champReglage: la clé du champ, et sa valeur dynamique (ex : { calibreur1: "valeur" })
  [champReglage: string]: string;
}

const REGLES_COLLECTION = "reglages";
const BLOCS_COLLECTION = "blocsConfig";

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
    
    // Vérifier si le document existe déjà
    const docSnap = await getDoc(ref);
    
    // Si le document existe, on fait une mise à jour, sinon on le crée
    if (docSnap.exists()) {
      console.log(`Firebase: setReglage - Le document ${id} existe déjà, mise à jour`);
    } else {
      console.log(`Firebase: setReglage - Création d'un nouveau document pour ${id}`);
    }
    
    // Utilise setDoc avec merge:true pour ne MAJ qu'un champ et garder les autres intacts
    await setDoc(ref, { 
      codeArticle, 
      numeroLigne, 
      [champReglage]: valeur 
    }, { merge: true });
    
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

// Sauvegarde complète d'un produit (tous les champs d'un coup)
export async function sauvegarderProduitComplet(produit: Record<string, string>) {
  try {
    if (!produit.codeArticle || !produit.numeroLigne) {
      console.error("Firebase sauvegarderProduitComplet: codeArticle ou numeroLigne manquant", { produit });
      throw new Error("codeArticle et numeroLigne sont requis pour enregistrer un produit");
    }
    
    const id = `${produit.codeArticle}_${produit.numeroLigne}`;
    console.log(`Firebase: sauvegarderProduitComplet - Enregistrement complet pour ${id}`);
    
    const ref = doc(db, REGLES_COLLECTION, id);
    await setDoc(ref, produit, { merge: true });
    
    console.log(`Firebase: sauvegarderProduitComplet - Succès pour ${id}`);
    return true;
  } catch (error) {
    console.error("Firebase: Erreur lors de l'enregistrement complet du produit:", error);
    throw error;
  }
}

// Sauvegarde la configuration des blocs
export async function sauvegarderBlocsConfiguration(blocs: BlocConfiguration[]) {
  try {
    console.log(`Firebase: sauvegarderBlocsConfiguration - Enregistrement de ${blocs.length} blocs`);
    console.log(`Contenu des blocs à sauvegarder:`, JSON.stringify(blocs, null, 2));
    
    // Vérification de l'existence des propriétés importantes
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
    
    const ref = doc(db, BLOCS_COLLECTION, "configuration");
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
    
    const ref = doc(db, BLOCS_COLLECTION, "configuration");
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

// Ajoute la fonction suivante à la fin du fichier :
export async function getAllProduits(): Promise<Produit[]> {
  try {
    const snapshot = await getDocs(collection(db, "reglages"));
    const produits: Produit[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      produits.push({
        ...data,
        id: docSnap.id,
      } as Produit);
    });
    return produits;
  } catch (error) {
    console.error("Erreur lors de la récupération de tous les produits:", error);
    return [];
  }
}
