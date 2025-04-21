
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Import } from "lucide-react";

interface FileUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload = ({ onFileChange }: FileUploadProps) => (
  <div className="border-2 border-dashed border-noir-300 rounded-md p-8 text-center">
    <div className="mb-4">
      <Import className="h-12 w-12 mx-auto text-noir-400" />
    </div>
    <p className="mb-4 text-noir-600">
      Sélectionnez un fichier Excel ou CSV contenant vos données de réglages.
    </p>
    <Input
      type="file"
      id="file-upload"
      onChange={onFileChange}
      className="hidden"
      accept=".xlsx,.xls,.csv"
    />
    <Label
      htmlFor="file-upload"
      className="inline-flex items-center px-4 py-2 bg-jaune-300 text-noir-800 rounded-md cursor-pointer hover:bg-jaune-400 transition-colors"
    >
      Sélectionner un fichier
    </Label>
  </div>
);

export default FileUpload;
