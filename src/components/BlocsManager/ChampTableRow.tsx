
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TableRow, TableCell } from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { ChampConfiguration } from "@/types";
import { ChampEditDialog } from "./ChampEditDialog";
import { ChampDeleteDialog } from "./ChampDeleteDialog";

interface ChampTableRowProps {
  champ: ChampConfiguration;
  champIndex: number;
  champsCount: number;
  blocId: string;
  isEditing: boolean;
  onEdit: () => void;
  onCloseEdit: () => void;
  onEditSave: (values: { nom: string; nomTechnique: string; lignesApplicables: string }) => void;
  onDelete: () => void;
  onChange: (field: keyof ChampConfiguration, value: any) => void;
  onLignesApplicablesChange: (value: string) => void;
  onMove: (direction: "up" | "down") => void;
}

export const ChampTableRow: React.FC<ChampTableRowProps> = ({
  champ, champIndex, champsCount, blocId,
  isEditing, onEdit, onCloseEdit, onEditSave,
  onDelete, onChange, onLignesApplicablesChange,
  onMove
}) => {
  console.log("Rendering ChampTableRow for champ:", champ.nom, "isEditing:", isEditing);
  
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={champ.ordre}
            onChange={(e) => onChange("ordre", parseInt(e.target.value))}
            className="border-noir-300 w-16"
          />
          <div className="flex flex-col">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-5 px-1"
              onClick={() => onMove("up")}
              disabled={champIndex === 0}
            >
              ▲
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-5 px-1"
              onClick={() => onMove("down")}
              disabled={champIndex === champsCount - 1}
            >
              ▼
            </Button>
          </div>
        </div>
      </TableCell>
      <TableCell>{champ.nom}</TableCell>
      <TableCell>
        <Input
          value={champ.nomTechnique}
          onChange={(e) => onChange("nomTechnique", e.target.value)}
          placeholder="Nom technique du champ"
          className="border-noir-300"
        />
      </TableCell>
      <TableCell>
        <Input
          value={champ.lignesApplicables.join(", ")}
          onChange={(e) => onLignesApplicablesChange(e.target.value)}
          placeholder="Exemple: 1, 2, * (pour toutes)"
          className="border-noir-300"
        />
      </TableCell>
      <TableCell>
        <Switch
          checked={champ.visible}
          onCheckedChange={(checked) => onChange("visible", checked)}
        />
      </TableCell>
      <TableCell>
        <div className="flex justify-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <ChampEditDialog
            open={isEditing}
            champ={champ}
            blocId={blocId}
            onClose={onCloseEdit}
            onSave={onEditSave}
          />
          <ChampDeleteDialog
            champ={champ}
            onDelete={onDelete}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};
