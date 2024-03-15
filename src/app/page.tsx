import Image from "next/image";
import AccountFormContainer from "@/components/user/account-form-container";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/authentication-functions";

export default async function Home() {
  const user = await getUser();
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
        <div className="w-9/12 rounded-xl border border-stone-700 bg-stone-950 p-14 shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)]">
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
