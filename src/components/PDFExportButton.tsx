
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useIsMobile } from "@/hooks/use-mobile";

interface PDFExportButtonProps {
  contentId: string;
}

const PDFExportButton = ({ contentId }: PDFExportButtonProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
        compress: true,
      });

      // Calculate dimensions based on A4 format
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 2; // 2mm margin (reduced from 3mm)

      // Mobile-specific adjustments for better rendering
      if (isMobile) {
        element.style.width = '100%';
        // Force 3-column layout on mobile for PDF export
        const blocks = element.querySelectorAll('.printable-block');
        blocks.forEach((block: HTMLElement) => {
          block.style.width = '100%';
          block.style.margin = '0 0 1px 0';
          block.style.padding = '1px';
          block.style.border = '0.5px solid #ddd';
        });
      }

      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // Apply print-specific styles to cloned document
          const styleElement = clonedDoc.createElement('style');
          styleElement.innerHTML = `
            .printable-block { 
              padding: 1px !important;
              margin-bottom: 0.5mm !important;
              break-inside: avoid !important;
              border: 0.5px solid #ddd !important;
              border-radius: 0.5px !important;
              overflow: visible !important;
            }
            #${contentId} {
              display: grid !important;
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 0.5mm !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            .printable-block h2 {
              font-size: 14px !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .printable-block .font-semibold {
              font-size: 12px !important;
            }
            .printable-block div > div {
              font-size: 12px !important;
            }
            /* Hide everything except the blocks */
            body > *:not(.printable-page),
            .printable-page > *:not(#${contentId}),
            .print\\:hidden {
              display: none !important;
            }
            /* Hide any headers and footers */
            header, footer, nav, .header, .footer, .nav-container {
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
              gap: 0.25mm !important;
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
      
      // Add first page
      pdf.addImage(imgData, "JPEG", margin, margin, imgWidth, imgHeight);
      
      // Calculate number of pages needed
      let heightLeft = imgHeight - (pageHeight - (margin * 2));
      let position = -(pageHeight - (margin * 2));
      let page = 1;

      // Add additional pages if needed
      while (heightLeft > 0) {
        pdf.addPage();
        page++;
        pdf.addImage(imgData, "JPEG", margin, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - (margin * 2));
        position -= (pageHeight - (margin * 2));
      }

      // Save the PDF with the correct filename
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
