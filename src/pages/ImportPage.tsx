
import PageLayout from "@/components/layout/PageLayout";
import ExcelImport from "@/components/ExcelImport";

const ImportPage = () => {
  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          <span className="text-noir-800">Import depuis</span> <span className="text-jaune-300">Excel</span>
        </h1>
        <ExcelImport />
      </div>
    </PageLayout>
  );
};

export default ImportPage;
