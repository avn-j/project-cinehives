import Navbar from "@/components/global/navbar";
import Section from "@/components/global/layout/section";
import { Button } from "@/components/ui/button";
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
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaInfo } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import Link from "next/link";

export default async function AppHome() {
  const user = await getUser();
  const profile = await getUserProfile(user);
  if (user && !profile) redirect("/account/setup");

  const popularMovieData = await fetchPopularMovieData();
  const popularTVData = await fetchPopularTVData();
  const featuredMoviesData = await fetchFeaturedData();

  const refinedPopularMovieData = await buildDataForMedias(
    popularMovieData.results,
  );

  const refinedPopularTVData = await buildDataForMedias(popularTVData.results);

  const refinedFeaturedMoviesData = await buildBannerData(
    featuredMoviesData.results,
  );

  return (
    <>
      <Navbar />
      <main>
        <FeaturedCarousel
          carouselTitle="Movies in theatres"
          mediaCollection={refinedFeaturedMoviesData}
        />
        <div className="my-16">
          <Section>
            {profile?.profileStage === "onboarding" && (
              <Alert className="mb-12">
                <AlertTitle className="flex gap-2">
                  <FaInfoCircle /> Heads up!
                </AlertTitle>
                <AlertDescription>
                  {`Looks like you haven't finished setting up your account.`}{" "}
                  Click{" "}
                  <Button variant="link" className="px-0 py-0">
                    <Link href="/account/setup"> here </Link>
                  </Button>{" "}
                  to continue setting it up.
                </AlertDescription>
              </Alert>
            )}

            {profile && (
              <h2 className="text-primary mb-12 text-4xl font-bold">
                Welcome, {profile.firstName}
              </h2>
            )}

            <div className="">
              <MediaCarousel
                mediaCollection={refinedPopularMovieData}
                carouselTitle="Popular movies this week"
                mediaType={MediaType.film}
                seeAllLink="/films"
              />
            </div>
          </Section>
          <Section>
            <MediaCarousel
              mediaCollection={refinedPopularTVData}
              carouselTitle="Popular TV shows this week"
              mediaType={MediaType.tv}
              seeAllLink="/tv-shows"
            />
          </Section>

          {profile && (
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
          )}
        </div>
      </main>
    </>
  );
}
