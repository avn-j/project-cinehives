import { Media } from "@prisma/client";
import Image from "next/image";

interface MediaListPreviewProps {
   medias: Media[];
}

export default async function MediaListPreview({
   medias,
}: MediaListPreviewProps) {
   return (
      <>
         <div className="flex -space-x-9 justify-center mt-4">
            {medias.map((media) => {
               return (
                  <Image
                     key={media.id}
                     src={media.posterPath}
                     alt={media.title}
                     width={85}
                     height={85}
                     className="rounded border border-green-50 border-opacity-15 object-cover"
                  />
               );
            })}
         </div>
      </>
   );
}
