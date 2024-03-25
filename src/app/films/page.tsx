import Section from "@/components/global/layout/section";
import MovieCard from "@/components/global/movie-card";
import Navbar from "@/components/global/navbar";
import InitialLoad from "@/components/infinite-loading-media/initial-load";
import { Separator } from "@/components/ui/separator";
import { getUser, getUserProfile } from "@/lib/authentication-functions";
import { fetchRecentFilmActivityRating } from "@/lib/db-actions";
import { buildDataForMedias } from "@/lib/movie-data-builder";
import { fetchTrendingMovieData } from "@/lib/moviedb-actions";
import { MediaType } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function FilmsPage() {
  const user = await getUser();
  if (!user) redirect("/");
  const profile = await getUserProfile(user);
  if (!profile) redirect("/account/setup");

  const popularMovieData = await fetchTrendingMovieData(1);
  const initialPopularMovieData = await buildDataForMedias(
    popularMovieData.results,
    user.id,
  );

  const recentFilmActivity = await fetchRecentFilmActivityRating(user.id);

  return (
    <>
      <Navbar />
      <main>
        <div className="pt-24">
          <Section>
            <h2 className="text-3xl">Recent Film Activity</h2>
            <Separator className="mb-4 mt-2 bg-stone-500" />
            <div className="grid grid-cols-5 gap-4">
              {recentFilmActivity.map((media: any) => (
                <MovieCard
                  title={media.title}
                  rating={media.rating}
                  alt={media.title}
                  id={media.id}
                  src={media.poster_path}
                  userActivity={media.userActivity}
                  otherUserRatingActivity={media.otherUserActivity}
                  key={media.id + "-" + media.otherUserActivity.username}
                  mediaType={MediaType.film}
                />
              ))}
            </div>
          </Section>
          <Section>
            <h2 className="text-3xl">Trending Films</h2>
            <Separator className="mb-4 mt-2 bg-stone-500" />
            <InitialLoad
              initialMediaCollection={initialPopularMovieData}
              mediaType={MediaType.film}
            />
          </Section>
        </div>
      </main>
    </>
  );
}
