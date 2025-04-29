
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
      
      // Add PDF export class to improve rendering
      document.body.classList.add('pdf-export-mode');
      
      // A4 dimensions in mm (210×297mm)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Calculate dimensions based on A4 format
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 5; // 5mm margin

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 1200, 
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // Apply print-specific styles to cloned document
          const styleElement = clonedDoc.createElement('style');
          styleElement.innerHTML = `
            .printable-block { 
              padding: 2px !important;
              margin-bottom: 2mm !important;
              break-inside: avoid !important;
              border: 0.5px solid #ddd !important;
              border-radius: 2px !important;
              overflow: visible !important;
            }
            #printable-content {
              display: grid !important;
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 2mm !important;
            }
            .printable-block h2 {
              font-size: 9px !important;
              margin-bottom: 1px !important;
            }
            /* Hide everything except the blocks */
            body > *:not(.printable-page),
            .printable-page > *:not(#printable-content),
            .print\\:hidden {
              display: none !important;
            }
            .break-words {
              word-break: break-word !important;
              white-space: normal !important;
            }
            .printable-block > div > div {
              display: flex !important;
              align-items: flex-start !important;
              padding: 0 !important;
              margin: 0 !important;
            }
          `;
          clonedDoc.head.appendChild(styleElement);
          
          // Hide elements with print:hidden class
          const hiddenElements = clonedDoc.querySelectorAll('.print\\:hidden');
          hiddenElements.forEach((el) => {
            (el as HTMLElement).style.display = 'none';
          });
        }
      });
      
      // Remove PDF export class
      document.body.classList.remove('pdf-export-mode');

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      
      // Calculate image dimensions preserving aspect ratio
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      let page = 1;

      // Add first page
      pdf.addImage(imgData, "JPEG", margin, margin, imgWidth, imgHeight);
      heightLeft -= (pageHeight - (margin * 2));
      position = -(pageHeight - (margin * 2));

      // Add additional pages if needed
      while (heightLeft > 0) {
        pdf.addPage();
        page++;
        pdf.addImage(imgData, "JPEG", margin, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - (margin * 2));
        position -= (pageHeight - (margin * 2));
      }

      pdf.save(`fiche-produit-${new Date().toISOString().slice(0, 10)}.pdf`);

      toast({
        title: "PDF généré",
        description: `Le fichier PDF (${page} page${page > 1 ? 's' : ''}) a été téléchargé avec succès.`,
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
