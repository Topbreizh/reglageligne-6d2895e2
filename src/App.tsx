
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import RecherchePage from "./pages/RecherchePage";
import NouveauProduitPage from "./pages/NouveauProduitPage";
import FicheProduitPage from "./pages/FicheProduitPage";
import ModifierProduitPage from "./pages/ModifierProduitPage";
import ImportPage from "./pages/ImportPage";
import GestionBlocsPage from "./pages/GestionBlocsPage";
import NotFound from "./pages/NotFound";
import CalculMatieresPage from "./pages/CalculMatieresPage";
import RelevesPage from "./pages/RelevesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/recherche" element={<RecherchePage />} />
          <Route path="/nouveau-produit" element={<NouveauProduitPage />} />
          <Route path="/fiche/:id" element={<FicheProduitPage />} />
          <Route path="/modifier/:id" element={<ModifierProduitPage />} />
          <Route path="/releves" element={<RelevesPage />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/gestion-blocs" element={<GestionBlocsPage />} />
          <Route path="/calcul-matieres" element={<CalculMatieresPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
