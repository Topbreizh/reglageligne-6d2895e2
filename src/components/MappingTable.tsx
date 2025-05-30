
import { ImportMapping, BlocConfiguration } from "@/types";
import { blocsConfiguration } from "@/data/blocConfig";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getBlocsConfiguration } from "@/lib/firebaseReglage";
import { useEffect, useState } from "react";

interface MappingTableProps {
  headers: string[];
  mappings: ImportMapping[];
  onChange: (champDestination: string, champSource: string) => void;
}

const MappingTable = ({ headers, mappings, onChange }: MappingTableProps) => {
  const [configurationBlocs, setConfigurationBlocs] = useState<BlocConfiguration[]>(blocsConfiguration);

  useEffect(() => {
    const fetchConfiguration = async () => {
      try {
        const savedConfig = await getBlocsConfiguration();
        if (savedConfig) {
          console.log("Configuration des blocs chargée pour le mapping:", savedConfig);
          setConfigurationBlocs(savedConfig);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la configuration des blocs:", error);
      }
    };

    fetchConfiguration();
  }, []);

  // Ne garder que les champs des blocs visibles
  const champsCibles = configurationBlocs
    .filter(bloc => bloc.visible)
    .flatMap((bloc) =>
      bloc.champs
        .filter(champ => champ.visible)
        .map((champ) => ({
          id: champ.id,
          nom: champ.nom,
          blocNom: bloc.nom,
          nomTechnique: champ.nomTechnique,
        }))
    );

  // Pour le débogage
  console.log("Mappings actuels:", mappings);
  console.log("Champs cibles disponibles:", champsCibles);

  // Cette fonction permet de récupérer la valeur correcte pour chaque champ
  const getFieldValue = (fieldId: string) => {
    const mapping = mappings.find(m => m.champDestination === fieldId);
    return mapping ? mapping.champSource : "none";
  };

  return (
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
              {champsCibles.map((champ) => {
                // Récupérer la valeur active pour ce champ spécifique
                const currentValue = getFieldValue(champ.nomTechnique);
                
                return (
                  <TableRow key={`row-${champ.id}-${champ.nomTechnique}`}>
                    <TableCell className="whitespace-nowrap font-medium">{champ.blocNom}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="font-semibold">{champ.nom}</div>
                    </TableCell>
                    <TableCell>
                      <div className="w-full relative" id={`select-container-${champ.nomTechnique}`}>
                        <Select
                          key={`select-${champ.nomTechnique}`}
                          value={currentValue}
                          onValueChange={(value) => {
                            console.log(`Mapping pour ${champ.nomTechnique} vers ${value}`);
                            onChange(champ.nomTechnique, value);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner une colonne" />
                          </SelectTrigger>
                          <SelectContent 
                            className="max-h-[400px] overflow-y-auto bg-white z-[100]"
                            position="popper"
                          >
                            <SelectItem value="none">Ne pas importer</SelectItem>
                            {headers.map((header, index) => (
                              header ? (
                                <SelectItem 
                                  key={`item-${champ.nomTechnique}-${header}-${index}`}
                                  value={header}
                                >
                                  {header}
                                </SelectItem>
                              ) : null
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};

export default MappingTable;
