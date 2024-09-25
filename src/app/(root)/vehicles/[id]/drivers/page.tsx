import { getVehicleById } from '@/lib/controllers/vehicle-controller';

export default async function VehicleDriversPage({
	params,
}: {
	params: { id: string };
}) {
	const vehicle = await getVehicleById(params.id);
	// const drivers = vehicle?.Drivers;
	return (
		<div className='p-3 md:p-5 w-full'>
			{/* <div className='flex flex-col gap-2 mb-20'>
				<div className='flex justify-between py-2'>
					<div className='shrink-0 grow-0 text-title1Bold'>
						Drivers
					</div>
					<Button asChild>
						<Link href={`/vehicles/${params.id}/new-driver`}>
							New Driver
						</Link>
					</Button>
				</div>
				<div className=''>
					<DataTable
						showSearch
						searchWith='name'
						searchWithPlaceholder='Search with name'
						showColumns
						columns={driversColumns}
						data={drivers || []}
					/>
				</div>
			</div> */}
		</div>
	);
}
