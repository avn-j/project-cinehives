"use client";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setupFormSchemaClient } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaUpload } from "react-icons/fa6";
import Image from "next/image";
import defaultPicture from "../../../../../public/profile.jpeg";
import { COUNTRIES_LIST } from "@/lib/countries";
import {
  SelectItem,
  SelectTrigger,
  Select,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { checkUsernameValidity, updateProfile } from "./actions";

export default function SetupForm() {
  const [pictureSelected, setPictureSelected] = useState(false);
  const [picturePreview, setPicturePreview] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const form = useForm<z.infer<typeof setupFormSchemaClient>>({
    resolver: zodResolver(setupFormSchemaClient),
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      profilePicture: undefined,
      // @ts-ignore
      dateOfBirth: "",
      country: "",
    },
  });

  const fileRef = form.register("profilePicture", { required: true });

  async function handleSubmit(values: z.infer<typeof setupFormSchemaClient>) {
    setLoading(true);
    setUsernameError("");

    const {
      firstName,
      lastName,
      userName,
      dateOfBirth,
      profilePicture,
      country,
    } = values;
    const formData = new FormData();

    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("userName", userName);
    formData.append("dateOfBirth", dateOfBirth.toJSON());
    formData.append("profilePicture", profilePicture[0]);
    formData.append("country", country);

    const validUsername = await checkUsernameValidity(userName);
    if (!validUsername) {
      setUsernameError(`${userName} is already taken.`);
      setLoading(false);
      return;
    }

    await updateProfile(formData);

    setLoading(false);
  }

  function handlePressEnter(e: React.KeyboardEvent<HTMLLabelElement>) {
    if (e.key == "Enter") {
      e.target.dispatchEvent(new Event("click"));
    }
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPictureSelected(true);
      setPicturePreview(file);
    }
    return;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="my-8 flex items-center gap-8">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => {
              return (
                <FormItem className="w-1/2">
                  <FormLabel className="text-base">First name</FormLabel>
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
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => {
              return (
                <FormItem className="w-1/2">
                  <FormLabel className="text-base">Last name</FormLabel>
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
        </div>
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-base">Username</FormLabel>
                <FormDescription className="text-gray-200">
                  This will be displayed on your profile and reviews.
                </FormDescription>
                <FormControl>
                  <Input
                    {...field}
                    className="focus:ring-primary border-stone-600 bg-stone-900 py-6 text-lg text-white focus:ring-1"
                  />
                </FormControl>

                <FormMessage className="text-red-500">
                  {usernameError}
                </FormMessage>
              </FormItem>
            );
          }}
        />
        <h2 className="mb-2 mt-8 text-base text-white">Profile Picture</h2>
        <FormField
          control={form.control}
          name="profilePicture"
          render={() => {
            return (
              <FormItem className="">
                <FormDescription>
                  Please upload a .png, .jpeg or .jpg file only. Maximum file
                  size is 5MB.
                </FormDescription>
                <FormLabel
                  htmlFor="profilePicture"
                  className="focus:ring-primary flex w-1/2 cursor-pointer items-center rounded border border-white bg-stone-900 p-2 text-xs focus:outline-none focus:ring-1"
                  tabIndex={0}
                  onKeyDown={handlePressEnter}
                >
                  <div className="relative mr-4 h-16 w-16 rounded-full bg-stone-700">
                    {picturePreview && pictureSelected && (
                      <Image
                        src={
                          picturePreview
                            ? URL.createObjectURL(picturePreview)
                            : defaultPicture.src
                        }
                        alt="Preview"
                        fill={true}
                        objectFit="cover"
                        className="border-primary rounded-full border-2"
                      />
                    )}
                  </div>

                  <FaUpload className="mr-2 text-white" />
                  {!pictureSelected
                    ? "Upload a profile picture"
                    : "Change profile picture"}
                </FormLabel>

                <FormControl>
                  <Input
                    {...fileRef}
                    id="profilePicture"
                    type="file"
                    onChangeCapture={handleImageChange}
                    accept="image/png, image/jpg"
                    className="hidden"
                  />
                </FormControl>

                <FormMessage className="text-red-500" />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => {
            return (
              <FormItem className="mt-8">
                <FormLabel className="text-base">Date of Birth</FormLabel>
                <FormControl>
                  {/* @ts-ignore */}
                  <Input
                    {...field}
                    type="date"
                    className="focus:ring-primary border-stone-600 bg-stone-900 text-lg text-white focus:ring-1"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => {
            return (
              <FormItem className="mt-8">
                <FormLabel className="text-base">Country</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="focus:ring-primary border-stone-600 bg-stone-900 py-6 text-lg text-white focus:ring-1 focus:ring-offset-0">
                      <SelectValue
                        placeholder="Select your country"
                        tabIndex={0}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-black">
                    {COUNTRIES_LIST.map((country, index) => (
                      <SelectItem key={index} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500" />
              </FormItem>
            );
          }}
        />

        <Button
          type="submit"
          className=" mt-8 w-full py-6 text-lg text-black"
          disabled={loading}
        >
          {loading ? "Creating your profile..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
}
