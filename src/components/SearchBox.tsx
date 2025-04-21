
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBoxProps {
  onSearch: (codeArticle: string, numeroLigne: string, designation: string) => void;
}

const SearchBox = ({ onSearch }: SearchBoxProps) => {
  const [codeArticle, setCodeArticle] = useState("");
  const [numeroLigne, setNumeroLigne] = useState("");
  const [designation, setDesignation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(codeArticle, numeroLigne, designation);
  };

  const handleReset = () => {
    setCodeArticle("");
    setNumeroLigne("");
    setDesignation("");
    onSearch("", "", "");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm border border-noir-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="codeArticle" className="field-label">
            Code Article
          </label>
          <Input
            id="codeArticle"
            value={codeArticle}
            onChange={(e) => setCodeArticle(e.target.value)}
            placeholder="Saisir un code article"
            className="border-noir-300"
          />
        </div>
        <div>
          <label htmlFor="numeroLigne" className="field-label">
            Numéro de Ligne
          </label>
          <Input
            id="numeroLigne"
            value={numeroLigne}
            onChange={(e) => setNumeroLigne(e.target.value)}
            placeholder="Saisir un numéro de ligne"
            className="border-noir-300"
          />
        </div>
        <div>
          <label htmlFor="designation" className="field-label">
            Désignation
          </label>
          <Input
            id="designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            placeholder="Saisir une désignation"
            className="border-noir-300"
          />
        </div>
      </div>
      <div className="flex justify-end mt-4 gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleReset}
        >
          Réinitialiser
        </Button>
        <Button 
          type="submit" 
          className="bg-jaune-300 text-noir-800 hover:bg-jaune-400"
        >
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
      </div>
    </form>
  );
};

export default SearchBox;
