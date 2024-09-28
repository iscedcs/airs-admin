import Searchbar from '@/components/ui/searchbar';
import React from 'react';

export default function SearchDriver() {
	return (
		<div className='max-w-[500px] p-2 mx-auto my-[100px]'>
			<Searchbar
				placeholder='Enter vehicle plate'
				variant='primary'
			/>
		</div>
	);
}
