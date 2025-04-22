
import { Button } from "@/components/ui/button";

interface ProduitFormFooterProps {
  mode: "create" | "edit";
}

const ProduitFormFooter = ({ mode }: ProduitFormFooterProps) => (
  <div className="flex justify-end mt-6 gap-4">
    <Button type="button" variant="outline" onClick={() => window.history.back()}>
      Annuler
    </Button>
    <Button type="submit" className="bg-jaune-300 text-noir-800 hover:bg-jaune-400">
      {mode === "create" ? "Créer" : "Enregistrer les modifications"}
    </Button>
  </div>
);

export default ProduitFormFooter;
