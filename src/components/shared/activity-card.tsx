import { unslugify } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

export default function ActivityCard({
	name,
	time,
	date,
	activity_id,
	description,
}: IActivityCard) {
	return (
		<Link
			href={`/activities/${activity_id}`}
			className='grid hover:bg-primary-500/30 px-3 py-1 rounded-lg'
		>
			<div className=' truncate text-ellipsis text-sm'>
				{unslugify(name)}
			</div>
			<div className=' truncate text-ellipsis text-xs line-clamp-2'>
				{description}
			</div>
			{date && (
				<div className='flex text-xs justify-between'>
					<div className=''>{date}</div>
					<div className=''>{time}</div>
				</div>
			)}
		</Link>
	);
}
