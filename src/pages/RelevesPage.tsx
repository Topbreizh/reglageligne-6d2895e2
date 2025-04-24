
import PageLayout from "@/components/layout/PageLayout";
import { ReleveBloc } from "@/components/ReleveBloc";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const RelevesPage = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            <span className="text-noir-800">Relevés de</span>{" "}
            <span className="text-jaune-300">réglages</span>
          </h1>
          <Button 
            onClick={handlePrint}
            variant="outline"
            className="print:hidden"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
        </div>
        
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 print:grid-cols-1 print:gap-4">
          {[...Array(5)].map((_, index) => (
            <ReleveBloc key={index} index={index + 1} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default RelevesPage;
