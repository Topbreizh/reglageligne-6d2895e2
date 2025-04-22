import { useState, useEffect } from "react";
import { BlocConfiguration, ChampConfiguration } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { sauvegarderBlocsConfiguration } from "@/lib/firebaseReglage";

function uniqueId(prefix: string) {
  return `${prefix}_${Math.floor(Date.now() * Math.random())}`;
}

function generateUniqueTechnicalName(baseName: string, existingNames: string[]): string {
  let candidate = baseName.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  
  // If the name is already used, add a number suffix
  if (existingNames.includes(candidate)) {
    let counter = 1;
    while (existingNames.includes(`${candidate}${counter}`)) {
      counter++;
    }
    return `${candidate}${counter}`;
  }
  
  return candidate;
}

export const useBlocsManager = (initialConfiguration: BlocConfiguration[], onConfigurationChange?: (blocs: BlocConfiguration[]) => void) => {
  const [blocs, setBlocs] = useState<BlocConfiguration[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [editingBloc, setEditingBloc] = useState<BlocConfiguration | null>(null);
  const [editingChamp, setEditingChamp] = useState<{champ: ChampConfiguration, blocId: string} | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialConfiguration && initialConfiguration.length > 0) {
      // Créer une copie profonde pour éviter les modifications par référence
      setBlocs(JSON.parse(JSON.stringify(initialConfiguration)));
    }
  }, [initialConfiguration]);

  const handleBlocChange = (id: string, field: keyof BlocConfiguration, value: any) => {
    console.log(`handleBlocChange: ${id}, field: ${field}, value:`, value);
    const updatedBlocs = blocs.map((bloc) =>
      bloc.id === id ? { ...bloc, [field]: value } : bloc
    );
    setBlocs(updatedBlocs);
    if (onConfigurationChange) onConfigurationChange(updatedBlocs);
  };

  const handleChampChange = (
    blocId: string,
    champId: string,
    field: keyof ChampConfiguration,
    value: any
  ) => {
    console.log(`handleChampChange: blocId=${blocId}, champId=${champId}, field=${field}, value:`, value);
    const updatedBlocs = blocs.map((bloc) => {
      if (bloc.id === blocId) {
        return {
          ...bloc,
          champs: bloc.champs.map((champ) =>
            champ.id === champId ? { ...champ, [field]: value } : champ
          ),
        };
      }
      return bloc;
    });
    setBlocs(updatedBlocs);
    if (onConfigurationChange) onConfigurationChange(updatedBlocs);
  };

  const handleLignesApplicablesChange = (
    blocId: string,
    champId: string | null,
    value: string
  ) => {
    const lignesArray = value
      .split(",")
      .map((ligne) => ligne.trim())
      .filter((ligne) => ligne);

    if (champId) {
      handleChampChange(blocId, champId, "lignesApplicables", lignesArray);
    } else {
      handleBlocChange(blocId, "lignesApplicables", lignesArray);
    }
  };

  const moveBloc = (blocId: string, direction: "up" | "down") => {
    const blocIndex = blocs.findIndex((bloc) => bloc.id === blocId);
    if (
      (direction === "up" && blocIndex === 0) ||
      (direction === "down" && blocIndex === blocs.length - 1)
    ) {
      return;
    }
    const newBlocs = [...blocs];
    const targetIndex = direction === "up" ? blocIndex - 1 : blocIndex + 1;
    const tempOrdre = newBlocs[blocIndex].ordre;
    newBlocs[blocIndex].ordre = newBlocs[targetIndex].ordre;
    newBlocs[targetIndex].ordre = tempOrdre;
    [newBlocs[blocIndex], newBlocs[targetIndex]] = [newBlocs[targetIndex], newBlocs[blocIndex]];
    setBlocs(newBlocs);
    if (onConfigurationChange) {
      onConfigurationChange(newBlocs);
    }
  };

  const moveChamp = (blocId: string, champId: string, direction: "up" | "down") => {
    const blocIndex = blocs.findIndex((bloc) => bloc.id === blocId);
    const champs = [...blocs[blocIndex].champs];
    const champIndex = champs.findIndex((champ) => champ.id === champId);
    if (
      (direction === "up" && champIndex === 0) ||
      (direction === "down" && champIndex === champs.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === "up" ? champIndex - 1 : champIndex + 1;
    const tempOrdre = champs[champIndex].ordre;
    champs[champIndex].ordre = champs[targetIndex].ordre;
    champs[targetIndex].ordre = tempOrdre;
    [champs[champIndex], champs[targetIndex]] = [champs[targetIndex], champs[champIndex]];
    const updatedBlocs = [...blocs];
    updatedBlocs[blocIndex].champs = champs;
    setBlocs(updatedBlocs);
    if (onConfigurationChange) {
      onConfigurationChange(updatedBlocs);
    }
  };

  const handleAddBloc = () => {
    const newOrder = blocs.length > 0 ? Math.max(...blocs.map(b => b.ordre)) + 1 : 1;
    const newId = uniqueId("bloc");
    const existingNomsTechniques = blocs.map(b => b.nomTechnique || '');
    const newNomTechnique = generateUniqueTechnicalName("nouveauBloc", existingNomsTechniques);
    
    const newBloc: BlocConfiguration = {
      id: newId,
      nom: "Nouveau bloc",
      nomTechnique: newNomTechnique,
      ordre: newOrder,
      lignesApplicables: ["*"],
      visible: true,
      champs: []
    };
    const newBlocs = [...blocs, newBloc];
    setBlocs(newBlocs);
    if (onConfigurationChange) onConfigurationChange(newBlocs);
    setEditingBloc(newBloc);
    toast({
      title: "Bloc ajouté",
      description: "Un bloc vierge a été ajouté. Complétez ses informations.",
      duration: 3000
    });
  };

  const handleAddChamp = (blocId: string) => {
    const bloc = blocs.find(b => b.id === blocId);
    if (!bloc) return;
    
    const newChampsOrder = (bloc.champs.length || 0) + 1;
    const newId = uniqueId("champ");
    
    // Generate a unique technical name
    const existingNomsTechniques = bloc.champs.map(c => c.nomTechnique);
    const newNomTechnique = generateUniqueTechnicalName(`nouveauChamp${newChampsOrder}`, existingNomsTechniques);
    
    const newChamp: ChampConfiguration = {
      id: newId,
      nom: "Nouveau champ",
      nomTechnique: newNomTechnique,
      ordre: newChampsOrder,
      visible: true,
      lignesApplicables: ["*"]
    };
    const updatedBlocs = blocs.map(bloc =>
      bloc.id === blocId
        ? { ...bloc, champs: [...bloc.champs, newChamp] }
        : bloc
    );
    setBlocs(updatedBlocs);
    if (onConfigurationChange) onConfigurationChange(updatedBlocs);
    setEditingChamp({champ: newChamp, blocId});
    toast({
      title: "Champ ajouté",
      description: "Un nouveau champ a été ajouté au bloc.",
      duration: 3000
    });
  };

  const handleDeleteBloc = (blocId: string) => {
    const updatedBlocs = blocs.filter(bloc => bloc.id !== blocId);
    updatedBlocs.forEach((bloc, index) => {
      bloc.ordre = index + 1;
    });
    setBlocs(updatedBlocs);
    if (onConfigurationChange) onConfigurationChange(updatedBlocs);
    toast({
      title: "Bloc supprimé",
      description: "Le bloc a été supprimé avec succès.",
      duration: 3000
    });
  };

  const handleDeleteChamp = (blocId: string, champId: string) => {
    const updatedBlocs = blocs.map(bloc => {
      if (bloc.id === blocId) {
        const filteredChamps = bloc.champs.filter(champ => champ.id !== champId);
        filteredChamps.forEach((champ, index) => {
          champ.ordre = index + 1;
        });
        return { ...bloc, champs: filteredChamps };
      }
      return bloc;
    });
    setBlocs(updatedBlocs);
    if (onConfigurationChange) onConfigurationChange(updatedBlocs);
    toast({
      title: "Champ supprimé",
      description: "Le champ a été supprimé avec succès.",
      duration: 3000
    });
  };

  const saveConfiguration = async () => {
    try {
      setIsSaving(true);
      
      // Vérification préalable: s'assurer que tous les blocs et champs ont les propriétés requises
      const blocsToSave = blocs.map(bloc => {
        // S'assurer que le bloc a un nomTechnique
        if (!bloc.nomTechnique) {
          console.warn(`Correction: Ajout d'un nomTechnique au bloc ${bloc.id} (${bloc.nom})`);
          bloc.nomTechnique = generateUniqueTechnicalName(bloc.nom, blocs.filter(b => b.id !== bloc.id).map(b => b.nomTechnique || ''));
        }
        
        // S'assurer que tous les champs ont un nomTechnique
        const champsVerifies = bloc.champs.map(champ => {
          if (!champ.nomTechnique) {
            console.warn(`Correction: Ajout d'un nomTechnique au champ ${champ.id} (${champ.nom}) du bloc ${bloc.nom}`);
            const existingNames = bloc.champs.filter(c => c.id !== champ.id).map(c => c.nomTechnique);
            champ.nomTechnique = generateUniqueTechnicalName(champ.nom, existingNames);
          }
          return champ;
        });
        
        return {
          ...bloc,
          champs: champsVerifies
        };
      });
      
      console.log('Blocs avant sauvegarde:', JSON.stringify(blocsToSave, null, 2));
      await sauvegarderBlocsConfiguration(blocsToSave);
      toast({
        title: "Configuration sauvegardée",
        description: "Les modifications des blocs et champs ont été enregistrées dans la base de données.",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration. Veuillez réessayer.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    blocs,
    isSaving,
    editingBloc,
    editingChamp,
    setEditingBloc,
    setEditingChamp,
    handleBlocChange,
    handleChampChange,
    handleLignesApplicablesChange,
    moveBloc,
    moveChamp,
    handleAddBloc,
    handleAddChamp,
    handleDeleteBloc,
    handleDeleteChamp,
    saveConfiguration
  };
};
