import { MediaReview, Profile } from "@prisma/client";
import { DateTime } from "luxon";
import Image from "next/image";
import { FaHeart, FaStar, FaStarHalf } from "react-icons/fa";

interface ReviewBlockProps {
  review: MediaReview | null;
  user: { username: string; profilePictureURL: string };
  date: Date;
}

export default async function ReviewBlock({
  review,
  user,
  date,
}: ReviewBlockProps) {
  const dt = DateTime.fromJSDate(date);
  const postedDate = dt.toFormat("DD");
  let halfStar: boolean = false;

  // Checks if there is a half star rating
  if (review?.rating && review?.rating !== null && !(review.rating % 1 == 0)) {
    halfStar = true;
  }

  return (
    <div className="bg-accent rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 rounded-full bg-stone-700">
            <Image
              src={user.profilePictureURL}
              alt={user.username}
              fill={true}
              objectFit="cover"
              className="border-primary rounded-full "
            />
          </div>
          <div>
            <p>
              <span className="text-stone-300">Reviewed by</span>{" "}
              {user.username}
            </p>
            <p className="text-xs text-stone-300">{postedDate}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {review?.liked && <FaHeart className="text-red-500" />}
          <div className="flex gap-0.5">
            {review?.rating &&
              Array.from({ length: review?.rating }).map((_item, index) => (
                <FaStar className="text-primary" key={index} />
              ))}

            {halfStar && <FaStarHalf className="text-primary" />}
          </div>
        </div>
      </div>
      <p className="mt-6">{review?.review}</p>
    </div>
  );
}
