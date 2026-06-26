import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";

interface TicketImagePreviewProps {
  alt?: string;
  src: string;
}

export function TicketImagePreview({
  alt = "attachment",
  src,
}: TicketImagePreviewProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="block cursor-zoom-in overflow-hidden rounded-md border bg-background p-0 transition-opacity hover:opacity-90 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2"
          type="button"
        >
          <img
            alt={alt}
            className="max-h-[300px] max-w-[300px] object-contain"
            src={src}
          />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] max-w-[92vw] overflow-hidden p-3 sm:max-w-[92vw]">
        <DialogTitle className="sr-only">Image preview</DialogTitle>
        <div className="flex max-h-[calc(92vh-1.5rem)] items-center justify-center">
          <img
            alt={alt}
            className="max-h-[calc(92vh-1.5rem)] max-w-[calc(92vw-1.5rem)] object-contain"
            src={src}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
