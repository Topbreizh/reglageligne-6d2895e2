
import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Produit } from "@/types";

interface ProduitAllFieldsProps {
  produit: Produit;
  selected: boolean;
  onClick: () => void;
}

function ProduitAllFieldsFiche({ produit, selected, onClick }: ProduitAllFieldsProps) {
  // Affiche dynamiquement toutes les clés de produit sauf "id"
  const filteredKeys = Object.keys(produit).filter(k => k !== "id");
  return (
    <div
      className={`rounded shadow border-2 cursor-pointer w-[320px] min-h-[350px] transition
        ${selected ? "border-indigo-600 bg-indigo-50" : "border-indigo-300 bg-white"}
        flex flex-col overflow-hidden
      `}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label="Sélectionner"
    >
      {/* En-tête avec codeArticle / ligne */}
      <div className="bg-yellow-100 border-b border-indigo-200 px-4 py-3">
        <div className="font-bold text-md text-neutral-800">
          Code article : <span className="text-indigo-500 font-mono underline">{produit.codeArticle}</span>
        </div>
        <div className="text-sm" style={{ color: "#8886d0" }}>
          Ligne : <span className="underline font-mono">{produit.numeroLigne}</span>
        </div>
      </div>
      <div className="flex-1 bg-blue-100/80 p-0">
        <table className="w-full text-sm border-separate" style={{ borderSpacing: 0 }}>
          <tbody>
            {filteredKeys.map((key) => (
              <tr key={key} className="border-b border-blue-200 last:border-none">
                <td className="pl-3 py-0.5 text-right text-blue-900 font-medium whitespace-nowrap lowercase">{key}</td>
                <td className="pl-2 py-0.5 pr-2 font-mono text-black break-words">
                  {produit[key]?.toString() ?? ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function RelevesPage() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [codeArticle, setCodeArticle] = useState("");
  const [numeroLigne, setNumeroLigne] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Recherche des produits dans Firebase dès le chargement (pas mockData)
  useEffect(() => {
    async function fetchProduits() {
      setLoading(true);
      const produitsFirebase: Produit[] = [];
      const snapshot = await getDocs(collection(db, "reglages"));
      snapshot.forEach((doc) => {
        const data = doc.data();
        produitsFirebase.push({
          id: doc.id,
          ...data,
        } as Produit);
      });
      setProduits(produitsFirebase);
      setLoading(false);
    }
    fetchProduits();
  }, []);

  // Filtrage en direct en fonction de la recherche utilisateur
  const produitsFiltres = produits.filter((produit) => {
    const matchCode = codeArticle === "" || (produit.codeArticle ?? "").toLowerCase().includes(codeArticle.toLowerCase());
    const matchLigne = numeroLigne === "" || (produit.numeroLigne ?? "").toLowerCase().includes(numeroLigne.toLowerCase());
    return matchCode && matchLigne;
  });

  // On affiche 5 produits max
  const produitsAffiches = produitsFiltres.slice(0, 5);

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 flex gap-4 items-center">
          <span className="text-noir-800">Relevés produits</span>
          <span className="text-indigo-400 font-semibold">grille</span>
        </h1>
        
        {/* Barre de recherche */}
        <form className="bg-white rounded shadow p-4 mb-6 flex flex-wrap gap-4 border"
              onSubmit={e => e.preventDefault()}>
          <div className="w-full md:w-1/4 flex flex-col">
            <Label htmlFor="rech-codeArticle">Code article</Label>
            <Input
              id="rech-codeArticle"
              value={codeArticle}
              onChange={e => setCodeArticle(e.target.value)}
              placeholder="Entrer le code article"
              className="bg-blue-50"
              autoComplete="off"
            />
          </div>
          <div className="w-full md:w-1/4 flex flex-col">
            <Label htmlFor="rech-numeroLigne">Numéro ligne</Label>
            <Input
              id="rech-numeroLigne"
              value={numeroLigne}
              onChange={e => setNumeroLigne(e.target.value)}
              placeholder="Entrer le numéro de ligne"
              className="bg-blue-50"
              autoComplete="off"
            />
          </div>
        </form>

        {/* Grille : 1 ligne de 5 max, chaque carte sélectionnable */}
        <div className="flex flex-wrap gap-6 md:justify-center">
          {loading ? (
            <div className="w-full text-center py-8 text-[#888] text-lg">
              Chargement...
            </div>
          ) : produitsAffiches.length === 0 ? (
            <div className="w-full text-center py-8 text-[#888] text-lg">
              Aucun produit trouvé.
            </div>
          ) : (
            produitsAffiches.map((produit, idx) => (
              <ProduitAllFieldsFiche
                key={produit.id || Math.random()}
                produit={produit}
                selected={selectedIndex === idx}
                onClick={() => setSelectedIndex(idx)}
              />
            ))
          )}
        </div>
        {selectedIndex !== null && produitsAffiches[selectedIndex] && (
          <div className="mt-8 px-4">
            <div className="rounded border-2 border-indigo-400 bg-indigo-50 p-4 shadow font-semibold text-indigo-900">
              Produit sélectionné : <span className="font-mono text-lg">{produitsAffiches[selectedIndex].codeArticle}</span>
              {produitsAffiches[selectedIndex].numeroLigne && (
                <span className="ml-8">Ligne : <span className="font-mono">{produitsAffiches[selectedIndex].numeroLigne}</span></span>
              )}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
