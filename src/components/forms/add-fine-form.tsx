'use client';
import React, { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import { DRIVER_TABLE } from '@/lib/consts';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
} from '../ui/alert-dialog';
import { successIcon } from '@/lib/icons';

const driverFormSchema = z.object({
	DateTime: z.string({
		description: 'date & time of offence',
	}),
	Offence: z
		.string()
		.refine(
			(value) =>
				[
					'dangerous driving',
					'overloading',
					'failure to move over',
					'road obstruction',
					'speed limit violation',
					'caution sign violation',
					'wrongful overtaking',
				].includes(value),
			{
				message: 'Invalid selection',
			}
		),
	platenumber: z.string(),
});

type DriverFormValues = z.infer<typeof driverFormSchema>;

export default function FineDriverForm({ plate }: { plate: string }) {
	const [open, setOpen] = useState(false);

	const vehicle = DRIVER_TABLE.find((driver) => driver.plate === plate);
	const defaultValues: Partial<DriverFormValues> = {
		DateTime: '',
		Offence: 'overloading',
		platenumber: vehicle?.plate,
	};
	const form = useForm<DriverFormValues>({
		resolver: zodResolver(driverFormSchema),
		defaultValues,
		mode: 'onChange',
	});

	function onSubmit(data: DriverFormValues) {
		setOpen(true);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col gap-4 '
			>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<FormField
						control={form.control}
						name='Offence'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-title1Bold pl-4'>
									{' '}
									Offence
								</FormLabel>

								<Select defaultValue={field.value}>
									<FormControl>
										<SelectTrigger className='relative text-body flex  items-center h-14 rounded-2xl'>
											<SelectValue placeholder='Select offence' />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value='dangerous driving'>
											Dangerous Driving
										</SelectItem>
										<SelectItem value='overloading'>
											Overloading
										</SelectItem>
										<SelectItem value='failure to move over'>
											Failure To Move Over
										</SelectItem>
										<SelectItem value='road obstruction'>
											Road Obstruction
										</SelectItem>
										<SelectItem value='speed limit violation'>
											Speed Limit Violation
										</SelectItem>
										<SelectItem value='caution sign violation'>
											Caution Sign Violation
										</SelectItem>
										<SelectItem value='wrongful overtaking'>
											Wrongful Overtaking
										</SelectItem>
									</SelectContent>
								</Select>
							</FormItem>
						)}
					/>

					<FormField
						name='DateTime'
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-title1Bold pl-4'>
									Date/Time
								</FormLabel>

								<FormControl>
									<Input
										className='relative text-body flex  items-center h-14 rounded-2xl'
										{...field}
										type='text'
										placeholder='date & time of offence'
										required
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
				<div className='flex justify-center items-center my-4 gap-6 text-title1Bold'>
					<Button
						variant={'outline'}
						size='lg'
						type='button'
						asChild
						className='p-4 py-2 rounded-normal w-28'
					>
						<Link href={`/vehicles/${plate}`}>Back</Link>
					</Button>
					<Button
						variant={'default'}
						size='lg'
						type='submit'
						className='p-4 py-2 rounded-normal w-28'
					>
						Submit Fine
					</Button>
				</div>
				<AlertDialog
					open={open}
					onOpenChange={setOpen}
				>
					<AlertDialogContent className='bg-secondary'>
						<div className='w-60 mx-auto flex-col'>
							<div className='flex flex-col items-center gap-5 mb-5'>
								<div className='h-20 w-20 text-awesome-foreground'>
									{successIcon}
								</div>
							</div>
							<div className='flex flex-col text-start mb-5'>
								<div className=''>
									platenumber:{' '}
									{form.getValues().platenumber}
								</div>
								<div className=''>
									DateTime:{' '}
									{form.getValues().DateTime}
								</div>
								<div className=''>
									Offence: {form.getValues().Offence}
								</div>
							</div>
							<div className='flex flex-col gap-3'>
								<AlertDialogAction
									asChild
									className='rounded-xl'
								>
									<Link href={`/agents/agentid`}>
										View Account
									</Link>
								</AlertDialogAction>
								<AlertDialogCancel
									asChild
									className='rounded-xl'
								>
									<Link href={`/agents`}>
										Dashboard
									</Link>
								</AlertDialogCancel>
							</div>
						</div>
					</AlertDialogContent>
				</AlertDialog>
			</form>
		</Form>
	);
}
