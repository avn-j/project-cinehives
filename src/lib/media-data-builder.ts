"use server";

import prisma from "../../prisma/client";
import { MOVIE_DB_IMG_PATH_PREFIX } from "./consts";
import { getUser } from "./authentication-functions";
import { _getConvertedMediaType } from "./helpers";
import {
  ApiIdWithMediaType,
  getCinehivesMediaIdByApiId,
  getCinehivesMediaIdsByApiIds,
} from "./db-actions";
import { MediaType } from "@prisma/client";

export async function _buildAppDataForMedias(_apiData: any[]) {
  const user = await getUser();

  if (!user) {
    const medias = _apiData.map((media) => {
      const convertedMediaType: MediaType = _getConvertedMediaType(media);

      return {
        apiId: media.id,
        title: media.title || media.name,
        posterPath: MOVIE_DB_IMG_PATH_PREFIX + media.poster_path,
        rating: -1,
        userActivity: [],
        mediaType: convertedMediaType,
      };
    });

    return medias;
  }

  const mediaUserActivity: any = {};
  const mediaRatings: any = {};

  const apiIdsAndMediaType: ApiIdWithMediaType[] = _apiData.map((media) => {
    const convertedMediaType: MediaType = _getConvertedMediaType(media);
    return {
      apiId: media.apiId || media.id,
      mediaType: convertedMediaType,
    };
  });

  const cinehivesIds = await getCinehivesMediaIdsByApiIds(apiIdsAndMediaType);

  const dbActivityResults = await prisma.mediaActivity.findMany({
    where: {
      userId: user.id,
      mediaId: {
        in: cinehivesIds,
      },
    },
    include: {
      media: true,
    },
  });

  const dbRatingResults = await prisma.mediaActivity.findMany({
    include: {
      mediaRating: true,
      media: true,
    },
    where: {
      userId: user.id,
      activityType: "RATING",
      mediaId: {
        in: cinehivesIds,
      },
      mediaRating: {
        mediaId: {
          in: cinehivesIds,
        },
      },
    },
  });

  // Iterate over database results and builds user activity
  dbActivityResults.forEach((result) => {
    // If the mediaId doesn't exist as a key, add it to the mediaUserActivity object
    // and initialize an empty array
    if (!mediaUserActivity[result.media.apiMovieDbId]) {
      mediaUserActivity[result.media.apiMovieDbId] = [];
    }

    // Push particular activity type, eg. rating, like, review to that specific mediaId in object.
    mediaUserActivity[result.media.apiMovieDbId].push(result.activityType);
  });

  dbRatingResults.forEach((rating) => {
    mediaRatings[rating.media.apiMovieDbId] = rating.mediaRating?.rating;
  });

  const appMediaData = _apiData.map((media) => {
    const convertedMediaType: MediaType = _getConvertedMediaType(media);
    return {
      apiId: media.apiId || media.id,
      title: media.title || media.name,
      posterPath: MOVIE_DB_IMG_PATH_PREFIX + media.poster_path,
      rating: mediaRatings[media.id] || -1,
      userActivity: mediaUserActivity[media.apiId || media.id] || [],
      mediaType: convertedMediaType,
    };
  });

  return appMediaData;
}

export async function _buildBannerData(mediaDbData: any[]) {
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

export async function _buildAppDataForMedia(_apiData: any) {
  const user = await getUser();
  const convertedMediaType: MediaType = _getConvertedMediaType(_apiData);

  if (!user) {
    return {
      apiId: _apiData.id,
      title: _apiData.title || _apiData.name,
      posterPath: MOVIE_DB_IMG_PATH_PREFIX + _apiData.poster_path,
      rating: -1,
      userActivity: [],
      mediaType: convertedMediaType,
    };
  }

  const apiIdAndMediaType: ApiIdWithMediaType = {
    apiId: _apiData.id,
    mediaType: convertedMediaType,
  };

  const cinehivesId = await getCinehivesMediaIdByApiId(apiIdAndMediaType);

  const activityResult = await prisma.mediaActivity.findMany({
    where: {
      userId: user.id,
      mediaId: cinehivesId,
    },
    include: {
      media: true,
    },
  });

  const ratingResult = await prisma.mediaActivity.findFirst({
    include: {
      media: true,
      mediaRating: true,
    },
    where: {
      userId: user.id,
      mediaId: cinehivesId,
      mediaRating: {
        mediaId: cinehivesId,
      },
    },
  });

  const userActivity: string[] = [];

  activityResult.forEach((result) => {
    userActivity.push(result.activityType);
  });

  const returned = {
    apiId: _apiData.id,
    title: _apiData.title || _apiData.name,
    posterPath: MOVIE_DB_IMG_PATH_PREFIX + _apiData.poster_path,
    rating: ratingResult?.mediaRating?.rating || -1,
    userActivity: userActivity || [],
    mediaType: convertedMediaType,
  };

  return returned;
}
