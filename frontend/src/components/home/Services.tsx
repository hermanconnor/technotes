import { Laptop, Smartphone, Tablet } from "lucide-react";
import ServiceCard from "./ServiceCard";

const Services = () => {
  return (
    <section id="services" className="bg-card py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-foreground mb-12 text-center text-3xl font-bold">
          What We Fix
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <ServiceCard
            icon={<Smartphone className="size-10" />}
            title="Smartphones"
            description="Screen replacements, battery swaps, charging port repairs, and more for all major brands."
          />
          <ServiceCard
            icon={<Laptop className="size-10" />}
            title="Laptops"
            description="Hardware upgrades, screen repairs, keyboard replacements, and data recovery services."
          />
          <ServiceCard
            icon={<Tablet className="size-10" />}
            title="Tablets"
            description="iPad and Android tablet repairs including screen, battery, and button fixes."
          />
        </div>
      </div>
    </section>
  );
};

export default Services;
