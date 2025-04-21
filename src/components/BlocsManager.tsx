
import { useState, useEffect } from "react";
import { BlocConfiguration, ChampConfiguration } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { sauvegarderBlocsConfiguration } from "@/lib/firebaseReglage";

interface BlocsManagerProps {
  initialConfiguration: BlocConfiguration[];
  onConfigurationChange?: (blocs: BlocConfiguration[]) => void;
}

const BlocsManager = ({ 
  initialConfiguration, 
  onConfigurationChange 
}: BlocsManagerProps) => {
  const [blocs, setBlocs] = useState<BlocConfiguration[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialConfiguration && initialConfiguration.length > 0) {
      setBlocs(JSON.parse(JSON.stringify(initialConfiguration)));
    }
  }, [initialConfiguration]);

  const handleBlocChange = (id: string, field: keyof BlocConfiguration, value: any) => {
    const updatedBlocs = blocs.map((bloc) =>
      bloc.id === id ? { ...bloc, [field]: value } : bloc
    );
    setBlocs(updatedBlocs);
    
    if (onConfigurationChange) {
      onConfigurationChange(updatedBlocs);
    }
  };

  const handleChampChange = (
    blocId: string,
    champId: string,
    field: keyof ChampConfiguration,
    value: any
  ) => {
    const updatedBlocs = blocs.map((bloc) => {
      if (bloc.id === blocId) {
        return {
          ...bloc,
          champs: bloc.champs.map((champ) =>
            champ.id === champId ? { ...champ, [field]: value } : champ
          ),
        };
      }
      return bloc;
    });
    
    setBlocs(updatedBlocs);
    
    if (onConfigurationChange) {
      onConfigurationChange(updatedBlocs);
    }
  };

  const handleLignesApplicablesChange = (
    blocId: string,
    champId: string | null,
    value: string
  ) => {
    // Convertir la chaîne d'entrée en tableau
    const lignesArray = value
      .split(",")
      .map((ligne) => ligne.trim())
      .filter((ligne) => ligne);

    if (champId) {
      // Mise à jour des lignes applicables pour un champ
      handleChampChange(blocId, champId, "lignesApplicables", lignesArray);
    } else {
      // Mise à jour des lignes applicables pour un bloc
      handleBlocChange(blocId, "lignesApplicables", lignesArray);
    }
  };

  const moveBloc = (blocId: string, direction: "up" | "down") => {
    const blocIndex = blocs.findIndex((bloc) => bloc.id === blocId);
    if (
      (direction === "up" && blocIndex === 0) ||
      (direction === "down" && blocIndex === blocs.length - 1)
    ) {
      return;
    }

    const newBlocs = [...blocs];
    const targetIndex = direction === "up" ? blocIndex - 1 : blocIndex + 1;
    
    // Swap order values
    const tempOrdre = newBlocs[blocIndex].ordre;
    newBlocs[blocIndex].ordre = newBlocs[targetIndex].ordre;
    newBlocs[targetIndex].ordre = tempOrdre;
    
    // Swap positions in array
    [newBlocs[blocIndex], newBlocs[targetIndex]] = [newBlocs[targetIndex], newBlocs[blocIndex]];
    
    setBlocs(newBlocs);
    
    if (onConfigurationChange) {
      onConfigurationChange(newBlocs);
    }
  };

  const moveChamp = (blocId: string, champId: string, direction: "up" | "down") => {
    const blocIndex = blocs.findIndex((bloc) => bloc.id === blocId);
    const champs = [...blocs[blocIndex].champs];
    const champIndex = champs.findIndex((champ) => champ.id === champId);
    
    if (
      (direction === "up" && champIndex === 0) ||
      (direction === "down" && champIndex === champs.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === "up" ? champIndex - 1 : champIndex + 1;
    
    // Swap order values
    const tempOrdre = champs[champIndex].ordre;
    champs[champIndex].ordre = champs[targetIndex].ordre;
    champs[targetIndex].ordre = tempOrdre;
    
    // Swap positions in array
    [champs[champIndex], champs[targetIndex]] = [champs[targetIndex], champs[champIndex]];
    
    const updatedBlocs = [...blocs];
    updatedBlocs[blocIndex].champs = champs;
    
    setBlocs(updatedBlocs);
    
    if (onConfigurationChange) {
      onConfigurationChange(updatedBlocs);
    }
  };

  const saveConfiguration = async () => {
    try {
      setIsSaving(true);
      console.log("Configuration à sauvegarder:", blocs);
      
      // Sauvegarde dans Firebase
      await sauvegarderBlocsConfiguration(blocs);
      
      toast({
        title: "Configuration sauvegardée",
        description: "Les modifications des blocs et champs ont été enregistrées dans la base de données.",
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la configuration:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration. Veuillez réessayer.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (blocs.length === 0) {
    return <div className="p-8 text-center">Chargement de la configuration...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-noir-200">
        <h2 className="section-title">Configuration des blocs</h2>
        <p className="mb-4 text-noir-600">
          Gérez l'ordre d'affichage des blocs et des champs, ainsi que leur visibilité selon le numéro de ligne.
        </p>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {blocs.sort((a, b) => a.ordre - b.ordre).map((bloc) => (
            <AccordionItem key={bloc.id} value={bloc.id} className="border border-noir-200 rounded-md overflow-hidden">
              <AccordionTrigger className="px-4 py-2 bg-noir-100 hover:bg-noir-200 transition-colors">
                <div className="flex items-center justify-between w-full">
                  <span>{bloc.nom}</span>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={bloc.visible}
                      onCheckedChange={(checked) => handleBlocChange(bloc.id, "visible", checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-sm text-noir-600">{bloc.visible ? "Visible" : "Masqué"}</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`bloc-${bloc.id}-ordre`} className="field-label">
                        Ordre d'affichage
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id={`bloc-${bloc.id}-ordre`}
                          type="number"
                          value={bloc.ordre}
                          onChange={(e) =>
                            handleBlocChange(bloc.id, "ordre", parseInt(e.target.value))
                          }
                          className="border-noir-300 w-24"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveBloc(bloc.id, "up")}
                          disabled={bloc.ordre <= 1}
                        >
                          ▲
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveBloc(bloc.id, "down")}
                          disabled={bloc.ordre >= blocs.length}
                        >
                          ▼
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`bloc-${bloc.id}-lignes`} className="field-label">
                        Lignes applicables
                      </Label>
                      <Input
                        id={`bloc-${bloc.id}-lignes`}
                        value={bloc.lignesApplicables.join(", ")}
                        onChange={(e) =>
                          handleLignesApplicablesChange(bloc.id, null, e.target.value)
                        }
                        placeholder="Exemple: 1, 2, * (pour toutes)"
                        className="border-noir-300"
                      />
                      <p className="text-xs text-noir-600 mt-1">
                        Séparez les numéros par des virgules. Utilisez * pour toutes les lignes.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-2 text-noir-700">Champs du bloc</h3>
                    <Table>
                      <TableHeader className="bg-noir-100">
                        <TableRow>
                          <TableHead className="w-12">Ordre</TableHead>
                          <TableHead>Nom</TableHead>
                          <TableHead>Lignes applicables</TableHead>
                          <TableHead>Visible</TableHead>
                          <TableHead className="w-24">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bloc.champs.sort((a, b) => a.ordre - b.ordre).map((champ) => (
                          <TableRow key={champ.id}>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  value={champ.ordre}
                                  onChange={(e) =>
                                    handleChampChange(
                                      bloc.id,
                                      champ.id,
                                      "ordre",
                                      parseInt(e.target.value)
                                    )
                                  }
                                  className="border-noir-300 w-16"
                                />
                                <div className="flex flex-col">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 px-1"
                                    onClick={() => moveChamp(bloc.id, champ.id, "up")}
                                    disabled={champ.ordre <= 1}
                                  >
                                    ▲
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 px-1"
                                    onClick={() => moveChamp(bloc.id, champ.id, "down")}
                                    disabled={champ.ordre >= bloc.champs.length}
                                  >
                                    ▼
                                  </Button>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{champ.nom}</TableCell>
                            <TableCell>
                              <Input
                                value={champ.lignesApplicables.join(", ")}
                                onChange={(e) =>
                                  handleLignesApplicablesChange(
                                    bloc.id,
                                    champ.id,
                                    e.target.value
                                  )
                                }
                                placeholder="Exemple: 1, 2, * (pour toutes)"
                                className="border-noir-300"
                              />
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={champ.visible}
                                onCheckedChange={(checked) =>
                                  handleChampChange(
                                    bloc.id,
                                    champ.id,
                                    "visible",
                                    checked
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                {/* Pas d'actions supplémentaires pour les champs */}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="flex justify-end mt-6">
          <Button
            onClick={saveConfiguration}
            disabled={isSaving}
            className="bg-jaune-300 text-noir-800 hover:bg-jaune-400"
          >
            {isSaving ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Enregistrement...
              </>
            ) : (
              "Enregistrer la configuration"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlocsManager;
