
import PageLayout from "@/components/layout/PageLayout";
import { ReleveBloc } from "@/components/ReleveBloc";

const RelevesPage = () => {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          <span className="text-noir-800">Relevés de</span>{" "}
          <span className="text-jaune-300">réglages</span>
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {[...Array(5)].map((_, index) => (
            <ReleveBloc key={index} index={index + 1} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default RelevesPage;
