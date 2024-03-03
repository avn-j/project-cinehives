import Navbar from "@/components/global/Navbar";
import Section from "@/components/global/layout/Section";
import Image from "next/image";
import MovieCard from "@/components/global/MovieCard";
import { FaStar } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Movie } from "@/types/types";
import { popularMovies, friendActivity, user } from "@/utils/test-data";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
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
          <h2 className="text-primary text-3xl"> Welcome, {user}</h2>

          <div className="mt-10 flex items-center justify-between">
            <h3 className="text-2xl font-bold">Popular this week</h3>
            <Button variant="link" className="text-lg">
              SEE ALL
            </Button>
          </div>
          <div className="flex flex-wrap gap-4 py-4">
            {popularMovies.map((movie: Movie) => {
              return (
                <MovieCard
                  id={movie.id}
                  key={movie.id}
                  alt={movie.alt}
                  src={movie.src}
                />
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
            {friendActivity.map((movie: Movie) => {
              console.log(movie);
              return (
                <div key={movie.id}>
                  <MovieCard
                    id={movie.id}
                    alt={movie.alt}
                    src={movie.src}
                    status={movie.status}
                    userRating={movie.userRating}
                  />
                </div>
              );
            })}
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
            {popularMovies.map((movie: Movie) => {
              console.log(movie);
              return (
                <div key={movie.id}>
                  <MovieCard
                    id={movie.id}
                    alt={movie.alt}
                    src={movie.src}
                    status={movie.status}
                  />
                </div>
              );
            })}
          </div>
        </Section>
      </main>
    </>
  );
}
