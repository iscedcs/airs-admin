import { Skeleton } from '@/components/ui/skeleton';

export default function RevenueAmountCardSkeleton() {
	return (
		<div className='relative flex h-24 w-full flex-col justify-between overflow-clip rounded-2xl bg-secondary p-3 shadow-md'>
			<div>
				<Skeleton className='h-4 w-40' />
				<Skeleton className='mt-2 h-7 w-28' />
			</div>
			<div className='flex flex-col items-end justify-end'>
				<Skeleton className='h-4 w-28' />
			</div>
		</div>
	);
}
