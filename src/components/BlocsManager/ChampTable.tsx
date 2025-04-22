
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BlocConfiguration, ChampConfiguration } from "@/types";
import { ChampTableRow } from "./ChampTableRow";

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
  moveChamp, handleAddChamp, handleDeleteChamp,
}) => {
  // Gather sorted champs (by ordre)
  const champs = [...bloc.champs].sort((a, b) => a.ordre - b.ordre);

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
          {champs.map((champ, i) => (
            <ChampTableRow
              key={champ.id}
              champ={champ}
              champIndex={i}
              champsCount={champs.length}
              blocId={bloc.id}
              isEditing={editingChamp?.champ.id === champ.id && editingChamp.blocId === bloc.id}
              onEdit={() => setEditingChamp({ champ, blocId: bloc.id })}
              onCloseEdit={() => setEditingChamp(null)}
              onEditSave={(values) => {
                // Parse lignesApplicables
                const lignes = values.lignesApplicables.split(",").map((v) => v.trim()).filter(Boolean);
                handleChampChange(bloc.id, champ.id, "nom", values.nom);
                handleChampChange(bloc.id, champ.id, "nomTechnique", values.nomTechnique);
                handleChampChange(bloc.id, champ.id, "lignesApplicables", lignes);
              }}
              onDelete={() => handleDeleteChamp(bloc.id, champ.id)}
              onChange={(field, value) => handleChampChange(bloc.id, champ.id, field, value)}
              onLignesApplicablesChange={(val) => handleLignesApplicablesChange(bloc.id, champ.id, val)}
              onMove={(direction) => moveChamp(bloc.id, champ.id, direction)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ChampTable;
