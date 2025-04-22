
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { blocsConfiguration } from "@/data/blocConfig";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const NB_BLOCS = 5;

// Champs du bloc Article :
const articleBloc = blocsConfiguration.find((b) => b.id === "article");
const articleChamps = articleBloc ? articleBloc.champs : [];

const emptyBloc = () =>
  articleChamps.reduce(
    (acc, champ) => ({ ...acc, [champ.id]: "" }),
    {} as Record<string, string>
  );

const RelevesPage = () => {
  // État pour chaque bloc : tous les champs Article
  const [blocsData, setBlocsData] = useState(
    Array.from({ length: NB_BLOCS }, emptyBloc)
  );
  const [searchClicked, setSearchClicked] = useState(false);

  // Champs de recherche factice (à remplacer plus tard par l'appel Firebase ou autre)
  const DUMMY_RESULTS = [
    { champ: "Code article", col1: "53014", col2: "", col3: "", col4: "", col5: "" },
    { champ: "Numéro de ligne", col1: "5", col2: "", col3: "", col4: "", col5: "" },
    { champ: "Désignation", col1: "Cr Courbé P CRU 70g 30% BF R15", col2: "", col3: "", col4: "", col5: "" },
    // Ajouter ci-dessous toutes les sections/thèmes et champs en ligne comme sur l'aperçu
    { champ: "Rouleau supérieur (15)", col1: "", col2: "", col3: "", col4: "", col5: "" },
    { champ: "Rouleau inferieur (16)", col1: "", col2: "", col3: "", col4: "", col5: "" },
    { champ: "Tapis façonneuse (17)", col1: "", col2: "", col3: "", col4: "", col5: "" },
    { champ: "Repère poignée (18)", col1: "", col2: "", col3: "", col4: "", col5: "" },
    { champ: "Rouleau pression (20)", col1: "", col2: "", col3: "", col4: "", col5: "" },
    { champ: "Vitesse tapis après guillotine (21)", col1: "", col2: "", col3: "", col4: "", col5: "" },
    { champ: "Etuve - surgel (22)", col1: "", col2: "", col3: "", col4: "", col5: "" },
    { champ: "Programme (5)", col1: "", col2: "", col3: "", col4: "", col5: "" },
    { champ: "Règle laminage (6)", col1: "", col2: "", col3: "", col4: "", col5: "" },
    { champ: "Quick (7)", col1: "", col2: "", col3: "", col4: "", col5: "" },
    { champ: "Calibreur1 (8)", col1: "", col2: "", col3: "", col4: "", col5: "" },
    { champ: "Calibreur 2 (9)", col1: "", col2: "", col3: "", col4: "", col5: "" },
    { champ: "Calibreur 3 (10)", col1: "", col2: "", col3: "", col4: "", col5: "" },
    { champ: "Laminoir (11)", col1: "", col2: "", col3: "", col4: "", col5: "" },
    { champ: "Retourneur (12)", col1: "", col2: "", col3: "", col4: "", col5: "" },
    { champ: "Aligneur (13)", col1: "", col2: "", col3: "", col4: "", col5: "" },
    { champ: "Humidificateur (14)", col1: "", col2: "", col3: "", col4: "", col5: "" }
  ];

  // Gestions des inputs :
  const handleInputChange = (blocIdx: number, champId: string, value: string) => {
    setBlocsData((prev) => {
      const next = [...prev];
      next[blocIdx] = {
        ...next[blocIdx],
        [champId]: value,
      };
      return next;
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchClicked(true);
  };

  // Rendu !
  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 flex gap-4 items-center">
          {/* Logo fictif pour respecter l'inspiration */}
          <img src="/lovable-uploads/ffe91cd6-93fd-4680-9f95-70decf334710.png" 
            alt="Logo Bridor" className="h-16 w-auto mr-4 hidden md:block rounded-lg shadow" />
          <span className="text-noir-800">Relevés</span>
          <span className="text-jaune-300">lignes</span>
        </h1>
        <form onSubmit={handleSearch}>
          {/* Grille 2 colonnes, chaque colonne contient quelques blocs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* 5 blocs affichés, répartition naturelle en responsive */}
            {Array.from({ length: NB_BLOCS }).map((_, blocIdx) => (
              <Card key={blocIdx} className="flex flex-col min-h-[180px] bg-[#D3E4FD] shadow border-2 border-[#9b87f5]">
                <CardHeader className="p-3 pb-1 bg-[#FEF7CD]">
                  <CardTitle className="text-lg font-semibold text-[#555]">
                    Code article + ligne
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2 bg-[#D3E4FD]">
                  <div className="flex flex-row gap-3 mb-2">
                    {/* Code Article */}
                    <div className="w-1/2">
                      <Label htmlFor={`codeArticle-${blocIdx}`}>
                        Code article
                      </Label>
                      <Input
                        id={`codeArticle-${blocIdx}`}
                        className="bg-yellow-50"
                        value={blocsData[blocIdx].codeArticle || ""}
                        onChange={(e) =>
                          handleInputChange(blocIdx, "codeArticle", e.target.value)
                        }
                        placeholder="Code article"
                        autoComplete="off"
                      />
                    </div>
                    {/* Numéro de Ligne */}
                    <div className="w-1/2">
                      <Label htmlFor={`numeroLigne-${blocIdx}`}>
                        Numéro de ligne
                      </Label>
                      <Input
                        id={`numeroLigne-${blocIdx}`}
                        className="bg-yellow-50"
                        value={blocsData[blocIdx].numeroLigne || ""}
                        onChange={(e) =>
                          handleInputChange(blocIdx, "numeroLigne", e.target.value)
                        }
                        placeholder="Ligne"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  {/* Tous les autres champs liés au code article sauf codeArticle et numeroLigne */}
                  {articleChamps
                    .filter(
                      (champ) =>
                        champ.id !== "codeArticle" &&
                        champ.id !== "numeroLigne"
                    )
                    .map((champ) => (
                      <div key={champ.id} className="mb-1">
                        <Label htmlFor={`${champ.id}-${blocIdx}`}>{champ.nom}</Label>
                        <Input
                          id={`${champ.id}-${blocIdx}`}
                          className="bg-blue-50"
                          value={blocsData[blocIdx][champ.id] || ""}
                          onChange={(e) =>
                            handleInputChange(
                              blocIdx,
                              champ.id,
                              e.target.value
                            )
                          }
                          placeholder={champ.nom}
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
              className="bg-[#FEF7CD] hover:bg-[#fff7aa] text-[#555] font-semibold py-2 px-4 rounded shadow"
            >
              Rechercher
            </button>
          </div>
        </form>

        {/* Résultats sous les blocs */}
        <div className="mb-10">
          {searchClicked &&
            <Card className="border-2 border-[#9b87f5] shadow">
              <CardHeader className="bg-[#FEF7CD] py-2">
                <CardTitle className="text-[#555] text-lg">Résultats de la recherche</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="bg-[#1EAEDB] text-white">Champ</TableHead>
                        {Array.from({ length: NB_BLOCS }).map((_, idx) => (
                          <TableHead
                            key={idx}
                            className="bg-[#1EAEDB] text-white text-center"
                          >
                            Bloc {idx + 1}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {DUMMY_RESULTS.map((item, i) => (
                        <TableRow
                          key={i}
                          className={
                            i === 0
                              ? "bg-[#FEF7CD]"
                              : i < 3
                              ? "bg-[#D3E4FD]"
                              : i === 4 || i === 8 || i === 12 || i === 18
                              ? "bg-[#FEF7CD]"
                              : "bg-[#F2FCE2]"
                          }
                        >
                          <TableCell className="font-semibold">
                            {item.champ}
                          </TableCell>
                          {[item.col1, item.col2, item.col3, item.col4, item.col5].map(
                            (val, j) => (
                              <TableCell key={j} className="text-center">
                                {val}
                              </TableCell>
                            )
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          }
        </div>
      </div>
    </PageLayout>
  );
};

export default RelevesPage;
