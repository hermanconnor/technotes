import { AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({
  title = "Unable to load data",
  message = "There was a problem fetching the latest information. Please check your connection and try again.",
  onRetry,
}: Props) => {
  return (
    <div className="mb-8">
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center gap-4 py-6 text-center sm:flex-row sm:text-left">
            <div className="bg-destructive/10 flex size-14 shrink-0 items-center justify-center rounded-full">
              <AlertCircle className="text-destructive size-7" />
            </div>
            <div className="flex-1">
              <h3 className="text-foreground text-lg font-semibold">{title}</h3>
              <p className="text-muted-foreground mt-1 text-sm">{message}</p>
            </div>
            {onRetry && (
              <Button
                variant="outline"
                onClick={onRetry}
                className="shrink-0 gap-2"
              >
                <RefreshCw className="size-4" />
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorState;
