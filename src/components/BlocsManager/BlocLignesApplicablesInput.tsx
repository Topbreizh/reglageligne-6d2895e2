
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BlocLignesApplicablesInputProps {
  blocId: string;
  lignesApplicables: string[];
  handleLignesApplicablesChange: (blocId: string, champId: string | null, value: string) => void;
}
const BlocLignesApplicablesInput: React.FC<BlocLignesApplicablesInputProps> = ({
  blocId,
  lignesApplicables,
  handleLignesApplicablesChange
}) => (
  <div>
    <Label htmlFor={`bloc-${blocId}-lignes`} className="field-label">
      Lignes applicables
    </Label>
    <Input
      id={`bloc-${blocId}-lignes`}
      value={lignesApplicables.join(", ")}
      onChange={(e) =>
        handleLignesApplicablesChange(blocId, null, e.target.value)
      }
      placeholder="Exemple: 1, 2, * (pour toutes)"
      className="border-noir-300"
    />
    <p className="text-xs text-noir-600 mt-1">
      Séparez les numéros par des virgules. Utilisez * pour toutes les lignes.
    </p>
  </div>
);
export default BlocLignesApplicablesInput;
