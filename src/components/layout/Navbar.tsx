
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion."
      });
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-noir-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="font-bold text-xl">
            <span className="text-noir-800">Réglage</span> <span className="text-jaune-300">ligne discontinue</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-noir-600 hidden md:inline">
                  {currentUser.email}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Déconnexion</span>
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-jaune-500 hover:text-jaune-600"
                >
                  Connexion
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
