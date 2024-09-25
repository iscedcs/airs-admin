export default async function AddDriver({
	params,
}: {
	params: { id: string };
}) {
	// const vehicle = await getVehicleById(params.id);
	return (
		<div className='w-full flex flex-col gap-3 mb-8 p-2 xs:p-5 '>
			{/* <div className='text-title1Bold py-6'>
				Add new driver for {vehicle?.owners_name}
			</div>
			<div className='flex items-center justify-between w-full'>
				<DriverForm id={params.id} />
			</div> */}
		</div>
	);
}
