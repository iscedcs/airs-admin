'use client';

import * as z from 'zod';
import { useToast } from '../ui/use-toast';
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
import { Label } from '../ui/label';

const agentFormSchema = z.object({
	code: z
		.string()
		.length(4, { message: 'Verification code must be 4 digits long' }),
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<AgentFormValues> = {
	code: '',
};

let currentCodeIndex: number = 0;
export function AuthVerificationCode() {
	const [open, setOpen] = React.useState(false);
	const { toast } = useToast();
	const inputRef = React.useRef<HTMLInputElement>(null);
	const router = useRouter();
	const [vCode, setVCode] = React.useState<string[]>(new Array(4).fill(''));
	const [activeCodeIndex, setActivCodeIndex] = React.useState<number>(0);

	const handleOnChange = ({
		target,
	}: React.ChangeEvent<HTMLInputElement>): void => {
		const { value } = target;
		const newVCode: string[] = [...vCode];
		newVCode[currentCodeIndex] = value.substring(value.length - 1);
		if (!value) setActivCodeIndex(currentCodeIndex - 1);
		else setActivCodeIndex(currentCodeIndex + 1);
		setVCode(newVCode);
	};

	const handleOnKeyDown = (
		{ key }: React.KeyboardEvent<HTMLInputElement>,
		i: number
	) => {
		currentCodeIndex = i;
		if (key === 'Backspace') setActivCodeIndex(currentCodeIndex - 1);
	};

	React.useEffect(() => {
		inputRef.current?.focus();
	}, [activeCodeIndex]);

	const handleSubmit = () => {
		setOpen(true);
		toast({
			title: 'You submitted the following values:',
			description: (
				<pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
					<code className='text-white'>
						<div className=''>Code: {vCode}</div>
					</code>
				</pre>
			),
		});
		// router.push('/new-password');
	};

	return (
		<form className='mb-20 flex flex-col gap-5'>
			{' '}
			<div className=' capitalize text-h4Bold md:text-h3Bold'>
				Verification Code
			</div>
			<div className='text-base'>
				We sent a code to ap.oyeniran@gmail.com
			</div>
			<div className='grid gap-5 pt-5'>
				<Label>Enter Code</Label>
				<div className='flex gap-5'>
					{vCode.map((_, k) => {
						return (
							<Input
								key={k}
								ref={
									k === activeCodeIndex
										? inputRef
										: null
								}
								type='number'
								className='w-12 h-12 text-bodyBold spin-button-none flex items-center justify-center'
								onChange={handleOnChange}
								onKeyDown={(e) => handleOnKeyDown(e, k)}
								value={vCode[k]}
							/>
						);
					})}
				</div>
			</div>
			<div className='grid gap-5'>
				<div className='grid'>
					<Button onClick={handleSubmit}>CONTINUE</Button>
					<div className='flex items-center justify-center'>
						{`Didn't Receive Code?`}
						<Button variant='link'>Resend Code</Button>
					</div>
				</div>
				<Button
					asChild
					variant='link'
				>
					<Link href='/sign-in'>
						<div className='h-4 w-4 mr-2'>{backIcon}</div>
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
							<div className=''>code: {vCode}</div>
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
								<Link href={`/agents`}>Dashboard</Link>
							</AlertDialogCancel>
						</div>
					</div>
				</AlertDialogContent>
			</AlertDialog>
		</form>
	);
}
