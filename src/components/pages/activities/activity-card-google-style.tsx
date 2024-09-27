import { Button, buttonVariants } from '@/components/ui/button';
import { cn, unslugify } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

export default function ActivityCardGS({
	name,
	time,
	date,
	activity_id,
	description,
}: IActivityCard) {
	return (
		<div className='grid px-3 py-1 max-w-3xl border-b last:border-none'>
			<div className=' truncate text-ellipsis text-sm'>
				{unslugify(name)}
			</div>
			<div className=' truncate text-ellipsis text-xs line-clamp-2'>
				{description}
			</div>
			<div className='flex text-xs justify-between items-center'>
				<div className=''>{`${date} ${time}`}</div>
				<Link
					className={cn(
						buttonVariants({ variant: 'link' }),
						'justify-start text-xs p-0 w-32'
					)}
					href={`/activities/${activity_id}`}
				>
					View Details
				</Link>
			</div>
		</div>
	);
}
