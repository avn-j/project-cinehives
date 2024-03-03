import { Movie, UserRating } from "@/types/types";
import { MovieCardStatus } from "@/utils/enums";

export const user: String = "Test User";

export const popularMovies: Movie[] = [
  {
    id: "1",
    src: "/movie.jpeg",
    alt: "Movie Poster",
  },
  {
    id: "2",
    src: "/movie.jpeg",
    alt: "Movie Poster",
  },
  {
    id: "3",
    src: "/movie.jpeg",
    alt: "Movie Poster",
  },
  {
    id: "4",
    src: "/movie.jpeg",
    alt: "Movie Poster",
  },
  {
    id: "5",
    src: "/movie.jpeg",
    alt: "Movie Poster",
  },
];

export const friendActivity: Movie[] = [
  {
    id: "1",
    src: "/movie.jpeg",
    alt: "Movie Poster",
    status: MovieCardStatus.Reviewed,
    userRating: {
      username: "Aevan",
      rating: 3,
      profilePictureSrc: "/profile.jpeg",
    },
  },
  {
    id: "2",
    src: "/movie.jpeg",
    alt: "Movie Poster",
    status: MovieCardStatus.Rewatched,
    userRating: {
      username: "Aevan",
      rating: 3.5,
      profilePictureSrc: "/profile.jpeg",
    },
  },
  {
    id: "3",
    src: "/movie.jpeg",
    alt: "Movie Poster",
    userRating: {
      username: "Aevan",
      rating: 2,
      profilePictureSrc: "/profile.jpeg",
    },
  },
  {
    id: "4",
    src: "/movie.jpeg",
    alt: "Movie Poster",
    userRating: {
      username: "Aevan",
      rating: 4.5,
      profilePictureSrc: "/profile.jpeg",
    },
  },
  {
    id: "5",
    src: "/movie.jpeg",
    alt: "Movie Poster",
    status: MovieCardStatus.Reviewed,
    userRating: {
      username: "Aevan",
      rating: 0.5,
      profilePictureSrc: "/profile.jpeg",
    },
  },
];
