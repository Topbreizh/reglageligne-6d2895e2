
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, Settings, FileText, Plus, Import, Calendar } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { name: "Accueil", path: "/", icon: <Calendar className="h-5 w-5" /> },
    { name: "Recherche", path: "/recherche", icon: <Search className="h-5 w-5" /> },
    { name: "Nouveau Produit", path: "/nouveau-produit", icon: <Plus className="h-5 w-5" /> },
    { name: "Import Excel", path: "/import", icon: <Import className="h-5 w-5" /> },
    { name: "Relevés", path: "/releves", icon: <FileText className="h-5 w-5" /> },
    { name: "Gestion Blocs", path: "/gestion-blocs", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <nav className="bg-noir-800 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-jaune-300 font-bold text-xl">Réglage ligne discontinue</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-300 hover:text-jaune-300 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-jaune-300 hover:bg-noir-700">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-noir-800 text-white">
                <div className="flex flex-col space-y-4 mt-6">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="text-gray-300 hover:text-jaune-300 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
