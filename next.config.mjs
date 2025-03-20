/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "upddmzowatarbwhpourt.supabase.co",
      },
      {
        hostname: "image.tmdb.org",
      },
    ],
  },
};

export default nextConfig;
