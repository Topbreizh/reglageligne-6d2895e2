
import { useState } from "react";
import { Produit } from "@/types";
import { Button } from "@/components/ui/button";
import { FileText, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface ProduitsListProps {
  produits: Produit[];
}

const ProduitsList = ({ produits }: ProduitsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = produits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(produits.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (produits.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-noir-200 text-center">
        <p className="text-noir-600">Aucun produit trouvé.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-noir-200 overflow-x-auto">
      <Table>
        <TableHeader className="bg-noir-100">
          <TableRow>
            <TableHead className="font-bold">Code Article</TableHead>
            <TableHead className="font-bold">Numéro de Ligne</TableHead>
            <TableHead className="font-bold">Désignation</TableHead>
            <TableHead className="text-right font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((produit) => (
            <TableRow key={produit.id} className="hover:bg-jaune-50">
              <TableCell className="font-medium">{produit.codeArticle}</TableCell>
              <TableCell>{produit.numeroLigne}</TableCell>
              <TableCell>{produit.designation}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link to={`/fiche/${produit.id}`}>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                  </Link>
                  <Link to={`/modifier/${produit.id}`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-noir-200">
          <div>
            <p className="text-sm text-noir-700">
              Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, produits.length)} sur {produits.length} produits
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={prevPage}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              Précédent
            </Button>
            <Button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProduitsList;
