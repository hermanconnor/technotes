import { Link } from "react-router";
import { ArrowLeft, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <section className="flex flex-1 items-center justify-center px-4">
      <div className="max-w-md text-center">
        {/* 404 Display */}
        <div className="mb-8">
          <div className="bg-primary/10 mb-6 inline-flex size-24 items-center justify-center rounded-full">
            <Search className="text-primary size-12" />
          </div>
          <h1 className="text-foreground mb-2 text-8xl font-bold tracking-tighter">
            404
          </h1>
          <div className="bg-primary mx-auto h-1 w-16 rounded-full" />
        </div>

        {/* Message */}
        <h2 className="text-foreground mb-3 text-2xl font-semibold">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8 text-balance">
          Sorry, we couldn't find the page you're looking for. It may have been
          moved, deleted, or never existed.
        </p>

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/">
              <Home className="mr-2 size-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 size-4" />
              Go to Dashboard
            </Link>
          </Button>
        </div>

        {/* Help text */}
        <p className="text-muted-foreground mt-8 text-sm">
          Need help?{" "}
          <Link to="/" className="text-primary hover:underline">
            Contact support
          </Link>
        </p>
      </div>
    </section>
  );
};

export default NotFound;
