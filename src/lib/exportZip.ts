
import JSZip from 'jszip';
import { Produit } from "@/types";
import { saveAs } from 'file-saver';
import { toast } from "@/hooks/use-toast";

// Export all products as CSV in a zip archive
export async function exportAllFilesAsZip(produits: Produit[]) {
  try {
    // Check if there are products to export
    if (!produits || produits.length === 0) {
      toast({
        title: "Aucun fichier à exporter",
        description: "Il n'y a aucun produit à exporter.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Préparation de l'archive",
      description: "Création du fichier zip en cours...",
    });

    const zip = new JSZip();
    
    // Add CSV file with all products
    const csvContent = generateCsvContent(produits);
    zip.file("tous-les-produits.csv", csvContent);
    
    // Add individual JSON files for each product
    produits.forEach(produit => {
      const filename = `${produit.codeArticle}_${produit.numeroLigne}.json`;
      const content = JSON.stringify(produit, null, 2);
      zip.file(`produits/${filename}`, content);
    });
    
    // Generate the zip file
    const content = await zip.generateAsync({ 
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 }
    });
    
    // Trigger download
    saveAs(content, `reglages-export-${new Date().toISOString().slice(0, 10)}.zip`);
    
    toast({
      title: "Téléchargement terminé",
      description: `${produits.length} produits exportés avec succès.`,
      variant: "default"
    });
  } catch (error) {
    console.error("Erreur lors de l'export des fichiers:", error);
    toast({
      title: "Erreur d'exportation",
      description: "Impossible de créer l'archive zip. Veuillez réessayer.",
      variant: "destructive"
    });
  }
}

// Generate CSV content from products array
function generateCsvContent(produits: Produit[]): string {
  // Use the existing headers order from localStorage or generate from keys
  let headers: string[] = [];
  const savedOrder = localStorage.getItem('importColumnOrder');
  
  if (savedOrder) {
    try {
      const savedHeaders = JSON.parse(savedOrder);
      headers = savedHeaders.filter((header: string) => 
        Object.keys(produits[0]).includes(header) || header === 'id'
      );
      
      const missingHeaders = Object.keys(produits[0]).filter(key => !headers.includes(key));
      headers = [...headers, ...missingHeaders];
    } catch (e) {
      headers = Object.keys(produits[0]);
    }
  } else {
    headers = Object.keys(produits[0]);
  }
  
  // Generate CSV rows
  const csvRows = [
    headers.join(";"),
    ...produits.map(prod => headers.map(header => {
      const value = (prod as any)[header];
      return value !== undefined ? `"${value}"` : `""`;
    }).join(";"))
  ];

  return csvRows.join("\r\n");
}
