
import React from "react";
import {
  Accordion
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BlocConfiguration, ChampConfiguration } from "@/types";
import BlocAccordionItem from "./BlocAccordionItem";

interface BlocsManagerUIProps {
  blocs: BlocConfiguration[];
  isSaving: boolean;
  editingBloc: BlocConfiguration | null;
  editingChamp: { champ: ChampConfiguration, blocId: string } | null;
  setEditingBloc: (bloc: BlocConfiguration | null) => void;
  setEditingChamp: (val: { champ: ChampConfiguration, blocId: string } | null) => void;
  handleBlocChange: (id: string, field: keyof BlocConfiguration, value: any) => void;
  handleChampChange: (blocId: string, champId: string, field: keyof ChampConfiguration, value: any) => void;
  handleLignesApplicablesChange: (blocId: string, champId: string | null, value: string) => void;
  moveBloc: (blocId: string, direction: "up" | "down") => void;
  moveChamp: (blocId: string, champId: string, direction: "up" | "down") => void;
  handleAddBloc: () => void;
  handleAddChamp: (blocId: string) => void;
  handleDeleteBloc: (blocId: string) => void;
  handleDeleteChamp: (blocId: string, champId: string) => void;
  saveConfiguration: () => Promise<void>;
}

const BlocsManagerUI = ({
  blocs,
  isSaving,
  editingBloc,
  editingChamp,
  setEditingBloc,
  setEditingChamp,
  handleBlocChange,
  handleChampChange,
  handleLignesApplicablesChange,
  moveBloc,
  moveChamp,
  handleAddBloc,
  handleAddChamp,
  handleDeleteBloc,
  handleDeleteChamp,
  saveConfiguration
}: BlocsManagerUIProps) => {
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
            <BlocAccordionItem
              key={bloc.id}
              bloc={bloc}
              allBlocsCount={blocs.length}
              editingBloc={editingBloc}
              editingChamp={editingChamp}
              setEditingBloc={setEditingBloc}
              setEditingChamp={setEditingChamp}
              handleBlocChange={handleBlocChange}
              handleChampChange={handleChampChange}
              handleLignesApplicablesChange={handleLignesApplicablesChange}
              moveBloc={moveBloc}
              moveChamp={moveChamp}
              handleAddChamp={handleAddChamp}
              handleDeleteBloc={handleDeleteBloc}
              handleDeleteChamp={handleDeleteChamp}
            />
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

export default BlocsManagerUI;
