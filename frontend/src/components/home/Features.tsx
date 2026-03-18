import { Clock, Shield, Wrench } from "lucide-react";
import FeatureItem from "./FeatureItem";

const Features = () => {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-foreground mb-6 text-3xl font-bold">
              Why Choose TechFix Pro?
            </h2>
            <ul className="space-y-4">
              <FeatureItem
                icon={<Clock className="text-primary size-5" />}
                title="Same-Day Service"
                description="Most repairs completed within hours, not days."
              />
              <FeatureItem
                icon={<Shield className="text-primary size-5" />}
                title="90-Day Warranty"
                description="All repairs backed by our comprehensive warranty."
              />
              <FeatureItem
                icon={<Wrench className="text-primary size-5" />}
                title="Certified Technicians"
                description="Our team is trained and certified on all major devices."
              />
            </ul>
          </div>
          <div className="bg-card border-border rounded-lg border p-8">
            <h3 className="text-foreground mb-4 text-xl font-semibold">
              Visit Our Shop
            </h3>
            <address className="text-muted-foreground space-y-2 not-italic">
              <p className="text-foreground font-medium">TechFix Pro</p>
              <p>456 Michigan Avenue</p>
              <p>Chicago, IL 60611</p>
              <p className="pt-2">
                <a
                  href="tel:+13125551234"
                  className="text-primary hover:underline"
                >
                  (312) 555-1234
                </a>
              </p>
              <p>
                <a
                  href="mailto:repairs@techfixpro.com"
                  className="text-primary hover:underline"
                >
                  repairs@techfixpro.com
                </a>
              </p>
            </address>
            <div className="border-border mt-6 border-t pt-6">
              <p className="text-muted-foreground text-sm">
                <span className="text-foreground font-medium">Hours:</span>{" "}
                Mon-Fri 9am-7pm, Sat 10am-5pm
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
