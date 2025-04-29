
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Pencil } from "lucide-react";
import PDFExportButton from "@/components/PDFExportButton";
import { Produit } from "@/types";

interface ProduitFicheHeaderProps {
  produit: Produit;
  printFiche: () => void;
}

const ProduitFicheHeader = ({ produit, printFiche }: ProduitFicheHeaderProps) => {
  return (
    <div className="printable-header mb-6">
      <h1 className="text-2xl font-bold">
        Fiche Produit: {produit.designation} ({produit.codeArticle})
      </h1>
      <div className="no-print flex flex-wrap gap-2 mt-2">
        <Link to={`/modifier/${produit.id}`}>
          <Button className="bg-jaune-300 text-noir-800 hover:bg-jaune-400">
            <Pencil className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </Link>
        <Button onClick={printFiche} variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Imprimer
        </Button>
        <PDFExportButton contentId="printable-content" />
      </div>
    </div>
  );
};

export default ProduitFicheHeader;
