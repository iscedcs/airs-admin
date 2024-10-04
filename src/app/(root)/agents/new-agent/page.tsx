import { AgentForm } from '@/components/forms/new-agent-form';
import { addIcon } from '@/lib/icons';
import React from 'react';

export default function AddNewAgent() {
	return (
		<div className='p-5 gap-5 w-full h-full flex flex-col '>
			<div className='flex justify-between'>
				<div className='px-2'>
					<h3 className='text-lg font-medium'>Add New Agent</h3>
					<p className='text-sm text-muted-foreground'>
						Fill in agent details
					</p>
				</div>
			</div>
			<div className='h-12 bg-primary w-full rounded-2xl flex overflow-hidden text-white items-center'>
				<div className='h-12 w-12 bg-black p-3'>{addIcon}</div>
				<div className='p-3'>PERSONAL INFORMATION</div>
			</div>
			<div className='flex flex-col gap-5  px-2'>
				<AgentForm />
			</div>
		</div>
	);
}
