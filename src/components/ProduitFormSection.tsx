
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FormFieldRenderer from "./FormFieldRenderer";
import { BlocConfiguration, Produit } from "@/types";

interface ProduitFormSectionProps {
  bloc: BlocConfiguration;
  champsVisibles: typeof bloc.champs;
  formData: Produit;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ProduitFormSection = ({
  bloc,
  champsVisibles,
  formData,
  onChange,
}: ProduitFormSectionProps) => (
  <Card key={bloc.id}>
    <CardHeader>
      <CardTitle className="text-lg font-bold text-noir-800 border-b-2 border-jaune-300 pb-2">
        {bloc.nom}
      </CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {champsVisibles.map((champ) => (
        <FormFieldRenderer
          key={champ.id}
          champ={champ}
          value={formData[champ.nomTechnique as keyof Produit] as string}
          onChange={onChange}
        />
      ))}
    </CardContent>
  </Card>
);

export default ProduitFormSection;
