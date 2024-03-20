import Image from "next/image";
import { FaStar, FaStarHalf } from "react-icons/fa";
import { UserRating as UserRatingProps } from "@/lib/types";

export default function UserRating({ ...props }: UserRatingProps) {
  let halfStar: boolean = false;

  // Checks if there is a half star rating
  if (!(props.rating % 1 == 0)) {
    halfStar = true;
  }

  return (
    <div className="mt-2 flex items-center">
      <div className="relative h-14 w-14 rounded-full bg-stone-700">
        <Image
          src={props.profilePictureSrc}
          alt={props.username}
          fill={true}
          objectFit="cover"
          className="border-primary rounded-full border-2"
        />
      </div>
      <div className="ml-2">
        <span className="font-bold">{props.username}</span>
        <div className="flex gap-0.5">
          {Array.from({ length: props.rating }).map((_item, index) => (
            <FaStar className="text-primary" key={index} />
          ))}
          {halfStar && <FaStarHalf className="text-primary" />}
        </div>
      </div>
    </div>
  );
}
