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
    <div className="flex items-center">
      <Image
        src="/profile.jpeg"
        height={50}
        width={50}
        alt="Profile Picture"
        className="border-primary mt-3 rounded-full"
      />
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
