
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Produit } from "@/types";

interface ReleveBlocProps {
  index: number;
}

export const ReleveBloc = ({ index }: ReleveBlocProps) => {
  const [codeArticle, setCodeArticle] = useState("");
  const [numeroLigne, setNumeroLigne] = useState("");
  const [produit, setProduit] = useState<Produit | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeArticle || !numeroLigne) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Le code article et le numéro de ligne sont requis."
      });
      return;
    }

    setLoading(true);
    try {
      const id = `${codeArticle}_${numeroLigne}`;
      const docRef = doc(db, "reglages", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProduit({
          id: docSnap.id,
          ...data,
          codeArticle: data.codeArticle || "",
          numeroLigne: data.numeroLigne || "",
          designation: data.designation || "Sans designation"
        } as Produit);
      } else {
        toast({
          variant: "destructive",
          title: "Produit non trouvé",
          description: "Aucun produit ne correspond à ces critères."
        });
        setProduit(null);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la recherche."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gray-50 border-b">
        <div className="font-semibold text-lg">Relevé {index}</div>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSearch} className="space-y-4">
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

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-jaune-300"></div>
          </div>
        ) : produit ? (
          <div className="mt-4 space-y-2 border-t pt-4">
            <div className="font-semibold">{produit.designation}</div>
            <div className="text-sm text-gray-600">
              Code: {produit.codeArticle} | Ligne: {produit.numeroLigne}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
