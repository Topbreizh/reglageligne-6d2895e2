
import PageLayout from "@/components/layout/PageLayout";
import BlocsManager from "@/components/BlocsManager";

const GestionBlocsPage = () => {
  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          <span className="text-noir-800">Gestion des</span> <span className="text-jaune-300">blocs et champs</span>
        </h1>
        <BlocsManager />
      </div>
    </PageLayout>
  );
};

export default GestionBlocsPage;
