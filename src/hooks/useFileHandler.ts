
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { parseExcelFile } from "@/utils/excelParser";

export const useFileHandler = (setHeaders: (headers: string[]) => void, setPreviewData: (data: any[]) => void) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const selectedFile = files[0];
    console.log("Fichier sélectionné:", selectedFile.name, selectedFile.type);
    
    setErrorMessage(undefined);
    
    if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      setErrorMessage("Format non supporté. Veuillez sélectionner un fichier Excel (.xlsx, .xls) ou CSV (.csv)");
      toast({
        title: "Format non supporté",
        description: "Veuillez sélectionner un fichier Excel (.xlsx, .xls) ou CSV (.csv)",
        variant: "destructive",
      });
      return;
    }
    
    setFile(selectedFile);
    setIsProcessing(true);
    
    try {
      console.log("Début de l'analyse du fichier");
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { headers: parsedHeaders, data } = await parseExcelFile(selectedFile);
      console.log("Fichier analysé avec succès");
      
      const cleanedHeaders = parsedHeaders.map((header, index) => 
        (header && header.trim()) ? header.trim() : `Colonne ${index + 1}`
      );
      
      if (cleanedHeaders.length === 0) {
        throw new Error("Aucune colonne détectée dans le fichier");
      }
      
      if (data.length === 0) {
        throw new Error("Aucune donnée détectée dans le fichier");
      }
      
      console.log("Données récupérées:", { headers: cleanedHeaders.length, data: data.length });
      setHeaders(cleanedHeaders);
      setPreviewData(data);
      
    } catch (error) {
      console.error("Erreur lors de l'importation du fichier:", error);
      const errorMsg = error instanceof Error 
        ? error.message 
        : "Impossible de lire le fichier. Vérifiez le format et réessayez.";
      
      setErrorMessage(errorMsg);
      toast({
        title: "Erreur lors de l'importation",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    file,
    setFile,
    isProcessing,
    errorMessage,
    handleFileChange
  };
};
