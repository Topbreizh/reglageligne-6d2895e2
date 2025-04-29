
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, FileText, Import, Settings, Calculator } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { currentUser } = useAuth();

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-noir-800">Réglage</span> <span className="text-jaune-300">ligne discontinue</span>
          </h1>
          <p className="text-lg text-noir-600 max-w-2xl mx-auto">
            Gérez efficacement tous vos réglages de ligne de production et accédez rapidement aux informations nécessaires.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Public Cards - Always visible */}
          <Card className="hover:shadow-md transition-shadow border-2 border-noir-200">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-jaune-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-jaune-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">Fiche réglage</h2>
              <p className="text-noir-600 mb-4">
                Recherchez rapidement des réglages par code article, numéro de ligne ou désignation.
              </p>
              <Link to="/recherche" className="mt-auto">
                <Button className="bg-jaune-300 text-noir-800 hover:bg-jaune-400">
                  Rechercher
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow border-2 border-noir-200">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-jaune-100 rounded-full flex items-center justify-center mb-4">
                <Calculator className="h-8 w-8 text-jaune-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">Calcul Matières</h2>
              <p className="text-noir-600 mb-4">
                Calculez les quantités de matières premières pour vos productions.
              </p>
              <Link to="/calcul-matieres" className="mt-auto">
                <Button className="bg-jaune-300 text-noir-800 hover:bg-jaune-400">
                  Calculer
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          {/* Protected Cards - Only visible when logged in */}
          {currentUser && (
            <>
              <Card className="hover:shadow-md transition-shadow border-2 border-noir-200">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-jaune-100 rounded-full flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-jaune-500" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Nouveau Produit</h2>
                  <p className="text-noir-600 mb-4">
                    Créez une nouvelle fiche de réglage pour un produit avec tous les paramètres nécessaires.
                  </p>
                  <Link to="/nouveau-produit" className="mt-auto">
                    <Button className="bg-jaune-300 text-noir-800 hover:bg-jaune-400">
                      Créer un produit
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow border-2 border-noir-200">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-jaune-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-jaune-500" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Relevés</h2>
                  <p className="text-noir-600 mb-4">
                    Consultez les relevés de réglages pour différentes lignes de production.
                  </p>
                  <Link to="/releves" className="mt-auto">
                    <Button className="bg-jaune-300 text-noir-800 hover:bg-jaune-400">
                      Voir les relevés
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow border-2 border-noir-200">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-jaune-100 rounded-full flex items-center justify-center mb-4">
                    <Import className="h-8 w-8 text-jaune-500" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Import Excel</h2>
                  <p className="text-noir-600 mb-4">
                    Importez vos données depuis Excel avec un mapping personnalisé des champs.
                  </p>
                  <Link to="/import" className="mt-auto">
                    <Button className="bg-jaune-300 text-noir-800 hover:bg-jaune-400">
                      Importer des données
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow border-2 border-noir-200">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-jaune-100 rounded-full flex items-center justify-center mb-4">
                    <Settings className="h-8 w-8 text-jaune-500" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Gestion des Blocs</h2>
                  <p className="text-noir-600 mb-4">
                    Configurez l'affichage et l'ordre des blocs et champs selon les besoins.
                  </p>
                  <Link to="/gestion-blocs" className="mt-auto">
                    <Button className="bg-jaune-300 text-noir-800 hover:bg-jaune-400">
                      Gérer les blocs
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}
        </div>
        
        {/* Login suggestion for non-authenticated users */}
        {!currentUser && (
          <div className="mt-10 text-center p-6 bg-noir-50 rounded-lg border border-noir-200">
            <h3 className="text-xl font-semibold mb-2">Accès administrateur</h3>
            <p className="text-noir-600 mb-4">
              Connectez-vous pour accéder aux fonctionnalités avancées: nouveau produit, relevés, import Excel et gestion des blocs.
            </p>
            <Link to="/login">
              <Button className="bg-jaune-300 text-noir-800 hover:bg-jaune-400">
                Se connecter
              </Button>
            </Link>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Index;
