
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FormFieldRenderer from "./FormFieldRenderer";
import { BlocConfiguration, Produit } from "@/types";

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
  
  // Special styling for the calcul de pâte block
  if (bloc.id === "calculPate") {
    console.log("Rendering special Calcul de pâte block");
    
    // Find the specific fields we want to display
    const fieldMap: Record<string, string> = {
      "poidPatequalistat": "Poids pâte Qualistat:",
      "poidFourragequalistat": "Poids fourrage qualistat:",
      "poidMarquantqualistat": "Poids marquant Qualistat:",
      "nbrDeBandes": "Nombre de bandes:",
      "rognure": "% Rognure:"
    };
    
    // Create an array of the field data we want to show in order
    const fieldOrder = ["poidPatequalistat", "poidFourragequalistat", "poidMarquantqualistat", "nbrDeBandes", "rognure"];
    
    return (
      <Card key={bloc.id}>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-noir-800 border-b-2 border-jaune-300 pb-2">
            {bloc.nom}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {fieldOrder.map(fieldName => {
              const value = formData[fieldName as keyof Produit] || '';
              return (
                <div key={fieldName} className="grid grid-cols-2 items-center">
                  <span className="font-medium">{fieldMap[fieldName]}</span>
                  <span>{value}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default rendering for all other blocks
  return (
    <Card key={bloc.id}>
      <CardHeader>
        <CardTitle className="text-lg font-bold text-noir-800 border-b-2 border-jaune-300 pb-2">
          {bloc.nom}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {champsVisibles.map((champ) => {
          // Make sure to handle potential case-sensitivity issues in field names
          const fieldName = champ.nomTechnique;
          
          // Fix case sensitivity issues by standardizing field names
          let standardizedFieldName = fieldName;
          if (fieldName.toLowerCase() === "poidpatequalistat") standardizedFieldName = "poidPatequalistat";
          if (fieldName.toLowerCase() === "poidfourragequalistat") standardizedFieldName = "poidFourragequalistat";
          if (fieldName.toLowerCase() === "poidmarquantqualistat") standardizedFieldName = "poidMarquantqualistat";
          if (fieldName.toLowerCase() === "nbrdebandes") standardizedFieldName = "nbrDeBandes";
          
          const fieldValue = formData[standardizedFieldName as keyof Produit] as string || "";
          
          // Log each field being rendered for debugging
          console.log(`Field in ${bloc.nom}: ${champ.nom} (${fieldName} -> ${standardizedFieldName}) => value:`, fieldValue);
          
          return (
            <FormFieldRenderer
              key={champ.id}
              champ={{
                ...champ,
                nomTechnique: standardizedFieldName // Use standardized field name
              }}
              value={fieldValue}
              onChange={onChange}
            />
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ProduitFormSection;
