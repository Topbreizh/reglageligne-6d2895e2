
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlocConfiguration } from "@/types";

const blocSchema = z.object({
  nom: z.string().min(1, "Le nom du bloc est requis"),
  nomTechnique: z.string().min(1, "Le nom technique est requis")
    .regex(/^[a-zA-Z0-9_]+$/, "Le nom technique ne doit contenir que des lettres, chiffres et underscore"),
  lignesApplicables: z.string()
    .min(1, "Les lignes applicables sont requises"),
});

interface BlocEditDialogProps {
  bloc: BlocConfiguration;
  editingBloc: BlocConfiguration | null;
  setEditingBloc: (bloc: BlocConfiguration | null) => void;
  handleBlocChange: (id: string, field: keyof BlocConfiguration, value: any) => void;
}

const BlocEditDialog: React.FC<BlocEditDialogProps> = ({
  bloc,
  editingBloc,
  setEditingBloc,
  handleBlocChange,
}) => {
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
        nomTechnique: editingBloc.nomTechnique || editingBloc.id,
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
    handleBlocChange(editingBloc.id, "lignesApplicables", lignesApplicables);
    handleBlocChange(editingBloc.id, "nomTechnique", values.nomTechnique);
    setEditingBloc(null);
  };

  return (
    <Dialog open={editingBloc?.id === bloc.id} onOpenChange={(open) => !open && setEditingBloc(null)}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setEditingBloc(bloc)}
        >
          <span className="mr-1">✎</span> Modifier
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
  );
};

export default BlocEditDialog;
