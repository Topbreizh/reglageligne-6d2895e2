
// Refactored ChampTable to use smaller child components

import React from "react";
import { Table, TableHeader } from "@/components/ui/table";
import { BlocConfiguration, ChampConfiguration } from "@/types";
import ChampTableHeader from "./ChampTableHeader";
import ChampTableBody from "./ChampTableBody";
import ChampAddButton from "./ChampAddButton";

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
  const champs = [...bloc.champs].sort((a, b) => a.ordre - b.ordre);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-noir-700">Champs du bloc</h3>
        <ChampAddButton blocId={bloc.id} onAdd={handleAddChamp} />
      </div>
      <Table>
        <TableHeader className="bg-noir-100">
          <ChampTableHeader />
        </TableHeader>
        <ChampTableBody
          champs={champs}
          blocId={bloc.id}
          editingChamp={editingChamp}
          setEditingChamp={setEditingChamp}
          handleChampChange={handleChampChange}
          handleLignesApplicablesChange={handleLignesApplicablesChange}
          moveChamp={moveChamp}
          handleDeleteChamp={handleDeleteChamp}
        />
      </Table>
    </div>
  );
};

export default ChampTable;
