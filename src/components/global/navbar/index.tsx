"use client";

import Image from "next/image";
import { Button } from "../../ui/button";
import { FaBell } from "react-icons/fa";
import { useUserContext } from "@/providers/user-context";
import { logout } from "./actions";
import Link from "next/link";
import { usePathname } from "next/navigation";

async function handleLogout() {
  logout();
}

export default function Navbar() {
  const user = useUserContext();
  const currentPath = usePathname();

  return (
    <nav className="fixed z-20 w-full border-b border-stone-900 bg-stone-950 py-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <h1 className="text-primary text-4xl font-extrabold">
              <Link href="/">Cinehives</Link>
            </h1>

            <ul className="flex gap-8 font-semibold text-white">
              <li className={currentPath === "/" ? "text-primary" : ""}>
                <Link href="/">Home</Link>
              </li>
              <li>Community</li>
              <li className={currentPath === "/films" ? "text-primary" : ""}>
                <Link href="/films">Films</Link>
              </li>
              <li className={currentPath === "/tv-shows" ? "text-primary" : ""}>
                <Link href="/tv-shows">TV Shows</Link>
              </li>
              <li>Anime</li>
              <li>Watchlist</li>
              <li>Search</li>
            </ul>
          </div>

          {!user && (
            <div className="flex gap-2">
              <Button variant="outline" className="text-white">
                <Link href="/register" className="px-8">
                  Register
                </Link>
              </Button>

              <Button className="text-black">
                <Link href="/login" className="px-10">
                  Login
                </Link>
              </Button>
            </div>
          )}

          {user && (
            <div className="flex items-center gap-8">
              <Button
                className="px-12 text-sm text-black"
                onClick={handleLogout}
              >
                Logout
              </Button>
              <FaBell color="white" size="1.5rem" />

              <div className="relative mr-4 h-12 w-12 rounded-full bg-stone-700">
                <Image
                  src={user.profilePictureURL}
                  alt="Profile Picture"
                  fill={true}
                  className="border-primary rounded-full border-2 object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
