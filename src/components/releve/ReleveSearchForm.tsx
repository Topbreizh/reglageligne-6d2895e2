
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface ReleveSearchFormProps {
  onSearch: (codeArticle: string, numeroLigne: string) => void;
  loading: boolean;
}

export const ReleveSearchForm = ({ onSearch, loading }: ReleveSearchFormProps) => {
  const [codeArticle, setCodeArticle] = useState("");
  const [numeroLigne, setNumeroLigne] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(codeArticle, numeroLigne);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 print:hidden">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Code Article</label>
          <Input
            value={codeArticle}
            onChange={(e) => setCodeArticle(e.target.value)}
            placeholder="Code article"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">N° Ligne</label>
          <Input
            value={numeroLigne}
            onChange={(e) => setNumeroLigne(e.target.value)}
            placeholder="Numéro de ligne"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-jaune-300 text-noir-800 hover:bg-jaune-400"
        >
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
      </div>
    </form>
  );
};
