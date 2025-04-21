
import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import SearchBox from "@/components/SearchBox";
import ProduitsList from "@/components/ProduitsList";
import { Produit } from "@/types";
import { produitsInitiaux } from "@/data/mockData";

const RecherchePage = () => {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [filteredProduits, setFilteredProduits] = useState<Produit[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Dans un vrai système, on chargerait les produits depuis une API
    setProduits(produitsInitiaux);
    setFilteredProduits(produitsInitiaux);
  }, []);

  const handleSearch = (codeArticle: string, numeroLigne: string, designation: string) => {
    setIsSearching(true);

    // Filtre les produits selon les critères
    const filtered = produits.filter((produit) => {
      const matchCodeArticle = codeArticle
        ? produit.codeArticle.toLowerCase().includes(codeArticle.toLowerCase())
        : true;
      const matchNumeroLigne = numeroLigne
        ? produit.numeroLigne.toLowerCase().includes(numeroLigne.toLowerCase())
        : true;
      const matchDesignation = designation
        ? produit.designation.toLowerCase().includes(designation.toLowerCase())
        : true;

      return matchCodeArticle && matchNumeroLigne && matchDesignation;
    });

    setFilteredProduits(filtered);
    setIsSearching(false);
  };

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          <span className="text-noir-800">Recherche de</span> <span className="text-jaune-300">réglages</span>
        </h1>

        <div className="space-y-6">
          <SearchBox onSearch={handleSearch} />

          {isSearching ? (
            <div className="text-center p-4">Recherche en cours...</div>
          ) : (
            <ProduitsList produits={filteredProduits} />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default RecherchePage;
