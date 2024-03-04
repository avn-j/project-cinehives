import Image from "next/image";
import LoginForm from "@/components/user/login/LoginForm";
import AccountFormContainer from "@/components/user/AccountFormContainer";

export default function Home() {
  return (
    <main className="flex">
      <Image
        src="/blade-runner.jpeg"
        fill
        alt="Banner"
        style={{ objectFit: "cover" }}
        className="fit -z-10"
      />
      <div className="h-svh w-1/2"></div>
      <div className="flex h-svh w-1/2 items-center justify-center">
        <div className="w-3/5 rounded border border-stone-700 bg-black p-14 shadow-xl">
          <div>
            <h1 className="text-primary  text-6xl font-extrabold">Wideshot</h1>
            <p className="mb-6 mt-2  text-xl">A film-driven social media</p>
          </div>

          <AccountFormContainer />
        </div>
      </div>
    </main>
  );
}
