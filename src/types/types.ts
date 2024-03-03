import { MovieCardStatus } from "@/utils/enums";

export interface Movie {
  id: string;
  src: string;
  alt: string;
  status?: MovieCardStatus;
  userRating?: UserRating;
}

export interface UserRating {
  username: string;
  rating: number;
  profilePictureSrc: string;
}
