
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

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
import LoginPage from "./pages/LoginPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/recherche" element={<RecherchePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/fiche/:id" element={<FicheProduitPage />} />
            
            {/* Protected Routes */}
            <Route path="/nouveau-produit" element={
              <ProtectedRoute>
                <NouveauProduitPage />
              </ProtectedRoute>
            } />
            <Route path="/modifier/:id" element={
              <ProtectedRoute>
                <ModifierProduitPage />
              </ProtectedRoute>
            } />
            <Route path="/releves" element={
              <ProtectedRoute>
                <RelevesPage />
              </ProtectedRoute>
            } />
            <Route path="/import" element={
              <ProtectedRoute>
                <ImportPage />
              </ProtectedRoute>
            } />
            <Route path="/gestion-blocs" element={
              <ProtectedRoute>
                <GestionBlocsPage />
              </ProtectedRoute>
            } />
            <Route path="/calcul-matieres" element={
              <ProtectedRoute>
                <CalculMatieresPage />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
