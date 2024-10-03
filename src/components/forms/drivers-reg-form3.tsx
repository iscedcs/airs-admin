'use client';
import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '../ui/alert-dialog';

const driverFormSchema = z.object({
	licenceBearerName: z.string({
		description: 'Enter your licence name',
	}),

	licenceNumber: z.string(),
});

type DriverFormValues = z.infer<typeof driverFormSchema>;

export default function DriverForm3() {
	const [open, setOpen] = React.useState(false);
	const form = useForm<DriverFormValues>({
		resolver: zodResolver(driverFormSchema),
		mode: 'onChange',
	});

	const onSubmit = (data: DriverFormValues) => {};

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='flex flex-col gap-4 '
				>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<FormField
							name='licenceBearerName'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-title1Bold pl-4'>
										Licence Bearer Name
									</FormLabel>

									<FormControl>
										<Input
											className='relative text-body flex  items-center h-14 rounded-2xl'
											{...field}
											type='text'
											placeholder='Licence Name'
											required
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							name='licenceNumber'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-title1Bold pl-4'>
										Licence Number
									</FormLabel>

									<FormControl>
										<Input
											className='relative text-body flex  items-center h-14 rounded-2xl'
											{...field}
											type='text'
											placeholder='Licence Number'
											required
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
					<div className='flex justify-center items-center gap-6 text-title1Bold'>
						<Button
							variant={'outline'}
							size='lg'
							type='button'
							asChild
							className='p-4 py-2 rounded-normal w-28'
						>
							<Link
								href={
									'/vehicles/new-vehicle/plate-info'
								}
							>
								Back
							</Link>
						</Button>
						<AlertDialog
							open={open}
							onOpenChange={setOpen}
						>
							<AlertDialogTrigger asChild>
								<Button
									variant='default'
									className='w-28'
								>
									Add Vehicle
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader className='items-center'>
									<AlertDialogTitle className='py-8'>
										{`Driver's Account Created`}
									</AlertDialogTitle>
									<div className='text-center'>
										<div className='grid gap-2'>
											<div>
												E-mail:
												omoroge24@gmail.com
											</div>
											<div>
												Password:
												hdfay123454
											</div>
										</div>
									</div>
								</AlertDialogHeader>
								<AlertDialogFooter className='grid gap-3 '>
									<AlertDialogCancel
										asChild
										className='w-64 rounded-2xl'
									>
										<Link
											href={`/vehicles/d6784`}
										>
											Dashboard
										</Link>
									</AlertDialogCancel>
									<AlertDialogAction
										asChild
										className='w-64 rounded-2xl'
									>
										<Link
											href={`/vehicles/driver`}
										>
											View Driver
										</Link>
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</form>
			</Form>
		</>
	);
}
