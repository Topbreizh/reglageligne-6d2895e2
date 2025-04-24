
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Produit } from "@/types";
import { blocsConfiguration } from "@/data/blocConfig";

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

  const renderProduitDetails = (produit: Produit) => {
    // Fonction pour grouper les champs par bloc selon la configuration
    const renderBlocs = () => {
      return blocsConfiguration.map((bloc) => {
        const champsVisibles = bloc.champs.filter(champ => {
          return champ.visible && 
                 (champ.lignesApplicables.includes('*') || 
                  champ.lignesApplicables.includes(produit.numeroLigne));
        });

        if (champsVisibles.length === 0) return null;

        return (
          <div key={bloc.id} className="border-t pt-2 mt-2">
            <div className="font-semibold mb-1">{bloc.nom}</div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
              {champsVisibles.map((champ) => {
                const valeur = produit[champ.nomTechnique as keyof Produit];
                return (
                  <div key={champ.id} className="overflow-hidden text-ellipsis">
                    <span className="font-semibold">{champ.nom}:</span>{" "}
                    {valeur || "-"}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }).filter(Boolean);
    };

    return (
      <div className="space-y-2 mt-4 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-semibold">Code Article:</span> {produit.codeArticle}
          </div>
          <div>
            <span className="font-semibold">N° Ligne:</span> {produit.numeroLigne}
          </div>
          <div className="col-span-2">
            <span className="font-semibold">Désignation:</span> {produit.designation}
          </div>
        </div>
        
        {renderBlocs()}
        
        {produit.commentaire && (
          <div className="border-t pt-2">
            <div className="font-semibold">Commentaire</div>
            <p className="text-xs">{produit.commentaire}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="shadow-lg print:shadow-none print:border-black">
      <CardHeader className="bg-gray-50 border-b print:bg-white">
        <div className="font-semibold text-lg">Relevé {index}</div>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSearch} className="space-y-4 print:hidden">
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
          renderProduitDetails(produit)
        ) : null}
      </CardContent>
    </Card>
  );
};
