
import { BlocConfiguration } from "@/types";
import BlocsManagerUI from "./BlocsManager/BlocsManagerUI";
import { useBlocsManager } from "@/hooks/useBlocsManager";

interface BlocsManagerProps {
  initialConfiguration: BlocConfiguration[];
  onConfigurationChange?: (blocs: BlocConfiguration[]) => void;
}

const BlocsManager = ({ initialConfiguration, onConfigurationChange }: BlocsManagerProps) => {
  const manager = useBlocsManager(initialConfiguration, onConfigurationChange);

  return <BlocsManagerUI {...manager} />;
};

export default BlocsManager;
