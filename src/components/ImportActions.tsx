
import { Button } from "@/components/ui/button";

interface ImportActionsProps {
  onCancel: () => void;
  onImport: () => void;
}

const ImportActions = ({ onCancel, onImport }: ImportActionsProps) => (
  <div className="flex justify-end space-x-2">
    <Button
      variant="outline"
      onClick={onCancel}
    >
      Annuler
    </Button>
    <Button
      onClick={onImport}
      className="bg-jaune-300 text-noir-800 hover:bg-jaune-400"
    >
      Importer les données
    </Button>
  </div>
);

export default ImportActions;
