import React from 'react';

export default function Pill({
	status,
	text,
}: {
	status: string;
	text: string;
}) {
	const dot =
		status === 'active'
			? 'bg-awesome'
			: status === 'inactive'
			? 'bg-destructive-foreground'
			: 'bg-gray-500';
	const bg =
		status === 'active'
			? 'bg-awesome/30'
			: status === 'inactive'
			? 'bg-destructive-foreground/30'
			: 'bg-gray-500/30';
	const color =
		status === 'active'
			? 'text-awesome-foreground'
			: status === 'inactive'
			? 'bg-destructive-foreground'
			: 'text-gray-500';

	return (
		<div
			className={`w-min h-[25px] flex items-center gap-2 rounded-full px-3 ${bg} ${color}`}
		>
			<span className={`h-3 w-3 rounded-full ${dot}`}></span>
			<span className=''>{text}</span>
		</div>
	);
}
