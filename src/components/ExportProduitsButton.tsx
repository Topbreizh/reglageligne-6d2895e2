
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { getAllProduits } from "@/lib/firebaseReglage";
import { exportProduitsAsCsv } from "@/lib/exportCsv";
import { useToast } from "@/hooks/use-toast";

const ExportProduitsButton = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const produits = await getAllProduits();
      if (!produits || produits.length === 0) {
        toast({
          title: "Aucun produit à exporter",
          description: "La base de données ne contient aucun produit.",
          variant: "destructive"
        });
        return;
      }
      exportProduitsAsCsv(produits);
      toast({
        title: "Exportation réussie",
        description: `${produits.length} produits exportés au format CSV.`,
        variant: "default"
      });
    } catch (err) {
      toast({
        title: "Erreur lors de l'export",
        description: "Impossible de récupérer ou exporter les produits.",
        variant: "destructive"
      });
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
      title="Exporter tous les produits"
    >
      <FileSpreadsheet className="w-4 h-4" />
      {isExporting ? "Exportation..." : "Exporter les produits"}
    </Button>
  );
};

export default ExportProduitsButton;
