import { Button } from '@/components/ui/button';
import {
	viewWaiverColumns,
	viewWaiverColumnsAdmin,
} from '@/components/ui/table/columns';
import { DataTable } from '@/components/ui/table/data-table';
import { DRIVER_TABLE, WAIVER_STATUS } from '@/lib/consts';
import { getVehicleSummary } from '@/lib/controllers/vehicle-controller';
import {
	getVehicleWaiver,
	getVehicleWaiverProtected,
} from '@/lib/controllers/waiver.controller';
import { addIcon, successIcon } from '@/lib/icons';
import Link from 'next/link';
import React from 'react';

export default async function Waiver({ params }: { params: { id: string } }) {
	const waivers = await getVehicleWaiverProtected(params.id);
	const onWaiver = waivers?.waivers.some(
		(waiver) => waiver.status === WAIVER_STATUS.approved
	);
	// const onWaiver = false;
	return (
		<div className='w-full flex flex-col gap-3 mb-8'>
			<div className='flex justify-between'>
				<div className=''>
					<h1 className=' text-title1Bold py-2 '>
						Waiver for{' '}
						{waivers?.vehicle.plate_number.toUpperCase()}
					</h1>
					<p className=' text-title2Bold pb-3'>
						Vehicle Waiver History
					</p>
				</div>
				{/* <Button
					className='justify-start rounded-xl'
					asChild
					variant={'default'}
				>
					<Link
						href={`waiver/add-new`}
						className='shrink-0 whitespace-nowrap'
					>
						<div className='mr-2 h-4 w-4 shrink-0'>
							{addIcon}
						</div>
						Add New Waiver
					</Link>
				</Button> */}
			</div>

			<div className='grid w-full items-center gap-2 mb-20'>
				{onWaiver && (
					<>
						<div className=' text-green-600 text-center mx-auto w-full max-w-xs'>
							{successIcon}
							<div className='flex py-2'>
								<div className='shrink-0 grow-0 text-title1Bold'>
									Vehicle is on waiver period
								</div>
							</div>
						</div>
					</>
				)}
				<DataTable
					columns={viewWaiverColumnsAdmin}
					data={waivers?.waivers || []}
				/>
			</div>
		</div>
	);
}
