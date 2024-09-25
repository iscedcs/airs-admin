'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '../ui/use-toast';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import React from 'react';
import { loadingSpinner } from '@/lib/icons';
import { NextResponse } from 'next/server';
import { Textarea } from '../ui/textarea';
// import DeleteBitsButton from '../shared/delete-buttons/delete-bit-button';
import { useRouter } from 'next/navigation';

const bitFormSchema = z.object({
	name: z
		.string({ required_error: 'Enter bit name' })
		.min(2, {
			message: 'Name must be at least 2 characters.',
		})
		.max(30, {
			message: 'Name must not be longer than 30 characters.',
		}),
	description: z.string({
		required_error: 'Please enter an description.',
	}),
	value: z.string({
		required_error: 'Please enter a value.',
	}),
});

type BitsFormValues = z.infer<typeof bitFormSchema>;

export function UpdateBitsForm({ bit }: { bit: IBits }) {
	const router = useRouter();
	const [disabled, setDisabled] = React.useState<boolean>(true);
	const defaultValues: Partial<BitsFormValues> = {
		name: bit.name,
		description: bit.description,
		value: bit.value,
	};

	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const { toast } = useToast();
	const form = useForm<BitsFormValues>({
		resolver: zodResolver(bitFormSchema),
		defaultValues,
		mode: 'onChange',
	});

	async function onSubmit(data: BitsFormValues) {
		setIsLoading(true);
		try {
			const createBitsResponse = await fetch(
				'/api/create-bit',
				{
					method: 'PUT',
					body: JSON.stringify({
						bit_id: bit.bit_id,
						name: data.name,
						description: data.description,
						value: data.value,
					}),
				}
			);
			const result = await createBitsResponse.json();
			if (
				createBitsResponse.status > 199 &&
				createBitsResponse.status < 299
			) {
				toast({
					title: 'Updated Successfully',
				});
				setIsLoading(false);
				setDisabled(true);
				router.refresh();
				return NextResponse.json(result);
			} else {
				setIsLoading(false);
				toast({
					title: 'Not Updated',
				});
				return null;
			}
		} catch (error) {
			setIsLoading(false);
		}
	}

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='mb-10 flex flex-col gap-5'
				>
					<div className='grid grid-cols-1 gap-5'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											disabled={disabled}
											placeholder='Bits Name'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='value'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Value</FormLabel>
									<FormControl>
										<Input
											disabled={disabled}
											placeholder='Enter Value'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Email Address
									</FormLabel>
									<FormControl>
										<Textarea
											disabled={disabled}
											placeholder='Enter bit description'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className=''>
						{!disabled && (
							<Button
								className='w-32'
								type='submit'
							>
								{isLoading
									? loadingSpinner
									: 'Save Changes'}
							</Button>
						)}
					</div>
				</form>
			</Form>
			{disabled && (
				<div className='flex items-center justify-between gap-5'>
					<Button
						className='w-32'
						onClick={() => setDisabled(false)}
						type='button'
					>
						Edit
					</Button>
					{/* <DeleteBitsButton id={bit.bit_id} /> */}
				</div>
			)}
		</>
	);
}
