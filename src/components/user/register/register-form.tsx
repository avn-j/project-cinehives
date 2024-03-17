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
import { registerFormSchema } from "@/schemas/schemas";
import { Separator } from "@/components/ui/separator";
import { register } from "./actions";
import { useState } from "react";
import VerifyEmail from "./verify-email";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [email, setEmail] = useState("");

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof registerFormSchema>) {
    setLoading(true);

    const error = await register(values);

    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    setEmail(values.email);
    setSuccessful(true);
  }

  if (successful) {
    return <VerifyEmail email={email} />;
  } else {
    return (
      <>
        <Separator className="mb-10 bg-stone-500" />
        <h2 className="mb-6 text-4xl font-bold">Register</h2>
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
                        type="password"
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
              name="confirmPassword"
              render={({ field }) => {
                return (
                  <FormItem className="mt-8">
                    <FormLabel className="text-base">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
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
              type="submit"
              disabled={loading}
              className=" mt-8 w-full py-6 text-base text-black"
            >
              Register
            </Button>
          </form>
        </Form>
      </>
    );
  }
}
