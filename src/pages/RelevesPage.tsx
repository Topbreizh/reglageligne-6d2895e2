
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input";
import { produitsInitiaux } from "@/data/mockData";
import { Produit } from "@/types";
import { Label } from "@/components/ui/label";

// Liste ordonnée des champs du type Produit à afficher dans les fiches
const produitChamps: { nom: string; key: keyof Produit }[] = [
  { nom: "Code article", key: "codeArticle" },
  { nom: "Numero ligne", key: "numeroLigne" },
  { nom: "Designation", key: "designation" },
  { nom: "Poids pate", key: "poidsPate" },
  { nom: "Poids article", key: "poidsArticle" },
  { nom: "Quantite pate", key: "quantitePate" },
  { nom: "Poid patequalistat", key: "poidPatequalistat" },
  { nom: "Poid fourragequalistat", key: "poidFourragequalistat" },
  { nom: "Poid marquantqualistat", key: "poidMarquantqualistat" },
  { nom: "Nbr de bandes", key: "nbrDeBandes" },
  { nom: "% Rognure", key: "rognure" },
  { nom: "Programme", key: "programme" },
  { nom: "Facteur", key: "facteur" },
  { nom: "Regle laminage", key: "regleLaminage" },
  { nom: "Quick", key: "quick" },
  { nom: "Calibreur 1", key: "calibreur1" },
  { nom: "Calibreur 2", key: "calibreur2" },
  { nom: "Calibreur 3", key: "calibreur3" },
  { nom: "Laminoir", key: "laminoir" },
  { nom: "Vitesse laminage", key: "vitesseLaminage" },
  { nom: "Farineur haut 1", key: "farineurHaut1" },
  { nom: "Farineur haut 2", key: "farineurHaut2" },
  { nom: "Farineur haut 3", key: "farineurHaut3" },
  { nom: "Farineur bas 1", key: "farineurBas1" },
  { nom: "Farineur bas 2", key: "farineurBas2" },
  { nom: "Farineur bas 3", key: "farineurBas3" },
  { nom: "Queue de carpe", key: "queueDeCarpe" },
  { nom: "Numero découpe", key: "numeroDecoupe" },
  { nom: "Buse", key: "buse" },
  { nom: "Distributeur choco raisin", key: "distributeurChocoRaisin" },
  { nom: "Humidificateur 1-4-6", key: "humidificateur146" },
  { nom: "Vitesse doreuse", key: "vitesseDoreuse" },
  { nom: "P1 longueur découpe", key: "p1LongueurDecoupe" },
  { nom: "P2 centrage", key: "p2Centrage" },
  { nom: "Bielle", key: "bielle" },
  { nom: "Lame racleur", key: "lameRacleur" },
  { nom: "Rademaker", key: "rademaker" },
  { nom: "Aera", key: "aera" },
  { nom: "Fritch", key: "fritch" },
  { nom: "Retourneur", key: "retourneur" },
  { nom: "Aligneur", key: "aligneur" },
  { nom: "Humidificateur 2-5", key: "humidificateur25" },
  { nom: "Push plaque", key: "pushPlaque" },
  { nom: "Rouleau inférieur", key: "rouleauInferieur" },
  { nom: "Rouleau supérieur", key: "rouleauSuperieur" },
  { nom: "Tapis faconneuse", key: "tapisFaconneuse" },
  { nom: "Repère poignée", key: "reperePoignee" },
  { nom: "Rouleau pression", key: "rouleauPression" },
  { nom: "Tapis avant étuve surg", key: "tapisAvantEtuveSurgel" },
  { nom: "Etuve/surgel", key: "etuveSurgel" },
  { nom: "Cadence", key: "cadence" },
  { nom: "Lamineur", key: "lamineur" },
  { nom: "Surveillant", key: "surveillant" },
  { nom: "Distributeur raisin choco", key: "distributeurRaisinChoco" },
  { nom: "Pose", key: "pose" },
  { nom: "Pliage triage", key: "pliageTriage" },
  { nom: "Topping", key: "topping" },
  { nom: "Sortie étuve", key: "sortieEtuve" },
  { nom: "Ouverture MP", key: "ouvertureMP" },
  { nom: "Commentaire", key: "commentaire" },
];

function ProduitFicheGrille({ produit }: { produit: Produit }) {
  return (
    <div className="rounded border border-indigo-300 shadow overflow-hidden w-[280px] bg-white flex flex-col">
      {/* En-tête jaune pâle */}
      <div className="bg-yellow-100 border-b border-indigo-200 px-4 py-2">
        <div className="font-bold text-lg text-neutral-800">
          Code article : <span className="text-indigo-500 font-mono underline">{produit.codeArticle}</span>
        </div>
        <div className="text-sm" style={{ color: "#8886d0" }}>
          Ligne : <span className="underline font-mono">{produit.numeroLigne}</span>
        </div>
      </div>
      {/* Champs produit en mode tableau bleu pâle */}
      <div className="flex-1 bg-blue-100/80 p-0">
        <table className="w-full text-sm border-separate" style={{ borderSpacing: 0 }}>
          <tbody>
            {produitChamps.map(({ nom, key }) => (
              <tr key={key} className="border-b border-blue-200 last:border-none">
                <td className="pl-3 py-0.5 text-right text-blue-900 font-medium whitespace-nowrap">{nom}</td>
                <td className="pl-2 py-0.5 pr-2 font-mono text-black whitespace-pre-wrap">{produit[key] ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function RelevesPage() {
  const [codeArticle, setCodeArticle] = useState("");
  const [numeroLigne, setNumeroLigne] = useState("");

  // Filtre produits
  const produitsFiltres = produitsInitiaux.filter((produit) => {
    const matchCode = codeArticle.length === 0 || (produit.codeArticle ?? "").toLowerCase().includes(codeArticle.toLowerCase());
    const matchLigne = numeroLigne.length === 0 || (produit.numeroLigne ?? "").toLowerCase().includes(numeroLigne.toLowerCase());
    return matchCode && matchLigne;
  });

  const produitsAffiches = produitsFiltres.slice(0, 5); // 5 max
  
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 flex gap-4 items-center">
          <span className="text-noir-800">Relevés produits</span>
          <span className="text-indigo-400 font-semibold">grille</span>
        </h1>
        {/* Barre de recherche */}
        <form className="bg-white rounded shadow p-4 mb-6 flex flex-wrap gap-4 border"
              onSubmit={e => e.preventDefault()}>
          <div className="w-full md:w-1/4 flex flex-col">
            <Label htmlFor="rech-codeArticle">Code article</Label>
            <Input
              id="rech-codeArticle"
              value={codeArticle}
              onChange={e => setCodeArticle(e.target.value)}
              placeholder="Entrer le code article"
              className="bg-blue-50"
              autoComplete="off"
            />
          </div>
          <div className="w-full md:w-1/4 flex flex-col">
            <Label htmlFor="rech-numeroLigne">Numéro ligne</Label>
            <Input
              id="rech-numeroLigne"
              value={numeroLigne}
              onChange={e => setNumeroLigne(e.target.value)}
              placeholder="Entrer le numéro de ligne"
              className="bg-blue-50"
              autoComplete="off"
            />
          </div>
        </form>

        {/* Grille : 1 ligne de 5 max. */}
        <div className="flex flex-wrap gap-6 justify-center">
          {produitsAffiches.length === 0 ? (
            <div className="w-full text-center py-8 text-[#888] text-lg">
              Aucun produit trouvé.
            </div>
          ) : (
            produitsAffiches.map((produit) => (
              <ProduitFicheGrille key={produit.id || Math.random()} produit={produit} />
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
}
