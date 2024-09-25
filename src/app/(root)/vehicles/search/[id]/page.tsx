import SearchVehicle from '@/components/pages/vehicle/search-vehicle';
import React from 'react';

export default function SearchPage({ params }: { params: { id: string } }) {
	return (
		<div className='w-full'>
			<SearchVehicle id={params.id} />
		</div>
	);
}
