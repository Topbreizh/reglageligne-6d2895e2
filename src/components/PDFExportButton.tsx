
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
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
        backgroundColor: "#ffffff",
      });

      // A4 dimensions in mm (210×297mm)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the image to the first page
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

      // If the content is taller than one page, add additional pages
      if (imgHeight > pageHeight) {
        let heightLeft = imgHeight - pageHeight;
        let position = -pageHeight; // Starting position for the second page
        
        while (heightLeft > 0) {
          position = position - pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }

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
      <Printer className="h-4 w-4 mr-2" />
      Export PDF
    </Button>
  );
};

export default PDFExportButton;
