
import React from "react";
import {
  AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ChampTable from "./ChampTable";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlocConfiguration, ChampConfiguration } from "@/types";

const blocSchema = z.object({
  nom: z.string().min(1, "Le nom du bloc est requis"),
  nomTechnique: z.string().min(1, "Le nom technique est requis")
    .regex(/^[a-zA-Z0-9_]+$/, "Le nom technique ne doit contenir que des lettres, chiffres et underscore"),
  lignesApplicables: z.string()
    .min(1, "Les lignes applicables sont requises"),
});

interface BlocAccordionItemProps {
  bloc: BlocConfiguration;
  allBlocsCount: number;
  editingBloc: BlocConfiguration | null;
  editingChamp: { champ: ChampConfiguration, blocId: string } | null;
  setEditingBloc: (bloc: BlocConfiguration | null) => void;
  setEditingChamp: (val: { champ: ChampConfiguration, blocId: string } | null) => void;
  handleBlocChange: (id: string, field: keyof BlocConfiguration, value: any) => void;
  handleChampChange: (blocId: string, champId: string, field: keyof ChampConfiguration, value: any) => void;
  handleLignesApplicablesChange: (blocId: string, champId: string | null, value: string) => void;
  moveBloc: (blocId: string, direction: "up" | "down") => void;
  moveChamp: (blocId: string, champId: string, direction: "up" | "down") => void;
  handleAddChamp: (blocId: string) => void;
  handleDeleteBloc: (blocId: string) => void;
  handleDeleteChamp: (blocId: string, champId: string) => void;
}

const BlocAccordionItem: React.FC<BlocAccordionItemProps> = ({
  bloc, allBlocsCount, editingBloc, editingChamp, setEditingBloc, setEditingChamp,
  handleBlocChange, handleChampChange, handleLignesApplicablesChange,
  moveBloc, moveChamp,
  handleAddChamp, handleDeleteBloc, handleDeleteChamp
}) => {
  // Form for bloc edit dialog
  const blocForm = useForm<z.infer<typeof blocSchema>>({
    resolver: zodResolver(blocSchema),
    defaultValues: {
      nom: "",
      nomTechnique: "",
      lignesApplicables: "",
    }
  });

  React.useEffect(() => {
    if (editingBloc && editingBloc.id === bloc.id) {
      blocForm.reset({
        nom: editingBloc.nom,
        nomTechnique: editingBloc.id,
        lignesApplicables: editingBloc.lignesApplicables.join(", "),
      });
    }
  }, [editingBloc, bloc, blocForm]);

  const onSubmitBlocEdit = (values: z.infer<typeof blocSchema>) => {
    if (!editingBloc) return;
    const lignesApplicables = values.lignesApplicables
      .split(",")
      .map(line => line.trim())
      .filter(line => line);
    handleBlocChange(editingBloc.id, "nom", values.nom);
    handleBlocChange(editingBloc.id, "id", values.nomTechnique);
    handleBlocChange(editingBloc.id, "lignesApplicables", lignesApplicables);
    setEditingBloc(null);
  };

  return (
    <AccordionItem value={bloc.id} className="border border-noir-200 rounded-md overflow-hidden">
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
                  disabled={bloc.ordre >= allBlocsCount}
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
            <ChampTable 
              bloc={bloc}
              editingChamp={editingChamp}
              setEditingChamp={setEditingChamp}
              handleChampChange={handleChampChange}
              handleLignesApplicablesChange={handleLignesApplicablesChange}
              moveChamp={moveChamp}
              handleAddChamp={handleAddChamp}
              handleDeleteChamp={handleDeleteChamp}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default BlocAccordionItem;
