"use server";
import { redirect } from "next/navigation";
import { searchSchema } from "@/schemas/schemas";

export async function search(
  query: { search: string },
  typeParam: string | null,
  pageParam: string | null,
) {
  const result = searchSchema.safeParse(query);

  if (!result.success) return false;

  // Append type search param if it exists in previous URL
  const params = typeParam ? `?type=${typeParam}` : "";
  const uriReplace = query.search.replaceAll(" ", "+");
  redirect(`/search/${uriReplace + params}`);
}
