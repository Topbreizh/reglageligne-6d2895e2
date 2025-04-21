
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Import, Loader2 } from "lucide-react";

interface FileUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isProcessing?: boolean;
}

const FileUpload = ({ onFileChange, isProcessing = false }: FileUploadProps) => (
  <div className="border-2 border-dashed border-noir-300 rounded-md p-8 text-center">
    <div className="mb-4">
      {isProcessing ? (
        <Loader2 className="h-12 w-12 mx-auto text-jaune-400 animate-spin" />
      ) : (
        <Import className="h-12 w-12 mx-auto text-noir-400" />
      )}
    </div>
    <p className="mb-4 text-noir-600">
      {isProcessing 
        ? "Analyse du fichier en cours..." 
        : "Sélectionnez un fichier Excel ou CSV contenant vos données de réglages."}
    </p>
    <Input
      type="file"
      id="file-upload"
      onChange={onFileChange}
      className="hidden"
      accept=".xlsx,.xls,.csv"
      disabled={isProcessing}
    />
    <Label
      htmlFor="file-upload"
      className={`inline-flex items-center px-4 py-2 rounded-md cursor-pointer transition-colors ${
        isProcessing 
          ? "bg-noir-200 text-noir-500 cursor-not-allowed" 
          : "bg-jaune-300 text-noir-800 hover:bg-jaune-400"
      }`}
    >
      {isProcessing ? "Traitement en cours..." : "Sélectionner un fichier"}
    </Label>
  </div>
);

export default FileUpload;
