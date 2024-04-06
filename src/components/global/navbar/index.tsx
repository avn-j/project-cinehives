"use client";

import Image from "next/image";
import { Button } from "../../ui/button";
import { FaBell, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useUserContext } from "@/providers/user-context";
import { logout } from "./actions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FaHeart,
  FaList,
  FaSortDown,
  FaSquarePlus,
  FaStar,
  FaUser,
} from "react-icons/fa6";
import SearchBox from "../searchbox";
import LogDialog from "../log-dialog";

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
            <h1 className="text-4xl font-extrabold text-primary">
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
            </ul>
          </div>

          {!user && (
            <div className="flex gap-4">
              <SearchBox />
              <Button variant="outline" className=" px-0 py-0 text-white">
                <Link
                  href="/register"
                  className="flex h-full w-full items-center justify-center  px-8"
                >
                  Register
                </Link>
              </Button>

              <Button className="px-0 py-0 text-black">
                <Link
                  href="/login"
                  className="flex h-full w-full items-center justify-center  px-10"
                >
                  Login
                </Link>
              </Button>
            </div>
          )}

          {user && (
            <div className="flex items-center gap-6">
              <SearchBox />
              <LogDialog>
                <FaSquarePlus size={20} className="text-white" />
              </LogDialog>

              <FaBell color="white" size="1.5rem" />
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="flex items-center">
                  <div className="relative h-14 w-14 rounded-full bg-stone-700">
                    <Image
                      src={user.profilePictureURL}
                      alt={user.username}
                      fill={true}
                      unoptimized
                      className="rounded-full border-2 border-primary object-cover"
                    />
                  </div>
                  <FaSortDown className="ml-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black">
                  <DropdownMenuLabel>@{user.username}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <FaUser className="mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FaStar className="mr-2" /> Reviews
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FaList className="mr-2" /> Watchlist
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FaHeart className="mr-2" /> Liked
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FaCog className="mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      onClick={handleLogout}
                      variant="link"
                      className="px-0 py-0 text-white"
                      size="sm"
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
