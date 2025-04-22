
import React from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ChampConfiguration } from "@/types";

interface ChampDeleteDialogProps {
  champ: ChampConfiguration;
  onDelete: () => void;
}

export const ChampDeleteDialog: React.FC<ChampDeleteDialogProps> = ({
  champ, onDelete,
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button 
        variant="ghost" 
        size="sm"
        className="text-destructive hover:bg-destructive/10"
      >
        <span className="sr-only">Supprimer le champ</span>
        {/* You may import a trash icon if desired */}
        🗑️
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
          onClick={onDelete}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          Supprimer
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
