import Image from "next/image";
import { Input } from "@/components/ui/input";

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
      <div className="flex h-svh w-1/2 items-center justify-center bg-white">
        <div className="bg-black p-10">
          <h1 className="text-primary text-4xl font-extrabold">Wideshot</h1>
          <p className="text-xl">Movie social media</p>

          <Input />
        </div>
      </div>
    </main>
  );
}
