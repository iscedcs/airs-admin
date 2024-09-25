import React from 'react';
import { Badge } from './badge';

export default function Cbadge({ variant }: { variant: string }) {
	const textcolor =
		variant === 'cleared' ? 'text-green-800' : 'text-destructive';
	return (
		<Badge className={`${textcolor} bg-gray-200 capitalize`}>
			{variant}
		</Badge>
	);
}
