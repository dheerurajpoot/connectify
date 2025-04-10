import Image from "next/image";
import Link from "next/link";

export function ProfilePosts({ posts }: any) {
	return (
		<div className='grid grid-cols-3 gap-1'>
			{posts.map((post: any) => (
				<Link
					key={post._id}
					href={`/post/${post._id}`}
					className='group aspect-square relative overflow-hidden'>
					<Image
						src={post.media[0] || "/placeholder.svg"}
						alt='Post thumbnail'
						sizes='90vw'
						fill
						className='object-cover transition-transform duration-300 group-hover:scale-105'
					/>
					<div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
				</Link>
			))}
		</div>
	);
}
