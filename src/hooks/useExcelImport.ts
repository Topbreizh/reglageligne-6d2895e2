
import { useImportState } from "./useImportState";
import { useFileHandler } from "./useFileHandler";
import { useImportProcess } from "./useImportProcess";
import { generateInitialMappings } from "@/utils/fieldMapping";

export const useExcelImport = () => {
  const {
    file,
    setFile,
    headers,
    setHeaders,
    previewData,
    setPreviewData,
    mappings,
    setMappings,
    step,
    setStep,
    resetForm
  } = useImportState();

  const { isProcessing, errorMessage, handleFileChange } = useFileHandler(
    (headers) => {
      setHeaders(headers);
      const initialMappings = generateInitialMappings(headers);
      console.log("Mappings initiaux générés:", initialMappings);
      setMappings(initialMappings);
      setStep(2);
    },
    setPreviewData
  );

  const { isImporting, processMappingAndImport } = useImportProcess();

  const handleMappingChange = (champDestination: string, champSource: string) => {
    console.log(`Mise à jour du mapping: ${champDestination} => ${champSource}`);
    
    const existingMappingIndex = mappings.findIndex(
      (mapping) => mapping.champDestination === champDestination
    );

    const updatedMappings = [...mappings];

    if (existingMappingIndex !== -1) {
      updatedMappings[existingMappingIndex] = { 
        ...updatedMappings[existingMappingIndex], 
        champSource 
      };
    } else {
      updatedMappings.push({ champDestination, champSource });
    }

    console.log("Nouveaux mappings:", updatedMappings);
    setMappings(updatedMappings);
  };

  const handleImport = async () => {
    const success = await processMappingAndImport(mappings, previewData);
    if (success) {
      resetForm();
    }
  };

  return {
    file,
    headers,
    previewData,
    mappings,
    step,
    isImporting,
    isProcessing,
    errorMessage,
    handleFileChange,
    handleMappingChange,
    processMappingAndImport: handleImport,
    resetForm
  };
};
