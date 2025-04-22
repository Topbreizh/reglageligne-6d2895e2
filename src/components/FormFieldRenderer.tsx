
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Produit } from "@/types";
import { isRequiredField } from "@/utils/produitFormUtils";

interface FormFieldRendererProps {
  champ: {
    id: string;
    nom: string;
    nomTechnique: string;
  };
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const FormFieldRenderer = ({ champ, value, onChange }: FormFieldRendererProps) => {
  const isFullWidth =
    champ.nomTechnique === "designation" ||
    champ.nomTechnique === "commentaire";

  // Corriger le problème de valeurs undefined en affichant une chaîne vide
  const displayValue = value === undefined ? "" : value;
  
  // Ajouter des logs pour déboguer les valeurs des champs avec leurs noms techniques
  console.log(`Rendu du champ ${champ.nom} (${champ.nomTechnique}) avec valeur:`, displayValue);

  return (
    <div className={isFullWidth ? "md:col-span-3" : ""}>
      <Label htmlFor={champ.nomTechnique} className="field-label">
        {champ.nom}
        {isRequiredField(champ.nomTechnique) ? " *" : ""}
      </Label>
      {champ.nomTechnique === "commentaire" ? (
        <Textarea
          id={champ.nomTechnique}
          name={champ.nomTechnique}
          value={displayValue}
          onChange={onChange}
          className="min-h-20 border-noir-300"
          required={isRequiredField(champ.nomTechnique)}
        />
      ) : (
        <Input
          id={champ.nomTechnique}
          name={champ.nomTechnique}
          value={displayValue}
          onChange={onChange}
          className="border-noir-300"
          required={isRequiredField(champ.nomTechnique)}
        />
      )}
    </div>
  );
};

export default FormFieldRenderer;
