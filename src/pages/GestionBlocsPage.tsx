
import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import BlocsManager from "@/components/BlocsManager";
import { BlocConfiguration } from "@/types";
import { getBlocsConfiguration } from "@/lib/firebaseReglage";
import { blocsConfiguration as defaultBlocsConfig } from "@/data/blocConfig";
import { useToast } from "@/hooks/use-toast";

const GestionBlocsPage = () => {
  const [configuration, setConfiguration] = useState<BlocConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchConfiguration = async () => {
      try {
        setLoading(true);
        const savedConfig = await getBlocsConfiguration();
        
        if (savedConfig) {
          console.log("Configuration chargée depuis Firebase:", savedConfig);
          setConfiguration(savedConfig);
        } else {
          console.log("Aucune configuration trouvée, utilisation de la configuration par défaut");
          setConfiguration(JSON.parse(JSON.stringify(defaultBlocsConfig)));
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la configuration:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger la configuration. Utilisation des valeurs par défaut.",
        });
        setConfiguration(JSON.parse(JSON.stringify(defaultBlocsConfig)));
      } finally {
        setLoading(false);
      }
    };

    fetchConfiguration();
  }, [toast]);

  const handleConfigurationChange = (updatedBlocs: BlocConfiguration[]) => {
    console.log("Configuration mise à jour dans GestionBlocsPage:", updatedBlocs);
    setConfiguration(updatedBlocs);
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          <span className="text-noir-800">Gestion des</span> <span className="text-jaune-300">blocs et champs</span>
        </h1>
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jaune-300"></div>
          </div>
        ) : (
          <BlocsManager 
            initialConfiguration={configuration} 
            onConfigurationChange={handleConfigurationChange} 
          />
        )}
      </div>
    </PageLayout>
  );
};

export default GestionBlocsPage;
