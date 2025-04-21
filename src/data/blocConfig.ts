
import { BlocConfiguration } from "@/types";

export const blocsConfiguration: BlocConfiguration[] = [
  {
    id: "article",
    nom: "Article",
    ordre: 1,
    lignesApplicables: ["*"],
    visible: true,
    champs: [
      { id: "codeArticle", nom: "Code article", nomTechnique: "codeArticle", ordre: 1, visible: true, lignesApplicables: ["*"] },
      { id: "numeroLigne", nom: "Numéro de ligne", nomTechnique: "numeroLigne", ordre: 2, visible: true, lignesApplicables: ["*"] },
      { id: "designation", nom: "Désignation", nomTechnique: "designation", ordre: 3, visible: true, lignesApplicables: ["*"] }
    ]
  },
  {
    id: "laminage",
    nom: "Laminage",
    ordre: 2,
    lignesApplicables: ["*"],
    visible: true,
    champs: [
      { id: "programme", nom: "Programme", nomTechnique: "programme", ordre: 1, visible: true, lignesApplicables: ["*"] },
      { id: "facteur", nom: "Facteur", nomTechnique: "facteur", ordre: 2, visible: true, lignesApplicables: ["*"] },
      { id: "regleLaminage", nom: "Règle laminage", nomTechnique: "regleLaminage", ordre: 3, visible: true, lignesApplicables: ["*"] },
      { id: "quick", nom: "Quick", nomTechnique: "quick", ordre: 4, visible: true, lignesApplicables: ["*"] },
      { id: "calibreur1", nom: "Calibreur 1", nomTechnique: "calibreur1", ordre: 5, visible: true, lignesApplicables: ["*"] },
      { id: "calibreur2", nom: "Calibreur 2", nomTechnique: "calibreur2", ordre: 6, visible: true, lignesApplicables: ["*"] },
      { id: "calibreur3", nom: "Calibreur 3", nomTechnique: "calibreur3", ordre: 7, visible: true, lignesApplicables: ["*"] },
      { id: "laminoir", nom: "Laminoir", nomTechnique: "laminoir", ordre: 8, visible: true, lignesApplicables: ["*"] },
      { id: "vitesseLaminage", nom: "Vitesse Laminage", nomTechnique: "vitesseLaminage", ordre: 9, visible: true, lignesApplicables: ["*"] },
      { id: "farineurHaut1", nom: "Farineur Haut 1", nomTechnique: "farineurHaut1", ordre: 10, visible: true, lignesApplicables: ["*"] },
      { id: "farineurHaut2", nom: "Farineur Haut 2", nomTechnique: "farineurHaut2", ordre: 11, visible: true, lignesApplicables: ["*"] },
      { id: "farineurHaut3", nom: "Farineur Haut 3", nomTechnique: "farineurHaut3", ordre: 12, visible: true, lignesApplicables: ["*"] },
      { id: "farineurBas1", nom: "Farineur Bas 1", nomTechnique: "farineurBas1", ordre: 13, visible: true, lignesApplicables: ["*"] },
      { id: "farineurBas2", nom: "Farineur Bas 2", nomTechnique: "farineurBas2", ordre: 14, visible: true, lignesApplicables: ["*"] },
      { id: "farineurBas3", nom: "Farineur Bas 3", nomTechnique: "farineurBas3", ordre: 15, visible: true, lignesApplicables: ["*"] }
    ]
  },
  {
    id: "faconnage146",
    nom: "Façonnage 1-4-6",
    ordre: 3,
    lignesApplicables: ["1", "4", "6"],
    visible: true,
    champs: [
      { id: "queueDeCarpe", nom: "Queue de carpe", nomTechnique: "queueDeCarpe", ordre: 1, visible: true, lignesApplicables: ["1", "4", "6"] },
      { id: "numeroDecoupe", nom: "N° découpe", nomTechnique: "numeroDecoupe", ordre: 2, visible: true, lignesApplicables: ["1", "4", "6"] },
      { id: "buse", nom: "Buse", nomTechnique: "buse", ordre: 3, visible: true, lignesApplicables: ["1", "4", "6"] },
      { id: "distributeurChocoRaisin", nom: "Distributeur choco raisin", nomTechnique: "distributeurChocoRaisin", ordre: 4, visible: true, lignesApplicables: ["1", "4", "6"] },
      { id: "humidificateur146", nom: "Humidificateur", nomTechnique: "humidificateur146", ordre: 5, visible: true, lignesApplicables: ["1", "4", "6"] },
      { id: "vitesseDoreuse", nom: "Vitesse doreuse", nomTechnique: "vitesseDoreuse", ordre: 6, visible: true, lignesApplicables: ["1", "4", "6"] }
    ]
  },
  {
    id: "guillotine",
    nom: "Guillotine",
    ordre: 4,
    lignesApplicables: ["*"],
    visible: true,
    champs: [
      { id: "p1LongueurDecoupe", nom: "P1 ou longueur découpe", nomTechnique: "p1LongueurDecoupe", ordre: 1, visible: true, lignesApplicables: ["*"] },
      { id: "p2Centrage", nom: "P2 ou centrage", nomTechnique: "p2Centrage", ordre: 2, visible: true, lignesApplicables: ["*"] },
      { id: "bielle", nom: "Bielle", nomTechnique: "bielle", ordre: 3, visible: true, lignesApplicables: ["*"] },
      { id: "lameRacleur", nom: "Lame racleur", nomTechnique: "lameRacleur", ordre: 4, visible: true, lignesApplicables: ["*"] }
    ]
  },
  {
    id: "distributeurCreme",
    nom: "Distributeur crème",
    ordre: 5,
    lignesApplicables: ["*"],
    visible: true,
    champs: [
      { id: "rademaker", nom: "Rademaker", nomTechnique: "rademaker", ordre: 1, visible: true, lignesApplicables: ["*"] },
      { id: "aera", nom: "Aera", nomTechnique: "aera", ordre: 2, visible: true, lignesApplicables: ["*"] },
      { id: "fritch", nom: "Fritch", nomTechnique: "fritch", ordre: 3, visible: true, lignesApplicables: ["*"] }
    ]
  },
  {
    id: "faconnage25",
    nom: "Façonnage 2-5",
    ordre: 6,
    lignesApplicables: ["2", "5"],
    visible: true,
    champs: [
      { id: "retourneur", nom: "Retourneur", nomTechnique: "retourneur", ordre: 1, visible: true, lignesApplicables: ["2", "5"] },
      { id: "aligneur", nom: "Aligneur", nomTechnique: "aligneur", ordre: 2, visible: true, lignesApplicables: ["2", "5"] },
      { id: "humidificateur25", nom: "Humidificateur", nomTechnique: "humidificateur25", ordre: 3, visible: true, lignesApplicables: ["2", "5"] },
      { id: "pushPlaque", nom: "Push Plaque", nomTechnique: "pushPlaque", ordre: 4, visible: true, lignesApplicables: ["2", "5"] },
      { id: "rouleauInferieur", nom: "Rouleau inferieur", nomTechnique: "rouleauInferieur", ordre: 5, visible: true, lignesApplicables: ["2", "5"] },
      { id: "rouleauSuperieur", nom: "Rouleau supérieur", nomTechnique: "rouleauSuperieur", ordre: 6, visible: true, lignesApplicables: ["2", "5"] },
      { id: "tapisFaconneuse", nom: "Tapis façonneuse", nomTechnique: "tapisFaconneuse", ordre: 7, visible: true, lignesApplicables: ["2", "5"] },
      { id: "reperePoignee", nom: "Repère poignée", nomTechnique: "reperePoignee", ordre: 8, visible: true, lignesApplicables: ["2", "5"] }
    ]
  },
  {
    id: "finDeLigne",
    nom: "Fin de ligne",
    ordre: 7,
    lignesApplicables: ["*"],
    visible: true,
    champs: [
      { id: "rouleauPression", nom: "Rouleau pression", nomTechnique: "rouleauPression", ordre: 1, visible: true, lignesApplicables: ["*"] },
      { id: "tapisAvantEtuveSurgel", nom: "Tapis avant Etuve Surgel", nomTechnique: "tapisAvantEtuveSurgel", ordre: 2, visible: true, lignesApplicables: ["*"] },
      { id: "etuveSurgel", nom: "Etuve Surgel", nomTechnique: "etuveSurgel", ordre: 3, visible: true, lignesApplicables: ["*"] }
    ]
  },
  {
    id: "cadencePersonnel",
    nom: "Cadence, Personnel",
    ordre: 8,
    lignesApplicables: ["*"],
    visible: true,
    champs: [
      { id: "cadence", nom: "Cadence", nomTechnique: "cadence", ordre: 1, visible: true, lignesApplicables: ["*"] },
      { id: "lamineur", nom: "Lamineur", nomTechnique: "lamineur", ordre: 2, visible: true, lignesApplicables: ["*"] },
      { id: "surveillant", nom: "Surveillant", nomTechnique: "surveillant", ordre: 3, visible: true, lignesApplicables: ["*"] },
      { id: "distributeurRaisinChoco", nom: "Distributeur raisin choco", nomTechnique: "distributeurRaisinChoco", ordre: 4, visible: true, lignesApplicables: ["*"] },
      { id: "pose", nom: "Pose", nomTechnique: "pose", ordre: 5, visible: true, lignesApplicables: ["*"] },
      { id: "pliageTriage", nom: "Pliage / Triage", nomTechnique: "pliageTriage", ordre: 6, visible: true, lignesApplicables: ["*"] },
      { id: "topping", nom: "Topping", nomTechnique: "topping", ordre: 7, visible: true, lignesApplicables: ["*"] },
      { id: "sortieEtuve", nom: "Sortie Etuve", nomTechnique: "sortieEtuve", ordre: 8, visible: true, lignesApplicables: ["*"] },
      { id: "ouvertureMP", nom: "Ouverture MP", nomTechnique: "ouvertureMP", ordre: 9, visible: true, lignesApplicables: ["*"] },
      { id: "commentaire", nom: "Commentaire", nomTechnique: "commentaire", ordre: 10, visible: true, lignesApplicables: ["*"] }
    ]
  }
];
