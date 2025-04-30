
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface PDFExportButtonProps {
  contentId: string;
}

const PDFExportButton = ({ contentId }: PDFExportButtonProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportPDF = async () => {
    try {
      if (isGenerating) return;
      
      setIsGenerating(true);
      
      toast({
        title: "Génération du PDF",
        description: "Veuillez patienter...",
      });

      const element = document.getElementById(contentId);
      if (!element) {
        throw new Error("Contenu non trouvé");
      }
      
      // Store original styles to restore later
      const originalStyles = {
        width: element.style.width,
        display: element.style.display,
        gridTemplateColumns: element.style.gridTemplateColumns,
        gap: element.style.gap
      };
      
      // Add PDF export class to improve rendering
      document.body.classList.add('pdf-export-mode');
      
      // Force 3-column layout - critical for mobile
      element.style.display = 'grid';
      element.style.gridTemplateColumns = 'repeat(3, 1fr)';
      element.style.gap = '0.5mm';
      
      // If on mobile, force full width to ensure proper rendering
      if (isMobile) {
        element.style.width = '100%';
        
        // Force specific styling on each block
        const blocks = element.querySelectorAll('.printable-block');
        blocks.forEach((block: HTMLElement) => {
          block.style.width = '100%';
          block.style.margin = '0 0 0.5mm 0';
          block.style.padding = '0.5px';
          block.style.border = '0.5px solid #ddd';
          block.style.overflow = 'visible';
          
          // Ensure text doesn't overflow
          const textElements = block.querySelectorAll('div');
          textElements.forEach((textEl: HTMLElement) => {
            textEl.style.wordBreak = 'break-word';
            textEl.style.overflowWrap = 'break-word';
          });
        });
      }
      
      // Wait for styles to be applied before capturing
      await new Promise(resolve => setTimeout(resolve, 300));

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
      const margin = 2; // 2mm margin

      console.log("Starting HTML to Canvas conversion");

      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        allowTaint: true, // Allow cross-origin images
        foreignObjectRendering: false, // Better compatibility
        onclone: (clonedDoc) => {
          console.log("Cloning document for PDF export");
          // Apply print-specific styles to cloned document
          const styleElement = clonedDoc.createElement('style');
          styleElement.innerHTML = `
            .printable-block { 
              padding: 0.5px !important;
              margin-bottom: 0.5mm !important;
              break-inside: avoid !important;
              page-break-inside: avoid !important;
              border: 0.5px solid #ddd !important;
              border-radius: 0.5px !important;
              overflow: visible !important;
              display: inline-block !important;
              width: 100% !important;
            }
            #${contentId} {
              display: grid !important;
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 0.5mm !important;
              padding: 0 !important;
              margin: 0 !important;
              width: 100% !important;
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
              overflow-wrap: break-word !important;
              max-width: 100% !important;
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

          // Force 3-column layout in cloned document
          const contentElement = clonedDoc.getElementById(contentId);
          if (contentElement) {
            contentElement.style.display = 'grid';
            contentElement.style.gridTemplateColumns = 'repeat(3, 1fr)';
            contentElement.style.gap = '0.5mm';
            contentElement.style.width = '100%';
          }
        }
      });
      
      console.log("Canvas created successfully, size:", canvas.width, "x", canvas.height);
      
      // Restore original styles
      if (isMobile) {
        element.style.width = originalStyles.width || '';
        element.style.display = originalStyles.display || '';
        element.style.gridTemplateColumns = originalStyles.gridTemplateColumns || '';
        element.style.gap = originalStyles.gap || '';
      }
      
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

      console.log(`PDF generated with ${page} pages`);

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
    } finally {
      setIsGenerating(false);
      document.body.classList.remove('pdf-export-mode');
    }
  };

  return (
    <Button 
      onClick={handleExportPDF} 
      variant="outline"
      disabled={isGenerating}
    >
      <Printer className="h-4 w-4 mr-2" />
      {isGenerating ? "Génération..." : "Export PDF"}
    </Button>
  );
};

export default PDFExportButton;
