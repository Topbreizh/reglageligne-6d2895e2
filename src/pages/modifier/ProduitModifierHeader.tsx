
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Props = { designation: string };

export default function ProduitModifierHeader({ designation }: Props) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center mb-6">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mr-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>
      <h1 className="text-2xl md:text-3xl font-bold">
        <span className="text-noir-800">Modifier</span>{" "}
        <span className="text-jaune-300">{designation}</span>
      </h1>
    </div>
  );
}
