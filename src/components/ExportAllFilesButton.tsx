
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { getAllProduits } from "@/lib/firebaseReglage";
import { exportAllFilesAsZip } from "@/lib/exportZip";
import { useToast } from "@/hooks/use-toast";

const ExportAllFilesButton = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const produits = await getAllProduits();
      if (!produits || produits.length === 0) {
        toast({
          title: "Aucun fichier à exporter",
          description: "La base de données ne contient aucun produit.",
          variant: "destructive"
        });
        return;
      }
      
      // Export all files as a zip archive
      await exportAllFilesAsZip(produits);
      
    } catch (err) {
      toast({
        title: "Erreur lors de l'export",
        description: "Impossible de récupérer ou exporter les fichiers.",
        variant: "destructive"
      });
      console.error("Error exporting files:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant="outline"
      className="border-jaune-300 text-noir-800 flex items-center gap-2"
      title="Télécharger tous les fichiers"
    >
      <Download className="w-4 h-4" />
      {isExporting ? "Export en cours..." : "Télécharger tous les fichiers"}
    </Button>
  );
};

export default ExportAllFilesButton;
