
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface BlocDeleteDialogProps {
  blocNom: string;
  onDelete: () => void;
}
const BlocDeleteDialog: React.FC<BlocDeleteDialogProps> = ({ blocNom, onDelete }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button 
        variant="outline" 
        size="sm"
        className="border-destructive text-destructive hover:bg-destructive/10"
      >
        <span className="mr-1">🗑️</span> Supprimer
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Supprimer le bloc</AlertDialogTitle>
        <AlertDialogDescription>
          Êtes-vous sûr de vouloir supprimer le bloc "{blocNom}" ?
          Cette action supprimera également tous les champs associés et ne peut pas être annulée.
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
export default BlocDeleteDialog;
