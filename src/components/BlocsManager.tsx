
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
import { Pencil, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

function uniqueId(prefix: string) {
  return `${prefix}_${Math.floor(Date.now() * Math.random())}`;
}

interface BlocsManagerProps {
  initialConfiguration: BlocConfiguration[];
  onConfigurationChange?: (blocs: BlocConfiguration[]) => void;
}

// Validation schemas
const blocSchema = z.object({
  nom: z.string().min(1, "Le nom du bloc est requis"),
  nomTechnique: z.string().min(1, "Le nom technique est requis")
    .regex(/^[a-zA-Z0-9_]+$/, "Le nom technique ne doit contenir que des lettres, chiffres et underscore"),
  lignesApplicables: z.string()
    .min(1, "Les lignes applicables sont requises"),
});

const champSchema = z.object({
  nom: z.string().min(1, "Le nom du champ est requis"),
  nomTechnique: z.string().min(1, "Le nom technique est requis")
    .regex(/^[a-zA-Z0-9_]+$/, "Le nom technique ne doit contenir que des lettres, chiffres et underscore"),
  lignesApplicables: z.string()
    .min(1, "Les lignes applicables sont requises"),
});

const BlocsManager = ({ 
  initialConfiguration, 
  onConfigurationChange 
}: BlocsManagerProps) => {
  const [blocs, setBlocs] = useState<BlocConfiguration[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [editingBloc, setEditingBloc] = useState<BlocConfiguration | null>(null);
  const [editingChamp, setEditingChamp] = useState<{champ: ChampConfiguration, blocId: string} | null>(null);
  const { toast } = useToast();

  // Form pour l'édition d'un bloc
  const blocForm = useForm<z.infer<typeof blocSchema>>({
    resolver: zodResolver(blocSchema),
    defaultValues: {
      nom: "",
      nomTechnique: "",
      lignesApplicables: "",
    },
  });

  // Form pour l'édition d'un champ
  const champForm = useForm<z.infer<typeof champSchema>>({
    resolver: zodResolver(champSchema),
    defaultValues: {
      nom: "",
      nomTechnique: "",
      lignesApplicables: "",
    },
  });

  useEffect(() => {
    if (initialConfiguration && initialConfiguration.length > 0) {
      setBlocs(JSON.parse(JSON.stringify(initialConfiguration)));
    }
  }, [initialConfiguration]);

  // Pré-remplir le formulaire d'édition de bloc
  useEffect(() => {
    if (editingBloc) {
      blocForm.reset({
        nom: editingBloc.nom,
        nomTechnique: editingBloc.id,
        lignesApplicables: editingBloc.lignesApplicables.join(", "),
      });
    }
  }, [editingBloc, blocForm]);

  // Pré-remplir le formulaire d'édition de champ
  useEffect(() => {
    if (editingChamp) {
      champForm.reset({
        nom: editingChamp.champ.nom,
        nomTechnique: editingChamp.champ.nomTechnique,
        lignesApplicables: editingChamp.champ.lignesApplicables.join(", "),
      });
    }
  }, [editingChamp, champForm]);

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
    const lignesArray = value
      .split(",")
      .map((ligne) => ligne.trim())
      .filter((ligne) => ligne);

    if (champId) {
      handleChampChange(blocId, champId, "lignesApplicables", lignesArray);
    } else {
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
    
    const tempOrdre = newBlocs[blocIndex].ordre;
    newBlocs[blocIndex].ordre = newBlocs[targetIndex].ordre;
    newBlocs[targetIndex].ordre = tempOrdre;
    
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
    
    const tempOrdre = champs[champIndex].ordre;
    champs[champIndex].ordre = champs[targetIndex].ordre;
    champs[targetIndex].ordre = tempOrdre;
    
    [champs[champIndex], champs[targetIndex]] = [champs[targetIndex], champs[champIndex]];
    
    const updatedBlocs = [...blocs];
    updatedBlocs[blocIndex].champs = champs;
    
    setBlocs(updatedBlocs);
    
    if (onConfigurationChange) {
      onConfigurationChange(updatedBlocs);
    }
  };

  const handleAddBloc = () => {
    const newOrder = blocs.length > 0 ? Math.max(...blocs.map(b => b.ordre)) + 1 : 1;
    const newBloc: BlocConfiguration = {
      id: uniqueId("bloc"),
      nom: "Nouveau bloc",
      ordre: newOrder,
      lignesApplicables: ["*"],
      visible: true,
      champs: []
    };
    const newBlocs = [...blocs, newBloc];
    setBlocs(newBlocs);
    if (onConfigurationChange) onConfigurationChange(newBlocs);

    // Ouvrir immédiatement le modal d'édition pour ce nouveau bloc
    setEditingBloc(newBloc);

    toast({
      title: "Bloc ajouté",
      description: "Un bloc vierge a été ajouté. Complétez ses informations.",
      duration: 3000
    });
  };

  const handleAddChamp = (blocId: string) => {
    const newChampsOrder = (blocs.find(b => b.id === blocId)?.champs.length || 0) + 1;
    const newChamp: ChampConfiguration = {
      id: uniqueId("champ"),
      nom: "Nouveau champ",
      nomTechnique: "nouveauChamp",
      ordre: newChampsOrder,
      visible: true,
      lignesApplicables: ["*"]
    };
    const updatedBlocs = blocs.map(bloc => 
      bloc.id === blocId
        ? { ...bloc, champs: [...bloc.champs, newChamp] }
        : bloc
    );
    setBlocs(updatedBlocs);
    if (onConfigurationChange) onConfigurationChange(updatedBlocs);

    // Ouvrir immédiatement le modal d'édition pour ce nouveau champ
    setEditingChamp({champ: newChamp, blocId});

    toast({
      title: "Champ ajouté",
      description: "Un nouveau champ a été ajouté au bloc.",
      duration: 3000
    });
  };

  const handleDeleteBloc = (blocId: string) => {
    const updatedBlocs = blocs.filter(bloc => bloc.id !== blocId);
    // Réorganiser les ordres
    updatedBlocs.forEach((bloc, index) => {
      bloc.ordre = index + 1;
    });
    
    setBlocs(updatedBlocs);
    if (onConfigurationChange) onConfigurationChange(updatedBlocs);

    toast({
      title: "Bloc supprimé",
      description: "Le bloc a été supprimé avec succès.",
      duration: 3000
    });
  };

  const handleDeleteChamp = (blocId: string, champId: string) => {
    const updatedBlocs = blocs.map(bloc => {
      if (bloc.id === blocId) {
        const filteredChamps = bloc.champs.filter(champ => champ.id !== champId);
        // Réorganiser les ordres
        filteredChamps.forEach((champ, index) => {
          champ.ordre = index + 1;
        });
        return { ...bloc, champs: filteredChamps };
      }
      return bloc;
    });
    
    setBlocs(updatedBlocs);
    if (onConfigurationChange) onConfigurationChange(updatedBlocs);

    toast({
      title: "Champ supprimé",
      description: "Le champ a été supprimé avec succès.",
      duration: 3000
    });
  };

  const saveConfiguration = async () => {
    try {
      setIsSaving(true);
      console.log("Configuration à sauvegarder:", blocs);
      
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

  const onSubmitBlocEdit = (values: z.infer<typeof blocSchema>) => {
    if (!editingBloc) return;

    // Préparer les lignes applicables
    const lignesApplicables = values.lignesApplicables
      .split(",")
      .map(line => line.trim())
      .filter(line => line);

    // Mettre à jour le bloc
    const updatedBlocs = blocs.map(bloc => {
      if (bloc.id === editingBloc.id) {
        return {
          ...bloc,
          nom: values.nom,
          id: values.nomTechnique, // Mise à jour de l'ID avec le nom technique
          lignesApplicables
        };
      }
      return bloc;
    });

    setBlocs(updatedBlocs);
    if (onConfigurationChange) onConfigurationChange(updatedBlocs);
    setEditingBloc(null);

    toast({
      title: "Bloc modifié",
      description: "Les modifications du bloc ont été appliquées.",
      duration: 3000
    });
  };

  const onSubmitChampEdit = (values: z.infer<typeof champSchema>) => {
    if (!editingChamp) return;

    // Préparer les lignes applicables
    const lignesApplicables = values.lignesApplicables
      .split(",")
      .map(line => line.trim())
      .filter(line => line);

    // Mettre à jour le champ
    const updatedBlocs = blocs.map(bloc => {
      if (bloc.id === editingChamp.blocId) {
        return {
          ...bloc,
          champs: bloc.champs.map(champ => {
            if (champ.id === editingChamp.champ.id) {
              return {
                ...champ,
                nom: values.nom,
                nomTechnique: values.nomTechnique,
                lignesApplicables
              };
            }
            return champ;
          })
        };
      }
      return bloc;
    });

    setBlocs(updatedBlocs);
    if (onConfigurationChange) onConfigurationChange(updatedBlocs);
    setEditingChamp(null);

    toast({
      title: "Champ modifié",
      description: "Les modifications du champ ont été appliquées.",
      duration: 3000
    });
  };

  if (blocs.length === 0) {
    return <div className="p-8 text-center">Chargement de la configuration...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title">Configuration des blocs</h2>
        <Button
          variant="outline"
          className="text-noir-800 border-jaune-300"
          onClick={handleAddBloc}
        >
          + Ajouter un bloc
        </Button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-noir-200">
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

                  <div className="flex justify-end gap-2 mt-2">
                    {/* Boutons d'édition et de suppression de bloc */}
                    <Dialog open={editingBloc?.id === bloc.id} onOpenChange={(open) => !open && setEditingBloc(null)}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingBloc(bloc)}
                        >
                          <Pencil className="h-4 w-4 mr-1" /> Modifier
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modifier le bloc</DialogTitle>
                          <DialogDescription>
                            Modifiez les propriétés du bloc ci-dessous.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Form {...blocForm}>
                          <form onSubmit={blocForm.handleSubmit(onSubmitBlocEdit)} className="space-y-4">
                            <FormField
                              control={blocForm.control}
                              name="nom"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nom du bloc</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Ex: Article, Laminage..." />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={blocForm.control}
                              name="nomTechnique"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Identifiant technique</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Ex: article, laminage..." />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={blocForm.control}
                              name="lignesApplicables"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Lignes applicables</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Ex: 1, 2, * (pour toutes)" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button" variant="outline">Annuler</Button>
                              </DialogClose>
                              <Button type="submit">Enregistrer</Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-destructive text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer le bloc</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer le bloc "{bloc.nom}" ?
                            Cette action supprimera également tous les champs associés et ne peut pas être annulée.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteBloc(bloc.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-noir-700">Champs du bloc</h3>
                      <Button
                        onClick={() => handleAddChamp(bloc.id)}
                        size="sm"
                        variant="outline"
                        className="border-jaune-300"
                      >
                        + Ajouter un champ
                      </Button>
                    </div>
                    <Table>
                      <TableHeader className="bg-noir-100">
                        <TableRow>
                          <TableHead className="w-12">Ordre</TableHead>
                          <TableHead>Nom</TableHead>
                          <TableHead>Nom technique</TableHead>
                          <TableHead>Lignes applicables</TableHead>
                          <TableHead>Visible</TableHead>
                          <TableHead className="w-32">Actions</TableHead>
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
                            <TableCell>{champ.nomTechnique}</TableCell>
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
                              <div className="flex justify-center gap-2">
                                {/* Dialog d'édition de champ */}
                                <Dialog 
                                  open={editingChamp?.champ.id === champ.id && editingChamp.blocId === bloc.id} 
                                  onOpenChange={(open) => !open && setEditingChamp(null)}
                                >
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => setEditingChamp({champ, blocId: bloc.id})}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Modifier le champ</DialogTitle>
                                      <DialogDescription>
                                        Modifiez les propriétés du champ ci-dessous.
                                      </DialogDescription>
                                    </DialogHeader>
                                    
                                    <Form {...champForm}>
                                      <form onSubmit={champForm.handleSubmit(onSubmitChampEdit)} className="space-y-4">
                                        <FormField
                                          control={champForm.control}
                                          name="nom"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Nom du champ</FormLabel>
                                              <FormControl>
                                                <Input {...field} placeholder="Ex: Code article, Programme..." />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        
                                        <FormField
                                          control={champForm.control}
                                          name="nomTechnique"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Nom technique</FormLabel>
                                              <FormControl>
                                                <Input {...field} placeholder="Ex: codeArticle, programme..." />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        
                                        <FormField
                                          control={champForm.control}
                                          name="lignesApplicables"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Lignes applicables</FormLabel>
                                              <FormControl>
                                                <Input {...field} placeholder="Ex: 1, 2, * (pour toutes)" />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        
                                        <DialogFooter>
                                          <DialogClose asChild>
                                            <Button type="button" variant="outline">Annuler</Button>
                                          </DialogClose>
                                          <Button type="submit">Enregistrer</Button>
                                        </DialogFooter>
                                      </form>
                                    </Form>
                                  </DialogContent>
                                </Dialog>
                                
                                {/* AlertDialog de suppression de champ */}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Supprimer le champ</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Êtes-vous sûr de vouloir supprimer le champ "{champ.nom}" ?
                                        Cette action ne peut pas être annulée.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteChamp(bloc.id, champ.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Supprimer
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
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
