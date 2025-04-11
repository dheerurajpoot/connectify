import { Skeleton } from "@/components/ui/skeleton";

export function ExploreSkeleton() {
	return (
		<div className='grid grid-cols-3 gap-1'>
			{Array(12)
				.fill(0)
				.map((_, i) => (
					<Skeleton key={i} className='aspect-square w-full' />
				))}
		</div>
	);
}
