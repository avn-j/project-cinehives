import Navbar from "@/components/global/Navbar";
import { getSupabaseUser } from "@/utils/supabase/user";
import { redirect } from "next/navigation";
import prisma from "../../../../prisma/client";
import Section from "@/components/global/layout/Section";
import SetupForm from "@/components/user/account/setup/SetupForm";

export default async function AccountSetup() {
  const user = await getSupabaseUser();

  if (!user) redirect("/");

  const profile = await prisma.profile.findFirst({
    where: {
      id: user.id,
    },
  });

  if (profile?.profileCreated) redirect("/home");

  return (
    <>
      <Navbar logoOnly={true} fixed={false} />
      <main className="flex flex-col justify-center">
        <Section>
          <div className="w-1/2 rounded-3xl border border-stone-700 bg-black p-14 shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)]">
            <h2 className="text-3xl font-bold">Account Setup</h2>
            <p className="mt-4 text-xl">
              To get started with Wideshot, you will need to set up your account
              first.
            </p>
            <div className="">
              <SetupForm />
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
