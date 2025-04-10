import { getFeed } from "@/app/actions/post-actions";
import { Post } from "@/components/post";

export async function Feed() {
	const { posts, error } = await getFeed();

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className='space-y-4'>
			{posts?.map((post: any) => (
				<Post key={post._id} post={post} />
			))}
		</div>
	);
}
