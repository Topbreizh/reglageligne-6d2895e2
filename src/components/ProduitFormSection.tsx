
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
  
  // Special logging for the calcul de pâte block
  if (bloc.id === "calculPate") {
    console.log("Data in Calcul de pâte block:", {
      poidsPate: formData.poidsPate,
      poidsArticle: formData.poidsArticle,
      quantitePate: formData.quantitePate,
      poidPatequalistat: formData.poidPatequalistat,
      poidFourragequalistat: formData.poidFourragequalistat,
      poidMarquantqualistat: formData.poidMarquantqualistat,
      nbrDeBandes: formData.nbrDeBandes,
      // Check if rognure exists in the data
      rognure: formData.rognure
    });
    
    // Log visible fields to verify their technical names
    console.log("Visible fields in Calcul de pâte:", 
      champsVisibles.map(c => ({ id: c.id, nom: c.nom, nomTechnique: c.nomTechnique }))
    );
  }

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
          const fieldValue = formData[fieldName as keyof Produit] as string || "";
          
          // Log each field being rendered for debugging
          console.log(`Field in ${bloc.nom}: ${champ.nom} (${fieldName}) => value:`, fieldValue);
          
          return (
            <FormFieldRenderer
              key={champ.id}
              champ={champ}
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
