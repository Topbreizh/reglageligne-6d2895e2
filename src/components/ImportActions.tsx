
import { Button } from "@/components/ui/button";

interface ImportActionsProps {
  onCancel: () => void;
  onImport: () => void;
  isLoading?: boolean;
}

const ImportActions = ({ onCancel, onImport, isLoading = false }: ImportActionsProps) => (
  <div className="flex justify-end space-x-2">
    <Button
      variant="outline"
      onClick={onCancel}
      disabled={isLoading}
    >
      Annuler
    </Button>
    <Button
      onClick={onImport}
      className="bg-jaune-300 text-noir-800 hover:bg-jaune-400"
      disabled={isLoading}
    >
      {isLoading ? "Importation en cours..." : "Importer les données"}
    </Button>
  </div>
);

export default ImportActions;
