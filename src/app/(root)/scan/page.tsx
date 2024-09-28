import QRScan from '@/components/pages/admin/scan';
import { getSSession } from '@/lib/get-data';
import React from 'react';

export default async function Scan() {
	const { role } = await getSSession();
	return (
		<div className='p-3 md:p-5'>
			<QRScan role={role} />
		</div>
	);
}
