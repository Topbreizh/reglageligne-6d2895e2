
import { useExcelImport } from "@/hooks/useExcelImport";
import DataPreviewTable from "./DataPreviewTable";
import MappingTable from "./MappingTable";
import ImportActions from "./ImportActions";
import FileUpload from "./FileUpload";

const ExcelImport = () => {
  const {
    file,
    headers,
    previewData,
    mappings,
    step,
    isImporting,
    isProcessing,
    handleFileChange,
    handleMappingChange,
    processMappingAndImport,
    resetForm
  } = useExcelImport();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-noir-200">
        <h2 className="section-title">Import de données depuis Excel</h2>
        <p className="mb-4 text-noir-600">
          Importez vos données de réglages ligne depuis un fichier Excel (.xlsx, .xls) ou CSV (.csv).
        </p>

        {step === 1 && (
          <FileUpload onFileChange={handleFileChange} isProcessing={isProcessing} />
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-noir-100 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Fichier sélectionné: {file?.name}</h3>
              <p className="text-sm text-noir-600">
                {previewData.length} lignes détectées avec {headers.length} colonnes.
              </p>
            </div>
            <DataPreviewTable headers={headers} previewData={previewData} />
            <MappingTable
              headers={headers}
              mappings={mappings}
              onChange={handleMappingChange}
            />
            <ImportActions
              onCancel={resetForm}
              onImport={processMappingAndImport}
              isLoading={isImporting}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelImport;
