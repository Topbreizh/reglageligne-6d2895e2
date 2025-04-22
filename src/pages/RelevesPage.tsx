
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { produitsInitiaux } from "@/data/mockData";

const FicheProduit = ({ produit }: { produit: typeof produitsInitiaux[0] }) => (
  <Card className="flex flex-col h-full border-2 border-[#9b87f5] shadow bg-[#D3E4FD]">
    <CardHeader className="p-3 pb-1 bg-[#FEF7CD] border-b border-[#f6e085]">
      <CardTitle className="text-lg font-semibold text-[#555] truncate">
        {produit.designation} <span className="block text-xs text-[#9b87f5]">{produit.codeArticle} / Ligne {produit.numeroLigne}</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 pt-2 overflow-y-auto">
      <div className="flex flex-col gap-1">
        <span className="font-medium text-[#888]">Poids Pâte: <span className="float-right font-normal">{produit.poidsPate}</span></span>
        <span className="font-medium text-[#888]">Poids Article: <span className="float-right font-normal">{produit.poidsArticle}</span></span>
        <span className="font-medium text-[#888]">Quantité Pâte: <span className="float-right font-normal">{produit.quantitePate}</span></span>
        <span className="font-medium text-[#888]">Pte qualistat: <span className="float-right font-normal">{produit.poidPatequalistat}</span></span>
        <span className="font-medium text-[#888]">Fourrage qualistat: <span className="float-right font-normal">{produit.poidFourragequalistat}</span></span>
        <span className="font-medium text-[#888]">Marquant qualistat: <span className="float-right font-normal">{produit.poidMarquantqualistat}</span></span>
        <span className="font-medium text-[#888]">Bandes: <span className="float-right font-normal">{produit.nbrDeBandes}</span></span>
        <span className="font-medium text-[#222] mt-2">Programme: <span className="float-right font-normal">{produit.programme}</span></span>
        <span className="font-medium text-[#888]">Facteur: <span className="float-right font-normal">{produit.facteur}</span></span>
        <span className="font-medium text-[#888]">Régle laminage: <span className="float-right font-normal">{produit.regleLaminage}</span></span>
        <span className="font-medium text-[#888]">Quick: <span className="float-right font-normal">{produit.quick}</span></span>
        <span className="font-medium text-[#888]">Calibreur1: <span className="float-right font-normal">{produit.calibreur1}</span></span>
        <span className="font-medium text-[#888]">Calibreur2: <span className="float-right font-normal">{produit.calibreur2}</span></span>
        <span className="font-medium text-[#888]">Calibreur3: <span className="float-right font-normal">{produit.calibreur3}</span></span>
        <span className="font-medium text-[#888]">Laminoir: <span className="float-right font-normal">{produit.laminoir}</span></span>
        <span className="font-medium text-[#888]">Vitesse Laminage: <span className="float-right font-normal">{produit.vitesseLaminage}</span></span>
        <span className="font-medium text-[#888]">Farineurs Haut/Bas: <span className="float-right font-normal">{produit.farineurHaut1} / {produit.farineurBas1}</span></span>
        <span className="font-medium text-[#222] mt-2">Cadence: <span className="float-right font-normal">{produit.cadence}</span></span>
        <span className="font-medium text-[#888]">Surveillant: <span className="float-right font-normal">{produit.surveillant}</span></span>
        <span className="font-medium text-[#888]">Sortie étuve: <span className="float-right font-normal">{produit.sortieEtuve}</span></span>
        <span className="font-medium text-[#888]">Commentaire: <span className="float-right font-normal">{produit.commentaire}</span></span>
      </div>
    </CardContent>
  </Card>
);

const RelevesPage = () => {
  const [codeArticle, setCodeArticle] = useState("");
  const [numeroLigne, setNumeroLigne] = useState("");
  const [searchDone, setSearchDone] = useState(false);

  const filtered = produitsInitiaux.filter((p) =>
    (codeArticle ? p.codeArticle.toLowerCase().includes(codeArticle.toLowerCase()) : true) &&
    (numeroLigne ? p.numeroLigne.toLowerCase().includes(numeroLigne.toLowerCase()) : true)
  );

  const produitsAffiches = filtered.slice(0, 5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchDone(true);
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 flex gap-4 items-center">
          <span className="text-noir-800">Relevés</span>
          <span className="text-jaune-300">lignes</span>
        </h1>
        {/* Barre Recherche */}
        <form onSubmit={handleSearch} className="bg-white rounded-md shadow p-4 mb-8 flex flex-wrap gap-4 justify-between items-end border">
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
          <button type="submit" className="bg-[#FEF7CD] hover:bg-[#fff7aa] text-[#555] font-semibold py-2 px-6 rounded shadow min-w-[140px]">
            Rechercher
          </button>
        </form>

        {/* Grille Fiches Produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {produitsAffiches.length === 0 ? (
            <div className="col-span-full text-center py-8 text-[#888] text-lg">
              Aucun produit trouvé.
            </div>
          ) : (
            produitsAffiches.map((produit, idx) => (
              <FicheProduit key={idx} produit={produit} />
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default RelevesPage;
