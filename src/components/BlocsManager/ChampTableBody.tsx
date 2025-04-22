
import React from "react";
import { TableBody } from "@/components/ui/table";
import { ChampConfiguration } from "@/types";
import { ChampTableRow } from "./ChampTableRow";

interface ChampTableBodyProps {
  champs: ChampConfiguration[];
  blocId: string;
  editingChamp: { champ: ChampConfiguration; blocId: string } | null;
  setEditingChamp: (val: { champ: ChampConfiguration; blocId: string } | null) => void;
  handleChampChange: (blocId: string, champId: string, field: keyof ChampConfiguration, value: any) => void;
  handleLignesApplicablesChange: (blocId: string, champId: string | null, value: string) => void;
  moveChamp: (blocId: string, champId: string, direction: "up" | "down") => void;
  handleDeleteChamp: (blocId: string, champId: string) => void;
}

const ChampTableBody: React.FC<ChampTableBodyProps> = ({
  champs,
  blocId,
  editingChamp,
  setEditingChamp,
  handleChampChange,
  handleLignesApplicablesChange,
  moveChamp,
  handleDeleteChamp,
}) => (
  <TableBody>
    {champs.map((champ, i) => (
      <ChampTableRow
        key={champ.id}
        champ={champ}
        champIndex={i}
        champsCount={champs.length}
        blocId={blocId}
        isEditing={editingChamp?.champ.id === champ.id && editingChamp.blocId === blocId}
        onEdit={() => setEditingChamp({ champ, blocId })}
        onCloseEdit={() => setEditingChamp(null)}
        onEditSave={(values) => {
          console.log("Saving champ edit with values:", values);
          // Apply each field individually to ensure all are updated
          handleChampChange(blocId, champ.id, "nom", values.nom);
          handleChampChange(blocId, champ.id, "nomTechnique", values.nomTechnique);
          
          // Handle lignes applicables
          const lignes = values.lignesApplicables
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean);
          handleChampChange(blocId, champ.id, "lignesApplicables", lignes);
        }}
        onDelete={() => handleDeleteChamp(blocId, champ.id)}
        onChange={(field, value) => handleChampChange(blocId, champ.id, field, value)}
        onLignesApplicablesChange={(val) => handleLignesApplicablesChange(blocId, champ.id, val)}
        onMove={(direction) => moveChamp(blocId, champ.id, direction)}
      />
    ))}
  </TableBody>
);

export default ChampTableBody;
