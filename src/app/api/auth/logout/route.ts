import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);

  const supabase = createClient();

  await supabase.auth.signOut();

  return NextResponse.redirect(requestUrl.origin);
}
