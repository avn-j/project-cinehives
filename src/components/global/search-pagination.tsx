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
  const isAfterFirstPage = currentPage > 1;
  const isOnlyOnePage = totalPages === 1;
  const isLastPage = currentPage === totalPages;

  const typeParam = useSearchParams().get("type");
  const pathPrefix = typeParam ? `?type=${typeParam}&` : "?";

  return (
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
