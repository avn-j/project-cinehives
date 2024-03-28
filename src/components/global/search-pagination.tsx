"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface SearchPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function SearchPagination({
  currentPage,
  totalPages,
}: SearchPaginationProps) {
  const isLastThreePages = currentPage >= totalPages - 2;
  const isAfterFirstPage = currentPage > 1;
  const isOnlyOnePage = totalPages === 1;
  const isPastFirstTwoPages = currentPage > 2;
  const isLastPage = currentPage === totalPages;

  const typeParam = useSearchParams().get("type");
  const pathPrefix = typeParam ? `?type=${typeParam}&` : "?";

  return (
    // <>

    //         {isLastThreePages && (
    //           <>
    //             {totalPages - 2 > 0 && (
    //               <PaginationItem>
    //                 <PaginationLink
    //                   isActive={currentPage === totalPages - 2}
    //                   href={pathPrefix + `page=${totalPages - 2}`}
    //                 >
    //                   {totalPages - 2}
    //                 </PaginationLink>
    //               </PaginationItem>
    //             )}
    //             <PaginationItem>
    //               <PaginationLink
    //                 isActive={currentPage === totalPages - 1}
    //                 href={pathPrefix + `page=${totalPages - 1}`}
    //               >
    //                 {totalPages - 1}
    //               </PaginationLink>
    //             </PaginationItem>
    //             <PaginationItem>
    //               <PaginationLink
    //                 isActive={currentPage === totalPages}
    //                 href={pathPrefix + `page=${totalPages}`}
    //               >
    //                 {totalPages}
    //               </PaginationLink>
    //             </PaginationItem>
    //           </>
    //         )}

    // </>

    <>
      {!isOnlyOnePage && (
        <Pagination>
          <PaginationContent>
            {isAfterFirstPage && (
              <PaginationItem>
                <PaginationPrevious
                  href={pathPrefix + `page=${currentPage - 1}`}
                />
              </PaginationItem>
            )}
            {Array.from({ length: totalPages }).map((_item, index) => {
              return (
                <PaginationItem key={index + 1}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    href={pathPrefix + `page=${index + 1}`}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            {!isLastPage && (
              <PaginationItem>
                <PaginationNext href={pathPrefix + `page=${currentPage + 1}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
