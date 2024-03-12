import { User } from "@supabase/supabase-js";
import prisma from "../../prisma/client";

export async function buildMovieData(mediaDbData: any[], user: User) {
  const mediaIds = mediaDbData.map((media) => {
    return media.id;
  });

  const result = await prisma.activity.findMany({
    where: {
      userId: user.id,
      mediaId: {
        in: mediaIds,
      },
    },
  });

  const mediaUserActivity: any = {};

  result.forEach((result) => {
    if (!mediaUserActivity[result.mediaId]) {
      mediaUserActivity[result.mediaId] = [];
    }
    mediaUserActivity[result.mediaId].push(result.activityType);
  });

  const mediaObj = mediaDbData.map((media) => {
    return {
      id: media.id,
      posterPath: media.poster_path,
      userActivity: mediaUserActivity[media.id] || null,
    };
  });

  return mediaObj;
}
