"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../prisma/client";
import { getUser } from "@/lib/authentication-functions";
import { User } from "@supabase/supabase-js";
import { Media } from "@prisma/client";

export async function upsertMedia(media: Media) {
  await prisma.media.upsert({
    where: {
      mediaId: media.mediaId,
    },
    update: {},
    create: {
      mediaId: media.mediaId,
      posterPath: media.posterPath,
      title: media.title,
    },
  });
}

export async function handleCreateNewRating(rating: number, media: Media) {
  const user = await getUser();

  if (!user) return null;

  await handleUnwatched(media);

  await upsertMedia(media);
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

  await handleWatched(media);

  revalidatePath("/");
}

export async function handleDeleteRating(media: Media) {
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

  revalidatePath("/");
}

export async function createNewWatchlist(userId: string) {
  await prisma.watchlist.create({
    data: {
      userId: userId,
    },
  });
}

export async function handleWatched(media: Media) {
  const user = await getUser();

  if (!user) return null;

  await upsertMedia(media);
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

export async function handleUnwatched(media: Media) {
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

export async function handleAddToWatchlist(media: Media) {
  const user = await getUser();
  const watchlistId = await getUserWatchlistId();

  if (!watchlistId) return null;
  if (!user) return null;

  await upsertMedia(media);
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

export async function handleRemoveFromWatchlist(media: Media) {
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

export async function handleLike(media: Media) {
  const user = await getUser();

  if (!user) return null;

  await upsertMedia(media);
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

export async function handleUnlike(media: Media) {
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
