import Image from "next/image";
import { Button } from "../ui/button";
import { FaBell } from "react-icons/fa";
import { Avatar } from "../ui/avatar";

export default function Navbar() {
  return (
    <div className="fixed z-20 w-full border-b border-stone-900 bg-black py-6">
      <div className="container mx-auto">
        <div className="flex justify-between">
          <div className="flex items-center gap-12">
            <h1 className="text-primary text-4xl font-extrabold">Wideshot</h1>
            <ul className="flex gap-8 font-semibold text-white">
              <li>Home</li>
              <li>Community</li>
              <li>Films</li>
              <li>Journal</li>
              <li>Watchlist</li>
              <li>Search</li>
            </ul>
          </div>
          <div className="flex items-center gap-8">
            <Button className="px-12 text-lg font-bold text-black">
              Log a Film
            </Button>
            <FaBell color="white" size="1.5rem" />
            <Image
              src="/profile.jpeg"
              height={50}
              width={50}
              alt="Profile Picture"
              className="border-primary rounded-full border-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
