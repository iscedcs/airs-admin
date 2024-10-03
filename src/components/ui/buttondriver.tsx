import { addIcon } from '@/lib/icons';
import React from 'react';

export default function ButtonDrivers({
	text,
	icon,
	variant,
	hasIcon,
	onClick,
}: ButtonF) {
	const variants =
		variant === 'primary'
			? 'bg-primary-900 text-white'
			: 'bg-white border border-primary-900 text-black';

	return (
		<button
			className={`flex items-center w-full h-16 gap-6 rounded-2xl overflow-hidden ${variants}`}
			onClick={onClick}
		>
			{hasIcon && icon && (
				<span className='h-16 w-16 p-4 bg-black  '>{addIcon}</span>
			)}
			<span className='px-4 py-2'> {text}</span>
		</button>
	);
}
