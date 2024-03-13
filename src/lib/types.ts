import { MovieCardStatus } from "@/lib/enums";

export interface UserRating {
  username: string;
  rating: number;
  profilePictureSrc: string;
}

export interface Media {
  id: number;
  title: string;
  posterPath: string;
  rating: number;
  userActivity: string[];
}

export interface BannerMedia {
  id: number;
  backdropPath: string;
  title: string;
  releaseDate: string;
}
