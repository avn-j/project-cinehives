"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCallback, useEffect, useState } from "react";
import {
  fetchMovieDetailsById,
  fetchTVDetailsById,
} from "@/lib/moviedb-actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import SearchCommand from "../ui/search-command";
import LogForm from "./log-form";
import { _buildAppDataForMedia } from "@/lib/media-data-builder";

const POPOVER_WIDTH = "w-[600px]";

interface LogDialogProps {
  children: React.ReactNode;
}

export default function LogDialog({ children }: LogDialogProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{
    mediaId: number;
    mediaType: string;
  } | null>(null);
  const [media, setMedia] = useState<any | null>(null);
  const [mediaData, setMediaData] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!selected) return;

    if (selected.mediaType === "movie") {
      fetchMovieDetailsById(selected.mediaId.toString()).then((result) => {
        setMedia(result);
        _buildAppDataForMedia(result).then((data) => setMediaData(data));
      });
    }

    if (selected.mediaType === "tv") {
      fetchTVDetailsById(selected.mediaId.toString()).then((result) => {
        setMedia(result);
        _buildAppDataForMedia(result).then((data) => setMediaData(data));
      });
    }
  }, [selected]);

  const handleSetActive = useCallback((mediaId: number, mediaType: string) => {
    setSelected({ mediaId: mediaId, mediaType: mediaType });
    setOpen(false);
  }, []);

  function handleOpenChanged(open: boolean) {
    if (!open) {
      setDialogOpen(false);
      setSelected(null);
      setMedia(null);
      setMediaData(null);
      return;
    }
    setDialogOpen(open);
  }

  return (
    <Dialog onOpenChange={handleOpenChanged} open={dialogOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="bg-black sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add to your diary</DialogTitle>
          <DialogDescription>
            Add a film, TV show or anime to your diary.
          </DialogDescription>
        </DialogHeader>
        {selected && media && mediaData && (
          <LogForm
            media={media}
            setOpen={setDialogOpen}
            mediaData={mediaData}
          />
        )}
        {!selected && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox">
                Search
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              side="bottom"
              className={cn("bg-black p-0", POPOVER_WIDTH)}
            >
              <SearchCommand onSelectResult={handleSetActive} />
            </PopoverContent>
          </Popover>
        )}
      </DialogContent>
    </Dialog>
  );
}
