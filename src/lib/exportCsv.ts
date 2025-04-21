
import { Produit } from "@/types";

// Transforme une liste de produits en CSV et déclenche le téléchargement
export function exportProduitsAsCsv(produits: Produit[]) {
  // Prendre toutes les clés du premier produit (pour les colonnes)
  if (produits.length === 0) return;
  const headers = Object.keys(produits[0]);
  const csvRows = [
    headers.join(";"),
    ...produits.map(prod => headers.map(header => `"${(prod as any)[header] ?? ""}"`).join(";"))
  ];

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
