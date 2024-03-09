import Navbar from "@/components/global/navbar";
import { redirect } from "next/navigation";
import Section from "@/components/global/layout/section";
import SetupForm from "@/components/user/account/setup/setup-form";
import { getUser, getUserProfile } from "@/lib/authentication-functions";

export default async function AccountSetup() {
  const user = await getUser();
  if (!user) redirect("/");
  const profile = await getUserProfile(user);
  if (profile) redirect("/home");

  return (
    <>
      <div className="w-full border-b border-stone-900 bg-black py-6">
        <div className="container mx-auto">
          <h1 className="text-primary text-4xl font-extrabold">Wideshot</h1>
        </div>
      </div>
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
