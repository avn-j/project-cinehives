import { FaStar, FaStarHalf } from "react-icons/fa";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

export default function AverageMediaRating({
  rating,
  count = 0,
}: {
  rating?: number | null;
  count?: number;
}) {
  let halfStar: boolean = false;

  // Checks if there is a half star rating
  if (rating && !(rating % 1 == 0)) {
    halfStar = true;
  }

  return (
    <>
      {rating && (
        <TooltipProvider>
          <Tooltip delayDuration={1.5}>
            <TooltipTrigger>
              <div className="flex gap-0.5">
                {Array.from({ length: rating }).map((_item, index) => (
                  <FaStar size={20} className="text-primary" key={index} />
                ))}
                {halfStar && <FaStarHalf size={20} className="text-primary" />}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-accent">
              <p>
                An average of {rating.toFixed(2)} based on {count}{" "}
                {count > 1 ? "users" : "user"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
}
