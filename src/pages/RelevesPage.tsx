
import PageLayout from "@/components/layout/PageLayout";
import { ReleveBloc } from "@/components/ReleveBloc";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const RelevesPage = () => {
  const isMobile = useIsMobile();

  const handlePrint = () => {
    // Force 3-column layout on mobile for print
    if (isMobile) {
      const printableContent = document.getElementById('printable-content');
      if (printableContent) {
        // Save original styles to restore later
        const originalStyles = {
          display: printableContent.style.display,
          gridTemplateColumns: printableContent.style.gridTemplateColumns
        };
        
        // Force 3-column grid for printing
        printableContent.style.display = 'grid';
        printableContent.style.gridTemplateColumns = 'repeat(3, 1fr)';
        
        // Restore after printing
        setTimeout(() => {
          printableContent.style.display = originalStyles.display || '';
          printableContent.style.gridTemplateColumns = originalStyles.gridTemplateColumns || '';
        }, 1000);
      }
    }
    
    // Add print mode class
    document.body.classList.add('print-mode');
    
    // Add print style overrides
    const style = document.createElement('style');
    style.id = 'print-override-style';
    style.innerHTML = `
      @page {
        margin: 2mm 2mm 0mm 2mm !important;
        size: portrait;
      }
      @page :footer {
        display: none !important;
        height: 0;
      }
      @page :header {
        display: none !important;
        height: 0;
      }
      /* Force page break after the first 3 elements */
      #printable-content .ReleveBloc:nth-child(3) {
        page-break-after: always !important;
      }
    `;
    document.head.appendChild(style);
    
    window.print();
    
    // Remove print mode class and style
    setTimeout(() => {
      document.body.classList.remove('print-mode');
      const styleElem = document.getElementById('print-override-style');
      if (styleElem) styleElem.remove();
    }, 500);
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            <span className="text-noir-800">Relevés de</span>{" "}
            <span className="text-jaune-300">réglages</span>
          </h1>
          <Button 
            onClick={handlePrint}
            variant="outline"
            className="print:hidden"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
        </div>
        
        <div id="printable-content" className={`grid grid-cols-1 ${!isMobile ? 'md:grid-cols-2 xl:grid-cols-3' : ''} gap-6 print:grid-cols-3 print:gap-1`}>
          {[...Array(6)].map((_, index) => (
            <ReleveBloc key={index} index={index + 1} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default RelevesPage;
