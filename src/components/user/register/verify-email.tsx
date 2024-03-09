"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { verifyFormSchema } from "@/schemas/schemas";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { verify } from "./actions";

interface Props {
  email: string;
}

export default function VerifyEmail({ email }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof verifyFormSchema>>({
    resolver: zodResolver(verifyFormSchema),
    defaultValues: {
      code: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof verifyFormSchema>) {
    setLoading(true);
    const error = await verify(values, email);
    setLoading(false);
    if (error) setError(error);
  }
  return (
    <div>
      <Separator className="mb-6 mt-2 bg-stone-500" />
      <h2 className="text-2xl font-bold">Registration successful</h2>
      <p className="my-6">
        Please verify your account by inputting the verification code provided
        in the verification email sent to: <b>{email}</b>
      </p>
      <div className="my-5 text-lg text-red-500">{error}</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="text-base">Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="focus:ring-primary border-stone-600 bg-stone-900 py-6 text-lg text-white focus:ring-1"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              );
            }}
          />
          <Button
            type="submit"
            disabled={loading}
            className=" mt-8 w-full py-6 text-lg text-black"
          >
            {!loading ? "Verify account" : "Verifying"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
