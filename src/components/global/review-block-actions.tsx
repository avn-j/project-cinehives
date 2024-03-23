"use client";

import { FaEllipsis } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FaEdit, FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";
import { Media, MediaReview } from "@prisma/client";
import {
  createNewMediaReview,
  deleteReview,
  updateMediaReview,
} from "@/lib/db-actions";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { StarRating } from "./buttons/review-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { reviewSchema } from "@/schemas/schemas";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";

interface ReviewBlockActionsProps {
  media: Media;
  review: MediaReview;
}

export default function ReviewBlockActions({
  media,
  review,
}: ReviewBlockActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [liked, setLiked] = useState(review.liked);
  const [rating, setRating] = useState(review.rating);
  const [loading, setLoading] = useState(false);

  const oldRating = review.rating ? review.rating : null;
  const oldLiked = review.liked || false;

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      review: "",
      rewatched: false,
      spoilers: false,
    },
  });

  useEffect(() => {
    form.setValue("rewatched", review.rewatched);
  }, [form, review.rewatched]);

  useEffect(() => {
    form.setValue("spoilers", review.spoiler);
  }, [form, review.spoiler]);

  useEffect(() => {
    form.setValue("review", review.review);
  }, [form, review.review]);

  async function handleSubmit(values: z.infer<typeof reviewSchema>) {
    setLoading(true);

    const response = await updateMediaReview(
      values,
      media,
      oldRating,
      rating,
      oldLiked,
      liked,
      review.activityId,
    );

    setLoading(false);

    if (response) {
      setIsEditDialogOpen(false);
      toast.success("Your review has been been updated.");
    } else {
      toast.error("Your review could not be updated. Please try again.");
    }
  }

  function handleLikeToggle() {
    setLiked(!liked);
  }

  function handleRating(rating: number) {
    setRating(rating);
  }

  async function handleDelete() {
    const result = await deleteReview(review.activityId);
    if (!result) toast.error("Failed to delete review.");
    toast.success("Your review has been successfully deleted.");
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <FaEllipsis className="-mt-4 justify-end" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black" align="end" sideOffset={-20}>
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <FaEdit className="mr-2" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
            <FaTrash className="mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-black">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your review?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-400"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {media && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-black sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editing Review for {media?.title}</DialogTitle>
            </DialogHeader>
            <div className="mt-4 grid grid-cols-3">
              <Image
                src={media.posterPath}
                alt={media.title}
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
                      initialRating={review?.rating || -1}
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
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="mt-8"
                  >
                    <FormField
                      control={form.control}
                      name="review"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel className="text-base">Review</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="max-h-[300px] border-stone-600 bg-black focus-visible:ring-0 focus-visible:ring-offset-0"
                                placeholder="Write your review..."
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
                                Watched this film before
                              </FormLabel>
                            </div>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        );
                      }}
                    />

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          type="button"
                          className="bg-secondary mt-6 text-stone-950"
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
                        Edit review
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
