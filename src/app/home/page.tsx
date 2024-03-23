import Navbar from "@/components/global/navbar";
import Section from "@/components/global/layout/section";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { getUser, getUserProfile } from "@/lib/authentication-functions";
import {
  fetchPopularMovieData,
  fetchPopularTVData,
  fetchFeaturedData,
} from "@/lib/moviedb-actions";
import { buildBannerData, buildDataForMedias } from "@/lib/movie-data-builder";
import MediaCarousel from "@/components/home/media-carousel";
import FeaturedCarousel from "@/components/home/featured-carousel";
import { MediaType } from "@prisma/client";

export default async function AppHome() {
  const user = await getUser();
  if (!user) redirect("/");
  const profile = await getUserProfile(user);
  if (!profile) redirect("/account/setup");

  const popularMovieData = await fetchPopularMovieData();
  const popularTVData = await fetchPopularTVData();
  const featuredMoviesData = await fetchFeaturedData();

  const refinedPopularMovieData = await buildDataForMedias(
    popularMovieData.results,
    user.id,
  );
  const refinedPopularTVData = await buildDataForMedias(
    popularTVData.results,
    user.id,
  );

  const refinedFeaturedMoviesData = await buildBannerData(
    featuredMoviesData.results,
  );

  return (
    <main>
      <Navbar />
      <FeaturedCarousel
        carouselTitle="Movies in theatres"
        mediaCollection={refinedFeaturedMoviesData}
      />

      <Section>
        <h2 className="text-primary mb-16 mt-12 text-4xl font-bold">
          Welcome, {profile.firstName}
        </h2>

        <MediaCarousel
          mediaCollection={refinedPopularMovieData}
          carouselTitle="Popular movies this week"
          mediaType={MediaType.film}
        />
      </Section>
      <Section>
        <MediaCarousel
          mediaCollection={refinedPopularTVData}
          carouselTitle="Popular TV shows this week"
          mediaType={MediaType.tv}
        />
      </Section>
      <Section>
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Recent Friend Activity</h3>
          <Button variant="link" className="text-lg">
            SEE ALL
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 py-4">
          <h2>No friend activity</h2>
        </div>
      </Section>
    </main>
  );
}
