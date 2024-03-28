"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { search } from "./actions";
import { searchSchema } from "@/schemas/schemas";
import { useSearchParams } from "next/navigation";

export default function SearchBox() {
  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: "",
    },
  });

  const typeParam = useSearchParams().get("type");
  const pageParam = useSearchParams().get("page");

  async function onSubmit(data: z.infer<typeof searchSchema>) {
    await search(data, typeParam, pageParam);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="Search"
                  className="rounded-full px-4"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="hidden">
          Submit
        </Button>
      </form>
    </Form>
  );
}
