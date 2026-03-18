import { Link } from "react-router";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroBg from "@/assets/images/hero-bg.webp";

const Hero = () => {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src={HeroBg}
        alt="Hero background image"
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      />
      {/* Dark Overlay */}
      <div className="bg-background/85 absolute inset-0" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 container px-4 py-12">
        <header className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="text-primary h-8 w-8" />
            <span className="text-foreground text-2xl font-bold">
              TechFix Pro
            </span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              to="#services"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Services
            </Link>
            <Link
              to="#about"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              to="#contact"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>

          <Button variant="outline" size="sm" asChild>
            <Link to="/login"> Employee Login</Link>
          </Button>
        </header>

        <div className="max-w-2xl">
          <h1 className="text-foreground mb-6 text-4xl leading-tight font-bold text-balance md:text-5xl lg:text-6xl">
            Expert Electronics Repair You Can Trust
          </h1>
          <p className="text-muted-foreground mb-8 max-w-lg text-lg">
            From cracked screens to water damage, our certified technicians
            bring your devices back to life. Fast turnaround, fair prices,
            quality parts.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="cursor-pointer py-5 font-semibold">
              Get a Free Quote
            </Button>
            <Button size="lg" variant="outline" className="cursor-pointer py-5">
              View Our Services
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
