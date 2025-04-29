
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import BlocCalculMatieres from "@/components/calcul-matieres/BlocCalculMatieres";
import RechercheReglageBloc from "@/components/calcul-matieres/RechercheReglageBloc";
import { useCalculMatieresForm } from "@/hooks/useCalculMatieresForm";

const CalculMatieresPage = () => {
  const {
    fields,
    loading,
    handleReglageResult,
    handleFieldChange
  } = useCalculMatieresForm();

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Calcul des matières premières</h1>

        <RechercheReglageBloc loading={loading} onResult={handleReglageResult} />

        <BlocCalculMatieres
          title="Calcul de pâte"
          withRognure
          formuleLabel="Formule : Poids de pâte × Nombre de bandes × Cadence × 60 ÷ 1000 × (100 - % Rognure) ÷ 100"
          values={fields.pate}
          onFieldChange={(key, value) => handleFieldChange("pate", key, value)}
        />
        <BlocCalculMatieres
          title="Calcul fourrage"
          formuleLabel="Formule : Poids de fourrage × Nombre de bandes × Cadence × 60 ÷ 1000"
          values={fields.fourrage}
          onFieldChange={(key, value) => handleFieldChange("fourrage", key, value)}
        />
        <BlocCalculMatieres
          title="Calcul marquant"
          formuleLabel="Formule : Poids de marquant × Nombre de bandes × Cadence × 60 ÷ 1000"
          values={fields.marquant}
          onFieldChange={(key, value) => handleFieldChange("marquant", key, value)}
        />
      </div>
    </PageLayout>
  );
};

export default CalculMatieresPage;
