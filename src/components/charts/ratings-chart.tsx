"use client";
import { FaStar, FaStarHalf } from "react-icons/fa6";
import {
   BarChart,
   Bar,
   ResponsiveContainer,
   Tooltip,
   TooltipProps,
   XAxis,
} from "recharts";
import {
   NameType,
   ValueType,
} from "recharts/types/component/DefaultTooltipContent";

interface RatingsChartProps {
   data: { name: string; count: number }[];
}

export default function RatingsChart({ data }: RatingsChartProps) {
   return (
      <ResponsiveContainer height="100%" width="100%">
         <BarChart data={data}>
            <Tooltip content={<CustomTooltip />} />
            <XAxis dataKey="name" hide={true} />
            <Bar dataKey="count" fill="#ffc300" />
         </BarChart>
      </ResponsiveContainer>
   );
}

function CustomTooltip({
   active,
   payload,
   label,
}: TooltipProps<ValueType, NameType>) {
   if (active && payload && payload.length) {
      let halfStar: boolean = false;
      const ratingNumber = parseFloat(label);

      if (!(ratingNumber % 1 == 0)) {
         halfStar = true;
      }

      return (
         <div className="bg-black border border-white rounded px-2 flex text-sm items-center gap-1 py-1">
            <p>{payload[0].value}</p>
            <div className="flex gap-0.5">
               {Array.from({ length: ratingNumber }).map((_item, index) => (
                  <FaStar className="text-primary" key={index} />
               ))}
               {halfStar && <FaStarHalf className="text-primary" />}
            </div>
            <p>ratings</p>
         </div>
      );
   }
}
