"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../prisma/client";
import { getUser } from "@/lib/authentication-functions";
import { User } from "@supabase/supabase-js";
import { Media } from "@prisma/client";
import { buildDataForMedias } from "./movie-data-builder";
import { commentSchema, reviewSchema } from "@/schemas/schemas";
import { z } from "zod";

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
  await prisma.mediaActivity.create({
    data: {
      userId: user.id,
      activityType: "rating",
      mediaId: media.mediaId,
      mediaRating: {
        create: {
          mediaId: media.mediaId,
          rating: rating,
        },
      },
    },
  });

  await createNewWatched(media);

  revalidatePath("/");
}

export async function deleteRating(media: Media) {
  const user = await getUser();

  if (!user) return null;

  await prisma.mediaActivity.deleteMany({
    where: {
      userId: user.id,
      activityType: "rating",
      mediaRating: {
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

export async function createNewWatched(media: Media) {
  const user = await getUser();

  if (!user) return null;

  await createNewMedia(media);
  await prisma.mediaActivity.create({
    data: {
      userId: user.id,
      activityType: "watched",
      mediaId: media.mediaId,
      mediaWatched: {
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

  await prisma.mediaActivity.deleteMany({
    where: {
      userId: user.id,
      activityType: "watched",
      mediaWatched: {
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
  await prisma.mediaActivity.create({
    data: {
      userId: user.id,
      activityType: "watchlist",
      mediaId: media.mediaId,
      mediaWatchlist: {
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

  await prisma.mediaActivity.deleteMany({
    where: {
      userId: user.id,
      activityType: "watchlist",
      mediaWatchlist: {
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
  await prisma.mediaActivity.create({
    data: {
      userId: user.id,
      activityType: "like",
      mediaId: media.mediaId,
      mediaLike: {
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

  await prisma.mediaActivity.deleteMany({
    where: {
      userId: user.id,
      activityType: "like",
      mediaLike: {
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
  const like = await prisma.mediaActivity.findFirst({
    where: {
      userId: user.id,
      activityType: "like",
      mediaLike: {
        mediaId: mediaId,
      },
    },
  });

  return like ? true : false;
}

export async function checkWatched(mediaId: number, user: User) {
  if (!user) return false;

  // Get like if
  const watched = await prisma.mediaActivity.findFirst({
    where: {
      userId: user.id,
      activityType: "watched",
      mediaWatched: {
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
      media: {
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

  const rating = await prisma.mediaActivity.findFirst({
    include: {
      mediaRating: true,
    },
    where: {
      userId: user.id,
      activityType: "rating",
      mediaRating: {
        mediaId: mediaId,
      },
    },
  });

  if (!rating || !rating.mediaRating) return -1;

  return rating.mediaRating.rating;
}

export async function fetchRecentTVActivityRating(userId: string) {
  const activity = await prisma.mediaActivity.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      activityType: "rating",
      media: {
        mediaType: "tv",
      },
    },
    select: {
      user: {
        select: {
          username: true,
          profilePictureURL: true,
        },
      },
      media: true,
      mediaRating: true,
    },
    take: 5,
  });

  const media = activity.map((activity) => {
    return {
      id: activity.media.mediaId,
      title: activity.media.title,
      poster_path: activity.media.posterPath,
      otherUserActivity: {
        username: activity.user.username,
        profilePicture: activity.user.profilePictureURL,
        rating: activity.mediaRating?.rating || -1,
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

export async function fetchRecentFilmActivityRating(userId: string) {
  const activity = await prisma.mediaActivity.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      activityType: "rating",
      media: {
        mediaType: "film",
      },
    },
    select: {
      user: {
        select: {
          username: true,
          profilePictureURL: true,
        },
      },
      media: true,
      mediaRating: true,
    },
    take: 5,
  });

  const media = activity.map((activity) => {
    return {
      id: activity.media.mediaId,
      title: activity.media.title,
      poster_path: activity.media.posterPath,
      otherUserActivity: {
        username: activity.user.username,
        profilePicture: activity.user.profilePictureURL,
        rating: activity.mediaRating?.rating || -1,
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
          mediaLike: true,
          mediaRating: true,
          mediaReview: true,
          mediaWatched: true,
          mediaWatchlist: true,
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

  await prisma.mediaActivity.create({
    data: {
      userId: user.id,
      activityType: "review",
      mediaId: media.mediaId,
      mediaReview: {
        create: {
          mediaId: media.mediaId,
          review: values.review,
          rating,
          liked,
          spoiler: values.spoilers,
          rewatched: values.rewatched,
        },
      },
    },
  });

  revalidatePath("/");

  return true;
}

export async function updateMediaReview(
  values: z.infer<typeof reviewSchema>,
  media: Media,
  oldRating: number | null,
  rating: number | null,
  oldLiked: boolean,
  liked: boolean,
  activityId: string,
) {
  const result = reviewSchema.safeParse(values);

  if (!result.success) return false;
  const user = await getUser();
  if (!user) return false;

  await createNewMedia(media);

  if (rating && rating !== oldRating) {
    await deleteRating(media);
    await createNewRating(rating, media);
  }

  if (oldLiked !== liked) {
    if (!liked) await deleteMediaLike(media);
    else await createMediaLike(media);
  }

  await prisma.mediaReview.update({
    where: {
      activityId: activityId,
    },
    data: {
      review: values.review,
      liked: liked,
      rating: rating,
      spoiler: values.spoilers,
      rewatched: values.rewatched,
    },
  });

  revalidatePath("/");

  return true;
}

export async function getUserReviewForMedia(mediaId: number) {
  const user = await getUser();
  if (!user) return [];

  const result = await prisma.mediaReview.findMany({
    where: {
      mediaId: mediaId,
      activity: {
        activityType: "review",
        userId: user.id,
      },
    },
    select: {
      activityId: true,
      media: true,
      review: true,
      rating: true,
      liked: true,
      spoiler: true,
      rewatched: true,
      _count: {
        select: {
          reviewComments: true,
        },
      },
      activity: {
        select: {
          user: {
            select: {
              username: true,
              id: true,
              profilePictureURL: true,
            },
          },
          createdAt: true,
        },
      },
      reviewLikes: {
        select: {
          activity: {
            select: {
              user: {
                select: {
                  profilePictureURL: true,
                  username: true,
                  id: true,
                },
              },
            },
          },
        },
      },
      reviewComments: true,
    },
    orderBy: {
      activity: {
        createdAt: "desc",
      },
    },
  });

  return result;
}

export async function getRecentReviewsForMedia(mediaId: number) {
  const user = await getUser();
  if (!user) return [];

  const result = await prisma.mediaReview.findMany({
    where: {
      mediaId: mediaId,
      activity: {
        activityType: "review",
        NOT: {
          userId: user.id,
        },
      },
    },
    select: {
      activityId: true,
      media: true,
      review: true,
      rating: true,
      liked: true,
      spoiler: true,
      rewatched: true,
      _count: {
        select: {
          reviewComments: true,
        },
      },
      activity: {
        select: {
          user: {
            select: {
              username: true,
              id: true,
              profilePictureURL: true,
            },
          },
          createdAt: true,
        },
      },
      reviewLikes: {
        select: {
          activity: {
            select: {
              user: {
                select: {
                  profilePictureURL: true,
                  username: true,
                  id: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      activity: {
        createdAt: "desc",
      },
    },
  });

  return result;
}

export async function deleteReview(activityId: string) {
  const result = await prisma.mediaActivity.delete({
    where: {
      id: activityId,
    },
  });

  revalidatePath("/");
  return result;
}

export async function createNewReviewLike(reviewId: string) {
  const user = await getUser();
  if (!user) return null;

  const result = prisma.userActivity.create({
    data: {
      userId: user.id,
      reviewLike: {
        create: {
          likedReviewId: reviewId,
        },
      },
    },
  });

  revalidatePath("/");

  return result;
}

export async function deleteReviewLike(reviewId: string) {
  const user = await getUser();
  if (!user) return null;

  const result = await prisma.userActivity.deleteMany({
    where: {
      userId: user.id,
      reviewLike: {
        likedReviewId: reviewId,
      },
    },
  });

  revalidatePath("/");
  return result;
}

export async function getReviewById(activityId: string) {
  const result = await prisma.mediaReview.findUnique({
    where: {
      activityId: activityId,
    },
    select: {
      activityId: true,
      media: true,
      rating: true,
      review: true,
      rewatched: true,
      spoiler: true,
      liked: true,
      _count: {
        select: {
          reviewComments: true,
        },
      },
      activity: {
        select: {
          user: {
            select: {
              username: true,
              id: true,
              profilePictureURL: true,
            },
          },
          createdAt: true,
        },
      },
      reviewLikes: {
        select: {
          activity: {
            select: {
              user: {
                select: {
                  username: true,
                  profilePictureURL: true,
                  id: true,
                },
              },
            },
          },
        },
      },
      reviewComments: {
        select: {
          activity: {
            select: {
              createdAt: true,
              user: {
                select: {
                  username: true,
                  profilePictureURL: true,
                  id: true,
                },
              },
            },
          },
          comment: true,
          activityId: true,
          commentLikes: {
            select: {
              activity: {
                select: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      profilePictureURL: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return result;
}

export async function createNewReviewComment(
  values: z.infer<typeof commentSchema>,
  reviewId: string,
) {
  const parseResult = commentSchema.safeParse(values);
  if (!parseResult.success) return false;

  const user = await getUser();
  if (!user) return false;

  const result = await prisma.userActivity.create({
    data: {
      userId: user.id,
      reviewComment: {
        create: {
          reviewId: reviewId,
          comment: values.comment,
        },
      },
    },
  });

  if (!result) return false;

  revalidatePath("/");
  return true;
}

export async function deleteReviewComment(commentId: string) {
  const result = await prisma.userReviewComment.delete({
    where: {
      activityId: commentId,
    },
  });

  revalidatePath("/");
  return result;
}

export async function createNewReviewCommentLike(commentId: string) {
  const user = await getUser();
  if (!user) return null;

  const result = prisma.userActivity.create({
    data: {
      userId: user.id,
      commentLike: {
        create: {
          likedCommentId: commentId,
        },
      },
    },
  });

  revalidatePath("/");

  return result;
}

export async function deleteReviewCommentLike(commentId: string) {
  const user = await getUser();
  if (!user) return null;

  const result = await prisma.userActivity.deleteMany({
    where: {
      userId: user.id,
      commentLike: {
        likedCommentId: commentId,
      },
    },
  });

  revalidatePath("/");
  return result;
}

export async function getMediaType(mediaId: number) {
  const mediaType = await prisma.media.findUnique({
    where: {
      mediaId: mediaId,
    },
    select: {
      mediaType: true,
    },
  });

  return mediaType;
}
