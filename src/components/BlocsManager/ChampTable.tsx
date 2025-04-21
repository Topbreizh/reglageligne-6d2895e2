
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlocConfiguration, ChampConfiguration } from "@/types";

const champSchema = z.object({
  nom: z.string().min(1, "Le nom du champ est requis"),
  nomTechnique: z.string().min(1, "Le nom technique est requis")
    .regex(/^[a-zA-Z0-9_]+$/, "Le nom technique ne doit contenir que des lettres, chiffres et underscore"),
  lignesApplicables: z.string()
    .min(1, "Les lignes applicables sont requises"),
});

interface ChampTableProps {
  bloc: BlocConfiguration;
  editingChamp: { champ: ChampConfiguration, blocId: string } | null;
  setEditingChamp: (val: { champ: ChampConfiguration, blocId: string } | null) => void;
  handleChampChange: (blocId: string, champId: string, field: keyof ChampConfiguration, value: any) => void;
  handleLignesApplicablesChange: (blocId: string, champId: string | null, value: string) => void;
  moveChamp: (blocId: string, champId: string, direction: "up" | "down") => void;
  handleAddChamp: (blocId: string) => void;
  handleDeleteChamp: (blocId: string, champId: string) => void;
}

const ChampTable: React.FC<ChampTableProps> = ({
  bloc, editingChamp, setEditingChamp, handleChampChange, handleLignesApplicablesChange,
  moveChamp, handleAddChamp, handleDeleteChamp
}) => {
  // Form for champ edit dialog
  const champForm = useForm<z.infer<typeof champSchema>>({
    resolver: zodResolver(champSchema),
    defaultValues: {
      nom: "",
      nomTechnique: "",
      lignesApplicables: "",
    }
  });

  React.useEffect(() => {
    if (editingChamp && editingChamp.blocId === bloc.id) {
      champForm.reset({
        nom: editingChamp.champ.nom,
        nomTechnique: editingChamp.champ.nomTechnique,
        lignesApplicables: editingChamp.champ.lignesApplicables.join(", "),
      });
    }
  }, [editingChamp, bloc.id, champForm]);

  const onSubmitChampEdit = (values: z.infer<typeof champSchema>) => {
    if (!editingChamp) return;
    const lignesApplicables = values.lignesApplicables
      .split(",")
      .map(line => line.trim())
      .filter(line => line);
    handleChampChange(bloc.id, editingChamp.champ.id, "nom", values.nom);
    handleChampChange(bloc.id, editingChamp.champ.id, "nomTechnique", values.nomTechnique);
    handleChampChange(bloc.id, editingChamp.champ.id, "lignesApplicables", lignesApplicables);
    setEditingChamp(null);
  };

  return (
    <div>
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
  );
};

export default ChampTable;
