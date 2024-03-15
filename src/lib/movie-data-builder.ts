"use server";

import { User } from "@supabase/supabase-js";
import prisma from "../../prisma/client";
import { MOVIE_DB_IMG_PATH_PREFIX } from "./consts";

export async function buildMovieData(mediaDbData: any[], user: User) {
  const mediaIds = mediaDbData.map((media) => {
    return media.id;
  });

  const activityResult = await prisma.activity.findMany({
    where: {
      userId: user.id,
      mediaId: {
        in: mediaIds,
      },
    },
  });

  const ratingResult = await prisma.activity.findMany({
    include: {
      MediaRating: true,
    },
    where: {
      userId: user.id,
      mediaId: {
        in: mediaIds,
      },
      MediaRating: {
        mediaId: {
          in: mediaIds,
        },
      },
    },
  });

  const mediaUserActivity: any = {};
  const mediaRatings: any = {};

  activityResult.forEach((result) => {
    if (!mediaUserActivity[result.mediaId]) {
      mediaUserActivity[result.mediaId] = [];
    }
    mediaUserActivity[result.mediaId].push(result.activityType);
  });

  ratingResult.forEach((result) => {
    mediaRatings[result.mediaId] = result.MediaRating?.rating;
  });

  const mediaObj = mediaDbData.map((media) => {
    return {
      id: media.id,
      title: media.title || media.name,
      posterPath: MOVIE_DB_IMG_PATH_PREFIX + media.poster_path,
      rating: mediaRatings[media.id] || -1,
      userActivity: mediaUserActivity[media.id] || null,
    };
  });

  return mediaObj;
}

export async function buildBannerData(mediaDbData: any[]) {
  const bannerData = mediaDbData.map((media) => {
    return {
      id: media.id,
      backdropPath: MOVIE_DB_IMG_PATH_PREFIX + media.backdrop_path,
      title: media.title,
      releaseDate: media.release_date,
    };
  });

  return bannerData.slice(0, 5);
}
