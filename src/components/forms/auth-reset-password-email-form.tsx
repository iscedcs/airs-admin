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
import Link from 'next/link';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
} from '../ui/alert-dialog';
import React from 'react';
import { backIcon, successIcon } from '@/lib/icons';
import { useRouter } from 'next/navigation';

const agentFormSchema = z.object({
	email: z
		.string({
			required_error: 'Please enter an email.',
		})
		.email(),
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<AgentFormValues> = {
	email: '',
};

export function AuthResetPasswordEmail() {
	const [open, setOpen] = React.useState(false);
	const { toast } = useToast();
	const router = useRouter();
	const form = useForm<AgentFormValues>({
		resolver: zodResolver(agentFormSchema),
		defaultValues,
		mode: 'onChange',
	});

	function onSubmit(data: AgentFormValues) {
		setOpen(true);
		toast({
			title: 'You submitted the following values:',
			description: (
				<pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
					<code className='text-white'>
						<div className=''>Email: {data.email}</div>
					</code>
				</pre>
			),
		});
		router.push('/verification-code');
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='mb-20 flex flex-col gap-5'
			>
				{' '}
				<div className=' capitalize text-h4Bold md:text-h3Bold'>
					Reset password
				</div>
				<div className='text-base'>
					Please enter the email linked to your account.
				</div>
				<div className='grid gap-5 pt-5'>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email Address</FormLabel>
								<FormControl>
									<Input
										placeholder='Email'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className='grid gap-5'>
					<Button type='submit'>RESET PASSWORD</Button>
					<Button
						asChild
						variant='link'
					>
						<Link href='/sign-in'>
							<div className='h-4 w-4 mr-2'>
								{backIcon}
							</div>
							Back to Login
						</Link>
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
								<div className='text-xl'>Ema</div>
							</div>
							<div className='flex flex-col text-start mb-5'>
								<div className=''>
									Email: {form.getValues().email}
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
