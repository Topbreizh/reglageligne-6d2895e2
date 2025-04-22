
import React from "react";
import { Button } from "@/components/ui/button";

interface ChampAddButtonProps {
  blocId: string;
  onAdd: (blocId: string) => void;
}

const ChampAddButton: React.FC<ChampAddButtonProps> = ({ blocId, onAdd }) => (
  <Button
    onClick={() => onAdd(blocId)}
    size="sm"
    variant="outline"
    className="border-jaune-300"
  >
    + Ajouter un champ
  </Button>
);

export default ChampAddButton;
