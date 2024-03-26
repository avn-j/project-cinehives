import { redirect } from "next/navigation";
import Section from "@/components/global/layout/section";
import {
  checkProfileStarted,
  getUser,
  getUserProfile,
} from "@/lib/authentication-functions";
import SetupFormContainer from "@/components/user/account/setup-form-container";
import { fetchTopMovieData, fetchTopTVShowData } from "@/lib/moviedb-actions";
import { buildDataForMedias } from "@/lib/movie-data-builder";

export default async function AccountSetup() {
  const user = await getUser();
  if (!user) redirect("/");
  const profile = await getUserProfile(user);
  if (profile?.profileStage === "created") redirect("/");

  const topRatedMovieData = await fetchTopMovieData(1);
  const refinedTopRatedMovieData = await buildDataForMedias(
    topRatedMovieData.results,
  );

  const topRatedTVData = await fetchTopTVShowData(1);
  const refinedTopRatedTVData = await buildDataForMedias(
    topRatedTVData.results,
  );

  const hasProfileStarted = profile?.profileStage === "onboarding";

  return (
    <>
      <div className="w-full border-b border-stone-900 py-6">
        <div className="container mx-auto">
          <h1 className="text-primary text-4xl font-extrabold">Cinehives</h1>
        </div>
      </div>
      <main>
        <Section>
          <SetupFormContainer
            movieCollection={refinedTopRatedMovieData}
            tvShowCollection={refinedTopRatedTVData}
            user={user}
            profileStarted={hasProfileStarted}
          />
        </Section>
      </main>
    </>
  );
}
