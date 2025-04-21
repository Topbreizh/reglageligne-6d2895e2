
import { ImportMapping } from "@/types";
import { blocsConfiguration } from "@/data/blocConfig";

interface ChampApp {
  id: string;
  nom: string;
  blocNom: string;
  nomTechnique: string;
}

const normalize = (str: string) => {
  if (!str) return "";
  return str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s-/]+/g, "");
};

const findMatchingHeader = (headers: string[], champApp: ChampApp) => {
  const champNomNorm = normalize(champApp.nom);
  const champTechNorm = normalize(champApp.nomTechnique || "");
  
  let foundHeader = headers.find(header => 
    normalize(header) === champNomNorm || normalize(header) === champTechNorm
  );
  if (foundHeader) return foundHeader;
  
  foundHeader = headers.find(header => {
    const headerNorm = normalize(header);
    return headerNorm.includes(champNomNorm) || champNomNorm.includes(headerNorm) ||
           headerNorm.includes(champTechNorm) || champTechNorm.includes(headerNorm);
  });
  if (foundHeader) return foundHeader;
  
  switch(champApp.nomTechnique) {
    case "codeArticle":
      return headers.find(h => normalize(h).includes("code") && normalize(h).includes("article"));
    case "numeroLigne":
      return headers.find(h => normalize(h).includes("numero") && normalize(h).includes("ligne"));
    case "designation":
      return headers.find(h => normalize(h).includes("designation") || normalize(h).includes("nom"));
    case "farineurHaut1":
      return headers.find(h => normalize(h).includes("farineur") && normalize(h).includes("haut") && normalize(h).includes("1"));
  }
  
  return null;
};

export const generateInitialMappings = (headers: string[]): ImportMapping[] => {
  const champsCibles = blocsConfiguration.flatMap((bloc) =>
    bloc.champs.map((champ) => ({
      id: champ.id,
      nom: champ.nom,
      blocNom: bloc.nom,
      nomTechnique: champ.nomTechnique,
    }))
  );
  
  return champsCibles.map(champApp => ({
    champSource: findMatchingHeader(headers, champApp) || "none",
    champDestination: champApp.nomTechnique
  }));
};
