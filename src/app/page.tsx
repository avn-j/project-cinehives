import Navbar from "@/components/global/navbar";
import Section from "@/components/global/layout/section";
import { Button } from "@/components/ui/button";
import { getUser, getUserProfile } from "@/lib/authentication-functions";
import {
  fetchPopularMovieData,
  fetchPopularTVData,
  fetchFeaturedData,
} from "@/lib/moviedb-actions";
import {
  _buildBannerData,
  _buildAppDataForMedias,
} from "@/lib/media-data-builder";
import MediaCarousel from "@/components/home/media-carousel";
import FeaturedCarousel from "@/components/home/featured-carousel";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaInfoCircle } from "react-icons/fa";
import Link from "next/link";

export default async function AppHome() {
  const user = await getUser();
  const profile = await getUserProfile(user);
  if (user && !profile) redirect("/account/setup");

  const _popularMovieData = await fetchPopularMovieData();
  const _popularTVData = await fetchPopularTVData();
  const _featuredMoviesData = await fetchFeaturedData();

  const filmData = await _buildAppDataForMedias(_popularMovieData.results);

  const tvData = await _buildAppDataForMedias(_popularTVData.results);

  const refinedFeaturedMoviesData = await _buildBannerData(
    _featuredMoviesData.results,
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
            {profile?.profileStage === "ONBOARDING" && (
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
              <h2 className="mb-12 text-4xl font-bold text-primary">
                Welcome, {profile.firstName}
              </h2>
            )}

            <div className="">
              <MediaCarousel
                medias={filmData}
                carouselTitle="Popular movies this week"
                seeAllLink="/films"
              />
            </div>
          </Section>
          <Section>
            <MediaCarousel
              medias={tvData}
              carouselTitle="Popular TV shows this week"
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
