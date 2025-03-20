import Section from "@/components/global/layout/section";
import Navbar from "@/components/global/navbar";
import { getUser, getUserProfile } from "@/lib/authentication-functions";
import { getProfileByUsername } from "@/lib/db-actions";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { FaLocationDot } from "react-icons/fa6";
import { DateTime } from "luxon";
import {
   _buildAppDataForMedias,
   _buildAppDataFromDbActivities,
} from "@/lib/media-data-builder";
import MovieCard from "@/components/global/movie-card";
import MediaListPreview from "@/components/global/media-list-preview";
import { FaCalendar, FaStar } from "react-icons/fa";
import Link from "next/link";
import RatingsChart from "@/components/charts/ratings-chart";

export default async function ProfilePage({
   params,
}: {
   params: { username: string };
}) {
   const user = await getUser();
   const profileCheck = await getUserProfile(user);
   if (user && !profileCheck) redirect("/account/setup");

   const profileData = await getProfileByUsername(params.username);
   if (!profileData) notFound();

   const {
      recentlyWatchlisted,
      animesWatched,
      filmsWatched,
      tvShowsWatched,
      mediaLikesCount,
      mediaRatingsCount,
      mediaReviewsCount,
      mediaWatchlistCount,
      profile,
      recentRatingActivity,
      recentlyLiked,
      mediaDiaryCount,
      recentDiary,
      ratingsData,
   } = profileData;

   const recentActivityData = await _buildAppDataFromDbActivities(
      recentRatingActivity
   );

   const relatedMediaWatchlisted = recentlyWatchlisted?.map(
      (watchlisted) => watchlisted.relatedMedia
   );

   const relatedMediaLiked = recentlyLiked?.map(
      (watchlisted) => watchlisted.relatedMedia
   );

   return (
      <>
         <Navbar />
         <main>
            <div className="pt-24">
               <Section>
                  <div className="flex justify-between items-center">
                     <div>
                        <div className="flex gap-4 items-center">
                           <div className="relative h-32 w-32 rounded-full bg-stone-700">
                              <Image
                                 src={profile.profilePictureURL}
                                 alt={profile.username}
                                 fill={true}
                                 unoptimized
                                 className="rounded-full border-2 border-primary object-cover"
                              />
                           </div>
                           <div>
                              <h1 className="text-2xl font-bold">
                                 @{profile.username}
                              </h1>
                              <h2 className="text-lg text-stone-300">
                                 {profile.firstName}
                              </h2>
                              <h3 className="text-sm text-stone-300 flex gap-1 items-center">
                                 <FaLocationDot />
                                 {profile.country}
                              </h3>
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-12">
                        <div className="flex flex-col items-center">
                           <div className="inline-block font-bold text-2xl">
                              {filmsWatched}
                           </div>{" "}
                           films
                        </div>
                        <div className="flex flex-col items-center">
                           <div className="inline-block font-bold text-2xl">
                              {tvShowsWatched}
                           </div>{" "}
                           TV shows
                        </div>
                        <div className="flex flex-col items-center">
                           <div className="inline-block font-bold text-2xl">
                              {animesWatched}
                           </div>{" "}
                           animes
                        </div>
                     </div>
                  </div>

                  <div className="mt-14 bg-accent rounded py-4">
                     <ul className="grid w-full grid-cols-8 justify-items-center font-bold">
                        <li className="bg-primary text-black px-8 rounded-lg py-1">
                           Profile
                        </li>
                        <li className="py-1">Activity</li>
                        <li className="py-1">Reviews</li>
                        <li className="py-1">Watchlist</li>
                        <li className="py-1">Diary</li>
                        <li className="py-1">Films</li>
                        <li className="py-1">TV Shows</li>
                        <li className="py-1">Anime</li>
                     </ul>
                  </div>

                  <div className="grid grid-cols-12 gap-16 mt-8">
                     <div className="col-span-3 space-y-6">
                        <h2 className="font-bold text-lg">Profile Stats</h2>
                        <div className="mt-4">
                           <div className="flex justify-between text-sm text-stone-200">
                              <h3>Watchlist</h3>
                              <p>{mediaWatchlistCount}</p>
                           </div>
                           <Separator className="bg-stone-200" />
                           {relatedMediaWatchlisted && (
                              <MediaListPreview
                                 medias={relatedMediaWatchlisted}
                              />
                           )}
                        </div>
                        <div className="mt-4">
                           <div className="flex justify-between text-sm text-stone-200">
                              <h3>Likes</h3>
                              <p>{mediaLikesCount}</p>
                           </div>
                           <Separator className="bg-stone-200" />
                           {relatedMediaLiked && (
                              <MediaListPreview medias={relatedMediaLiked} />
                           )}
                        </div>
                        <div className="mt-4">
                           <div className="flex justify-between text-sm text-stone-200">
                              <h3>Diary</h3>
                              <p>{mediaDiaryCount}</p>
                           </div>
                           <Separator className="bg-stone-200" />
                           <ul className="space-y-5 my-4">
                              {recentDiary?.map((entry, index) => {
                                 return (
                                    <li
                                       className="font-body text-sm grid grid-cols-2 items-start"
                                       key={index}
                                    >
                                       <div className="flex items-center gap-2">
                                          <FaCalendar />
                                          <p>
                                             {DateTime.fromJSDate(
                                                entry.loggedDate
                                             ).toFormat("LLL dd")}
                                          </p>
                                       </div>
                                       <Link
                                          href={`/${entry.relatedMedia.mediaType.toLowerCase()}/${
                                             entry.relatedMedia.relatedTVMedia
                                                ?.parentApiId ||
                                             entry.relatedMedia.apiMovieDbId
                                          }`}
                                       >
                                          {entry.relatedMedia.title}
                                       </Link>
                                    </li>
                                 );
                              })}
                           </ul>
                        </div>
                        <div className="mt-4">
                           <div className="flex justify-between text-sm text-stone-200">
                              <h3>Lists</h3>
                              <p>0</p>
                           </div>
                           <Separator className="bg-stone-200" />
                        </div>
                        <div className="mt-4">
                           <div className="flex justify-between text-sm text-stone-200">
                              <h3>Ratings</h3>
                              <p>{mediaRatingsCount}</p>
                           </div>
                           <Separator className="bg-stone-200" />
                           <div className="mt-4 h-24 w-full flex items-end">
                              <div className="flex items-center gap-1">
                                 <p className="mt-1">0</p>
                                 <FaStar className="text-primary" />
                              </div>
                              <RatingsChart data={ratingsData} />
                              <div className="flex items-center gap-1">
                                 <p className="mt-1">5</p>
                                 <FaStar className="text-primary" />
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="col-span-9">
                        <h2 className="font-bold text-lg">Recent Activity</h2>
                        <div className="mt-4 grid grid-cols-4 gap-2">
                           {recentActivityData.map(
                              (media: any, index: number) => {
                                 return (
                                    <MovieCard
                                       key={index}
                                       media={media}
                                       userActivity={media.userActivity}
                                       rating={media.rating}
                                       otherUserRatingActivity={{
                                          username: profile.username,
                                          profilePictureURL:
                                             profile.profilePictureURL,
                                          rating:
                                             recentRatingActivity[index]
                                                .mediaRating?.rating || -1,
                                       }}
                                    />
                                 );
                              }
                           )}
                        </div>
                        <h2 className="font-bold text-lg mt-8">
                           Recent Reviews
                        </h2>
                        <div className="mt-4 grid grid-cols-4 gap-2">
                           {recentActivityData.map(
                              (media: any, index: number) => {
                                 return (
                                    <MovieCard
                                       key={index}
                                       media={media}
                                       userActivity={media.userActivity}
                                       rating={media.rating}
                                       otherUserRatingActivity={{
                                          username: profile.username,
                                          profilePictureURL:
                                             profile.profilePictureURL,
                                          rating:
                                             recentRatingActivity[index]
                                                .mediaRating?.rating || -1,
                                       }}
                                    />
                                 );
                              }
                           )}
                        </div>
                     </div>
                  </div>
               </Section>
            </div>
         </main>
      </>
   );
}
