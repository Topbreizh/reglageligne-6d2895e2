import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { BlocConfiguration, Produit } from "@/types";

export interface ReglageFirebase {
  codeArticle: string;
  numeroLigne: string;
  [champReglage: string]: string;
}

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
    const ref = doc(db, "reglages", id);

    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      console.log(`Firebase: setReglage - Le document ${id} existe déjà, mise à jour`);
    } else {
      console.log(`Firebase: setReglage - Création d'un nouveau document pour ${id}`);
    }

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
    const ref = doc(db, "reglages", id);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      console.log(`Firebase: getReglage - Données trouvées pour ${id}`, data);
      // Vérification du bloc calcul de pâte
      console.log("Données du bloc calcul de pâte dans Firebase:", {
        poidsPate: data.poidsPate,
        poidsArticle: data.poidsArticle,
        quantitePate: data.quantitePate
      });
      return data as ReglageFirebase;
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
    const reglagesRef = collection(db, "reglages");
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

// Fonction pour sauvegarder un produit complet
export async function sauvegarderProduitComplet(produit: Record<string, string>): Promise<boolean> {
  try {
    const { codeArticle, numeroLigne } = produit;
    
    if (!codeArticle || !numeroLigne) {
      console.error("codeArticle et numeroLigne sont requis pour enregistrer un produit");
      throw new Error("codeArticle et numeroLigne sont requis pour enregistrer un produit");
    }
    
    const id = `${codeArticle}_${numeroLigne}`;
    console.log(`Firebase: sauvegarderProduitComplet - Enregistrement du produit ${id}`);
    
    // S'assurer que les champs du bloc calculPate sont bien présents
    console.log("Valeurs des champs calculPate avant enregistrement:", {
      poidPatequalistat: produit.poidPatequalistat || "",
      poidFourragequalistat: produit.poidFourragequalistat || "",
      poidMarquantqualistat: produit.poidMarquantqualistat || "",
      nbrDeBandes: produit.nbrDeBandes || ""
    });
    
    const ref = doc(db, "reglages", id);
    await setDoc(ref, produit, { merge: true });
    
    console.log(`Firebase: sauvegarderProduitComplet - Succès pour le produit ${id}`);
    return true;
  } catch (error) {
    console.error("Firebase: Erreur lors de l'enregistrement du produit complet:", error);
    throw error;
  }
}
