
import { Produit } from "@/types";

// Transforme une liste de produits en CSV et déclenche le téléchargement
export function exportProduitsAsCsv(produits: Produit[]) {
  // Vérifier s'il y a des produits à exporter
  if (produits.length === 0) return;
  
  // Récupérer l'ordre des colonnes depuis localStorage ou utiliser l'ordre par défaut
  let headers: string[] = [];
  const savedOrder = localStorage.getItem('importColumnOrder');
  
  if (savedOrder) {
    try {
      // Utiliser l'ordre sauvegardé lors du dernier import
      const savedHeaders = JSON.parse(savedOrder);
      // Vérifier que chaque entête existe dans le produit
      headers = savedHeaders.filter((header: string) => 
        Object.keys(produits[0]).includes(header) || header === 'id'
      );
      
      // S'assurer que toutes les propriétés du produit sont incluses
      const missingHeaders = Object.keys(produits[0]).filter(key => !headers.includes(key));
      headers = [...headers, ...missingHeaders];
    } catch (e) {
      console.error("Erreur lors de la récupération de l'ordre des colonnes:", e);
      headers = Object.keys(produits[0]);
    }
  } else {
    // Si aucun ordre n'est sauvegardé, utiliser l'ordre par défaut
    headers = Object.keys(produits[0]);
  }
  
  // Générer les lignes CSV
  const csvRows = [
    headers.join(";"),
    ...produits.map(prod => headers.map(header => {
      const value = (prod as any)[header];
      return value !== undefined ? `"${value}"` : `""`;
    }).join(";"))
  ];

  // Générer et télécharger le fichier CSV
  const csvContent = csvRows.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  // Créer un lien temporaire pour déclencher le téléchargement
  const a = document.createElement("a");
  a.href = url;
  a.download = "produits.csv";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
