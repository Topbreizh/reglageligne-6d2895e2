
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
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
        windowWidth: 1200,
        windowHeight: 1600,
      });

      // A4 dimensions in mm (210×297mm)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
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
      <FileText className="h-4 w-4 mr-2" />
      Export PDF
    </Button>
  );
};

export default PDFExportButton;
