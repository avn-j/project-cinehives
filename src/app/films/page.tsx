import Section from "@/components/global/layout/section";
import MovieCard from "@/components/global/movie-card";
import Navbar from "@/components/global/navbar";
import InitialLoad from "@/components/infinite-loading-media/initial-load";
import { Separator } from "@/components/ui/separator";
import { getUser, getUserProfile } from "@/lib/authentication-functions";
import { MediaDatabase, fetchRecentFilmActivityRating } from "@/lib/db-actions";
import { _buildAppDataForMedias } from "@/lib/media-data-builder";
import { fetchTrendingMovieData } from "@/lib/moviedb-actions";
import { MediaDataWithUserActivity } from "@/lib/types";
import { MediaType } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function FilmsPage() {
  const user = await getUser();
  const profile = await getUserProfile(user);
  if (user && !profile) redirect("/account/setup");

  const _apiPopularMovieData = await fetchTrendingMovieData(1);
  const initialPopularMovieData = await _buildAppDataForMedias(
    _apiPopularMovieData.results,
  );

  const recentFilmActivity = await fetchRecentFilmActivityRating();

  return (
    <>
      <Navbar />
      <main>
        <div className="pt-24">
          <Section>
            <h2 className="text-3xl">Recent Film Activity</h2>
            <Separator className="mb-4 mt-2 bg-stone-500" />
            <div className="grid grid-cols-5 gap-4">
              {recentFilmActivity.map((media) => {
                const dbMedia: MediaDatabase = {
                  apiId: media.apiId,
                  posterPath: media.posterPath || "",
                  title: media.title || "",
                  mediaType: media.mediaType,
                };

                return (
                  <MovieCard
                    key={media.apiId + "-" + media.otherUserActivity.username}
                    media={dbMedia}
                    rating={media.rating}
                    userActivity={media.userActivity}
                    otherUserRatingActivity={media.otherUserActivity}
                  />
                );
              })}
            </div>
          </Section>
          <Section>
            <h2 className="text-3xl">Trending Films</h2>
            <Separator className="mb-4 mt-2 bg-stone-500" />
            <InitialLoad
              initialMediaCollection={initialPopularMovieData}
              mediaType={MediaType.FILM}
            />
          </Section>
        </div>
      </main>
    </>
  );
}
