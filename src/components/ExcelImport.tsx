
import { useState } from "react";
import { ImportMapping, Produit } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { blocsConfiguration } from "@/data/blocConfig";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Import, Table as TableIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const ExcelImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [mappings, setMappings] = useState<ImportMapping[]>([]);
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  // Liste de tous les champs disponibles pour le mapping (dans l'ordre des blocs + champs)
  const champsCibles = blocsConfiguration.flatMap((bloc) =>
    bloc.champs.map((champ) => ({
      id: champ.id,
      nom: champ.nom,
      blocNom: bloc.nom,
      nomTechnique: champ.nomTechnique,
    }))
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      
      // Vérification du type de fichier
      if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        toast({
          title: "Format non supporté",
          description: "Veuillez sélectionner un fichier Excel (.xlsx, .xls) ou CSV (.csv)",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Simuler l'extraction des en-têtes et des données avec un jeu de données plus complet
      setTimeout(() => {
        // Exemple d'entêtes plus complet pour démonstration
        const mockHeaders = [
          "Code Article",
          "Numéro de ligne",
          "Désignation",
          "Programme",
          "Facteur",
          "Calibrage",
          "Vitesse",
          "Laminoir",
          "Farineur Haut 1",
          "Farineur Haut 2",
          "Farineur Haut 3",
          "Farineur Bas 1",
          "Farineur Bas 2",
          "Farineur Bas 3",
          "Queue de Carpe",
          "Numéro Découpe",
          "Buse",
          "Humidificateur 1-4-6",
          "Distributeur Choco/Raisin",
          "Vitesse Doreuse",
          "P1 Longueur Découpe",
          "P2 Centrage",
          "Bielle",
          "Lame Racleur",
          "Rademaker",
          "Aera",
          "Fritch",
          "Retourneur",
          "Aligneur",
          "Humidificateur 2-5",
          "Push Plaque",
          "Rouleau Inférieur",
          "Rouleau Supérieur",
          "Tapis Façonneuse",
          "Repère Poignée",
          "Rouleau Pression",
          "Tapis Avant Étuve Surgel",
          "Étuve Surgel",
          "Cadence",
          "Lamineur",
          "Surveillant",
          "Distributeur Raisin/Choco",
          "Pose",
          "Pliage/Triage",
          "Topping",
          "Sortie Étuve",
          "Ouverture MP",
          "Commentaire",
          "Règle Laminage",
          "Quick"
        ];
        
        // Jeu de données plus complet
        const mockData = [
          {
            "Code Article": "P004",
            "Numéro de ligne": "3",
            "Désignation": "Chausson aux pommes",
            "Programme": "P40",
            "Facteur": "1.2",
            "Calibrage": "2.5",
            "Vitesse": "45",
            "Laminoir": "L1",
            "Farineur Haut 1": "3.2",
            "Farineur Haut 2": "2.2",
            "Farineur Haut 3": "1.2",
            "Farineur Bas 1": "2.4",
            "Farineur Bas 2": "2.1",
            "Farineur Bas 3": "1.9",
            "Queue de Carpe": "Oui",
            "Numéro Découpe": "7",
            "Buse": "B3",
            "Humidificateur 1-4-6": "H2",
            "Distributeur Choco/Raisin": "D1",
            "Vitesse Doreuse": "35",
            "P1 Longueur Découpe": "15",
            "P2 Centrage": "Centre",
            "Bielle": "B2",
            "Lame Racleur": "L3",
            "Rademaker": "R1",
            "Aera": "A2",
            "Fritch": "F3",
            "Retourneur": "On",
            "Aligneur": "3",
            "Humidificateur 2-5": "H1",
            "Push Plaque": "P2",
            "Rouleau Inférieur": "4",
            "Rouleau Supérieur": "5",
            "Tapis Façonneuse": "T3",
            "Repère Poignée": "2",
            "Rouleau Pression": "3",
            "Tapis Avant Étuve Surgel": "On",
            "Étuve Surgel": "220°C",
            "Cadence": "60",
            "Lamineur": "Dupont",
            "Surveillant": "Martin",
            "Distributeur Raisin/Choco": "Durand",
            "Pose": "Laurent",
            "Pliage/Triage": "Robert",
            "Topping": "Petit",
            "Sortie Étuve": "Simon",
            "Ouverture MP": "Bernard",
            "Commentaire": "RAS",
            "Règle Laminage": "Standard",
            "Quick": "Non"
          },
          {
            "Code Article": "P005",
            "Numéro de ligne": "1",
            "Désignation": "Croissant aux amandes",
            "Programme": "P32",
            "Facteur": "1.3",
            "Calibrage": "2.3",
            "Vitesse": "50",
            "Laminoir": "L2",
            "Farineur Haut 1": "3.0",
            "Farineur Haut 2": "2.0",
            "Farineur Haut 3": "1.0",
            "Farineur Bas 1": "2.5",
            "Farineur Bas 2": "2.0",
            "Farineur Bas 3": "1.5",
            "Queue de Carpe": "Non",
            "Numéro Découpe": "5",
            "Buse": "B2",
            "Humidificateur 1-4-6": "H1",
            "Distributeur Choco/Raisin": "D2",
            "Vitesse Doreuse": "40",
            "P1 Longueur Découpe": "12",
            "P2 Centrage": "Gauche",
            "Bielle": "B1",
            "Lame Racleur": "L2",
            "Rademaker": "R2",
            "Aera": "A1",
            "Fritch": "F2",
            "Retourneur": "Off",
            "Aligneur": "2",
            "Humidificateur 2-5": "H2",
            "Push Plaque": "P1",
            "Rouleau Inférieur": "3",
            "Rouleau Supérieur": "4",
            "Tapis Façonneuse": "T2",
            "Repère Poignée": "1",
            "Rouleau Pression": "2",
            "Tapis Avant Étuve Surgel": "Off",
            "Étuve Surgel": "200°C",
            "Cadence": "55",
            "Lamineur": "Lefèvre",
            "Surveillant": "Moreau",
            "Distributeur Raisin/Choco": "Dubois",
            "Pose": "Richard",
            "Pliage/Triage": "Thomas",
            "Topping": "Girard",
            "Sortie Étuve": "Morel",
            "Ouverture MP": "David",
            "Commentaire": "Ajuster température",
            "Règle Laminage": "Spécial",
            "Quick": "Oui"
          },
          {
            "Code Article": "P006",
            "Numéro de ligne": "2",
            "Désignation": "Pain au chocolat",
            "Programme": "P35",
            "Facteur": "1.4",
            "Calibrage": "2.6",
            "Vitesse": "55",
            "Laminoir": "L3",
            "Farineur Haut 1": "3.1",
            "Farineur Haut 2": "2.1",
            "Farineur Haut 3": "1.1",
            "Farineur Bas 1": "2.6",
            "Farineur Bas 2": "2.2",
            "Farineur Bas 3": "1.8",
            "Queue de Carpe": "Non",
            "Numéro Découpe": "6",
            "Buse": "B4",
            "Humidificateur 1-4-6": "H3",
            "Distributeur Choco/Raisin": "D3",
            "Vitesse Doreuse": "38",
            "P1 Longueur Découpe": "14",
            "P2 Centrage": "Droite",
            "Bielle": "B3",
            "Lame Racleur": "L4",
            "Rademaker": "R3",
            "Aera": "A3",
            "Fritch": "F1",
            "Retourneur": "On",
            "Aligneur": "4",
            "Humidificateur 2-5": "H3",
            "Push Plaque": "P3",
            "Rouleau Inférieur": "5",
            "Rouleau Supérieur": "6",
            "Tapis Façonneuse": "T4",
            "Repère Poignée": "3",
            "Rouleau Pression": "4",
            "Tapis Avant Étuve Surgel": "On",
            "Étuve Surgel": "210°C",
            "Cadence": "65",
            "Lamineur": "Roux",
            "Surveillant": "Fournier",
            "Distributeur Raisin/Choco": "Vincent",
            "Pose": "Leroy",
            "Pliage/Triage": "Mercier",
            "Topping": "Boyer",
            "Sortie Étuve": "Garnier",
            "Ouverture MP": "Chevalier",
            "Commentaire": "Vérifier cuisson",
            "Règle Laminage": "Allégé",
            "Quick": "Non"
          },
          {
            "Code Article": "P007",
            "Numéro de ligne": "4",
            "Désignation": "Brioche feuilletée",
            "Programme": "P38",
            "Facteur": "1.5",
            "Calibrage": "2.8",
            "Vitesse": "48",
            "Laminoir": "L4",
            "Farineur Haut 1": "3.3",
            "Farineur Haut 2": "2.3",
            "Farineur Haut 3": "1.3",
            "Farineur Bas 1": "2.7",
            "Farineur Bas 2": "2.3",
            "Farineur Bas 3": "1.7",
            "Queue de Carpe": "Oui",
            "Numéro Découpe": "8",
            "Buse": "B1",
            "Humidificateur 1-4-6": "H4",
            "Distributeur Choco/Raisin": "D4",
            "Vitesse Doreuse": "42",
            "P1 Longueur Découpe": "16",
            "P2 Centrage": "Centre",
            "Bielle": "B4",
            "Lame Racleur": "L1",
            "Rademaker": "R4",
            "Aera": "A4",
            "Fritch": "F4",
            "Retourneur": "Off",
            "Aligneur": "1",
            "Humidificateur 2-5": "H4",
            "Push Plaque": "P4",
            "Rouleau Inférieur": "2",
            "Rouleau Supérieur": "3",
            "Tapis Façonneuse": "T1",
            "Repère Poignée": "4",
            "Rouleau Pression": "1",
            "Tapis Avant Étuve Surgel": "Off",
            "Étuve Surgel": "225°C",
            "Cadence": "58",
            "Lamineur": "Michel",
            "Surveillant": "Bertrand",
            "Distributeur Raisin/Choco": "Legrand",
            "Pose": "Faure",
            "Pliage/Triage": "Rousseau",
            "Topping": "Blanc",
            "Sortie Étuve": "Guerin",
            "Ouverture MP": "Henry",
            "Commentaire": "OK",
            "Règle Laminage": "Renforcé",
            "Quick": "Oui"
          }
        ];

        setHeaders(mockHeaders);
        setPreviewData(mockData);

        // Initialiser le mapping pour chaque champ de l'appli 
        const initialMappings = champsCibles.map(champApp => {
          // Chercher une entête qui "matche" ce champ
          const foundHeader = mockHeaders.find(header => {
            // Normalisation simple pour comparaison
            const hNorm = header.toLowerCase().replace(/[\s-/]+/g, "");
            const champNomNorm = champApp.nom.toLowerCase().replace(/[\s-/]+/g, "");
            const champTechNorm = champApp.nomTechnique.toLowerCase();
            
            return hNorm === champNomNorm || hNorm === champTechNorm || 
                   hNorm.includes(champNomNorm) || hNorm.includes(champTechNorm) ||
                   champNomNorm.includes(hNorm) || champTechNorm.includes(hNorm);
          });
          
          let champSource = "none";
          
          // Matching spécial pour certains champs spécifiques
          if (champApp.nomTechnique === "codeArticle" && mockHeaders.find(h => h.toLowerCase().includes("code"))) {
            champSource = mockHeaders.find(h => h.toLowerCase().includes("code")) || "none";
          }
          else if (champApp.nomTechnique === "numeroLigne" && mockHeaders.find(h => h.toLowerCase().includes("numéro") && h.toLowerCase().includes("ligne"))) {
            champSource = mockHeaders.find(h => h.toLowerCase().includes("numéro") && h.toLowerCase().includes("ligne")) || "none";
          }
          else if (champApp.nomTechnique === "designation" && mockHeaders.find(h => h.toLowerCase().includes("désignation"))) {
            champSource = mockHeaders.find(h => h.toLowerCase().includes("désignation")) || "none";
          }
          else if (champApp.nomTechnique === "calibreur1" && mockHeaders.find(h => h.toLowerCase().includes("calibrage"))) {
            champSource = mockHeaders.find(h => h.toLowerCase().includes("calibrage")) || "none";
          }
          else if (champApp.nomTechnique === "vitesseLaminage" && mockHeaders.find(h => h.toLowerCase().includes("vitesse") && !h.toLowerCase().includes("doreuse"))) {
            champSource = mockHeaders.find(h => h.toLowerCase().includes("vitesse") && !h.toLowerCase().includes("doreuse")) || "none";
          }
          else if (champApp.nomTechnique === "farineurHaut1" && mockHeaders.find(h => h.toLowerCase().includes("farineur") && h.toLowerCase().includes("haut") && h.toLowerCase().includes("1"))) {
            champSource = mockHeaders.find(h => h.toLowerCase().includes("farineur") && h.toLowerCase().includes("haut") && h.toLowerCase().includes("1")) || "none";
          }
          else if (champApp.nomTechnique === "farineurHaut2" && mockHeaders.find(h => h.toLowerCase().includes("farineur") && h.toLowerCase().includes("haut") && h.toLowerCase().includes("2"))) {
            champSource = mockHeaders.find(h => h.toLowerCase().includes("farineur") && h.toLowerCase().includes("haut") && h.toLowerCase().includes("2")) || "none";
          }
          else if (champApp.nomTechnique === "farineurHaut3" && mockHeaders.find(h => h.toLowerCase().includes("farineur") && h.toLowerCase().includes("haut") && h.toLowerCase().includes("3"))) {
            champSource = mockHeaders.find(h => h.toLowerCase().includes("farineur") && h.toLowerCase().includes("haut") && h.toLowerCase().includes("3")) || "none";
          }
          else if (champApp.nomTechnique === "farineurBas1" && mockHeaders.find(h => h.toLowerCase().includes("farineur") && h.toLowerCase().includes("bas") && h.toLowerCase().includes("1"))) {
            champSource = mockHeaders.find(h => h.toLowerCase().includes("farineur") && h.toLowerCase().includes("bas") && h.toLowerCase().includes("1")) || "none";
          }
          else if (champApp.nomTechnique === "farineurBas2" && mockHeaders.find(h => h.toLowerCase().includes("farineur") && h.toLowerCase().includes("bas") && h.toLowerCase().includes("2"))) {
            champSource = mockHeaders.find(h => h.toLowerCase().includes("farineur") && h.toLowerCase().includes("bas") && h.toLowerCase().includes("2")) || "none";
          }
          else if (champApp.nomTechnique === "farineurBas3" && mockHeaders.find(h => h.toLowerCase().includes("farineur") && h.toLowerCase().includes("bas") && h.toLowerCase().includes("3"))) {
            champSource = mockHeaders.find(h => h.toLowerCase().includes("farineur") && h.toLowerCase().includes("bas") && h.toLowerCase().includes("3")) || "none";
          }
          else if (champApp.nomTechnique === "humidificateur146" && mockHeaders.find(h => h.toLowerCase().includes("humidificateur") && h.toLowerCase().includes("1-4-6"))) {
            champSource = mockHeaders.find(h => h.toLowerCase().includes("humidificateur") && h.toLowerCase().includes("1-4-6")) || "none";
          }
          else if (champApp.nomTechnique === "humidificateur25" && mockHeaders.find(h => h.toLowerCase().includes("humidificateur") && h.toLowerCase().includes("2-5"))) {
            champSource = mockHeaders.find(h => h.toLowerCase().includes("humidificateur") && h.toLowerCase().includes("2-5")) || "none";
          }
          else if (champApp.nomTechnique === "queueDeCarpe" && mockHeaders.find(h => h.toLowerCase().includes("queue") && h.toLowerCase().includes("carpe"))) {
            champSource = mockHeaders.find(h => h.toLowerCase().includes("queue") && h.toLowerCase().includes("carpe")) || "none";
          }
          else if (champApp.nomTechnique === "numeroDecoupe" && mockHeaders.find(h => h.toLowerCase().includes("numéro") && h.toLowerCase().includes("découpe"))) {
            champSource = mockHeaders.find(h => h.toLowerCase().includes("numéro") && h.toLowerCase().includes("découpe")) || "none";
          }
          else if (champApp.nomTechnique === "distributeurChocoRaisin" && mockHeaders.find(h => h.toLowerCase().includes("distributeur") && (h.toLowerCase().includes("choco") || h.toLowerCase().includes("raisin")))) {
            champSource = mockHeaders.find(h => h.toLowerCase().includes("distributeur") && (h.toLowerCase().includes("choco") || h.toLowerCase().includes("raisin"))) || "none";
          }
          else if (champApp.nomTechnique === "p1LongueurDecoupe" && mockHeaders.find(h => h.toLowerCase().includes("p1") && h.toLowerCase().includes("longueur"))) {
            champSource = mockHeaders.find(h => h.toLowerCase().includes("p1") && h.toLowerCase().includes("longueur")) || "none";
          }
          else if (champApp.nomTechnique === "p2Centrage" && mockHeaders.find(h => h.toLowerCase().includes("p2") && h.toLowerCase().includes("centrage"))) {
            champSource = mockHeaders.find(h => h.toLowerCase().includes("p2") && h.toLowerCase().includes("centrage")) || "none";
          }
          else if (champApp.nomTechnique === "regleLaminage" && mockHeaders.find(h => h.toLowerCase().includes("règle") && h.toLowerCase().includes("laminage"))) {
            champSource = mockHeaders.find(h => h.toLowerCase().includes("règle") && h.toLowerCase().includes("laminage")) || "none";
          }
          else if (foundHeader) {
            champSource = foundHeader;
          }
          
          return {
            champSource,
            champDestination: champApp.nomTechnique
          };
        });
        
        setMappings(initialMappings);
        setStep(2);
      }, 1000);
    }
  };

  // Quand user change le mapping d'un champ appli
  const handleMappingChange = (champDestination: string, champSource: string) => {
    setMappings(
      mappings.map((mapping) =>
        mapping.champDestination === champDestination
          ? { ...mapping, champSource }
          : mapping
      )
    );
  };

  const processMappingAndImport = () => {
    // Vérifier qu'au moins les champs obligatoires sont mappés à une entête
    const requiredFields = ["codeArticle", "numeroLigne", "designation"];
    const missingRequired = requiredFields.filter(field =>
      !mappings.find(m => m.champDestination === field && m.champSource !== "none")
    );

    if (missingRequired.length > 0) {
      toast({
        title: "Mapping incomplet",
        description: `Veuillez mapper les champs obligatoires: ${missingRequired.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    // Ici, on pourrait construire/projeter les données importées pour push en base
    // Pour démo, toast OK
    toast({
      title: "Importation réussie",
      description: `${previewData.length} produits ont été importés avec succès.`,
    });

    // Réinitialiser l'état
    setFile(null);
    setHeaders([]);
    setPreviewData([]);
    setMappings([]);
    setStep(1);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-noir-200">
        <h2 className="section-title">Import de données depuis Excel</h2>
        <p className="mb-4 text-noir-600">
          Importez vos données de réglages ligne depuis un fichier Excel (.xlsx, .xls) ou CSV (.csv).
        </p>

        {step === 1 && (
          <div className="border-2 border-dashed border-noir-300 rounded-md p-8 text-center">
            <div className="mb-4">
              <Import className="h-12 w-12 mx-auto text-noir-400" />
            </div>
            <p className="mb-4 text-noir-600">
              Sélectionnez un fichier Excel ou CSV contenant vos données de réglages.
            </p>
            <Input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              className="hidden"
              accept=".xlsx,.xls,.csv"
            />
            <Label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-jaune-300 text-noir-800 rounded-md cursor-pointer hover:bg-jaune-400 transition-colors"
            >
              Sélectionner un fichier
            </Label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-noir-100 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Fichier sélectionné: {file?.name}</h3>
              <p className="text-sm text-noir-600">
                {previewData.length} lignes détectées avec {headers.length} colonnes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Aperçu des données</h3>
              <ScrollArea className="h-72 rounded-md border">
                <div className="w-max min-w-full">
                  <Table>
                    <TableHeader className="bg-noir-100 sticky top-0 z-10">
                      <TableRow>
                        {headers.map((header, index) => (
                          <TableHead key={index} className="whitespace-nowrap">{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {headers.map((header, cellIndex) => (
                            <TableCell key={cellIndex} className="whitespace-nowrap">{row[header]}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Mapping des champs</h3>
              <p className="mb-4 text-sm text-noir-600">
                Associez chaque champ de l'application à une colonne de votre fichier Excel (ou choisissez "ne pas importer").
              </p>
              <ScrollArea className="h-[500px] rounded-md border">
                <div className="w-max min-w-full p-1">
                  <Table>
                    <TableHeader className="bg-noir-100 sticky top-0 z-10">
                      <TableRow>
                        <TableHead className="w-32 whitespace-nowrap">Bloc</TableHead>
                        <TableHead className="w-64 whitespace-nowrap">Champ destination (Application)</TableHead>
                        <TableHead className="w-64 whitespace-nowrap">Colonne source (Excel)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {champsCibles.map((champ, index) => {
                        const mapping = mappings.find(m => m.champDestination === champ.nomTechnique) || {
                          champDestination: champ.nomTechnique,
                          champSource: "none"
                        };
                        return (
                          <TableRow key={champ.id}>
                            <TableCell className="whitespace-nowrap font-medium">{champ.blocNom}</TableCell>
                            <TableCell className="whitespace-nowrap">
                              <div className="font-semibold">{champ.nom}</div>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={mapping.champSource}
                                onValueChange={(value) =>
                                  handleMappingChange(champ.nomTechnique, value)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Sélectionner une colonne" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[400px]">
                                  <SelectItem value="none">Ne pas importer</SelectItem>
                                  {headers.map(header => (
                                    <SelectItem value={header} key={header}>
                                      {header}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null);
                  setHeaders([]);
                  setPreviewData([]);
                  setMappings([]);
                  setStep(1);
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={processMappingAndImport}
                className="bg-jaune-300 text-noir-800 hover:bg-jaune-400"
              >
                Importer les données
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelImport;
