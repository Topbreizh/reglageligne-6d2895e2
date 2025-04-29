
import { BlocConfiguration, Produit } from "@/types";
import CalculMatieresSection from "./form-sections/CalculMatieresSection";
import StandardFormSection from "./form-sections/StandardFormSection";

interface ProduitFormSectionProps {
  bloc: BlocConfiguration;
  champsVisibles: BlocConfiguration['champs'];
  formData: Produit;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ProduitFormSection = ({
  bloc,
  champsVisibles,
  formData,
  onChange,
}: ProduitFormSectionProps) => {
  // Enhanced logging for debugging the data flow
  console.log(`Rendering section ${bloc.nom} with id: ${bloc.id}`);
  
  // Special styling for the calcul de pâte block - now Calcul matières
  if (bloc.id === "calculPate") {
    console.log("Rendering special Calcul matières blocks");
    return <CalculMatieresSection formData={formData} onChange={onChange} />;
  }

  // Default rendering for all other blocks
  return (
    <StandardFormSection 
      bloc={bloc} 
      champsVisibles={champsVisibles} 
      formData={formData} 
      onChange={onChange} 
    />
  );
};

export default ProduitFormSection;
