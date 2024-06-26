import Section from "@/components/global/layout/section";
import Navbar from "@/components/global/navbar";
import { Separator } from "@/components/ui/separator";

import SearchBox from "@/components/global/searchbox";
import { redirect } from "next/navigation";
import { getUser, getUserProfile } from "@/lib/authentication-functions";

interface SearchPageProps {}

export default async function SearchPage({}: SearchPageProps) {
  const user = await getUser();
  const profile = await getUserProfile(user);
  if (user && !profile) redirect("/account/setup");

  return (
    <>
      <Navbar />

      <div className="pt-36">
        <Section>
          <h1 className="mb-2 text-xl">Search</h1>
          <SearchBox />
          <Separator className="mt-4 bg-white" />
          <div className="mt-8"></div>
        </Section>
      </div>
    </>
  );
}
