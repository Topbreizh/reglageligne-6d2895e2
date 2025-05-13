
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ReleveSearchForm } from "./releve/ReleveSearchForm";
import { ReleveProduitDetails } from "./releve/ReleveProduitDetails";
import { useReleveSearch } from "@/hooks/useReleveSearch";

interface ReleveBlocProps {
  index: number;
}

export const ReleveBloc = ({ index }: ReleveBlocProps) => {
  const { produit, loading, handleSearch } = useReleveSearch();

  return (
    <Card className="shadow-lg print:shadow-none print:border-black print:text-black ReleveBloc">
      <CardHeader className="bg-gray-50 border-b print:bg-white print:p-1">
        <div className="font-semibold text-lg print:text-[10px]">Relevé {index}</div>
      </CardHeader>
      <CardContent className="p-4 print:p-0.5">
        <ReleveSearchForm onSearch={handleSearch} loading={loading} />

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-jaune-300"></div>
          </div>
        ) : produit ? (
          <ReleveProduitDetails produit={produit} />
        ) : null}
      </CardContent>
    </Card>
  );
};
