'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import * as React from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem } from './form';

export function DatePickerWithRange({
	className,
	open,
	setOpen,
}: {
	className?: string;
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	const router = useRouter();
	const dateRangeSchema = z.object({
		from: z.date(),
		to: z.date(),
	});

	const FormSchema = z.object({
		dateRange: dateRangeSchema,
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	function onSubmit({ dateRange }: z.infer<typeof FormSchema>) {
		const { from, to } = dateRange;

		router.push(
			`/revenue?start_date=${format(
				from,
				'yyyy-MM-dd'
			)}&end_date=${format(to, 'yyyy-MM-dd')}&d=${'CUSTOM'}`
		);
		setOpen(false);
	}

	return (
		<div className={cn('grid gap-2', className)}>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='grid gap-2'
				>
					<FormField
						control={form.control}
						name='dateRange'
						render={({ field }) => (
							<FormItem className='grid text-center'>
								{' '}
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												id='date'
												variant={'outline'}
												className={cn(
													buttonVariants(),
													!field.value &&
														'text-muted-foreground'
												)}
											>
												<CalendarIcon className='mr-2 h-4 w-4' />
												{field.value
													?.from ? (
													field.value
														.to ? (
														<>
															{format(
																field
																	.value
																	.from,
																'yyyy-MM-dd'
															)}{' '}
															-{' '}
															{format(
																field
																	.value
																	.to,
																'yyyy-MM-dd'
															)}
														</>
													) : (
														format(
															field
																.value
																.from,
															'yyyy-MM-dd'
														)
													)
												) : (
													<span>
														Select a
														date range
													</span>
												)}
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent
										className='w-auto p-0'
										align='start'
									>
										<Calendar
											mode='range'
											defaultMonth={
												field.value?.from
											}
											selected={field.value}
											onSelect={field.onChange}
											numberOfMonths={1}
											disabled={(date) =>
												date > new Date() ||
												date <
													new Date(
														'1900-01-01'
													)
											}
										/>
									</PopoverContent>
								</Popover>
							</FormItem>
						)}
					/>
					<Button type='submit'>Submit</Button>
				</form>
			</Form>
		</div>
	);
}
