
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
  // Logs détaillés pour comprendre les données reçues
  console.log(`Rendu de la section ${bloc.nom} avec données:`, formData);
  
  // Log spécifique pour le bloc calcul de pâte
  if (bloc.id === "calculPate") {
    console.log("Données dans le bloc Calcul de pâte:", {
      poidsPate: formData.poidsPate,
      poidsArticle: formData.poidsArticle,
      quantitePate: formData.quantitePate,
      poidPatequalistat: formData.poidPatequalistat,
      poidFourragequalistat: formData.poidFourragequalistat,
      poidMarquantqualistat: formData.poidMarquantqualistat,
      nbrDeBandes: formData.nbrDeBandes
    });
    
    // Log des noms techniques des champs visibles pour vérifier
    console.log("Champs visibles dans le bloc Calcul de pâte:", 
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
          // S'assurer que le nom technique existe dans le formData, sinon utiliser ""
          const fieldValue = formData[champ.nomTechnique as keyof Produit] as string || "";
          
          // Log pour chaque champ rendu
          console.log(`Rendu du champ ${champ.nom} (${champ.nomTechnique}) avec valeur:`, fieldValue);
          
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
