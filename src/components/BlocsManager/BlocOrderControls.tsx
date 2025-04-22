
import React from "react";
import { Button } from "@/components/ui/button";

interface BlocOrderControlsProps {
  blocId: string;
  ordre: number;
  allBlocsCount: number;
  handleBlocChange: (id: string, field: string, value: any) => void;
  moveBloc: (blocId: string, direction: "up" | "down") => void;
}

const BlocOrderControls: React.FC<BlocOrderControlsProps> = ({
  blocId,
  ordre,
  allBlocsCount,
  handleBlocChange,
  moveBloc
}) => {
  return (
    <div className="flex gap-2">
      <input
        id={`bloc-${blocId}-ordre`}
        type="number"
        value={ordre}
        onChange={(e) =>
          handleBlocChange(blocId, "ordre", parseInt(e.target.value))
        }
        className="border-noir-300 w-24 rounded-md border px-3 py-2 text-base md:text-sm"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => moveBloc(blocId, "up")}
        disabled={ordre <= 1}
      >
        ▲
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => moveBloc(blocId, "down")}
        disabled={ordre >= allBlocsCount}
      >
        ▼
      </Button>
    </div>
  );
};
export default BlocOrderControls;
