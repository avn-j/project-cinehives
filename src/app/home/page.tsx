import Navbar from "@/components/global/navbar";
import Section from "@/components/global/layout/section";
import Image from "next/image";
import { FaStar } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { getUser, getUserProfile } from "@/lib/authentication-functions";
import {
  fetchPopularMovieData,
  fetchPopularTVData,
  fetchFeaturedData,
} from "@/lib/moviedb-actions";
import { buildBannerData, buildMovieData } from "@/lib/movie-data-builder";
import MediaCarousel from "@/components/global/home/media-carousel";
import FeaturedCarousel from "@/components/global/home/featured-carousel";

export default async function AppHome() {
  const user = await getUser();
  if (!user) redirect("/");
  const profile = await getUserProfile(user);
  if (!profile) redirect("/account/setup");

  const popularMovieData = await fetchPopularMovieData();
  const popularTVData = await fetchPopularTVData();
  const featuredMoviesData = await fetchFeaturedData();

  const refinedPopularMovieData = await buildMovieData(
    popularMovieData.results,
    user,
  );
  const refinedPopularTVData = await buildMovieData(
    popularTVData.results,
    user,
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
        <h2 className="text-primary mb-16 mt-12 text-3xl">
          Welcome, {profile.firstName}
        </h2>

        <MediaCarousel
          mediaCollection={refinedPopularMovieData}
          carouselTitle="Popular movies this week"
        />
      </Section>
      <Section>
        <MediaCarousel
          mediaCollection={refinedPopularTVData}
          carouselTitle="Popular TV shows this week"
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
