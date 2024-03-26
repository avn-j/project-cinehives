import CommentBlock from "@/components/global/comment-block";
import ReviewCommentForm from "@/components/global/forms/review-comment-form";
import Section from "@/components/global/layout/section";
import MovieCard from "@/components/global/movie-card";
import Navbar from "@/components/global/navbar";
import ReviewBlock from "@/components/global/review-block";
import { Separator } from "@/components/ui/separator";
import { getUser, getUserProfile } from "@/lib/authentication-functions";
import { MOVIE_DB_IMG_PATH_PREFIX } from "@/lib/consts";
import { getMediaType, getReviewById } from "@/lib/db-actions";
import { buildDataForMedia } from "@/lib/movie-data-builder";
import {
  fetchMovieDetailsById,
  fetchTVDetailsById,
} from "@/lib/moviedb-actions";
import { MediaType } from "@prisma/client";
import { DateTime } from "luxon";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function ReviewPage({
  params,
}: {
  params: { reviewId: string };
}) {
  const user = await getUser();
  const profile = await getUserProfile(user);
  if (user && !profile) redirect("/account/setup");

  const review = await getReviewById(params.reviewId);
  if (!review) notFound();

  const mediaType = await getMediaType(review.media.mediaId);

  if (!mediaType) {
    notFound();
  }

  let mediaResult;

  if (mediaType.mediaType == MediaType.film) {
    mediaResult = await fetchMovieDetailsById(review.media.mediaId.toString());
  } else {
    mediaResult = await fetchTVDetailsById(review.media.mediaId.toString());
  }

  const mediaData = await buildDataForMedia(mediaResult);

  const {
    id,
    title,
    name,
    first_air_date,
    original_title,
    release_date,
    backdrop_path,
  } = mediaResult;

  const postedDate = DateTime.fromJSDate(review.activity.createdAt).toFormat(
    "DD",
  );

  let hasLiked = false;
  let ownReview = false;

  if (user) {
    hasLiked = review.reviewLikes.some((value) => {
      return value.activity.user.id === user.id;
    });
    ownReview = review.activity.user.id === user.id;
  }

  const { media, activity, reviewLikes, reviewComments, ...reviewContent } =
    review;

  const mediaTitle = mediaType.mediaType === MediaType.film ? title : name;

  const releaseYear =
    mediaType.mediaType === MediaType.film
      ? release_date.split("-")[0]
      : first_air_date.split("-")[0];
  const watched = mediaData.userActivity.includes("watched");

  return (
    <>
      <Navbar />

      <main>
        <div className="relative min-h-[600px]">
          <Image
            src={MOVIE_DB_IMG_PATH_PREFIX + backdrop_path}
            layout="fill"
            className="-z-10 object-cover object-top"
            alt="Banner"
          />
        </div>
        <Section>
          <div className="-mt-36 grid grid-cols-4 gap-8">
            <div>
              <MovieCard
                alt={title}
                id={id}
                mediaType={mediaType.mediaType}
                rating={mediaData.rating}
                src={mediaData.posterPath}
                title={title}
                userActivity={mediaData.userActivity}
              />
            </div>

            <div className="col-span-3 mt-40">
              <Link href={`/${mediaType.mediaType}/${id}`}>
                <h1 className=" text-4xl font-bold">{mediaTitle}</h1>
              </Link>
              <h2 className="mt-2 text-3xl">({releaseYear})</h2>

              <div className="mt-8">
                <ReviewBlock
                  review={{ mediaId: media.mediaId, ...reviewContent }}
                  reviewUser={activity.user}
                  date={postedDate}
                  media={media}
                  ownReview={ownReview}
                  watched={watched}
                  likes={reviewLikes}
                  hasLiked={hasLiked}
                  commentCount={review._count.reviewComments}
                />
              </div>

              <h2 className="mt-8 text-xl">
                Comments ({reviewComments.length})
              </h2>
              <Separator className="my-2 bg-white" />
              {reviewComments.map((comment) => {
                const postedDate = DateTime.fromJSDate(
                  comment.activity.createdAt,
                ).toRelative();

                let ownComment = false;
                if (user) {
                  ownComment = comment.activity.user.id === user.id;
                }

                return (
                  <CommentBlock
                    key={comment.activityId}
                    commentId={comment.activityId}
                    commentUser={comment.activity.user}
                    comment={comment.comment}
                    date={postedDate}
                    ownComment={ownComment}
                    likes={comment.commentLikes}
                  />
                );
              })}

              {review.reviewComments.length === 0 && (
                <p className="mb-12 mt-4 text-stone-400">
                  No comments on this review
                </p>
              )}

              {user && <ReviewCommentForm parentReviewId={review.activityId} />}
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
