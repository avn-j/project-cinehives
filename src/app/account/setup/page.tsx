import { redirect } from "next/navigation";
import Section from "@/components/global/layout/section";
import {
  checkProfileStarted,
  getUser,
  getUserProfile,
} from "@/lib/authentication-functions";
import SetupFormContainer from "@/components/user/account/setup-form-container";
import { fetchTopMovieData, fetchTopTVShowData } from "@/lib/moviedb-actions";
import { buildMovieData } from "@/lib/movie-data-builder";

export default async function AccountSetup() {
  const user = await getUser();
  if (!user) redirect("/");
  const profile = await getUserProfile(user);
  if (profile) redirect("/home");

  const topRatedMovieData = await fetchTopMovieData(1);
  const refinedTopRatedMovieData = await buildMovieData(
    topRatedMovieData.results,
    user,
  );

  const topRatedTVData = await fetchTopTVShowData(1);
  const refinedTopRatedTVData = await buildMovieData(
    topRatedTVData.results,
    user,
  );

  const hasProfileStarted = await checkProfileStarted(user.id);

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
