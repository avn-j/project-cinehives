import { redirect } from "next/navigation";
import Section from "@/components/global/layout/section";
import {
  checkProfileStarted,
  getUser,
  getUserProfile,
} from "@/lib/authentication-functions";
import SetupFormContainer from "@/components/user/account/setup-form-container";
import { fetchTopMovieData, fetchTopTVShowData } from "@/lib/moviedb-actions";
import { _buildAppDataForMedias } from "@/lib/media-data-builder";

export default async function AccountSetup() {
  const user = await getUser();
  if (!user) redirect("/");
  const profile = await getUserProfile(user);
  if (profile?.profileStage === "CREATED") redirect("/");

  const _apiTopRatedFilmData = await fetchTopMovieData(1);
  const topRatedFilmData = await _buildAppDataForMedias(
    _apiTopRatedFilmData.results,
  );

  const _apiTopRatedTVData = await fetchTopTVShowData(1);
  const topRatedTVData = await _buildAppDataForMedias(
    _apiTopRatedTVData.results,
  );

  const hasProfileStarted = profile?.profileStage === "ONBOARDING";

  return (
    <>
      <div className="w-full border-b border-stone-900 py-6">
        <div className="container mx-auto">
          <h1 className="text-4xl font-extrabold text-primary">Cinehives</h1>
        </div>
      </div>
      <main>
        <Section>
          <SetupFormContainer
            movieCollection={topRatedFilmData}
            tvShowCollection={topRatedTVData}
            user={user}
            profileStarted={hasProfileStarted}
          />
        </Section>
      </main>
    </>
  );
}
