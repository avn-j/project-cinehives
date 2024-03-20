import { FaStar, FaStarHalf } from "react-icons/fa";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

export default function AverageMediaRating({
  ...props
}: {
  rating?: number | null;
  count?: number | null;
}) {
  let halfStar: boolean = false;

  // Checks if there is a half star rating
  if (props.rating && !(props.rating % 1 == 0)) {
    halfStar = true;
  }

  return (
    <>
      {props.rating && (
        <TooltipProvider>
          <Tooltip delayDuration={1.5}>
            <TooltipTrigger>
              <div className="flex gap-0.5">
                {Array.from({ length: props.rating }).map((_item, index) => (
                  <FaStar size={20} className="text-primary" key={index} />
                ))}
                {halfStar && <FaStarHalf size={20} className="text-primary" />}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-accent">
              <p>
                An average of {props.rating.toFixed(2)} based on {props.count}
                users
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
}
