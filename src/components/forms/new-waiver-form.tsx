'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '../ui/use-toast';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Dialog, DialogContent } from '../ui/dialog';
import React from 'react';
import { loadingSpinner, successIcon } from '@/lib/icons';
import { NextResponse } from 'next/server';
import { Textarea } from '../ui/textarea';
import { useRouter } from 'next/navigation';
import { DatePickerWithRange } from '../ui/date-range-picker';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { addDays, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { Checkbox } from '../ui/checkbox';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

const reasons = [
	{
		id: 1,
		title: 'Vehicle Maintenance',
		description:
			'The vehicle requires critical repairs, scheduled servicing, or upgrades that make it temporarily unsuitable for commercial use.',
	},
	{
		id: 2,
		title: 'Personal Health',
		description:
			'The driver is experiencing illness or injury that prevents them from operating the vehicle safely.',
	},
	{
		id: 3,
		title: 'Family Emergency',
		description:
			"An urgent family situation requires the driver/owner's full attention.",
	},
	{
		id: 4,
		title: 'Licensing Issues',
		description:
			'Expired licenses need renewal, outstanding fines need resolution, or permits are temporarily suspended.',
	},
	{
		id: 5,
		title: 'Route Disruptions',
		description:
			'The usual route is inaccessible due to construction, flooding, or security concerns.',
	},
	{
		id: 6,
		title: 'Financial Hardship',
		description:
			'The driver/owner lacks sufficient funds to cover fuel costs or temporary maintenance expenses.',
	},
	{
		id: 7,
		title: 'Religious/Cultural Obligations',
		description:
			'The driver/owner needs to observe periods of fasting, pilgrimage, or significant cultural events that prevent regular operation.',
	},
	{
		id: 7,
		title: 'Others',
		description:
			'The driver/owner needs to observe periods of fasting, pilgrimage, or significant cultural events that prevent regular operation.',
	},
];

const waiverFormSchema = z.object({
	start_date: z.date({ required_error: 'Enter Start Date' }),
	end_date: z.date({ required_error: 'Enter End Date' }),
	reason: z
		.string({
			required_error: 'Please enter a valid reason.',
		})
		.min(3, {
			message: 'Reason must be at least 3 characters.',
		})
		.max(50, {
			message: 'Reason must not be longer than 50 characters.',
		})
		.refine(
			(value) =>
				reasons.some((reason) => reason.title.includes(value)),
			{
				message: 'Reason Selected does not exist',
			}
		),
	id: z.string({ required_error: 'No vehicle detected' }),
	additional_info: z.string(),
	indefinite: z.boolean().default(false).optional(),
});

export type waiverFormValues = z.infer<typeof waiverFormSchema>;

// This can come from your database or API.
export function NewWaiverForm({ vehicle }: { vehicle: IVehicleSummary }) {
	const defaultValues: Partial<waiverFormValues> = {
		reason: 'Vehicle Maintenance',
		id: vehicle.id,
		indefinite: false,
		additional_info: '',
		start_date: addDays(new Date(), 1),
		end_date: addDays(new Date(), 2),
	};
	const router = useRouter();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const { toast } = useToast();

	const form = useForm<waiverFormValues>({
		resolver: zodResolver(waiverFormSchema),
		defaultValues,
		mode: 'onChange',
	});

	const isIndefinite = form.getValues('indefinite');
	const isOthers =
		form.getValues('reason').toLowerCase().trim() === 'others';
	const selectedReasonId = form.getValues('reason');
	const selectedReason = reasons.find(
		(reason) =>
			reason.title.toLowerCase() === selectedReasonId.toLowerCase()
	);
	// form.setValue('additional_info', selectedReason?.description || '');
	async function onSubmit(data: waiverFormValues) {
		setIsLoading(true);
		const payload = {
			id: data.id,
			reason: data.reason,
			start_date: format(data.start_date, 'yyyy-MM-dd'),
			end_date: isIndefinite
				? format(new Date('9999-01-01'), 'yyyy-MM-dd')
				: format(data.end_date, 'yyyy-MM-dd'),
			// additional_info: isOthers
			// 	? data.additional_info
			// 	: selectedReason?.description,
		};
		console.log('new waiver form client... ', { payload });
		try {
			const createWaiverResponse = await fetch('/api/create-waiver', {
				method: 'POST',
				body: JSON.stringify(payload),
			});
			const result = await createWaiverResponse.json();
			if (result.success) {
				toast({
					title: 'waiver Created Successfully',
				});
				setIsLoading(false);
				form.reset();
				router.refresh();
				return NextResponse.json(result);
			} else {
				setIsLoading(false);
				toast({
					title: result.message,
				});
				return null;
			}
		} catch (error: any) {
			setIsLoading(false);
			form.reset();
			toast({ title: 'Feature Coming soon' });
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className=''
			>
				<div className='grid grid-cols-1 gap-5 mb-10 text-start'>
					<FormField
						control={form.control}
						name='start_date'
						render={({ field }) => (
							<FormItem className='flex flex-col'>
								<FormLabel>Start Date</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={'outline'}
												className={cn(
													'w-full pl-3 text-left font-normal',
													!field.value &&
														'text-muted-foreground'
												)}
											>
												{field.value ? (
													format(
														field.value,
														'PPP'
													)
												) : (
													<span>
														Pick a
														date
													</span>
												)}
												<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent
										className='w-auto p-0'
										align='start'
									>
										<Calendar
											mode='single'
											selected={field.value}
											onSelect={field.onChange}
											disabled={(date) =>
												date >
													addDays(
														new Date(),
														7
													) ||
												date <= new Date()
											}
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='indefinite'
						render={({ field }) => (
							<FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow'>
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={
											field.onChange
										}
										onChange={() =>
											form.setValue(
												'additional_info',
												selectedReason?.description ||
													''
											)
										}
									/>
								</FormControl>
								<div className='space-y-1 leading-none'>
									<FormLabel>
										Apply indefinitely
									</FormLabel>
								</div>
							</FormItem>
						)}
					/>

					{!isIndefinite && (
						<FormField
							control={form.control}
							name='end_date'
							render={({ field }) => (
								<FormItem className='flex flex-col'>
									<FormLabel>End Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={
														'outline'
													}
													className={cn(
														'w-full pl-3 text-left font-normal',
														!field.value &&
															'text-muted-foreground'
													)}
												>
													{field.value ? (
														format(
															field.value,
															'PPP'
														)
													) : (
														<span>
															Pick
															a
															date
														</span>
													)}
													<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent
											className='w-auto p-0'
											align='start'
										>
											<Calendar
												mode='single'
												selected={
													field.value
												}
												onSelect={
													field.onChange
												}
												disabled={(date) =>
													// date >
													// 	addDays(
													// 		form.getValues(
													// 			'start_date'
													// 		),
													// 		5
													// 	) ||
													date <=
													form.getValues(
														'start_date'
													)
												}
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}

					<FormField
						control={form.control}
						name='reason'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Reason</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder='Choose a reason' />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectGroup>
											{reasons.map(
												(reason, key) => (
													<SelectItem
														key={key}
														value={
															reason.title
														}
														onChange={() =>
															form.setValue(
																'additional_info',
																selectedReason?.description ||
																	''
															)
														}
													>
														{
															reason.title
														}
													</SelectItem>
												)
											)}
										</SelectGroup>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					{isOthers && (
						<FormField
							control={form.control}
							name='additional_info'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Additional Information
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Tell us why you need a waiver'
											className='resize-none'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
				</div>
				<div className='grid'>
					<Button
						className=''
						type='submit'
						// disabled
					>
						{isLoading ? loadingSpinner : 'Add waiver'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
