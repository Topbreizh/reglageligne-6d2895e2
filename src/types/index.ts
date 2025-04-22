
export interface Produit {
  id?: string;
  // Bloc Article
  codeArticle: string;
  numeroLigne: string;
  designation: string;
  
  // Bloc Laminage
  programme: string;
  facteur: string;
  regleLaminage: string;
  quick: string;
  calibreur1: string;
  calibreur2: string;
  calibreur3: string;
  laminoir: string;
  vitesseLaminage: string;
  farineurHaut1: string;
  farineurHaut2: string;
  farineurHaut3: string;
  farineurBas1: string;
  farineurBas2: string;
  farineurBas3: string;
  
  // Bloc Façonnage 1-4-6
  queueDeCarpe: string;
  numeroDecoupe: string;
  buse: string;
  distributeurChocoRaisin: string;
  humidificateur146: string;
  vitesseDoreuse: string;
  
  // Bloc Guillotine
  p1LongueurDecoupe: string;
  p2Centrage: string;
  bielle: string;
  lameRacleur: string;
  
  // Bloc Distributeur crème
  rademaker: string;
  aera: string;
  fritch: string;
  
  // Bloc Façonnage 2-5
  retourneur: string;
  aligneur: string;
  humidificateur25: string;
  pushPlaque: string;
  rouleauInferieur: string;
  rouleauSuperieur: string;
  tapisFaconneuse: string;
  reperePoignee: string;
  
  // Bloc Fin de ligne
  rouleauPression: string;
  tapisAvantEtuveSurgel: string;
  etuveSurgel: string;
  
  // Bloc Cadence, Personnel
  cadence: string;
  lamineur: string;
  surveillant: string;
  distributeurRaisinChoco: string;
  pose: string;
  pliageTriage: string;
  topping: string;
  sortieEtuve: string;
  ouvertureMP: string;
  commentaire: string;
}

export interface BlocConfiguration {
  id: string;
  nom: string;
  nomTechnique?: string; // Ajout de la propriété nomTechnique comme optionnelle pour la compatibilité
  ordre: number;
  lignesApplicables: string[];
  visible: boolean;
  champs: ChampConfiguration[];
}

export interface ChampConfiguration {
  id: string;
  nom: string;
  nomTechnique: string;
  ordre: number;
  visible: boolean;
  lignesApplicables: string[];
}

export interface ImportMapping {
  champSource: string;
  champDestination: string;
}
