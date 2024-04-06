"use client";
import { StarRating } from "./buttons/review-dialog";
import Image from "next/image";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { MOVIE_DB_IMG_PATH_PREFIX } from "@/lib/consts";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loggedSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { MediaDatabase, createNewDiaryEntry } from "@/lib/db-actions";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MediaDataWithUserActivity } from "@/lib/types";

interface LogFormProps {
  media: any;
  clearDialog: Function;
  mediaData: MediaDataWithUserActivity;
}

export default function LogForm({ media, clearDialog, mediaData }: LogFormProps) {
  const [liked, setLiked] = useState(mediaData.userActivity.includes("like"));
  const [rating, setRating] = useState<number>(-1);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof loggedSchema>>({
    resolver: zodResolver(loggedSchema),
    defaultValues: {
      review: "",
      rewatched: false,
      spoilers: false,
      logDate: new Date(),
      season: media.id.toString(),
    },
  });

  useEffect(() => {
    form.setValue("rewatched", mediaData.userActivity.includes("watched"));
  }, [mediaData, form]);

  async function handleSubmit(values: z.infer<typeof loggedSchema>) {
    setLoading(true);

    const seasonNumber = values.season ? parseInt(values.season) : null;
    const isSeason = seasonNumber !== mediaData.apiId;

    const dbMedia: MediaDatabase = {
      apiId: mediaData.apiId,
      posterPath: mediaData.posterPath,
      mediaType: mediaData.mediaType,
      title: mediaData.title,
    }

    let response = false;

    if (isSeason && seasonNumber) {
      const seasonId = media.seasons[seasonNumber].id;
      const seasonPosterPath = MOVIE_DB_IMG_PATH_PREFIX + media.seasons[seasonNumber].poster_path;
      const seasonTitle = media.seasons[seasonNumber].name;

      const dbMediaSeason: MediaDatabase = {
        title: mediaData.title + " " + seasonTitle,
        posterPath: seasonPosterPath,
        apiSeasonId: seasonId,
        apiId: mediaData.apiId,
        mediaType: mediaData.mediaType,
        season: seasonNumber,
      }

      response = await createNewDiaryEntry(
        values,
        dbMediaSeason,
        rating,
        liked,
      );
    } else {
      response = await createNewDiaryEntry(values, dbMedia, rating, liked);
    }

    setLoading(false);

    if (response) {
      toast.success("Diary entry has been added.");
    } else {
      toast.error("Diary entry could not be added.");
    }

    clearDialog();
  }

  function handleLikeToggle() {
    setLiked(!liked);
  }

  function handleRating(rating: number) {
    setRating(rating);
  }

  return (
    <div className="mt-4 grid grid-cols-3 gap-8">
      <Image
        src={MOVIE_DB_IMG_PATH_PREFIX + media.poster_path}
        alt={media.title || media.name}
        width={150}
        height={150}
        className="col-span-1"
      />
      <div className="col-span-2">
        <div className="flex w-2/3 items-start justify-between">
          <div>
            <p className="mb-1">Rating</p>
            <StarRating
              handleRating={handleRating}
              initialRating={mediaData.rating}
            />
          </div>
          <div className="flex flex-col items-center">
            <p className="mb-1">Like</p>
            <button onClick={handleLikeToggle}>
              {liked ? (
                <FaHeart size={25} className="text-red-500" />
              ) : (
                <FaRegHeart size={25} className="text-stone-600" />
              )}
            </button>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-8">
            {media.seasons && (
              <FormField
                control={form.control}
                name="season"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adding an entry for</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            className="text-white"
                            placeholder="Select a verified email to display"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black">
                        {media.seasons.length > 0 && (
                          <SelectItem value={media.id.toString()}>
                            Entire show
                          </SelectItem>
                        )}

                        {media.seasons.length > 1 &&
                          media.seasons.map((season: any, index: number) => {
                            if (!season.air_date) return;
                            return (
                              <SelectItem
                                key={season.id}
                                value={index.toString()}
                              >
                                {season.name}
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="logDate"
              render={({ field }) => (
                <FormItem className="mt-4 flex flex-col">
                  <FormLabel>Watched on</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto bg-black p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        selected={field.value}
                        onSelect={field.onChange}
                        fromYear={1960}
                        toYear={2030}
                        disabled={(date) => date > new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="review"
              render={({ field }) => {
                return (
                  <FormItem className="mt-4">
                    <FormLabel className="text-base">Review</FormLabel>
                    <FormControl>
                      <Textarea
                        className="max-h-[300px] border-stone-600 bg-black focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Write your review... (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="spoilers"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div className="mt-4 flex items-center gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="bg-stone-700"
                        />
                      </FormControl>
                      <FormLabel className="text-sm">
                        Contains spoilers
                      </FormLabel>
                    </div>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="rewatched"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div className="mt-4 flex items-center gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="bg-stone-700"
                        />
                      </FormControl>
                      <FormLabel className="text-sm">
                        Watched this before
                      </FormLabel>
                    </div>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                );
              }}
            />

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button
                  type="button"
                  className="mt-6 bg-secondary text-stone-950"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="mt-6 text-stone-950"
                disabled={loading}
              >
                Add to diary
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </div>
    </div>
  );
}
