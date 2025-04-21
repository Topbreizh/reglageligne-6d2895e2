
import { Button } from "@/components/ui/button";
import { File } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface PDFExportButtonProps {
  contentId: string;
}

const PDFExportButton = ({ contentId }: PDFExportButtonProps) => {
  const { toast } = useToast();

  const handleExportPDF = async () => {
    try {
      toast({
        title: "Génération du PDF",
        description: "Veuillez patienter...",
      });

      const element = document.getElementById(contentId);
      if (!element) throw new Error("Contenu non trouvé");

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: 794, // Largeur A4 en pixels à 96 DPI
        height: 1123, // Hauteur A4 en pixels à 96 DPI
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297); // Dimensions A4 en mm
      pdf.save(`fiche-produit-${new Date().toISOString().slice(0, 10)}.pdf`);

      toast({
        title: "PDF généré",
        description: "Le fichier PDF a été téléchargé avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le PDF. Veuillez réessayer.",
      });
    }
  };

  return (
    <Button onClick={handleExportPDF} variant="outline">
      <File className="h-4 w-4 mr-2" />
      Export PDF
    </Button>
  );
};

export default PDFExportButton;

