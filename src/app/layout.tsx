import type { Metadata } from "next";
import { Raleway, Montserrat } from "next/font/google";
import "./globals.css";
import UserContextProvider from "@/providers/user-context";
import { getUser, getUserProfile } from "@/lib/authentication-functions";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./provider";

const raleway = Raleway({
	subsets: ["latin"],
	variable: "--font-raleway",
	display: "swap",
});

const monsterrat = Montserrat({
	subsets: ["latin"],
	variable: "--font-monsterrat",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Project Cinehives",
	description: "A social media for film, TV and anime lovers",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = await getUser();
	const profile = await getUserProfile(user);

	console.log(user);
	console.log(profile);

	return (
		<html
			lang="en"
			className={`${raleway.variable} ${monsterrat.variable}`}
		>
			<body>
				<Providers>
					<UserContextProvider value={profile}>
						{children}
					</UserContextProvider>
					<Toaster richColors />
				</Providers>
			</body>
		</html>
	);
}
