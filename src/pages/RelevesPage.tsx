
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { produitsInitiaux } from "@/data/mockData";
import { Produit } from "@/types";

const getAllFieldLabels = (produit: Produit): [string, string][] => {
  // Exclure id de l'affichage, mais prendre tout le reste
  return Object.entries(produit)
    .filter(([key]) => key !== "id")
    .map(([key, value]) => {
      // Mettre en forme l'affichage du nom du champ
      const formattedKey = key
        .replace(/[A-Z]/g, (m) => " " + m.toLowerCase())
        .replace(/^./, (c) => c.toUpperCase())
        .replace(/_/g, " ")
        .trim();
      return [formattedKey, value || ""];
    });
};

const ProduitFiche = ({ produit }: { produit: Produit }) => (
  <Card className="flex flex-col h-full border-2 border-[#9b87f5] shadow bg-[#D3E4FD]">
    <CardHeader className="p-3 pb-1 bg-[#FEF7CD] border-b border-[#f6e085]">
      <CardTitle className="text-lg font-semibold text-[#555] truncate">
        <span className="block">Code article : <span className="font-mono text-[#9b87f5]">{produit.codeArticle}</span></span>
        <span className="block text-xs text-[#9b87f5]">Ligne : {produit.numeroLigne}</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 pt-2 overflow-y-auto text-sm">
      <div className="flex flex-col gap-1">
        {getAllFieldLabels(produit).map(([label, value]) => (
          <div key={label} className="flex justify-between border-b border-dashed border-[#ededf6] py-[1px] last:border-none">
            <span className="font-medium text-[#666]">{label}</span>
            <span className="ml-3 text-[#333] font-mono break-all">{value}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const RelevesPage = () => {
  const [codeArticle, setCodeArticle] = useState("");
  const [numeroLigne, setNumeroLigne] = useState("");

  // Filtrage dynamique
  const filtered = produitsInitiaux.filter((p) =>
    (codeArticle ? p.codeArticle.toLowerCase().includes(codeArticle.toLowerCase()) : true) &&
    (numeroLigne ? p.numeroLigne.toLowerCase().includes(numeroLigne.toLowerCase()) : true)
  );

  const produitsAffiches = filtered.slice(0, 5);

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 flex gap-4 items-center">
          <span className="text-noir-800">Relevés</span>
          <span className="text-jaune-300">lignes</span>
        </h1>
        {/* Barre Recherche */}
        <form className="bg-white rounded-md shadow p-4 mb-8 flex flex-wrap gap-4 justify-between items-end border" onSubmit={e => e.preventDefault()}>
          <div className="w-full md:w-auto flex-1">
            <Label htmlFor="recherche-codeArticle">Code Article</Label>
            <Input
              id="recherche-codeArticle"
              value={codeArticle}
              onChange={e => setCodeArticle(e.target.value)}
              placeholder="Entrer le code article"
              className="bg-blue-50"
              autoComplete="off"
            />
          </div>
          <div className="w-full md:w-auto flex-1">
            <Label htmlFor="recherche-numeroLigne">Numéro Ligne</Label>
            <Input
              id="recherche-numeroLigne"
              value={numeroLigne}
              onChange={e => setNumeroLigne(e.target.value)}
              placeholder="Entrer le numéro de ligne"
              className="bg-blue-50"
              autoComplete="off"
            />
          </div>
        </form>

        {/* Grille Fiches Produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {produitsAffiches.length === 0 ? (
            <div className="col-span-full text-center py-8 text-[#888] text-lg">
              Aucun produit trouvé.
            </div>
          ) : (
            produitsAffiches.map((produit) => (
              <ProduitFiche key={produit.id || Math.random()} produit={produit} />
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default RelevesPage;
