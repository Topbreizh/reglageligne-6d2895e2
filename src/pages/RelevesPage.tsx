
import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Produit } from "@/types";
import { produitsInitiaux } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { blocsConfiguration } from "@/data/blocConfig";

const RelevesPage = () => {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [filteredProduits, setFilteredProduits] = useState<Produit[]>([]);
  const [searchColumns, setSearchColumns] = useState({
    column1: { field: "codeArticle", value: "" },
    column2: { field: "numeroLigne", value: "" },
    column3: { field: "designation", value: "" },
    column4: { field: "cadence", value: "" },
  });

  // Liste des champs disponibles pour les colonnes de recherche
  const availableFields = blocsConfiguration.flatMap((bloc) =>
    bloc.champs.map((champ) => ({
      id: champ.nomTechnique,
      label: `${bloc.nom} - ${champ.nom}`,
    }))
  );

  useEffect(() => {
    // Dans un vrai système, on chargerait les produits depuis une API
    setProduits(produitsInitiaux);
    setFilteredProduits(produitsInitiaux);
  }, []);

  const handleSearch = () => {
    const filtered = produits.filter((produit) => {
      // Vérifier chaque colonne de recherche
      const matchColumn1 =
        !searchColumns.column1.value ||
        String(produit[searchColumns.column1.field as keyof Produit] || "")
          .toLowerCase()
          .includes(searchColumns.column1.value.toLowerCase());

      const matchColumn2 =
        !searchColumns.column2.value ||
        String(produit[searchColumns.column2.field as keyof Produit] || "")
          .toLowerCase()
          .includes(searchColumns.column2.value.toLowerCase());

      const matchColumn3 =
        !searchColumns.column3.value ||
        String(produit[searchColumns.column3.field as keyof Produit] || "")
          .toLowerCase()
          .includes(searchColumns.column3.value.toLowerCase());

      const matchColumn4 =
        !searchColumns.column4.value ||
        String(produit[searchColumns.column4.field as keyof Produit] || "")
          .toLowerCase()
          .includes(searchColumns.column4.value.toLowerCase());

      return matchColumn1 && matchColumn2 && matchColumn3 && matchColumn4;
    });

    setFilteredProduits(filtered);
  };

  const handleColumnChange = (
    columnKey: string,
    field: string,
    value: string
  ) => {
    setSearchColumns((prev) => ({
      ...prev,
      [columnKey]: {
        ...prev[columnKey as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const getFieldLabel = (fieldId: string) => {
    const field = availableFields.find((f) => f.id === fieldId);
    return field ? field.label : fieldId;
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          <span className="text-noir-800">Relevés des</span> <span className="text-jaune-300">réglages</span>
        </h1>

        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-noir-200">
            <h2 className="text-lg font-semibold mb-4">Recherche multicritères</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Colonne 1 */}
              <div>
                <Label htmlFor="column1-field" className="field-label">Colonne 1</Label>
                <select
                  id="column1-field"
                  className="w-full border border-noir-300 rounded-md p-2 mb-2"
                  value={searchColumns.column1.field}
                  onChange={(e) =>
                    handleColumnChange("column1", "field", e.target.value)
                  }
                >
                  {availableFields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.label}
                    </option>
                  ))}
                </select>
                <Input
                  id="column1-value"
                  placeholder="Valeur"
                  value={searchColumns.column1.value}
                  onChange={(e) =>
                    handleColumnChange("column1", "value", e.target.value)
                  }
                  className="border-noir-300"
                />
              </div>

              {/* Colonne 2 */}
              <div>
                <Label htmlFor="column2-field" className="field-label">Colonne 2</Label>
                <select
                  id="column2-field"
                  className="w-full border border-noir-300 rounded-md p-2 mb-2"
                  value={searchColumns.column2.field}
                  onChange={(e) =>
                    handleColumnChange("column2", "field", e.target.value)
                  }
                >
                  {availableFields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.label}
                    </option>
                  ))}
                </select>
                <Input
                  id="column2-value"
                  placeholder="Valeur"
                  value={searchColumns.column2.value}
                  onChange={(e) =>
                    handleColumnChange("column2", "value", e.target.value)
                  }
                  className="border-noir-300"
                />
              </div>

              {/* Colonne 3 */}
              <div>
                <Label htmlFor="column3-field" className="field-label">Colonne 3</Label>
                <select
                  id="column3-field"
                  className="w-full border border-noir-300 rounded-md p-2 mb-2"
                  value={searchColumns.column3.field}
                  onChange={(e) =>
                    handleColumnChange("column3", "field", e.target.value)
                  }
                >
                  {availableFields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.label}
                    </option>
                  ))}
                </select>
                <Input
                  id="column3-value"
                  placeholder="Valeur"
                  value={searchColumns.column3.value}
                  onChange={(e) =>
                    handleColumnChange("column3", "value", e.target.value)
                  }
                  className="border-noir-300"
                />
              </div>

              {/* Colonne 4 */}
              <div>
                <Label htmlFor="column4-field" className="field-label">Colonne 4</Label>
                <select
                  id="column4-field"
                  className="w-full border border-noir-300 rounded-md p-2 mb-2"
                  value={searchColumns.column4.field}
                  onChange={(e) =>
                    handleColumnChange("column4", "field", e.target.value)
                  }
                >
                  {availableFields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.label}
                    </option>
                  ))}
                </select>
                <Input
                  id="column4-value"
                  placeholder="Valeur"
                  value={searchColumns.column4.value}
                  onChange={(e) =>
                    handleColumnChange("column4", "value", e.target.value)
                  }
                  className="border-noir-300"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                onClick={handleSearch}
                className="bg-jaune-300 text-noir-800 hover:bg-jaune-400"
              >
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-noir-200 overflow-x-auto">
            <Table>
              <TableHeader className="bg-noir-100">
                <TableRow>
                  <TableHead>Code Article</TableHead>
                  <TableHead>Numéro de Ligne</TableHead>
                  <TableHead>Désignation</TableHead>
                  <TableHead>{getFieldLabel(searchColumns.column1.field)}</TableHead>
                  <TableHead>{getFieldLabel(searchColumns.column2.field)}</TableHead>
                  <TableHead>{getFieldLabel(searchColumns.column3.field)}</TableHead>
                  <TableHead>{getFieldLabel(searchColumns.column4.field)}</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProduits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      Aucun produit trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProduits.map((produit) => (
                    <TableRow key={produit.id} className="hover:bg-jaune-50">
                      <TableCell className="font-medium">{produit.codeArticle}</TableCell>
                      <TableCell>{produit.numeroLigne}</TableCell>
                      <TableCell>{produit.designation}</TableCell>
                      <TableCell>
                        {String(produit[searchColumns.column1.field as keyof Produit] || "-")}
                      </TableCell>
                      <TableCell>
                        {String(produit[searchColumns.column2.field as keyof Produit] || "-")}
                      </TableCell>
                      <TableCell>
                        {String(produit[searchColumns.column3.field as keyof Produit] || "-")}
                      </TableCell>
                      <TableCell>
                        {String(produit[searchColumns.column4.field as keyof Produit] || "-")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/fiche/${produit.id}`}>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Fiche
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default RelevesPage;
