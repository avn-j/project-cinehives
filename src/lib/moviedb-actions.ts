"use server";

import { MOVIE_API_BASE_URL } from "./consts";

export async function fetchPopularMovieData() {
  const url = `${MOVIE_API_BASE_URL}/trending/movie/week?language=en-US`;
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
  const url = `${MOVIE_API_BASE_URL}/trending/tv/week?language=en-US`;
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

export async function fetchFeaturedData() {
  const url = `${MOVIE_API_BASE_URL}/movie/now_playing`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.MOVIEDB_API_READ_TOKEN} `,
    },
    cache: "no-cache",
  });

  return res.json();
}

export async function fetchTopMovieData(page: number) {
  const url = `${MOVIE_API_BASE_URL}/discover/movie?Include_video=false&language=en-US&page=${page}&sort_by=vote_count.desc`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.MOVIEDB_API_READ_TOKEN} `,
    },
    cache: "no-cache",
  });

  return res.json();
}

export async function fetchTopTVShowData(page: number) {
  const url = `${MOVIE_API_BASE_URL}/discover/tv?Include_video=false&language=en-US&page=${page}&sort_by=vote_count.desc`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.MOVIEDB_API_READ_TOKEN} `,
    },
    cache: "no-cache",
  });

  return res.json();
}
