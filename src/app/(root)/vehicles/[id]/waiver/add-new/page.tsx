'use client';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { WAIVER_HISTORY } from '@/lib/consts';
import { addIcon, successIcon } from '@/lib/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function AddNewWaiver({
	params,
}: {
	params: { plate: string };
}) {
	const router = useRouter();
	const vehicle = WAIVER_HISTORY.find(
		(driver) => driver.timeline === params.plate
	);
	const [open, setOpen] = React.useState(false);
	return (
		<div className='w-full p-10'>
			<div className=' py-5'>
				<h1 className=' font-bold text-lg'>Waiver Extension</h1>
				<p>Fill in to extend your grace period</p>
			</div>
			<div className=' flex w-full h-14 items-center text-lg py-2 text-white bg-[#4D4100] rounded-3xl'>
				<div className=' h-14 w-16 shrink-0 p-4 bg-black rounded-l-3xl'>
					{addIcon}
				</div>
				<div className=' pl-4'>TIMELINE</div>
			</div>
			<div className=' w-full flex flex-col py-4'>
				<label className='pl-4'>Reason for Extension</label>
				<input
					className=' flex h-32 rounded-3xl gap-2 p-4 pb-20 bg-secondary'
					type='text'
					placeholder='Brief explanation'
				/>
				<label className=' pt-4 pl-4'> End Date</label>
				<input
					className=' h-16 text-black bg-secondary rounded-3xl p-4 flex'
					type='date'
					placeholder='date'
				/>
			</div>
			<div className=' flex justify-center gap-4'>
				<Button
					variant={'outline'}
					size='lg'
					className='p-4 py-2 rounded-normal w-32'
					onClick={() => router.back()}
				>
					Back
				</Button>

				<AlertDialog
					open={open}
					onOpenChange={setOpen}
				>
					<AlertDialogTrigger asChild>
						<Button
							variant={'default'}
							size='lg'
							type='submit'
							className='p-4 py-2 rounded-normal w-32'
						>
							Process
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent className='bg-secondary'>
						<div className='w-60 mx-auto flex-col'>
							<div className='flex flex-col items-center gap-5 mb-5'>
								<div className='h-20 w-20 text-awesome-foreground'>
									{successIcon}
								</div>
								<div className=''>
									<h1 className=' font-bold text-xl'>
										PROCESSING WAIVER
									</h1>
									<div className=' text-base'>
										<p>Dear customer,</p>
										<p>{`Your request of waiver is bing processed you'll be alert by via number for confirmation`}</p>
									</div>
								</div>
							</div>

							<div className='flex flex-col gap-3'>
								<AlertDialogAction
									asChild
									className='rounded-xl'
								>
									<Link href={`/vehicles/driversid`}>
										VIEW DRIVER ACCOUNT
									</Link>
								</AlertDialogAction>
								<AlertDialogCancel
									asChild
									className='rounded-xl'
								>
									<Link href={`/vehicles`}>
										DASHBOARD
									</Link>
								</AlertDialogCancel>
							</div>
						</div>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
}
