export async function fetchPopularMovieData() {
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

export async function fetchPopularTVData() {
  const url = "https://api.themoviedb.org/3/trending/tv/week?language=en-US";
  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.MOVIEDB_API_READ_TOKEN}`,
    },
  });

  return res.json();
}

export async function fetchFeaturedData() {
  const url = "https://api.themoviedb.org/3/movie/now_playing";
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
