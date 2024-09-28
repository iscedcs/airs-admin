'use client';
import { loadingSpinner, searchIcon } from '@/lib/icons';
import React, { useState } from 'react';
import { Button } from './button';
import { useRouter } from 'next/navigation';

export default function Searchbar({
	placeholder,
	variant,
}: {
	placeholder: string;
	variant: string;
}) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState('');
	const router = useRouter();

	const variants =
		variant === 'primary'
			? 'bg-secondary text-primary-400'
			: variant === 'secondary'
			? 'bg-transparent border border-black'
			: 'bg-primary-900 text-primary-400';

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		router.push(`/search/${searchValue}`);
	};

	return (
		<form
			className={`flex relative text-body w-full items-center h-14 rounded-[40px] overflow-hidden ${variants}`}
			onSubmit={handleSubmit}
		>
			<Button
				type='submit'
				variant='default'
				className='absolute h-14 w-14 aspect-square z-10 rounded-none'
			>
				{isLoading ? loadingSpinner : searchIcon}
			</Button>
			<input
				name='search'
				type='text'
				placeholder={placeholder}
				value={searchValue}
				required
				onChange={(e) => setSearchValue(e.target.value)} // Update searchValue when the input changes
				className={`bg-secondary focus:outline-0 pl-16 py-4 h-14 w-full rounded-2xl absolute`}
			/>
		</form>
	);
}
