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
import { SETUP_FORMS_TYPES } from "../setup-form-container";

export default function SetupForm({
  handleFormChange,
}: {
  handleFormChange: Function;
}) {
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
    handleFormChange(SETUP_FORMS_TYPES.movies);
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
    <div className="mt-14 w-full">
      <h2 className="text-3xl font-bold">Account Setup</h2>
      <p className="mt-4 text-xl">
        To get started with Wideshot, you will need to set up your account
        first.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex gap-28">
            <div className="w-1/2">
              <div className="my-8 flex items-center gap-8">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => {
                    return (
                      <FormItem className="w-1/2">
                        <FormLabel className="text-lg">First name</FormLabel>
                        <FormMessage className="text-red-500" />
                        <FormControl>
                          <Input
                            {...field}
                            className="focus:ring-primary border-stone-600 bg-stone-900 py-6 text-lg text-white focus:ring-1"
                          />
                        </FormControl>
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
                        <FormLabel className="text-lg">Last name</FormLabel>
                        <FormMessage className="text-red-500" />
                        <FormControl>
                          <Input
                            {...field}
                            className="focus:ring-primary border-stone-600 bg-stone-900 py-6 text-lg text-white focus:ring-1"
                          />
                        </FormControl>
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
                      <FormLabel className="text-lg">Username</FormLabel>

                      <FormDescription className="text-gray-200">
                        This will be displayed on your profile and reviews.
                      </FormDescription>
                      <FormMessage className="text-red-500">
                        {usernameError}
                      </FormMessage>
                      <FormControl>
                        <Input
                          {...field}
                          className="focus:ring-primary border-stone-600 bg-stone-900 py-6 text-lg text-white focus:ring-1"
                        />
                      </FormControl>
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
                      <FormLabel className="text-lg">Date of Birth</FormLabel>
                      <FormMessage className="text-red-500" />
                      <FormControl>
                        {/* @ts-ignore */}
                        <Input
                          {...field}
                          type="date"
                          className="focus:ring-primary border-stone-600 bg-stone-900 text-lg text-white focus:ring-1"
                        />
                      </FormControl>
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
                      <FormLabel className="text-lg">Country</FormLabel>
                      <FormMessage className="text-red-500" />
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
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex w-1/2 flex-col justify-between">
              <div className="flex flex-col items-center">
                <h2 className="mt-6 text-lg text-white">Profile Picture</h2>
                <p className="mt-2 text-sm">
                  Please upload a .png, .jpeg or .jpg file only. Maximum file
                  size is 5MB.
                </p>
                <div className="relative mb-4 mr-2 mt-8 h-48 w-48 rounded-full bg-stone-700">
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
                <FormField
                  control={form.control}
                  name="profilePicture"
                  render={() => {
                    return (
                      <FormItem>
                        <FormLabel
                          htmlFor="profilePicture"
                          className="focus:ring-primary flex cursor-pointer items-center justify-center rounded border border-stone-600 bg-stone-900 p-2 text-xs transition duration-100 hover:bg-stone-700 focus:outline-none focus:ring-1"
                          tabIndex={0}
                          onKeyDown={handlePressEnter}
                        >
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
              </div>
              <Button
                type="submit"
                className="mt-12 px-16 py-6 text-lg text-black"
                disabled={loading}
              >
                {loading ? "Creating your profile..." : "Continue"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
