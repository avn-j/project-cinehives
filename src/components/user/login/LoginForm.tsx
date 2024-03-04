"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginFormSchema } from "@/schemas/schemas";
import { login } from "./actions";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof loginFormSchema>) {
    setLoading(true);
    const error = await login(values);
    setLoading(false);

    if (error) setError(error);
  }
  return (
    <>
      <Separator className="mb-10 bg-stone-500" />
      <h2 className="mb-6 text-4xl font-bold">Sign In</h2>
      <div className="mb-5 text-lg text-red-500">{error}</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="text-base">Email address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="off"
                      type="email"
                      className="focus:ring-primary border-stone-600 bg-stone-900 py-6 text-lg text-white focus:ring-1"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem className="mt-8">
                  <FormLabel className="text-base">Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="off"
                      type="password"
                      className="focus:ring-primary border-stone-600 bg-stone-900 py-6 text-lg text-white focus:ring-1"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              );
            }}
          />
          <Button
            disabled={loading}
            type="submit"
            className=" mt-8 w-full py-6 text-lg text-black"
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </Form>
      <Button variant="link" className="mb-4 px-0 text-base">
        Forgot your password?
      </Button>
    </>
  );
}
