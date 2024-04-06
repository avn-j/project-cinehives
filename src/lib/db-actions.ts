"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../prisma/client";
import { getUser } from "@/lib/authentication-functions";
import { MediaType } from "@prisma/client";
import { _buildAppDataForMedias } from "./media-data-builder";
import { commentSchema, loggedSchema, reviewSchema } from "@/schemas/schemas";
import { z } from "zod";
import { randomUUID } from "crypto";
import { E } from "./errors";

export interface DatabaseFilmMedia {
  title: string;
  posterPath: string;
  mediaType: MediaType;
  apiId: number;
  season?: never;
  episode?: never;
  apiSeasonId?: never;
  apiEpisodeId?: never;
}

export interface DatabaseTVMedia {
  title: string;
  posterPath: string;
  apiId: number;
  mediaType: MediaType;
  episode?: number;
  apiSeasonId?: number;
  apiEpisodeId?: number;
  season?: number;
}

export interface ApiIdWithMediaType {
  apiId: number;
  mediaType: MediaType;
}

export type MediaDatabase = DatabaseFilmMedia | DatabaseTVMedia;

export async function getCinehivesMediaId(media: MediaDatabase) {
  const result = await prisma.media.findUnique({
    where: {
      apiMovieDbId_mediaType: {
        apiMovieDbId: media.apiId,
        mediaType: media.mediaType,
      },
    },
  });

  if (!result) return null;
  return result.id;
}

export async function getCinehivesMediaIdsByApiIds(
  medias: ApiIdWithMediaType[],
) {
  const promises = medias.map(async (media) => {
    const result = await prisma.media.findUnique({
      where: {
        apiMovieDbId_mediaType: {
          apiMovieDbId: media.apiId,
          mediaType: media.mediaType,
        },
      },
    });

    if (!result) return -1;
    return result.id;
  });

  const cinehivesIds = await Promise.all(promises);

  return cinehivesIds;
}

export async function getCinehivesMediaIdByApiId(media: ApiIdWithMediaType) {
  const result = await prisma.media.findUnique({
    where: {
      apiMovieDbId_mediaType: {
        apiMovieDbId: media.apiId,
        mediaType: media.mediaType,
      },
    },
  });

  if (!result) return -1;
  return result.id;
}

export async function createNewMedia(media: MediaDatabase) {
  const dbMedia = await prisma.media.upsert({
    where: {
      apiMovieDbId_mediaType: {
        apiMovieDbId: media.apiId,
        mediaType: media.mediaType,
      },
    },
    update: {},
    create: {
      apiMovieDbId: media.apiId,
      mediaType: media.mediaType,
      title: media.title,
      posterPath: media.posterPath,
      ...(media.mediaType === "FILM"
        ? {
            relatedFilmMedia: {
              create: { title: media.title, posterPath: media.posterPath },
            },
          }
        : {
            relatedTVMedia: {
              create: {
                title: media.title,
                posterPath: media.posterPath,
                season: media.season,
                apiSeasonId: media.apiSeasonId,
                episode: media.episode,
                apiEpisodeId: media.apiEpisodeId,
              },
            },
          }),
    },
  });

  return dbMedia.id;
}

export async function createNewRating(rating: number, media: MediaDatabase) {
  const user = await getUser();
  if (!user) throw Error(E.USER_AUTHENTICATION_ERROR);

  const mediaId = await createNewMedia(media);

  await deleteWatched(media);

  await prisma.mediaActivity.create({
    data: {
      userId: user.id,
      activityType: "RATING",
      mediaId: mediaId,
      mediaRating: {
        create: {
          mediaId: mediaId,
          rating: rating,
        },
      },
    },
  });

  await createNewWatched(media);

  revalidatePath("/");
}

export async function deleteRating(media: MediaDatabase) {
  const user = await getUser();
  if (!user) throw Error(E.USER_AUTHENTICATION_ERROR);

  const mediaId = await getCinehivesMediaId(media);
  if (!mediaId) return;

  await prisma.mediaActivity.deleteMany({
    where: {
      userId: user.id,
      activityType: "RATING",
      mediaId: mediaId,
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

export async function createNewWatched(media: MediaDatabase) {
  const user = await getUser();
  if (!user) throw Error(E.USER_AUTHENTICATION_ERROR);

  const mediaId = await createNewMedia(media);

  await prisma.mediaActivity.create({
    data: {
      userId: user.id,
      activityType: "WATCHED",
      mediaId: mediaId,
      mediaWatched: {
        create: {
          mediaId: mediaId,
        },
      },
    },
  });

  revalidatePath("/");
}

export async function deleteWatched(media: MediaDatabase) {
  const user = await getUser();
  if (!user) throw Error(E.USER_AUTHENTICATION_ERROR);

  const mediaId = await getCinehivesMediaId(media);
  if (!mediaId) return;

  await prisma.mediaActivity.deleteMany({
    where: {
      userId: user.id,
      activityType: "WATCHED",
      mediaId: mediaId,
    },
  });

  revalidatePath("/");
}

export async function getUserWatchlistId() {
  const user = await getUser();
  if (!user) throw Error(E.USER_AUTHENTICATION_ERROR);

  const watchlist = await prisma.watchlist.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!watchlist) throw Error(E.WATCHLIST_DOES_NOT_EXIST);

  return watchlist.id;
}

export async function addMediaToUserWatchlist(media: MediaDatabase) {
  const user = await getUser();
  const watchlistId = await getUserWatchlistId();

  if (!user) throw Error(E.USER_AUTHENTICATION_ERROR);

  const mediaId = await createNewMedia(media);
  await prisma.mediaActivity.create({
    data: {
      userId: user.id,
      activityType: "WATCHLIST",
      mediaId: mediaId,
      mediaWatchlist: {
        create: {
          mediaId: mediaId,
          watchlistId: watchlistId,
        },
      },
    },
  });

  revalidatePath("/");
}

export async function deleteFromUserWatchlist(media: MediaDatabase) {
  const user = await getUser();
  const watchlistId = await getUserWatchlistId();

  if (!user) throw Error(E.USER_AUTHENTICATION_ERROR);
  if (!watchlistId) throw Error(E.WATCHLIST_ID_NOT_FOUND);

  const mediaId = await getCinehivesMediaId(media);
  if (!mediaId) return;

  await prisma.mediaActivity.deleteMany({
    where: {
      userId: user.id,
      activityType: "WATCHLIST",
      mediaId: mediaId,
      mediaWatchlist: {
        watchlistId: watchlistId,
      },
    },
  });

  revalidatePath("/");
}

export async function createNewMediaLike(media: MediaDatabase) {
  const user = await getUser();
  if (!user) throw Error(E.USER_AUTHENTICATION_ERROR);

  const mediaId = await createNewMedia(media);

  await prisma.mediaActivity.create({
    data: {
      userId: user.id,
      activityType: "LIKE",
      mediaId: mediaId,
      mediaLike: {
        create: {
          mediaId: mediaId,
        },
      },
    },
  });

  revalidatePath("/");
}

export async function deleteMediaLike(media: MediaDatabase) {
  const user = await getUser();
  if (!user) throw Error(E.USER_AUTHENTICATION_ERROR);

  const mediaId = await getCinehivesMediaId(media);
  if (!mediaId) return;

  await prisma.mediaActivity.deleteMany({
    where: {
      userId: user.id,
      activityType: "LIKE",
      mediaId: mediaId,
    },
  });

  revalidatePath("/");
}

export async function checkLiked(media: MediaDatabase) {
  const user = await getUser();
  if (!user) throw Error(E.USER_AUTHENTICATION_ERROR);

  const mediaId = await getCinehivesMediaId(media);
  if (!mediaId) return;

  const like = await prisma.mediaActivity.findFirst({
    where: {
      userId: user.id,
      activityType: "LIKE",
      mediaId: mediaId,
    },
  });

  return like ? true : false;
}

export async function checkWatched(media: MediaDatabase) {
  const user = await getUser();
  if (!user) throw Error(E.USER_AUTHENTICATION_ERROR);

  const mediaId = await getCinehivesMediaId(media);
  if (!mediaId) return;

  const watched = await prisma.mediaActivity.findFirst({
    where: {
      userId: user.id,
      activityType: "WATCHED",
      mediaId: mediaId,
    },
  });

  return watched ? true : false;
}

export async function checkOnWatchlist(media: MediaDatabase) {
  const user = await getUser();
  if (!user) throw Error(E.USER_AUTHENTICATION_ERROR);

  const mediaId = await getCinehivesMediaId(media);
  if (!mediaId) return;

  const onWatchlist = await prisma.watchlist.findUnique({
    where: {
      userId: user.id,
      mediaOnWatchlist: {
        some: {
          activity: {
            mediaId: mediaId,
          },
        },
      },
    },
  });

  return onWatchlist ? true : false;
}

export async function checkRating(media: MediaDatabase) {
  const user = await getUser();
  if (!user) throw Error(E.USER_AUTHENTICATION_ERROR);

  const mediaId = await getCinehivesMediaId(media);
  if (!mediaId) return;

  const rating = await prisma.mediaActivity.findFirst({
    include: {
      mediaRating: true,
    },
    where: {
      userId: user.id,
      activityType: "RATING",
      mediaId: mediaId,
    },
  });

  if (!rating || !rating.mediaRating) return -1;

  return rating.mediaRating.rating;
}

export async function fetchRecentTVActivityRating() {
  const activity = await prisma.mediaActivity.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      activityType: "RATING",
      media: {
        mediaType: "TV",
      },
    },
    select: {
      user: {
        select: {
          username: true,
          profilePictureURL: true,
        },
      },
      media: {
        select: {
          apiMovieDbId: true,
          id: true,
          relatedTVMedia: true,
          mediaType: true,
        },
      },
      mediaRating: true,
    },
    take: 5,
  });

  const media = activity.map((activity) => {
    return {
      id: activity.media.id,
      apiId: activity.media.apiMovieDbId,
      title: activity.media.relatedTVMedia?.title,
      posterPath: activity.media.relatedTVMedia?.posterPath,
      mediaType: activity.media.mediaType,
      otherUserActivity: {
        username: activity.user.username,
        profilePictureURL: activity.user.profilePictureURL,
        rating: activity.mediaRating?.rating || -1,
      },
    };
  });

  const tvData = await _buildAppDataForMedias(media);

  const mediaWithAllData = media.map((media, index) => {
    return {
      ...media,
      rating: tvData[index].rating || null,
      userActivity: tvData[index].userActivity || null,
    };
  });

  return mediaWithAllData;
}

export async function fetchRecentFilmActivityRating() {
  const activity = await prisma.mediaActivity.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      activityType: "RATING",
      media: {
        mediaType: "FILM",
      },
    },
    select: {
      user: {
        select: {
          username: true,
          profilePictureURL: true,
        },
      },
      media: {
        select: {
          apiMovieDbId: true,
          id: true,
          relatedFilmMedia: true,
          mediaType: true,
        },
      },
      mediaRating: true,
    },
    take: 5,
  });

  const media = activity.map((activity) => {
    return {
      id: activity.media.id,
      apiId: activity.media.apiMovieDbId,
      title: activity.media.relatedFilmMedia?.title,
      posterPath: activity.media.relatedFilmMedia?.posterPath,
      mediaType: activity.media.mediaType,
      otherUserActivity: {
        username: activity.user.username,
        profilePictureURL: activity.user.profilePictureURL,
        rating: activity.mediaRating?.rating || -1,
      },
    };
  });

  const tvData = await _buildAppDataForMedias(media);

  const mediaWithAllData = media.map((media, index) => {
    return {
      ...media,
      rating: tvData[index].rating || null,
      userActivity: tvData[index].userActivity || null,
    };
  });

  return mediaWithAllData;
}

export async function getAverageRatingForMedia(media: MediaDatabase) {

  const mediaId = await getCinehivesMediaId(media);
  if (!mediaId) return;

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

export async function getAllInteractionsForMedia(media: MediaDatabase) {
  const mediaId = await getCinehivesMediaId(media);
  if (!mediaId) return;

  const interactions = await prisma.media.findFirst({
    where: {
      id: mediaId,
    },
    select: {
      _count: {
        select: {
          mediaLikes: true,
          mediaRatings: true,
          mediaReviews: true,
          mediaWatches: true,
          mediaOnWatchlists: true,
        },
      },
    },
  });

  return interactions;
}

export async function createNewMediaReview(
  values: z.infer<typeof reviewSchema>,
  media: MediaDatabase,
  rating: number | null,
  liked: boolean,
) {
  const result = reviewSchema.safeParse(values);

  if (!result.success) throw Error(E.SCHEMA_PARSING_ERROR);
  const user = await getUser();
  if (!user) throw Error(E.USER_AUTHENTICATION_ERROR);

  const mediaId = await createNewMedia(media);

  if (rating) {
    await deleteRating(media);
    await createNewRating(rating, media);
  }

  if (liked) {
    await deleteMediaLike(media);
    await createNewMediaLike(media);
  }

  await prisma.mediaActivity.create({
    data: {
      userId: user.id,
      activityType: "REVIEW",
      mediaId: mediaId,
      mediaReview: {
        create: {
          mediaId: mediaId,
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
  media: MediaDatabase,
  oldRating: number | null,
  rating: number | null,
  oldLiked: boolean,
  liked: boolean,
  activityId: string,
) {
  const result = reviewSchema.safeParse(values);

  if (!result.success) throw Error(E.SCHEMA_PARSING_ERROR);
  const user = await getUser();
  if (!user) throw Error(E.USER_AUTHENTICATION_ERROR);

  if (rating && rating !== oldRating) {
    await deleteRating(media);
    await createNewRating(rating, media);
  }

  if (oldLiked !== liked) {
    if (!liked) await deleteMediaLike(media);
    else await createNewMediaLike(media);
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

export async function getUserReviewForMedia(media: MediaDatabase) {
  const user = await getUser();
  if (!user) return [];

  const mediaId = await getCinehivesMediaId(media);
  if (!mediaId) return;

  const result = await prisma.mediaReview.findMany({
    where: {
      mediaId: mediaId,
      activity: {
        activityType: "REVIEW",
        userId: user.id,
      },
    },
    select: {
      activityId: true,
      relatedMedia: {
        select: {
          apiMovieDbId: true,
          id: true,
          mediaType: true,
          relatedTVMedia: true,
          relatedFilmMedia: true,
        },
      },
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

export async function getRecentReviewsForMedia(media: MediaDatabase) {
  const user = await getUser();
  const userId = user ? user.id : randomUUID();

  const mediaId = await getCinehivesMediaId(media);
  if (!mediaId) return;

  const result = await prisma.mediaReview.findMany({
    where: {
      mediaId: mediaId,
      activity: {
        activityType: "REVIEW",
        NOT: {
          userId: userId,
        },
      },
    },
    select: {
      activityId: true,
      relatedMedia: {
        select: {
          apiMovieDbId: true,
          id: true,
          mediaType: true,
          relatedTVMedia: true,
          relatedFilmMedia: true,
        },
      },
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
      relatedMedia: {
        select: {
          apiMovieDbId: true,
          id: true,
          mediaType: true,
          relatedTVMedia: true,
          relatedFilmMedia: true,
        },
      },
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

export async function getAllReviewsForMedia(media: MediaDatabase) {
  const mediaId = await getCinehivesMediaId(media);
  if (!mediaId) return;

  const result = await prisma.mediaReview.findMany({
    where: {
      mediaId: mediaId,
      activity: {
        activityType: "REVIEW",
      },
    },
    select: {
      activityId: true,
      relatedMedia: {
        select: {
          apiMovieDbId: true,
          id: true,
          mediaType: true,
          relatedTVMedia: true,
          relatedFilmMedia: true,
        },
      },
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

export async function createNewDiaryEntry(
  values: z.infer<typeof loggedSchema>,
  media: MediaDatabase,
  rating: number,
  liked: boolean,
) {
  const parseResult = loggedSchema.safeParse(values);
  if (!parseResult.success) return false;

  const user = await getUser();
  const diaryId = await getUserDiaryId();

  if (!diaryId) return false;
  if (!user) return false;

  const mediaId = await createNewMedia(media);

  if (rating) {
    await deleteRating(media);
    await createNewRating(rating, media);
  }

  if (liked) {
    await deleteMediaLike(media);
    await createNewMediaLike(media);
  }

  await prisma.mediaActivity.create({
    data: {
      userId: user.id,
      activityType: "DIARY_ENTRY",
      mediaId: mediaId,
      mediaDiaryEntry: {
        create: {
          diaryId: diaryId,
          mediaId: mediaId,
          loggedDate: values.logDate,
        },
      },
    },
  });

  if (values.review) {
    await prisma.mediaActivity.create({
      data: {
        userId: user.id,
        activityType: "REVIEW",
        mediaId: mediaId,
        mediaReview: {
          create: {
            mediaId: mediaId,
            review: values.review,
            rating,
            liked,
            spoiler: values.spoilers,
            rewatched: values.rewatched,
          },
        },
      },
    });
  }

  revalidatePath("/");
  return true;
}

export async function createNewUserDiary(userId: string) {
  await prisma.userDiary.create({
    data: {
      userId: userId,
    },
  });
}

export async function getUserDiaryId() {
  const user = await getUser();
  if (!user) return null;

  const diary = await prisma.userDiary.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!diary) return null;
  return diary.id;
}
