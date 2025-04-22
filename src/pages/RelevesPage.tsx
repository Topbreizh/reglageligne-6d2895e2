
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { blocsConfiguration } from "@/data/blocConfig";

const NB_BLOCS = 5;
const DUMMY_RESULTS = [
  { champ: "Champ 1", valeur: "Valeur 1" },
  { champ: "Champ 2", valeur: "Valeur 2" },
  { champ: "Champ 3", valeur: "Valeur 3" },
];

const RelevesPage = () => {
  // Données pour chaque bloc (1 à 5)
  const [blocsData, setBlocsData] = useState(
    Array.from({ length: NB_BLOCS }, () => ({
      codeArticle: "",
      numeroLigne: "",
      champs: {} as Record<string, string>,
    }))
  );
  const [searchClicked, setSearchClicked] = useState(false);

  const handleInputChange = (blocIdx: number, field: string, value: string) => {
    setBlocsData(prev => {
      const updated = [...prev];
      updated[blocIdx] = {
        ...updated[blocIdx],
        [field]: value,
      };
      return updated;
    });
  };

  // Pour simplifier, on considère que les champs liés au code article sont ceux du bloc "Article"
  const articleBloc = blocsConfiguration.find((b) => b.id === "article");
  const articleChamps = articleBloc ? articleBloc.champs : [];

  // Actions pour les champs dynamiques liés à codeArticle
  const handleChampChange = (blocIdx: number, champId: string, value: string) => {
    setBlocsData(prev => {
      const updated = [...prev];
      updated[blocIdx] = {
        ...updated[blocIdx],
        champs: {
          ...updated[blocIdx].champs,
          [champId]: value,
        },
      };
      return updated;
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchClicked(true);
  };

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          <span className="text-noir-800">Relevés</span>{" "}
          <span className="text-jaune-300">réglages</span>
        </h1>
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {Array.from({ length: NB_BLOCS }).map((_, blocIdx) => (
              <Card key={blocIdx} className="flex flex-col justify-start">
                <CardHeader>
                  <CardTitle>Bloc {blocIdx + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Ligne codeArticle / numéroLigne */}
                  <div className="flex flex-row gap-4 mb-4">
                    <div className="flex-1">
                      <Label htmlFor={`codeArticle-${blocIdx}`}>Code Article</Label>
                      <Input
                        id={`codeArticle-${blocIdx}`}
                        value={blocsData[blocIdx].codeArticle}
                        onChange={(e) =>
                          handleInputChange(blocIdx, "codeArticle", e.target.value)
                        }
                        placeholder="Saisir le code article"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`numeroLigne-${blocIdx}`}>Numéro de Ligne</Label>
                      <Input
                        id={`numeroLigne-${blocIdx}`}
                        value={blocsData[blocIdx].numeroLigne}
                        onChange={(e) =>
                          handleInputChange(blocIdx, "numeroLigne", e.target.value)
                        }
                        placeholder="Saisir le numéro de ligne"
                      />
                    </div>
                  </div>
                  {/* Champs dynamiques */}
                  {articleChamps
                    .filter(
                      (champ) =>
                        champ.id !== "codeArticle" && champ.id !== "numeroLigne"
                    )
                    .map((champ) => (
                      <div key={champ.id} className="mb-3">
                        <Label htmlFor={`${champ.id}-${blocIdx}`}>{champ.nom}</Label>
                        <Input
                          id={`${champ.id}-${blocIdx}`}
                          value={blocsData[blocIdx].champs[champ.id] || ""}
                          onChange={(e) =>
                            handleChampChange(blocIdx, champ.id, e.target.value)
                          }
                          placeholder={`Saisir ${champ.nom.toLowerCase()}`}
                        />
                      </div>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Bouton rechercher aligné à droite */}
          <div className="flex justify-end mb-6">
            <button
              type="submit"
              className="bg-jaune-300 hover:bg-jaune-400 text-noir-800 font-medium py-2 px-4 rounded"
            >
              Rechercher
            </button>
          </div>
        </form>
        {/* Résultats sous les blocs */}
        <div className="mb-10">
          {searchClicked && (
            <Card>
              <CardHeader>
                <CardTitle>Résultats de la recherche</CardTitle>
              </CardHeader>
              <CardContent>
                {DUMMY_RESULTS.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    Aucun résultat trouvé.
                  </div>
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
      </div>
    </PageLayout>
  );
};

export default RelevesPage;
