import Section from "@/components/global/layout/section";
import Navbar from "@/components/global/navbar";

import SearchBox from "@/components/global/searchbox";
import { redirect } from "next/navigation";
import { getUser, getUserProfile } from "@/lib/authentication-functions";
import SearchResults from "@/components/global/search-results";
import { Suspense } from "react";
import { ImSpinner2 } from "react-icons/im";

interface SearchPageProps {
  params: {
    query: string;
  };
  searchParams: {
    page: string;
    type: string;
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const searchQuery = params.query.replaceAll("%2B", " ");
  const filterType = searchParams.type ? searchParams.type : "all";

  const user = await getUser();
  const profile = await getUserProfile(user);
  if (user && !profile) redirect("/account/setup");

  return (
    <>
      <Navbar />

      <div className="pt-36">
        <Section>
          <h1 className="mb-1 text-3xl font-bold">Search</h1>
          <p className="mb-12 text-xl">Find what you are looking for</p>
          <SearchBox />
          <div className="flex justify-between">
            <h2 className="mt-8 text-3xl font-bold">
              Search results for {`"${searchQuery}"`}
            </h2>
          </div>
          <Suspense
            fallback={
              <div className="mt-16 flex w-full justify-center">
                <ImSpinner2 className="text-primary animate-spin" size={30} />
              </div>
            }
          >
            <SearchResults
              filterType={filterType}
              page={currentPage}
              query={searchQuery}
            />
          </Suspense>
        </Section>
      </div>
    </>
  );
}
