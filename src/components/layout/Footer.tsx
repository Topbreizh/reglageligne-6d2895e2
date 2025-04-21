
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-noir-800 text-white p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {currentYear} Réglage ligne discontinue - Tous droits réservés
        </p>
      </div>
    </footer>
  );
};

export default Footer;
