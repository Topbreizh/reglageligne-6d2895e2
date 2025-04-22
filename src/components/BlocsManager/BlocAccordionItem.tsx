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
import BlocEditDialog from "./BlocEditDialog";
import BlocOrderControls from "./BlocOrderControls";
import BlocDeleteDialog from "./BlocDeleteDialog";
import BlocLignesApplicablesInput from "./BlocLignesApplicablesInput";

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
              <BlocOrderControls
                blocId={bloc.id}
                ordre={bloc.ordre}
                allBlocsCount={allBlocsCount}
                handleBlocChange={handleBlocChange}
                moveBloc={moveBloc}
              />
            </div>
            <div>
              <BlocLignesApplicablesInput
                blocId={bloc.id}
                lignesApplicables={bloc.lignesApplicables}
                handleLignesApplicablesChange={handleLignesApplicablesChange}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <BlocEditDialog
              bloc={bloc}
              editingBloc={editingBloc}
              setEditingBloc={setEditingBloc}
              handleBlocChange={handleBlocChange}
            />
            <BlocDeleteDialog
              blocNom={bloc.nom}
              onDelete={() => handleDeleteBloc(bloc.id)}
            />
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
