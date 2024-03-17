"use client";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { genreItems, mediaItems } from "@/lib/consts";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { SETUP_FORMS_TYPES } from "../setup-form-container";

interface MediaPreferencesFormProps {
  handleFormChange: Function;
}

export default function MediaPreferencesForm({
  handleFormChange,
}: MediaPreferencesFormProps) {
  const [mediaValues, setMediaValues] = useState<string[]>([]);
  const [genreValues, setGenreValues] = useState<string[]>([]);
  const [showGenres, setShowGenres] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const [genreError, setGenreError] = useState("");

  function handleContinue() {
    setMediaError("");
    setGenreError("");

    if (mediaValues.length < 1) {
      setMediaError("Please select at least one");
      return;
    }

    if (showGenres && genreValues.length < 3) {
      setGenreError("Please select at least three");
      return;
    }

    if (!showGenres) {
      setShowGenres(true);
      return;
    }
    handleFormChange(SETUP_FORMS_TYPES.movies);
  }

  return (
    <div className="mt-12 flex gap-36">
      <div className="w-1/2">
        <h2 className="mb-6 text-2xl">Select your media preferences</h2>

        <ToggleGroup
          type="multiple"
          onValueChange={(value) => {
            if (value) setMediaValues(value);
            console.log(value);
          }}
          className="grid grid-cols-3 gap-8"
          disabled={showGenres}
        >
          {mediaItems.map((item) => (
            <ToggleGroupItem
              key={item.id}
              value={item.id}
              className="data-state[on]:bg-primary rounded-3xl border border-white py-6 text-lg"
            >
              {item.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {mediaError && <p className="mt-4 text-red-500">{mediaError}</p>}
        {showGenres && (
          <>
            <h2 className="mb-6 mt-12 text-2xl">
              Select your genre preferences
            </h2>
            <ToggleGroup
              type="multiple"
              onValueChange={(value) => {
                if (value) setGenreValues(value);
                console.log(value);
              }}
              className="grid grid-cols-2 justify-start gap-8"
            >
              {genreItems.map((item) => (
                <ToggleGroupItem
                  key={item.id}
                  value={item.id}
                  className="data-state[on]:bg-primary rounded-3xl border border-white py-6 text-lg"
                >
                  {item.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {genreError && <p className="mt-4 text-red-500">{genreError}</p>}
          </>
        )}
      </div>
      <div className="flex w-1/2 flex-col">
        <div className="">
          <div className="bg-accent mb-8 flex flex-col rounded-lg p-6">
            <div className="flex items-center gap-4">
              <FaCheckCircle size={25} />
              <h2 className="text-3xl font-bold">Account setup successful</h2>
            </div>

            <p className="mt-4 text-wrap text-lg">
              Your account has been successfully created.
            </p>
          </div>
          <h2 className="mt-8 text-3xl font-bold">{"Let's start!"}</h2>
          <p className="mt-4 text-lg">We'd love to know more about you.</p>
          <p className="mt-4 text-lg">
            What are your interests when it comes to media? Select your
            preferences.
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            className="mt-8 w-full text-base text-stone-950"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
