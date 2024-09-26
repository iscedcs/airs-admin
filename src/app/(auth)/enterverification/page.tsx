'use client';
import { AuthVerification } from '@/components/forms/authForm';
import { backArrowIcon } from '@/lib/icons';
import Link from 'next/link';
import React from 'react';

export default function Verification() {
	return (
		<>
			<h2 className='text-h5Bold'>Verification Code</h2>
			<p className='text-[11x]'>
				We sent a code to{' '}
				<b className='font-bold'>iscedigital@gmail.com</b>
			</p>
			<div className='ml-5 mt-1'>
				<AuthVerification
					detail='Enter code'
					type='text'
				/>
				<Link href='/passwordreset'>
					<button className='mt-5 w-full bg-primary-900 rounded-[14px] h-10 text-white'>
						Continue
					</button>
				</Link>
				<p className='mt-3 text-center text-[12px]'>
					Didn’t Receive Code?
					<Link
						className='text-primary-900 font-bold'
						href=''
					>
						Resend Code
					</Link>
				</p>
				<div className='flex mt-3 justify-center'>
					<Link
						className='mt-[5px]'
						href='/auth'
					>
						{backArrowIcon}
					</Link>
					<p className='ml-2'>Back to Login</p>
				</div>
			</div>
		</>
	);
}
