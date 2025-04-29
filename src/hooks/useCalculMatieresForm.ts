
import { useState } from "react";
import { ReglageFirebase } from "@/lib/firebaseReglage";

interface Fields {
  pate: { poids: string; nbBandes: string; cadence: string; rognure: string };
  fourrage: { poids: string; nbBandes: string; cadence: string };
  marquant: { poids: string; nbBandes: string; cadence: string };
}

export const useCalculMatieresForm = () => {
  const [fields, setFields] = useState<Fields>({
    pate: { poids: "", nbBandes: "", cadence: "", rognure: "" },
    fourrage: { poids: "", nbBandes: "", cadence: "" },
    marquant: { poids: "", nbBandes: "", cadence: "" },
  });
  
  const [loading, setLoading] = useState(false);

  const handleReglageResult = (result: ReglageFirebase | null) => {
    if (result) {
      console.log("Données brutes Firebase:", result);
      
      const nbBandes = result.nbrDeBandes || result.nbrdebandes || "";
      console.log("Nombre de bandes récupéré:", nbBandes);
      
      const poidsPate = result.poidsPate || result.poidpatequalistat || result.poidPatequalistat || "";
      const poidsFourrage = 
        result.poidsFourrage || 
        result.poidfourragequalistat || 
        result.poidFourragequalistat || 
        "";
      const poidsMarquant = 
        result.poidsMarquant || 
        result.poidmarquantqualistat || 
        result.poidMarquantqualistat || 
        "";
      
      console.log("Poids récupérés:", {
        pate: poidsPate,
        fourrage: poidsFourrage,
        marquant: poidsMarquant
      });
      
      const cadence = result.cadence || "";
      const rognure = result.rognure || "";
      
      setFields({
        pate: {
          poids: poidsPate,
          nbBandes: nbBandes,
          cadence: cadence,
          rognure: rognure,
        },
        fourrage: {
          poids: poidsFourrage,
          nbBandes: nbBandes,
          cadence: cadence,
        },
        marquant: {
          poids: poidsMarquant,
          nbBandes: nbBandes,
          cadence: cadence,
        },
      });
    }
  };

  const handleFieldChange = (bloc: "pate" | "fourrage" | "marquant", key: string, value: string) => {
    setFields((prev) => ({
      ...prev,
      [bloc]: { ...prev[bloc], [key]: value },
    }));
  };

  return {
    fields,
    loading,
    setLoading,
    handleReglageResult,
    handleFieldChange,
  };
};
