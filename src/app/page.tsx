import { Suspense } from "react";
import { FeedSkeleton } from "@/components/skeletons/feed-skeleton";
import { Feed } from "@/components/feed";
import { Stories } from "@/components/stories";
import { SuggestedUsers } from "@/components/suggested-users";
import { TrendingTopics } from "@/components/trending-topics";

export default function HomePage() {
	return (
		<div className='container grid gap-4 px-4 py-6 md:pl-16 md:grid-cols-8 lg:gap-18'>
			<div className='mt-10 md:mt-0 md:col-span-4'>
				<h1 className='sr-only'>Orbtao Home Feed</h1>
				<Stories />
				<Suspense fallback={<FeedSkeleton />}>
					<Feed />
				</Suspense>
			</div>

			<div className='hidden space-y-4 md:col-span-3 md:block'>
				<SuggestedUsers />
				<TrendingTopics />
			</div>
		</div>
	);
}
