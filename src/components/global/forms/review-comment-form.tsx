"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { createNewReviewComment } from "@/lib/db-actions";
import { commentSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ReviewCommentFormProps {
  parentReviewId: string;
}

export default function ReviewCommentForm({
  parentReviewId,
}: ReviewCommentFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof commentSchema>) {
    setLoading(true);
    const response = await createNewReviewComment(values, parentReviewId);

    setLoading(false);
    if (!response) {
      toast.error("Could not add comment to review");
      return;
    }

    form.reset();
    toast.success("Your comment had been added.");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-8">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-base">Add a comment</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="max-h-[300px] border-stone-600 bg-black focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Write your comment..."
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            );
          }}
        />

        <Button
          type="submit"
          className="mt-6 text-stone-950"
          disabled={loading}
        >
          Add comment
        </Button>
      </form>
    </Form>
  );
}
