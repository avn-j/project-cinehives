import Image from "next/image";
import LoginForm from "@/components/user/login/LoginForm";
import AccountFormContainer from "@/components/user/AccountFormContainer";
import { getSupabaseUser } from "@/utils/supabase/user";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getSupabaseUser();

  if (user) redirect("/home");

  return (
    <main className="flex">
      <Image
        src="/blade-runner.jpeg"
        fill
        alt="Banner"
        style={{ objectFit: "cover" }}
        className="fit -z-10 scale-x-[-1]"
      />
      <div className="flex h-svh w-1/2 items-center justify-center">
        <div className="w-9/12 rounded-3xl border border-stone-700 bg-black p-14 shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)]">
          <div>
            <h1 className="text-primary text-6xl font-extrabold">Wideshot</h1>
            <p className="mb-6 mt-2 text-xl">A film-driven social media</p>
          </div>

          <AccountFormContainer />
        </div>
      </div>
    </main>
  );
}
