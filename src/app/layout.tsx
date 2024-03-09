import type { Metadata } from "next";
import { Raleway, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import UserContextProvider from "@/providers/user-context";
import { getUser, getUserProfile } from "@/lib/authentication-functions";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

const roboto_condensed = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Project Wideshot",
  description: "A social media for film lovers",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let profile = null;
  const user = await getUser();

  if (user) {
    profile = await getUserProfile(user);
  }

  return (
    <html
      lang="en"
      className={`${raleway.variable} ${roboto_condensed.variable}`}
    >
      <body>
        <UserContextProvider value={profile}>{children}</UserContextProvider>
      </body>
    </html>
  );
}
