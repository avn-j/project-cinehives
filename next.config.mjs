/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "gqnctbbjhevjgplrhphm.supabase.co",
      },
      {
        hostname: "image.tmdb.org",
      },
    ],
  },
};

export default nextConfig;
