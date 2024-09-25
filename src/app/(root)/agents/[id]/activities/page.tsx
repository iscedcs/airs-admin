import { Card } from '@/components/ui/card';
import React from 'react';
import ActivityCard from '@/components/shared/activity-card';
import { getAllActivities } from '@/lib/controllers/activity.controller';
import { notFound } from 'next/navigation';
import ActivityList from '@/components/pages/activities/activity-list';

export default async function Activity() {
	const all_activities = await getAllActivities();
	if (!all_activities) return notFound();
	return (
		<div className='w-full flex flex-col gap-3 mb-8 p-2 xs:p-5 '>
			<div className='flex flex-col gap-2 mb-20'>
				<div className='flex justify-between py-2'>
					<div className='shrink-0 grow-0 text-title1Bold'>
						Activity History
					</div>
				</div>
				<Card className='bg-secondary'>
					<ActivityList
						page='1'
						limit='20'
						allActivities={all_activities}
					/>
				</Card>
			</div>
		</div>
	);
}
