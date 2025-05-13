
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generatePDF } from "@/utils/pdfExport";

export function usePDFExport(contentId: string) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportPDF = async () => {
    if (isGenerating) return;
    
    const handleStart = () => {
      setIsGenerating(true);
      toast({
        title: "Génération du PDF",
        description: "Veuillez patienter...",
      });
    };

    const handleComplete = (pageCount: number) => {
      toast({
        title: "PDF généré",
        description: `Le fichier PDF (${pageCount} page${pageCount > 1 ? 's' : ''}) a été téléchargé avec succès.`,
      });
      setIsGenerating(false);
    };

    const handleError = (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le PDF. Veuillez réessayer.",
      });
      setIsGenerating(false);
    };

    await generatePDF(contentId, handleStart, handleComplete, handleError);
  };

  return {
    isGenerating,
    handleExportPDF
  };
}
