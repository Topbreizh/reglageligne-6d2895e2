
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
      
      // Simuler l'extraction des en-têtes et des données
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
          "Farineur Haut",
          "Farineur Bas",
          "Queue de Carpe",
          "Numéro Découpe",
          "Buse",
          "Humidificateur",
          "Distributeur",
          "Commentaire"
        ];
        
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
            "Farineur Haut": "3.2",
            "Farineur Bas": "2.1",
            "Queue de Carpe": "Oui",
            "Numéro Découpe": "7",
            "Buse": "B3",
            "Humidificateur": "H2",
            "Distributeur": "D1",
            "Commentaire": "RAS"
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
            "Farineur Haut": "3.0",
            "Farineur Bas": "2.0",
            "Queue de Carpe": "Non",
            "Numéro Découpe": "5",
            "Buse": "B2",
            "Humidificateur": "H1",
            "Distributeur": "D2",
            "Commentaire": "Ajuster température"
          }
        ];

        setHeaders(mockHeaders);
        setPreviewData(mockData);

        // Initialiser le mapping pour chaque champ de l'appli 
        const initialMappings = champsCibles.map(champApp => {
          // Chercher une entête qui "matche" ce champ
          const foundHeader = mockHeaders.find(header => {
            // Normalisation simple
            const hNorm = header.toLowerCase().replace(/\s+/g, "");
            const champNomNorm = champApp.nom.toLowerCase().replace(/\s+/g, "");
            const champTechNorm = champApp.nomTechnique.toLowerCase();
            return hNorm === champNomNorm || hNorm === champTechNorm;
          });
          
          let champSource = "none";
          
          // Matching spécial, autoriser les correspondances spécifiques
          if (champApp.nomTechnique === "codeArticle" && mockHeaders.find(h=> h.toLowerCase().includes("code"))) {
            champSource = mockHeaders.find(h=> h.toLowerCase().includes("code")) || "none";
          }
          else if (champApp.nomTechnique === "numeroLigne" && mockHeaders.find(h=> h.toLowerCase().includes("numéro"))) {
            champSource = mockHeaders.find(h=> h.toLowerCase().includes("numéro")) || "none";
          }
          else if (champApp.nomTechnique === "designation" && mockHeaders.find(h=> h.toLowerCase().includes("désignation"))) {
            champSource = mockHeaders.find(h=> h.toLowerCase().includes("désignation")) || "none";
          }
          else if (champApp.nomTechnique === "calibreur1" && mockHeaders.find(h=> h.toLowerCase().includes("calibrage"))) {
            champSource = mockHeaders.find(h=> h.toLowerCase().includes("calibrage")) || "none";
          }
          else if (champApp.nomTechnique === "vitesseLaminage" && mockHeaders.find(h=> h.toLowerCase().includes("vitesse"))) {
            champSource = mockHeaders.find(h=> h.toLowerCase().includes("vitesse")) || "none";
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-noir-100">
                    <TableRow>
                      {headers.map((header, index) => (
                        <TableHead key={index}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.slice(0, 3).map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {headers.map((header, cellIndex) => (
                          <TableCell key={cellIndex}>{row[header]}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Mapping des champs</h3>
              <p className="mb-4 text-sm text-noir-600">
                Associez chaque champ de l'application à une colonne de votre fichier Excel (ou choisissez "ne pas importer").
              </p>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-noir-100">
                    <TableRow>
                      <TableHead>Bloc</TableHead>
                      <TableHead>Champ destination (Application)</TableHead>
                      <TableHead>Colonne source (Excel)</TableHead>
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
                          <TableCell>{champ.blocNom}</TableCell>
                          <TableCell>
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
                              <SelectContent>
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
