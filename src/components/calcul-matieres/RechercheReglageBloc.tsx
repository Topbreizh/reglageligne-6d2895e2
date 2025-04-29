
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReglageFirebase, getReglage } from "@/lib/firebaseReglage";
import { toast } from "@/components/ui/use-toast";

interface RechercheRéglageBlocProps {
  onResult: (result: ReglageFirebase | null) => void;
  loading: boolean;
}

const RechercheReglageBloc: React.FC<RechercheRéglageBlocProps> = ({
  onResult,
  loading,
}) => {
  const [codeArticle, setCodeArticle] = useState("");
  const [numeroLigne, setNumeroLigne] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeArticle || !numeroLigne) return;
    setIsLoading(true);
    try {
      const reglage = await getReglage(codeArticle.trim(), numeroLigne.trim());
      onResult(reglage);
      if (reglage) {
        toast({
          title: "Données récupérées",
          description: `Données pour l'article ${codeArticle} (ligne ${numeroLigne}) chargées.`,
        });
      } else {
        toast({
          title: "Aucune donnée trouvée",
          description: `Aucune donnée trouvée pour l'article ${codeArticle} (ligne ${numeroLigne}).`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la recherche.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col md:flex-row items-end gap-4 mb-8" onSubmit={handleSearch}>
      <div>
        <Label>Code article</Label>
        <Input
          value={codeArticle}
          onChange={(e) => setCodeArticle(e.target.value)}
          placeholder="ex : 123456"
        />
      </div>
      <div>
        <Label>Numéro de ligne</Label>
        <Input
          value={numeroLigne}
          onChange={(e) => setNumeroLigne(e.target.value)}
          placeholder="ex : 1"
        />
      </div>
      <button
        type="submit"
        className="bg-jaune-300 hover:bg-jaune-400 text-noir-800 font-medium py-2 px-4 rounded"
        disabled={isLoading || loading}
      >
        {isLoading || loading ? "Recherche..." : "Pré-remplir"}
      </button>
    </form>
  );
};

export default RechercheReglageBloc;
