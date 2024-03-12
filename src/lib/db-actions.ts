"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../prisma/client";
import { getUser } from "@/lib/authentication-functions";
import { User } from "@supabase/supabase-js";

export async function handleNewRating(rating: number, mediaId: number) {
  const user = await getUser();

  if (!user) return null;

  await prisma.activity.create({
    data: {
      userId: user.id,
      activityType: "rating",
      mediaId: mediaId,
      MediaRating: {
        create: {
          mediaId: mediaId,
          rating: rating,
        },
      },
    },
  });

  revalidatePath("/");
}

export async function handleDeleteRating(mediaId: number) {
  const user = await getUser();

  if (!user) return null;

  const rating = await prisma.activity.deleteMany({
    where: {
      userId: user.id,
      activityType: "rating",
      MediaRating: {
        mediaId: mediaId,
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

export async function handleWatched(mediaId: number) {
  const user = await getUser();

  if (!user) return null;

  await prisma.activity.create({
    data: {
      userId: user.id,
      activityType: "watched",
      mediaId: mediaId,
      MediaWatched: {
        create: {
          mediaId: mediaId,
        },
      },
    },
  });

  revalidatePath("/");
}

export async function handleUnwatched(mediaId: number) {
  const user = await getUser();

  if (!user) return null;

  await prisma.activity.deleteMany({
    where: {
      userId: user.id,
      activityType: "watched",
      MediaWatched: {
        mediaId: mediaId,
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

export async function handleAddToWatchlist(mediaId: number) {
  const user = await getUser();
  const watchlistId = await getUserWatchlistId();

  if (!watchlistId) return null;
  if (!user) return null;

  await prisma.activity.create({
    data: {
      userId: user.id,
      activityType: "watchlist",
      mediaId: mediaId,
      MediaWatchlist: {
        create: {
          mediaId: mediaId,
          watchlistId: watchlistId,
        },
      },
    },
  });

  revalidatePath("/");
}

export async function handleRemoveFromWatchlist(mediaId: number) {
  const user = await getUser();
  const watchlistId = await getUserWatchlistId();

  if (!user) return null;
  if (!watchlistId) return null;

  await prisma.activity.deleteMany({
    where: {
      userId: user.id,
      activityType: "watchlist",
      MediaWatchlist: {
        mediaId: mediaId,
        watchlistId: watchlistId,
      },
    },
  });

  revalidatePath("/");
}

export async function handleLike(mediaId: number) {
  const user = await getUser();

  if (!user) return null;

  await prisma.activity.create({
    data: {
      userId: user.id,
      activityType: "like",
      mediaId: mediaId,
      MediaLike: {
        create: {
          mediaId: mediaId,
        },
      },
    },
  });

  revalidatePath("/");
}

export async function handleUnlike(mediaId: number) {
  const user = await getUser();

  if (!user) return null;

  await prisma.activity.deleteMany({
    where: {
      userId: user.id,
      activityType: "like",
      MediaLike: {
        mediaId: mediaId,
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
