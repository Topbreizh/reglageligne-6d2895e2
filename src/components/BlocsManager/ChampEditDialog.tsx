
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ChampConfiguration } from "@/types";

const champSchema = z.object({
  nom: z.string().min(1, "Le nom du champ est requis"),
  nomTechnique: z.string().min(1, "Le nom technique est requis")
    .regex(/^[a-zA-Z0-9_]+$/, "Le nom technique ne doit contenir que des lettres, chiffres et underscore"),
  lignesApplicables: z.string().min(1, "Les lignes applicables sont requises"),
});

type ChampFormValues = z.infer<typeof champSchema>;

interface ChampEditDialogProps {
  open: boolean;
  champ: ChampConfiguration;
  blocId: string;
  onClose: () => void;
  onSave: (values: ChampFormValues) => void;
}

export const ChampEditDialog: React.FC<ChampEditDialogProps> = ({
  open, champ, blocId, onClose, onSave,
}) => {
  const champForm = useForm<ChampFormValues>({
    resolver: zodResolver(champSchema),
    defaultValues: {
      nom: champ.nom,
      nomTechnique: champ.nomTechnique,
      lignesApplicables: champ.lignesApplicables.join(", "),
    }
  });

  // This useEffect ensures the form is reset with the current champ values when the dialog opens
  React.useEffect(() => {
    if (open) {
      console.log("Resetting form with champ values:", champ);
      champForm.reset({
        nom: champ.nom,
        nomTechnique: champ.nomTechnique,
        lignesApplicables: champ.lignesApplicables.join(", "),
      });
    }
  }, [champ, champForm, open]);

  const onSubmit = (values: ChampFormValues) => {
    console.log("Submitting form with values:", values);
    onSave(values);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le champ</DialogTitle>
          <DialogDescription>
            Modifiez les propriétés du champ ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <Form {...champForm}>
          <form onSubmit={champForm.handleSubmit(onSubmit)} className="space-y-4">
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
  );
};
