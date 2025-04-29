
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FormFieldRenderer from "./FormFieldRenderer";
import { BlocConfiguration, Produit } from "@/types";
import { parseNumberFR, calculQuantite } from "@/lib/calculMatieresUtils";

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
    
    // Calculate quantities
    const pateQuantity = calculQuantite(
      parseNumberFR(formData.poidPatequalistat || "0"),
      parseFloat(formData.nbrDeBandes || "0"),
      parseFloat(formData.cadence || "0"),
      formData.rognure ? parseFloat(formData.rognure) : 0
    );
    
    const fourrageQuantity = calculQuantite(
      parseNumberFR(formData.poidFourragequalistat || "0"),
      parseFloat(formData.nbrDeBandes || "0"),
      parseFloat(formData.cadence || "0"),
      null
    );
    
    const marquantQuantity = calculQuantite(
      parseNumberFR(formData.poidMarquantqualistat || "0"),
      parseFloat(formData.nbrDeBandes || "0"),
      parseFloat(formData.cadence || "0"),
      null
    );
    
    return (
      <div key={bloc.id} className="space-y-6">
        <h2 className="text-lg font-bold text-noir-800">Calcul matières</h2>
        
        {/* Bloc Calcul de pâte */}
        <Card>
          <CardHeader>
            <CardTitle>Calcul de pâte</CardTitle>
            <div className="text-xs text-muted-foreground">
              Formule : Poids de pâte × Nombre de bandes × Cadence × 60 ÷ 1000 × (100 - % Rognure) ÷ 100
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
              <div>
                <label className="block text-sm font-medium mb-1">Poids (kg)</label>
                <input
                  type="text"
                  name="poidPatequalistat"
                  value={formData.poidPatequalistat || ""}
                  onChange={onChange}
                  className="w-full p-2 border rounded"
                  placeholder="ex: 5,0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nombre de bandes</label>
                <input
                  type="number"
                  name="nbrDeBandes"
                  value={formData.nbrDeBandes || ""}
                  onChange={onChange}
                  className="w-full p-2 border rounded"
                  placeholder="ex: 6"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cadence</label>
                <input
                  type="number"
                  name="cadence"
                  value={formData.cadence || ""}
                  onChange={onChange}
                  className="w-full p-2 border rounded"
                  placeholder="ex: 50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">% Rognure</label>
                <input
                  type="number"
                  name="rognure"
                  value={formData.rognure || ""}
                  onChange={onChange}
                  className="w-full p-2 border rounded"
                  placeholder="ex: 3"
                />
              </div>
            </div>
            <div className="text-right text-lg font-semibold text-noir-700">
              Quantité à l'heure : {pateQuantity} kg
            </div>
          </CardContent>
        </Card>
        
        {/* Bloc Calcul fourrage */}
        <Card>
          <CardHeader>
            <CardTitle>Calcul fourrage</CardTitle>
            <div className="text-xs text-muted-foreground">
              Formule : Poids de fourrage × Nombre de bandes × Cadence × 60 ÷ 1000
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              <div>
                <label className="block text-sm font-medium mb-1">Poids (kg)</label>
                <input
                  type="text"
                  name="poidFourragequalistat"
                  value={formData.poidFourragequalistat || ""}
                  onChange={onChange}
                  className="w-full p-2 border rounded"
                  placeholder="ex: 5,0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nombre de bandes</label>
                <input
                  type="number"
                  name="nbrDeBandes"
                  value={formData.nbrDeBandes || ""}
                  onChange={onChange}
                  className="w-full p-2 border rounded"
                  placeholder="ex: 6"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cadence</label>
                <input
                  type="number"
                  name="cadence"
                  value={formData.cadence || ""}
                  onChange={onChange}
                  className="w-full p-2 border rounded"
                  placeholder="ex: 50"
                  disabled
                />
              </div>
            </div>
            <div className="text-right text-lg font-semibold text-noir-700">
              Quantité à l'heure : {fourrageQuantity} kg
            </div>
          </CardContent>
        </Card>
        
        {/* Bloc Calcul marquant */}
        <Card>
          <CardHeader>
            <CardTitle>Calcul marquant</CardTitle>
            <div className="text-xs text-muted-foreground">
              Formule : Poids de marquant × Nombre de bandes × Cadence × 60 ÷ 1000
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              <div>
                <label className="block text-sm font-medium mb-1">Poids (kg)</label>
                <input
                  type="text"
                  name="poidMarquantqualistat"
                  value={formData.poidMarquantqualistat || ""}
                  onChange={onChange}
                  className="w-full p-2 border rounded"
                  placeholder="ex: 5,0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nombre de bandes</label>
                <input
                  type="number"
                  name="nbrDeBandes"
                  value={formData.nbrDeBandes || ""}
                  onChange={onChange}
                  className="w-full p-2 border rounded"
                  placeholder="ex: 6"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cadence</label>
                <input
                  type="number"
                  name="cadence"
                  value={formData.cadence || ""}
                  onChange={onChange}
                  className="w-full p-2 border rounded"
                  placeholder="ex: 50"
                  disabled
                />
              </div>
            </div>
            <div className="text-right text-lg font-semibold text-noir-700">
              Quantité à l'heure : {marquantQuantity} kg
            </div>
          </CardContent>
        </Card>
      </div>
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
