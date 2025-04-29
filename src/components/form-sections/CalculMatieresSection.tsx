
import React from "react";
import { Produit } from "@/types";
import CalculPateBlock from "./CalculPateBlock";
import CalculFourrageBlock from "./CalculFourrageBlock";
import CalculMarquantBlock from "./CalculMarquantBlock";

interface CalculMatieresSectionProps {
  formData: Produit;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CalculMatieresSection = ({ formData, onChange }: CalculMatieresSectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-noir-800">Calcul matières</h2>
      
      <CalculPateBlock formData={formData} onChange={onChange} />
      <CalculFourrageBlock formData={formData} onChange={onChange} />
      <CalculMarquantBlock formData={formData} onChange={onChange} />
    </div>
  );
};

export default CalculMatieresSection;
