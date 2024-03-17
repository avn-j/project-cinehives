"use client";

import { Media } from "@/lib/types";
import SetupForm from "./setup/setup-form";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import TVSetupCarousel from "./setup/tv-setup-carousel";
import MovieSetupCarousel from "./setup/movie-setup-carousel";
import MediaPreferencesForm from "./setup/media-preferences-form";

interface SetupFormContainerProps {
  movieCollection: Media[];
  tvShowCollection: Media[];
  user: User;
  profileStarted: boolean;
}

export enum SETUP_FORMS_TYPES {
  setup,
  preferences,
  movies,
  tvShows,
}

export default function SetupFormContainer({
  ...props
}: SetupFormContainerProps) {
  const [showForm, setShowForm] = useState(
    props.profileStarted
      ? SETUP_FORMS_TYPES.preferences
      : SETUP_FORMS_TYPES.setup,
  );

  function handleFormChange(form: SETUP_FORMS_TYPES) {
    setShowForm(form);
  }

  return (
    <div className="flex justify-center">
      {showForm === SETUP_FORMS_TYPES.setup && (
        <SetupForm handleFormChange={handleFormChange} />
      )}
      {showForm === SETUP_FORMS_TYPES.preferences && (
        <MediaPreferencesForm handleFormChange={handleFormChange} />
      )}
      {showForm === SETUP_FORMS_TYPES.movies && (
        <MovieSetupCarousel
          initialMediaCollection={props.movieCollection}
          user={props.user}
          handleFormChange={handleFormChange}
        />
      )}
      {showForm === SETUP_FORMS_TYPES.tvShows && (
        <TVSetupCarousel
          initialMediaCollection={props.tvShowCollection}
          user={props.user}
          handleFormChange={handleFormChange}
        />
      )}
    </div>
  );
}
