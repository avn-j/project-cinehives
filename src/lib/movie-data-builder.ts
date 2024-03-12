import { User } from "@supabase/supabase-js";
import prisma from "../../prisma/client";

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
      posterPath: media.poster_path,
      rating: mediaRatings[media.id] || -1,
      userActivity: mediaUserActivity[media.id] || null,
    };
  });

  return mediaObj;
}
