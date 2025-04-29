
/**
 * Utilitaires pour le calcul des matières premières.
 */

export function parseNumberFR(value: string): number {
  if (!value) return 0;
  return parseFloat(value.replace(',', '.'));
}

/**
 * Calcule la quantité à l'heure pour une matière première.
 * @param poids 
 * @param nbBandes 
 * @param cadence 
 * @param rognure (en %, optionnel)
 * @returns quantité formatée en chaîne (fr-FR), ou chaîne vide
 */
export function calculQuantite(
  poids: number,
  nbBandes: number,
  cadence: number,
  rognure: number | null = null
): string {
  if (!poids || !nbBandes || !cadence) return "0";
  
  let quantite = poids * nbBandes * cadence * 60 / 1000;
  
  // Apply rognure calculation if provided (for pâte)
  if (rognure !== null) {
    quantite = quantite * (1 - rognure/100);
  }
  
  return isNaN(quantite) ? "0" : quantite.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
}
