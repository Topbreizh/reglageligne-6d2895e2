
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
}) => {
  console.log("ChampTableBody rendering with champs:", champs);
  console.log("Current editingChamp:", editingChamp);
  
  return (
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
            console.log("ChampTableBody: Saving champ edit with values:", values);
            // Mettre à jour chaque champ individuellement et explicitement
            handleChampChange(blocId, champ.id, "nom", values.nom);
            handleChampChange(blocId, champ.id, "nomTechnique", values.nomTechnique);
            
            // Gérer les lignes applicables
            handleLignesApplicablesChange(blocId, champ.id, values.lignesApplicables);
            
            // Fermer la boîte de dialogue après enregistrement
            setEditingChamp(null);
          }}
          onDelete={() => handleDeleteChamp(blocId, champ.id)}
          onChange={(field, value) => {
            console.log(`ChampTableBody: Changing field ${String(field)} to:`, value);
            handleChampChange(blocId, champ.id, field, value);
          }}
          onLignesApplicablesChange={(val) => handleLignesApplicablesChange(blocId, champ.id, val)}
          onMove={(direction) => moveChamp(blocId, champ.id, direction)}
        />
      ))}
    </TableBody>
  );
};

export default ChampTableBody;
