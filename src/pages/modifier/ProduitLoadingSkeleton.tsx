
const ProduitLoadingSkeleton = () => (
  <div className="max-w-5xl mx-auto text-center py-12">
    <div className="flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jaune-300"></div>
    </div>
    <p className="mt-4 text-noir-600">Chargement des données du produit...</p>
  </div>
);

export default ProduitLoadingSkeleton;
