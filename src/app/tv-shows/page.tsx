import Section from "@/components/global/layout/section";
import MovieCard from "@/components/global/movie-card";
import Navbar from "@/components/global/navbar";
import InitialLoad from "@/components/infinite-loading-media/initial-load";
import { Separator } from "@/components/ui/separator";
import { getUser, getUserProfile } from "@/lib/authentication-functions";
import { MediaDatabase, fetchRecentTVActivityRating } from "@/lib/db-actions";
import { _buildAppDataForMedias } from "@/lib/media-data-builder";
import { fetchTrendingTVShowData } from "@/lib/moviedb-actions";
import { MediaType } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function FilmsPage() {
  const user = await getUser();
  const profile = await getUserProfile(user);
  if (user && !profile) redirect("/account/setup");

  const _apiPopularTVData = await fetchTrendingTVShowData(1);
  const initialPopulartTVShowData = await _buildAppDataForMedias(
    _apiPopularTVData.results,
  );
  const recentTVShowActivity = await fetchRecentTVActivityRating();

  return (
    <>
      <Navbar />

      <main>
        <div className="pt-24">
          <Section>
            <h2 className="text-3xl">Recent TV Show Activity</h2>
            <Separator className="mb-4 mt-2 bg-stone-500" />

            <div className="grid grid-cols-5 gap-4">
              {recentTVShowActivity.map((media) => {
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
            <h2 className="text-3xl">Trending TV Shows</h2>
            <Separator className="mb-4 mt-2 bg-stone-500" />
            <InitialLoad
              initialMediaCollection={initialPopulartTVShowData}
              mediaType={MediaType.TV}
            />
          </Section>
        </div>
      </main>
    </>
  );
}
