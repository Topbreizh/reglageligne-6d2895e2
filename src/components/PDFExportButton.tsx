
import { useState } from "react";
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
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportPDF = async () => {
    try {
      if (isGenerating) return;
      
      setIsGenerating(true);
      
      toast({
        title: "Génération du PDF",
        description: "Veuillez patienter...",
      });

      // Get the content element
      const element = document.getElementById(contentId);
      if (!element) {
        throw new Error("Contenu non trouvé");
      }
      
      // Create a wrapper div to ensure consistent layout
      const wrapper = document.createElement('div');
      wrapper.style.width = '210mm'; // A4 width
      wrapper.style.backgroundColor = 'white';
      wrapper.style.position = 'absolute';
      wrapper.style.left = '-9999px';
      wrapper.style.top = '0';
      
      // Clone the content
      const clone = element.cloneNode(true) as HTMLElement;
      clone.id = 'pdf-export-clone';
      clone.style.display = 'grid';
      clone.style.gridTemplateColumns = 'repeat(3, 1fr)';
      clone.style.gap = '0.5mm';
      clone.style.width = '100%';
      clone.style.padding = '2mm';
      
      // Apply PDF export styles to clone
      Array.from(clone.querySelectorAll('.printable-block')).forEach((block: HTMLElement) => {
        block.style.padding = '0.5px';
        block.style.margin = '0 0 0.5mm 0';
        block.style.border = '0.5px solid #ddd';
        block.style.borderRadius = '0.5px';
        block.style.fontSize = '8px';
        block.style.breakInside = 'avoid';
        block.style.pageBreakInside = 'avoid';
        block.style.display = 'inline-block';
        block.style.width = '100%';
        block.style.boxSizing = 'border-box';

        const title = block.querySelector('h2');
        if (title) {
          title.style.fontSize = '10px';
          title.style.margin = '0 0 0.5px 0';
          title.style.padding = '0';
        }
        
        Array.from(block.querySelectorAll('div > div')).forEach((row: HTMLElement) => {
          row.style.display = 'flex';
          row.style.flexWrap = 'wrap';
          row.style.alignItems = 'flex-start';
          row.style.padding = '0';
          row.style.margin = '0 0 0.5px 0';
          row.style.gap = '0';
          row.style.fontSize = '8px';
          
          const label = row.querySelector('.font-semibold');
          if (label) {
            label.classList.add('break-words');
            (label as HTMLElement).style.fontSize = '8px';
            (label as HTMLElement).style.maxWidth = '10px';
            (label as HTMLElement).style.minWidth = 'fit-content';
          }
          
          const value = row.querySelector('.break-words');
          if (value) {
            (value as HTMLElement).style.wordBreak = 'break-word';
            (value as HTMLElement).style.whiteSpace = 'normal';
            (value as HTMLElement).style.overflowWrap = 'break-word';
            (value as HTMLElement).style.maxWidth = 'calc(100% - 15px)';
          }
        });
      });
      
      // Remove print:hidden elements
      Array.from(clone.querySelectorAll('.print\\:hidden')).forEach(el => {
        el.remove();
      });
      
      // Append to wrapper and add to body
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);
      
      // Wait for DOM to update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create PDF
      // A4 dimensions in mm (210×297mm)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      // Calculate dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 2; // 2mm margin
      
      console.log("Creating canvas for PDF export");
      
      // Create canvas from clone
      const canvas = await html2canvas(clone, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: true,
        backgroundColor: "#ffffff",
        allowTaint: true,
        foreignObjectRendering: false,
      });
      
      console.log("Canvas created with dimensions:", canvas.width, "x", canvas.height);
      
      // Clean up
      document.body.removeChild(wrapper);
      
      // Add to PDF
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      
      // Add first page
      pdf.addImage(imgData, "JPEG", margin, margin, imgWidth, imgHeight);
      
      // Calculate number of pages needed
      const pageHeight = pdf.internal.pageSize.getHeight();
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

      // Save the PDF
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
