import Navbar from "@/components/global/navbar";
import Section from "@/components/global/layout/section";
import Image from "next/image";
import MovieCard, { MovieProps } from "@/components/global/movie-card";
import { FaStar } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { getUser, getUserProfile } from "@/lib/authentication-functions";
import { getPopularMovieData, getUpcomingMovies } from "./functions";
import { buildMovieData } from "@/lib/movie-data-builder";

export default async function AppHome() {
  const user = await getUser();
  if (!user) redirect("/");
  const profile = await getUserProfile(user);
  if (!profile) redirect("/account/setup");

  const popularData = await getPopularMovieData();
  const popularMovies = popularData.results.slice(0, 5);
  const builtData = await buildMovieData(popularMovies, user);
  const upcomingData = await getUpcomingMovies();
  const upcomingMovies = upcomingData.results.slice(0, 5);

  return (
    <main>
      <Navbar />
      <div className="relative min-h-[600px]">
        <div className="container relative min-h-[600px]">
          <div className="absolute bottom-0 left-0 px-8 py-8">
            <div className="py-6 text-3xl font-bold uppercase">{`This Weeks Featured Films`}</div>
            <div className="text-3xl font-bold uppercase">2024</div>
            <h3 className="text-6xl font-black">Poor Things</h3>
            <div className="flex items-center gap-2 text-3xl font-bold uppercase">
              <FaStar className="text-primary" size={25} />
              4.2
            </div>
          </div>
        </div>

        <Image
          src="/image.png"
          layout="fill"
          objectFit="cover"
          alt="Banner"
          className="-z-10"
        />
      </div>
      <Section>
        <h2 className="text-primary text-3xl"> Welcome, {profile.firstName}</h2>

        <div className="mt-10 flex items-center justify-between">
          <h3 className="text-2xl font-bold">Popular this week</h3>
          <Button variant="link" className="text-lg">
            SEE ALL
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 py-4">
          {builtData.map((movie: any) => {
            return (
              <div key={movie.id}>
                <MovieCard
                  user={user}
                  id={movie.id}
                  alt={movie.title}
                  src={`https://image.tmdb.org/t/p/original/${movie.posterPath}`}
                  status={movie.status}
                  rating={movie.rating}
                  userActivity={movie.userActivity}
                />
              </div>
            );
          })}
        </div>
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
      <Section>
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Films coming soon</h3>
          <Button variant="link" className="text-lg">
            SEE ALL
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 py-4">
          {/* {upcomingMovies.map((movie: any) => {
            return (
              <div key={movie.id}>
                <MovieCard
                  user={user}
                  id={movie.id}
                  alt={movie.title}
                  src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                  status={movie.status}
                  userRating={movie.userRating}
                />
              </div>
            );
          })} */}
        </div>
      </Section>
    </main>
  );
}
