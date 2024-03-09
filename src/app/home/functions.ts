"use server";

export async function getPopularMovieData() {
  const url = "https://api.themoviedb.org/3/trending/movie/week?language=en-US";
  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.MOVIEDB_API_READ_TOKEN}`,
    },
    cache: "no-cache",
  });

  return res.json();
}

export async function getUpcomingMovies() {
  const url =
    "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1";
  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.MOVIEDB_API_READ_TOKEN}`,
    },
  });

  return res.json();
}
