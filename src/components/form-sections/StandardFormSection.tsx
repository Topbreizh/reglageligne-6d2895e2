
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FormFieldRenderer from "@/components/FormFieldRenderer";
import { BlocConfiguration, Produit } from "@/types";

interface StandardFormSectionProps {
  bloc: BlocConfiguration;
  champsVisibles: BlocConfiguration['champs'];
  formData: Produit;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const StandardFormSection = ({
  bloc,
  champsVisibles,
  formData,
  onChange,
}: StandardFormSectionProps) => {
  // Log each block being rendered for debugging
  console.log(`Rendering standard section ${bloc.nom} with id: ${bloc.id}`);
  
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

export default StandardFormSection;
