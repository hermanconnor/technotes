import { Link } from "react-router";
import { Wrench } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-border mt-auto border-t py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <div className="flex items-center gap-2">
          <Wrench className="text-primary size-5" />
          <span className="text-foreground font-semibold">TechFix Pro</span>
        </div>
        <p className="text-muted-foreground text-sm">
          © {currentYear} TechFix Pro. All rights reserved.
        </p>
        <Link to="/login" className="text-primary text-sm hover:underline">
          Employee Login
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
