
import React from "react";

const ProduitFicheFooter = () => {
  return (
    <div className="mt-6 text-center text-sm text-gray-500 no-print">
      Document généré le {new Date().toLocaleDateString('fr-FR')}
    </div>
  );
};

export default ProduitFicheFooter;
