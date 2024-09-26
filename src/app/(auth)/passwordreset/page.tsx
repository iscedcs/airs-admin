'use client';
import { AuthForm } from '@/components/forms/authForm';
import { backArrowIcon, passwordIcon } from '@/lib/icons';
import Link from 'next/link';
import React from 'react';

export default function ConfirmPassword() {
	return (
		<>
			<h2 className='text-h5Bold'>Reset Password</h2>
			<div className='mt-1'>
				<AuthForm
					detail='Password'
					type='password'
					icon={passwordIcon}
				/>
				<AuthForm
					detail='Confirm Password'
					type='password'
					icon={passwordIcon}
				/>
				<Link href='/done'>
					<button className=' mt-5 w-full bg-primary-900 rounded-[14px] h-10 text-white'>
						Reset Password
					</button>
				</Link>
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
