"use client";

import Image from "next/image";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../ui/hover-card";
import { MovieCardStatus } from "@/lib/enums";
import LikeButton from "./icon-buttons/like-button";
import WatchButton from "./icon-buttons/watch-button";
import WatchlistButton from "./icon-buttons/watchlist-button";
import RateButton from "./icon-buttons/rate-button";
import { useEffect, useState } from "react";
import { MediaType } from "@prisma/client";
import UserRating from "./user-rating";
import Link from "next/link";
import { useUserContext } from "@/providers/user-context";
import { MediaDatabase } from "@/lib/db-actions";
import { getUser } from "@/lib/authentication-functions";

export interface MovieProps {
	media: MediaDatabase;
	status?: MovieCardStatus;
	userActivity: string[];
	rating: number;
	otherUserRatingActivity?: {
		username: string;
		profilePictureURL: string;
		rating: number;
	};
	activityActionsOff?: boolean;
}

export default function MovieCard({
	activityActionsOff = false,
	media,
	userActivity,
	rating,
	status,
	otherUserRatingActivity,
}: MovieProps) {
	const [liked, setLiked] = useState(
		userActivity.includes("LIKE") || false
	);
	const [watched, setWatched] = useState(
		userActivity.includes("WATCHED") || false
	);
	const [onWatchlist, setOnWatchlist] = useState(
		userActivity.includes("WATCHLIST") || false
	);
	const [rated, setRated] = useState(
		userActivity.includes("RATING") || false
	);
	const [newRating, setNewRating] = useState<number | null>(null);

	let user = useUserContext();

	useEffect(() => {
		setLiked(userActivity.includes("LIKE") || false);
		setWatched(userActivity.includes("WATCHED") || false);
		setOnWatchlist(userActivity.includes("WATCHLIST") || false);
		setRated(userActivity.includes("RATING") || false);
	}, [userActivity]);

	function toggleLikeHandler(liked: boolean) {
		setLiked(liked);
	}

	function toggleWatchlistHandler(onWatchlist: boolean) {
		setOnWatchlist(onWatchlist);
	}

	function toggleRatedHandler(rated: boolean) {
		setRated(rated);
	}

	function toggleWatchedHandler(watched: boolean) {
		setWatched(watched);
	}

	function handleNewRating(rating: number) {
		setNewRating(rating);
	}

	return (
		<div className="">
			<HoverCard openDelay={0} closeDelay={0}>
				<HoverCardTrigger asChild>
					<Link
						href={`/${media.mediaType.toLowerCase()}/${
							media.apiId
						}`}
					>
						<Image
							src={media.posterPath}
							alt={media.title}
							width={400}
							height={400}
							className="rounded border-2 border-green-50 border-opacity-15 object-cover"
							loading="eager"
						/>
					</Link>
				</HoverCardTrigger>
				{user && !activityActionsOff && (
					<HoverCardContent
						className="w-full rounded-xl border-0 bg-black bg-opacity-70 shadow-none"
						align="center"
						side="bottom"
						sideOffset={-70}
						avoidCollisions={false}
					>
						<div className="flex justify-center gap-8">
							<LikeButton
								media={media}
								liked={liked}
								toggleLikeHandler={
									toggleLikeHandler
								}
							/>
							<WatchButton
								media={media}
								watched={watched}
								toggleWatchedHandler={
									toggleWatchedHandler
								}
							/>
							<WatchlistButton
								media={media}
								onWatchlist={onWatchlist}
								toggleWatchlistHandler={
									toggleWatchlistHandler
								}
							/>
							<RateButton
								media={media}
								rated={rated}
								rating={
									newRating
										? newRating
										: rating
								}
								toggleWatchedHandler={
									toggleWatchedHandler
								}
								toggleRatedHandler={
									toggleRatedHandler
								}
								handleNewRating={
									handleNewRating
								}
							/>
						</div>
					</HoverCardContent>
				)}
			</HoverCard>
			{otherUserRatingActivity && (
				<UserRating
					username={otherUserRatingActivity.username}
					rating={otherUserRatingActivity.rating}
					profilePictureSrc={
						otherUserRatingActivity.profilePictureURL
					}
				/>
			)}
		</div>
	);
}
