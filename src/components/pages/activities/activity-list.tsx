import { PaginationISCE } from '@/components/shared/pagination-isce';
import { format } from 'date-fns';
import ActivityCardGS from './activity-card-google-style';

export default function ActivityList({
	allActivities,
	page,
	limit,
}: {
	allActivities:
		| {
				rows: IActivity[];
				meta: {
					total: number;
					total_pages: number;
					page: number;
				};
		  }
		| undefined;
	page: string;
	limit: string;
}) {
	const start = (Number(page) - 1) * Number(limit);
	const end = start + Number(limit);

	// const activitiesByDate: Record<string, IActivity[]> | undefined =
	// 	allActivities?.rows.reduce((acc, activity) => {
	// 		const date = new Date(activity.created_at);
	// 		const dateString = format(date, 'yyyy-MM-dd');

	// 		if (!acc[dateString]) {
	// 			acc[dateString] = [];
	// 		}

	// 		acc[dateString].push(activity);
	// 		return acc;
	// 	}, {} as Record<string, IActivity[]>);

	// Convert the organized data into an array for rendering
	// const activityGroups = activitiesByDate
	// 	? Object.entries(activitiesByDate).map(([date, activities]) => ({
	// 			date,
	// 			activities,
	// 	  }))
	// 	: [];

	// activityGroups.sort(
	// 	(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	// );
	return (
		<div className='px-3 lg:px-5 flex flex-col gap-2'>
			{allActivities?.rows ? (
				allActivities?.rows.map((a, b) => (
					<ActivityCardGS
						key={b}
						id={a.id}
						name={a.name}
						activity_id={a.id}
						time={format(new Date(a.created_at), 'h:mm a')}
						date={format(new Date(a.created_at), 'MMM dd,')}
						description={a.description}
						user_id={a.meta ? a.meta.user.id : ''}
						user_role={a.meta ? a.meta.user.role : ''}
					/>
				))
			) : (
				<div className='p-4 flex items-center justify-center'>
					No Activities Found
				</div>
			)}
			{allActivities && allActivities.rows && (
				<PaginationISCE
					hasNextPage={end < allActivities.meta.total}
					hasPrevPage={start > 0}
					page={Number(page)}
					limit={Number(limit)}
					total={allActivities.meta.total}
					hrefPrefix='/activities'
				/>
			)}
		</div>
	);
}
