import React from 'react';
import { Input } from '@/components/ui/input';

export interface AUTH_TYPESI {
	detail: string;
	type: string;
	icon?: any;
}

export function AuthForm({ detail, type, icon }: AUTH_TYPESI) {
	return (
		<div className='pt-2'>
			<p className='text-title2Bold mt-3'>{detail}</p>
			<div className='relative'>
				<Input
					placeholder={detail}
					type={type}
					className='rounded-[14px] text-body mt-2 bg-secondary border-none'
				/>{' '}
				<div className='absolute top-1/4 right-3 transform-translate-y-1/2 cursor-pointer'>
					{icon}
				</div>
			</div>
		</div>
	);
}
export function AuthVerification({ detail, type, icon }: AUTH_TYPESI) {
	return (
		<div className='pt-2'>
			<p className='text-title2Bold mt-3'>{detail}</p>
			<div className='flex gap-6 justify-center'>
				<Input
					type={type}
					className='w-12 h-[50px] no-spinner rounded-[14px] text-[35px] font-bold mt-2 bg-secondary border-gray-600'
				/>
				<Input
					type={type}
					className='w-12 h-[50px] no-spinner rounded-[14px] text-[35px] font-bold mt-2 bg-secondary border-gray-600'
				/>
				<Input
					type={type}
					className='w-12 h-[50px] no-spinner rounded-[14px] text-[35px] font-bold mt-2 bg-secondary border-gray-600'
				/>
				<Input
					type={type}
					className='w-12 h-[50px] no-spinner rounded-[14px] text-[35px] font-bold mt-2 bg-secondary border-gray-600'
				/>
			</div>

			<div className='absolute -mt-8 ml-48'>{icon}</div>
		</div>
	);
}
