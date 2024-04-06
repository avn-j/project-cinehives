import { MovieCardStatus } from "@/lib/enums";
import { MediaType } from "@prisma/client";

export interface UserRating {
  username: string;
  rating: number;
  profilePictureSrc: string;
}

export interface MediaDataWithUserActivity {
  apiId: number;
  title: string;
  posterPath: string;
  rating: number;
  userActivity: string[];
  mediaType: MediaType;
  otherUserActivity?: {
    username: string;
    profilePicture: string;
    rating: number;
  };
}

export interface BannerMedia {
  id: number;
  backdropPath: string;
  title: string;
  releaseDate: string;
}
