import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface Props {
  metadata?: PaginationMetadata;
  onPageChange: (newPage: number | ((prev: number) => number)) => void;
  isFetching?: boolean;
  unit?: string;
}

const TablePagination = ({
  metadata,
  onPageChange,
  isFetching,
  unit = "items",
}: Props) => {
  if (!metadata || metadata.total === 0) return null;

  const start = (metadata.page - 1) * metadata.limit + 1;
  const end = Math.min(metadata.page * metadata.limit, metadata.total);

  return (
    <div className="border-border flex items-center justify-between border-t p-4">
      {/* <div className="hidden sm:block">
        <p className="text-muted-foreground text-sm">
          Showing{" "}
          <span className="text-foreground font-medium">{metadata?.page}</span>{" "}
          of{" "}
          <span className="text-foreground font-medium">{metadata?.total}</span>{" "}
          {unit}
        </p>
      </div> */}

      <div className="hidden sm:block">
        <p className="text-muted-foreground text-sm">
          Showing <span className="text-foreground font-medium">{start}</span>{" "}
          to <span className="text-foreground font-medium">{end}</span> of{" "}
          <span className="text-foreground font-medium">{metadata.total}</span>{" "}
          {unit}
        </p>
      </div>

      {/* Mobile view */}
      <div className="block sm:hidden">
        <p className="text-muted-foreground text-sm">
          Page {metadata?.page} of {metadata?.pages}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!metadata.hasPrevPage || isFetching}
          onClick={() => onPageChange((p) => p - 1)}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!metadata.hasNextPage || isFetching}
          onClick={() => onPageChange((p) => p + 1)}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
