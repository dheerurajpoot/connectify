import { Suspense } from "react";
import { ExploreFeed } from "@/components/explore-feed";
import { ExploreSkeleton } from "@/components/skeletons/explore-skeleton";
import type { Metadata } from "next";
import { SearchPeople } from "@/components/search-people";

export const metadata: Metadata = {
	title: "Explore",
	description:
		"Discover trending posts, photos, and videos from around the world",
};

export default function ExplorePage() {
	return (
		<div className='container flex flex-col mt-12 md:mt-0 px-4 py-6 flex-1'>
			<h1 className='mb-6 text-2xl font-bold'>Explore</h1>
			<div className='mb-6'>
				<SearchPeople />
			</div>
			<Suspense fallback={<ExploreSkeleton />}>
				<ExploreFeed />
			</Suspense>
		</div>
	);
}
