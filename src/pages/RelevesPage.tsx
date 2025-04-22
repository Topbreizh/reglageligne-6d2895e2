
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DUMMY_RESULTS = [
  { champ: "Champ 1", valeur: "Valeur 1" },
  { champ: "Champ 2", valeur: "Valeur 2" },
  { champ: "Champ 3", valeur: "Valeur 3" },
];

const blocs = [
  { id: 1, title: "Bloc 1" },
  { id: 2, title: "Bloc 2" },
  { id: 3, title: "Bloc 3" },
  { id: 4, title: "Bloc 4" },
  { id: 5, title: "Bloc 5" },
];

const RelevesPage = () => {
  const [codeArticle, setCodeArticle] = useState("");
  const [numeroLigne, setNumeroLigne] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);

  // Simule la recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchClicked(true);
    // Ici on pourrait appeler une vraie API, en attendant juste flag pour affichage
  };

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          <span className="text-noir-800">Relevés</span>{" "}
          <span className="text-jaune-300">réglages</span>
        </h1>
        {/* Inputs de recherche */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" onSubmit={handleSearch}>
          <div>
            <Label htmlFor="codeArticle">Code Article</Label>
            <Input
              id="codeArticle"
              value={codeArticle}
              onChange={(e) => setCodeArticle(e.target.value)}
              placeholder="Saisir le code article"
            />
          </div>
          <div>
            <Label htmlFor="numeroLigne">Numéro de Ligne</Label>
            <Input
              id="numeroLigne"
              value={numeroLigne}
              onChange={(e) => setNumeroLigne(e.target.value)}
              placeholder="Saisir le numéro de ligne"
            />
          </div>
          {/* Bouton rechercher sur une nouvelle ligne en mobile */}
          <div className="md:col-span-2 flex justify-end mt-2">
            <button
              type="submit"
              className="bg-jaune-300 hover:bg-jaune-400 text-noir-800 font-medium py-2 px-4 rounded"
            >
              Rechercher
            </button>
          </div>
        </form>
        {/* Résultats sous les inputs */}
        <div className="mb-6">
          {searchClicked && (
            <Card>
              <CardHeader>
                <CardTitle>Résultats de la recherche</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Affichage du tableau ou message si aucun résultat */}
                {DUMMY_RESULTS.length === 0 ? (
                  <div className="text-center text-muted-foreground">Aucun résultat trouvé.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Champ</TableHead>
                          <TableHead>Valeur</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {DUMMY_RESULTS.map((item, i) => (
                          <TableRow key={i}>
                            <TableCell>{item.champ}</TableCell>
                            <TableCell>{item.valeur}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        {/* Les 5 blocs disposés en 2 colonnes (1 colonne mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blocs.map((bloc) => (
            <Card key={bloc.id} className="h-40 flex flex-col justify-center items-center">
              <CardHeader>
                <CardTitle>{bloc.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground">Contenu du bloc {bloc.id}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default RelevesPage;

