
import { useState } from "react";
import { ImportMapping } from "@/types";

export const useImportState = () => {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [mappings, setMappings] = useState<ImportMapping[]>([]);
  const [step, setStep] = useState(1);
  const [isImporting, setIsImporting] = useState(false);

  const resetForm = () => {
    setFile(null);
    setHeaders([]);
    setPreviewData([]);
    setMappings([]);
    setStep(1);
  };

  return {
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
    isImporting,
    setIsImporting,
    resetForm
  };
};
