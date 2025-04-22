
import { Produit } from "@/types";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase";

// Sauvegarde complète d'un produit (tous les champs d'un coup)
export async function sauvegarderProduitComplet(produit: Record<string, string>) {
  try {
    if (!produit.codeArticle || !produit.numeroLigne) {
      console.error("Firebase sauvegarderProduitComplet: codeArticle ou numeroLigne manquant", { produit });
      throw new Error("codeArticle et numeroLigne sont requis pour enregistrer un produit");
    }
    const id = `${produit.codeArticle}_${produit.numeroLigne}`;
    console.log(`Firebase: sauvegarderProduitComplet - Enregistrement complet pour ${id}`);
    console.log("Données à enregistrer:", produit);
    // Vérification du bloc calcul de pâte avec la bonne casse
    console.log("Données du bloc calcul de pâte à enregistrer:", {
      poidsPate: produit.poidsPate,
      poidsArticle: produit.poidsArticle,
      quantitePate: produit.quantitePate,
      poidPatequalistat: produit.poidPatequalistat,
      poidFourragequalistat: produit.poidFourragequalistat,
      poidMarquantqualistat: produit.poidMarquantqualistat,
      nbrDeBandes: produit.nbrDeBandes
    });
    
    // S'assurer que tous les champs sont présents avec au moins une valeur vide
    // Cela permet d'avoir un schéma cohérent, même pour les champs ajoutés par l'utilisateur
    const produitComplet = {...produit};
    
    const ref = doc(db, "reglages", id);
    await setDoc(ref, produitComplet, { merge: true });
    console.log(`Firebase: sauvegarderProduitComplet - Succès pour ${id}`);
    return true;
  } catch (error) {
    console.error("Firebase: Erreur lors de l'enregistrement complet du produit:", error);
    throw error;
  }
}

// Récupère tous les produits
export async function getAllProduits(): Promise<Produit[]> {
  try {
    console.log("Firebase: getAllProduits - Récupération de tous les produits");
    const snapshot = await getDocs(collection(db, "reglages"));
    const produits: Produit[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      console.log("Données brutes du produit:", data);
      
      // Créer l'objet produit avec les propriétés de base
      const produit: Produit = {
        id: docSnap.id,
        codeArticle: data.codeArticle || "",
        numeroLigne: data.numeroLigne || "",
        designation: data.designation || "",
        poidsPate: data.poidsPate || "",
        poidsArticle: data.poidsArticle || "",
        quantitePate: data.quantitePate || "",
        poidPatequalistat: data.poidPatequalistat || "",
        poidFourragequalistat: data.poidFourragequalistat || "",
        poidMarquantqualistat: data.poidMarquantqualistat || "",
        nbrDeBandes: data.nbrDeBandes || "",
        programme: data.programme || "",
        facteur: data.facteur || "",
        regleLaminage: data.regleLaminage || "",
        quick: data.quick || "",
        calibreur1: data.calibreur1 || "",
        calibreur2: data.calibreur2 || "",
        calibreur3: data.calibreur3 || "",
        laminoir: data.laminoir || "",
        vitesseLaminage: data.vitesseLaminage || "",
        farineurHaut1: data.farineurHaut1 || "",
        farineurHaut2: data.farineurHaut2 || "",
        farineurHaut3: data.farineurHaut3 || "",
        farineurBas1: data.farineurBas1 || "",
        farineurBas2: data.farineurBas2 || "",
        farineurBas3: data.farineurBas3 || "",
        queueDeCarpe: data.queueDeCarpe || "",
        numeroDecoupe: data.numeroDecoupe || "",
        buse: data.buse || "",
        distributeurChocoRaisin: data.distributeurChocoRaisin || "",
        humidificateur146: data.humidificateur146 || "",
        vitesseDoreuse: data.vitesseDoreuse || "",
        p1LongueurDecoupe: data.p1LongueurDecoupe || "",
        p2Centrage: data.p2Centrage || "",
        bielle: data.bielle || "",
        lameRacleur: data.lameRacleur || "",
        rademaker: data.rademaker || "",
        aera: data.aera || "",
        fritch: data.fritch || "",
        retourneur: data.retourneur || "",
        aligneur: data.aligneur || "",
        humidificateur25: data.humidificateur25 || "",
        pushPlaque: data.pushPlaque || "",
        rouleauInferieur: data.rouleauInferieur || "",
        rouleauSuperieur: data.rouleauSuperieur || "",
        tapisFaconneuse: data.tapisFaconneuse || "",
        reperePoignee: data.reperePoignee || "",
        rouleauPression: data.rouleauPression || "",
        tapisAvantEtuveSurgel: data.tapisAvantEtuveSurgel || "",
        etuveSurgel: data.etuveSurgel || "",
        cadence: data.cadence || "",
        lamineur: data.lamineur || "",
        surveillant: data.surveillant || "",
        distributeurRaisinChoco: data.distributeurRaisinChoco || "",
        pose: data.pose || "",
        pliageTriage: data.pliageTriage || "",
        topping: data.topping || "",
        sortieEtuve: data.sortieEtuve || "",
        ouvertureMP: data.ouvertureMP || "",
        commentaire: data.commentaire || ""
      };
      
      // Ajouter tous les autres champs personnalisés qui ne sont pas dans la définition standard
      Object.keys(data).forEach(key => {
        if (!(key in produit) && key !== 'id') {
          (produit as any)[key] = data[key] || '';
        }
      });
      
      // Log pour vérifier les champs spécifiques qui nous intéressent
      console.log("Données du produit après mappage (bloc calcul pâte):", {
        id: produit.id,
        poidPatequalistat: produit.poidPatequalistat,
        poidFourragequalistat: produit.poidFourragequalistat,
        poidMarquantqualistat: produit.poidMarquantqualistat,
        nbrDeBandes: produit.nbrDeBandes
      });
      
      produits.push(produit);
    });
    console.log(`Firebase: getAllProduits - ${produits.length} produits récupérés`);
    return produits;
  } catch (error) {
    console.error("Erreur lors de la récupération de tous les produits:", error);
    return [];
  }
}
