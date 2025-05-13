
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { usePDFExport } from "@/hooks/usePDFExport";

interface PDFExportButtonProps {
  contentId: string;
}

const PDFExportButton = ({ contentId }: PDFExportButtonProps) => {
  const { isGenerating, handleExportPDF } = usePDFExport(contentId);

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
