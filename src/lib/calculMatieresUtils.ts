
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
  let principal = poids * nbBandes * cadence * 60 / 1000;
  if (rognure !== null) {
    let pourcentage = (isNaN(rognure) ? 0 : rognure) / 100;
    principal = principal * (1 + pourcentage);
  }
  return isNaN(principal) ? "" : principal.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
}
