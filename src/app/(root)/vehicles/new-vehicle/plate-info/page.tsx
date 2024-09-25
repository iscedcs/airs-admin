import DriverForm2 from '@/components/forms/drivers-reg-form2';
import ButtonDrivers from '@/components/ui/buttondriver';
import { addIcon, driversProgressIcon2 } from '@/lib/icons';
import React from 'react';

export default function AddNewDriver2() {
	return (
		<div className='w-full  p-12'>
			<div className=''>
				<h1 className=' text-title1Bold py-2 '>Add New Driver</h1>
				<p className=' text-title2Bold pb-4'>
					Fill in drivers details
				</p>
			</div>
			<div className=' text-primary-900 max-h-16 max-w-sm flex justify-start'>
				{driversProgressIcon2}
			</div>
			<div className='py-10  text-h4'>
				<ButtonDrivers
					text='Vehicle Plate Information'
					hasIcon
					icon={addIcon}
					variant='primary'
				/>
			</div>
			<div>
				<DriverForm2 />
			</div>
		</div>
	);
}
