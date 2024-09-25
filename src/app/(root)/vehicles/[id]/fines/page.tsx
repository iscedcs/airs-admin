import FineDriverForm from '@/components/forms/add-fine-form';
import { viewDriversColumns } from '@/components/ui/table/columns';
import { DataTable } from '@/components/ui/table/data-table';
import { DRIVER_TABLE, VIEW_DRIVER_TABLE } from '@/lib/consts';
import React from 'react';

export default function Fines({ params }: { params: { plate: string } }) {
	const vehicle = DRIVER_TABLE.find(
		(driver) => driver.plate === params.plate
	);
	return (
		<div className='w-full flex flex-col gap-3 mb-8 p-2 xs:p-5 '>
			<div className=''>
				<h1 className=' text-title1Bold py-2 '>
					Fine {vehicle?.name}
				</h1>
				<p className=' text-title2Bold pb-3'>
					Fill in Drivers Offence and Fine
				</p>
			</div>
			<div className=''>
				<FineDriverForm plate={params.plate} />
			</div>

			<div className='flex flex-col gap-2 mb-20'>
				<div className='flex justify-between py-2'>
					<div className='shrink-0 grow-0 text-title1Bold'>
						Fine History
					</div>
				</div>
				<div className=''>
					<DataTable
						columns={viewDriversColumns}
						data={VIEW_DRIVER_TABLE}
					/>
				</div>
			</div>
		</div>
	);
}
