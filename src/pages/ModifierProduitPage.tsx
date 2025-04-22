
import PageLayout from "@/components/layout/PageLayout";
import ModifierProduitLoader from "./modifier/ModifierProduitLoader";

const ModifierProduitPage = () => {
  return (
    <PageLayout>
      <ModifierProduitLoader mode="edit" />
    </PageLayout>
  );
};

export default ModifierProduitPage;
