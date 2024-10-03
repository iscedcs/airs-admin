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
import { useRouter } from 'next/navigation';
import DeleteSettingsButton from '../shared/delete-buttons/delete-settings-button';

const settingsFormSchema = z.object({
	name: z
		.string({ required_error: 'Enter setting name' })
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

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export function UpdateSettingsForm({ settings }: { settings: ISettings }) {
	const router = useRouter();
	const [disabled, setDisabled] = React.useState<boolean>(true);
	const defaultValues: Partial<SettingsFormValues> = {
		name: settings.name,
		description: settings.description,
		value: settings.value,
	};

	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const { toast } = useToast();
	const form = useForm<SettingsFormValues>({
		resolver: zodResolver(settingsFormSchema),
		defaultValues,
		mode: 'onChange',
	});

	async function onSubmit(data: SettingsFormValues) {
		setIsLoading(true);
		try {
			const createSettingsResponse = await fetch(
				'/api/create-settings',
				{
					method: 'PUT',
					body: JSON.stringify({
						setting_id: settings.setting_id,
						name: data.name,
						description: data.description,
						value: data.value,
					}),
				}
			);
			const result = await createSettingsResponse.json();
			if (
				createSettingsResponse.status > 199 &&
				createSettingsResponse.status < 299
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
											placeholder='Settings Name'
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
											placeholder='Enter settings description'
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
					<DeleteSettingsButton id={settings.setting_id} />
				</div>
			)}
		</>
	);
}
