import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPost } from "@/app/actions/post-actions";
import { PostPageClient } from "@/components/post-page-client";

export default async function PostPage({ params }: { params: { id: string } }) {
	const { id } = await params;
	const { post, error } = await getPost(id);

	if (!post || error) {
		notFound();
	}

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<PostPageClient post={post} />
		</Suspense>
	);
}
