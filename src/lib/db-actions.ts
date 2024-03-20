"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../prisma/client";
import { getUser } from "@/lib/authentication-functions";
import { User } from "@supabase/supabase-js";
import { Media } from "@prisma/client";
import { buildDataForMedias } from "./movie-data-builder";
import { reviewSchema } from "@/schemas/schemas";
import { z } from "zod";
import { AirplayIcon } from "lucide-react";

export async function createNewMedia(media: Media) {
  await prisma.media.upsert({
    where: {
      mediaId: media.mediaId,
    },
    update: {},
    create: {
      mediaId: media.mediaId,
      posterPath: media.posterPath,
      title: media.title,
      mediaType: media.mediaType,
    },
  });
}

export async function createNewRating(rating: number, media: Media) {
  const user = await getUser();

  if (!user) return null;

  await deleteWatched(media);

  await createNewMedia(media);
  await prisma.activity.create({
    data: {
      userId: user.id,
      activityType: "rating",
      mediaId: media.mediaId,
      MediaRating: {
        create: {
          mediaId: media.mediaId,
          rating: rating,
        },
      },
    },
  });

  await createNewWatched(media);
}

export async function deleteRating(media: Media) {
  const user = await getUser();

  if (!user) return null;

  await prisma.activity.deleteMany({
    where: {
      userId: user.id,
      activityType: "rating",
      MediaRating: {
        mediaId: media.mediaId,
      },
    },
  });
}

export async function createNewWatchlist(userId: string) {
  await prisma.watchlist.create({
    data: {
      userId: userId,
    },
  });
}

export async function createNewWatched(media: Media) {
  const user = await getUser();

  if (!user) return null;

  await createNewMedia(media);
  await prisma.activity.create({
    data: {
      userId: user.id,
      activityType: "watched",
      mediaId: media.mediaId,
      MediaWatched: {
        create: {
          mediaId: media.mediaId,
        },
      },
    },
  });

  revalidatePath("/");
}

export async function deleteWatched(media: Media) {
  const user = await getUser();

  if (!user) return null;

  await prisma.activity.deleteMany({
    where: {
      userId: user.id,
      activityType: "watched",
      MediaWatched: {
        mediaId: media.mediaId,
      },
    },
  });

  revalidatePath("/");
}

export async function getUserWatchlistId() {
  const user = await getUser();
  if (!user) return null;

  const watchlist = await prisma.watchlist.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!watchlist) return null;

  return watchlist.id;
}

export async function addToUserWatchlist(media: Media) {
  const user = await getUser();
  const watchlistId = await getUserWatchlistId();

  if (!watchlistId) return null;
  if (!user) return null;

  await createNewMedia(media);
  await prisma.activity.create({
    data: {
      userId: user.id,
      activityType: "watchlist",
      mediaId: media.mediaId,
      MediaWatchlist: {
        create: {
          mediaId: media.mediaId,
          watchlistId: watchlistId,
        },
      },
    },
  });

  revalidatePath("/");
}

export async function removeFromUserWatchlist(media: Media) {
  const user = await getUser();
  const watchlistId = await getUserWatchlistId();

  if (!user) return null;
  if (!watchlistId) return null;

  await prisma.activity.deleteMany({
    where: {
      userId: user.id,
      activityType: "watchlist",
      MediaWatchlist: {
        mediaId: media.mediaId,
        watchlistId: watchlistId,
      },
    },
  });

  revalidatePath("/");
}

export async function createMediaLike(media: Media) {
  const user = await getUser();

  if (!user) return null;

  await createNewMedia(media);
  await prisma.activity.create({
    data: {
      userId: user.id,
      activityType: "like",
      mediaId: media.mediaId,
      MediaLike: {
        create: {
          mediaId: media.mediaId,
        },
      },
    },
  });

  revalidatePath("/");
}

export async function deleteMediaLike(media: Media) {
  const user = await getUser();

  if (!user) return null;

  await prisma.activity.deleteMany({
    where: {
      userId: user.id,
      activityType: "like",
      MediaLike: {
        mediaId: media.mediaId,
      },
    },
  });

  revalidatePath("/");
}

// TODO: get user from getUser()
export async function checkLiked(mediaId: number, user: User) {
  if (!user) return false;

  // Get like if
  const like = await prisma.activity.findFirst({
    where: {
      userId: user.id,
      activityType: "like",
      MediaLike: {
        mediaId: mediaId,
      },
    },
  });

  return like ? true : false;
}

export async function checkWatched(mediaId: number, user: User) {
  if (!user) return false;

  // Get like if
  const watched = await prisma.activity.findFirst({
    where: {
      userId: user.id,
      activityType: "watched",
      MediaWatched: {
        mediaId: mediaId,
      },
    },
  });

  return watched ? true : false;
}

export async function checkOnWatchlist(mediaId: number, user: User) {
  if (!user) return false;

  const onWatchlist = await prisma.watchlist.findUnique({
    where: {
      userId: user.id,
      Media: {
        some: {
          mediaId: mediaId,
        },
      },
    },
  });

  return onWatchlist ? true : false;
}

export async function checkRating(mediaId: number, user: User) {
  if (!user) return 0;

  const rating = await prisma.activity.findFirst({
    include: {
      MediaRating: true,
    },
    where: {
      userId: user.id,
      activityType: "rating",
      MediaRating: {
        mediaId: mediaId,
      },
    },
  });

  if (!rating || !rating.MediaRating) return -1;

  return rating.MediaRating.rating;
}

export async function fetchRecentFilmActivityRating(userId: string) {
  const activity = await prisma.activity.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      activityType: "rating",
    },
    select: {
      user: {
        select: {
          username: true,
          profilePictureURL: true,
        },
      },
      Media: true,
      MediaRating: true,
    },
    take: 5,
  });

  const media = activity.map((activity) => {
    return {
      id: activity.Media.mediaId,
      title: activity.Media.title,
      poster_path: activity.Media.posterPath,
      otherUserActivity: {
        username: activity.user.username,
        profilePicture: activity.user.profilePictureURL,
        rating: activity.MediaRating?.rating || -1,
      },
    };
  });

  const movieData = await buildDataForMedias(media, userId);

  const mediaWithAllData = media.map((media, index) => {
    return {
      ...media,
      rating: movieData[index].rating,
      userActivity: movieData[index].userActivity,
    };
  });

  return mediaWithAllData;
}

export async function getAverageRatingForMedia(mediaId: number) {
  const result = await prisma.mediaRating.aggregate({
    where: {
      mediaId: mediaId,
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  if (!result) return null;

  return result;
}

export async function getAllInteractionsForMedia(mediaId: number) {
  const interactions = await prisma.media.findFirst({
    where: {
      mediaId: mediaId,
    },
    select: {
      _count: {
        select: {
          MediaLike: true,
          MediaRating: true,
          MediaReview: true,
          MediaWatched: true,
          MediaWatchlist: true,
        },
      },
    },
  });

  return interactions;
}

export async function createNewMediaReview(
  values: z.infer<typeof reviewSchema>,
  media: Media,
  rating: number | null,
  liked: boolean,
) {
  const result = reviewSchema.safeParse(values);

  if (!result.success) return false;
  const user = await getUser();
  if (!user) return false;

  await createNewMedia(media);

  if (rating) {
    await deleteRating(media);
    await createNewRating(rating, media);
  }

  if (liked) {
    await deleteMediaLike(media);
    await createMediaLike(media);
  }

  await prisma.activity.create({
    data: {
      userId: user.id,
      activityType: "review",
      mediaId: media.mediaId,
      MediaReview: {
        create: {
          mediaId: media.mediaId,
          review: values.review,
          rating: rating,
          liked: liked,
        },
      },
    },
  });

  revalidatePath("/");

  return true;
}

export async function getReviewsForMedia(mediaId: number) {
  const result = await prisma.activity.findMany({
    where: {
      mediaId: mediaId,
      activityType: "review",
      MediaReview: {
        mediaId: mediaId,
      },
    },
    select: {
      createdAt: true,
      MediaReview: true,
      user: {
        select: {
          username: true,
          profilePictureURL: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
}
