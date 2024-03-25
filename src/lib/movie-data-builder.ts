"use server";

import { User } from "@supabase/supabase-js";
import prisma from "../../prisma/client";
import { MOVIE_DB_IMG_PATH_PREFIX } from "./consts";
import { revalidatePath } from "next/cache";

export async function buildDataForMedias(mediaDbData: any[], userId: string) {
  const mediaIds = mediaDbData.map((media) => {
    return media.id;
  });

  const activityResult = await prisma.mediaActivity.findMany({
    where: {
      userId: userId,
      mediaId: {
        in: mediaIds,
      },
    },
  });

  const ratingResult = await prisma.mediaActivity.findMany({
    include: {
      mediaRating: true,
    },
    where: {
      userId: userId,
      mediaId: {
        in: mediaIds,
      },
      mediaRating: {
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
    mediaRatings[result.mediaId] = result.mediaRating?.rating;
  });

  const dataObj = mediaDbData.map((media) => {
    return {
      id: media.id,
      title: media.title || media.name,
      posterPath: MOVIE_DB_IMG_PATH_PREFIX + media.poster_path,
      rating: mediaRatings[media.id] || -1,
      userActivity: mediaUserActivity[media.id] || null,
    };
  });

  return dataObj;
}

export async function buildBannerData(mediaDbData: any[]) {
  const bannerData = mediaDbData.map((media) => {
    return {
      id: media.id,
      backdropPath: MOVIE_DB_IMG_PATH_PREFIX + media.backdrop_path,
      title: media.title || media.name,
      releaseDate: media.release_date,
    };
  });

  return bannerData.slice(0, 5);
}

export async function buildDataForMedia(media: any, userId: string) {
  const activityResult = await prisma.mediaActivity.findMany({
    where: {
      userId: userId,
      mediaId: media.id,
    },
  });

  const ratingResult = await prisma.mediaActivity.findFirst({
    include: {
      media: true,
      mediaRating: true,
    },
    where: {
      userId: userId,
      mediaId: media.id,
      mediaRating: {
        mediaId: media.id,
      },
    },
  });

  const userActivity: string[] = [];

  activityResult.forEach((result) => {
    userActivity.push(result.activityType);
  });

  return {
    id: media.id,
    title: media.title || media.name,
    posterPath: MOVIE_DB_IMG_PATH_PREFIX + media.poster_path,
    rating: ratingResult?.mediaRating?.rating || -1,
    userActivity: userActivity || null,
  };
}
